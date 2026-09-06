import { ArrowLeft, ArrowRight, SlidersHorizontal, LayoutGrid } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import FilterPanel, { FilterPanelDesktop } from "./FilterPanel";
import ServiceCard from "./ServiceCard";
import CustomServiceBanner from "../CustomServiceBanner";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetPublicCategoriesQuery,
  useGetPublicServicesQuery,
  useSearchPublicServicesQuery,
} from "@/redux/features/landing/landingApi";
import { FaBolt, FaBug, FaFaucet, FaLeaf, FaPaintRoller, FaTv, FaHammer } from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
import { TbAirConditioning, TbScissors, TbTruck } from "react-icons/tb";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 },
  },
} as const;

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryLabel: string;
  price: number;
  priceDisplay: string;
  done: string;
  rating: number;
  availability: string[];
  daysAgo: number;
  slug?: string;
}

interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
  vendorId?: string;
  vendorName?: string;
  vendorCategories?: string[];
  devisionId?: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Repair": TbAirConditioning,
  "AC": TbAirConditioning,
  "Plumbing": FaFaucet,
  "Cleaning": MdOutlineCleaningServices,
  "Electrical": FaBolt,
  "Shifting": TbTruck,
  "CCTV": MdOutlineSecurity,
  "Security": MdOutlineSecurity,
  "Appliance Repair": FaTv,
  "Appliance": FaTv,
  "Painting": FaPaintRoller,
  "Gardening": FaLeaf,
  "Pest Control": FaBug,
  "Salon": TbScissors,
  "Home Salon": TbScissors,
  "Carpentry": FaHammer,
};

const RATING_OPTIONS = [
  { value: "5.0", label: "5.0 only" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
];

const PER_PAGE = 9;
const PRICE_CEIL = 5000;

const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const ListingCardSkeleton = () => (
  <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse">
    <div className="h-48 bg-slate-200 relative" />
    <div className="p-4 flex flex-col flex-1 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200/60 rounded w-full" />
        <div className="h-3 bg-slate-200/60 rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6] mt-auto">
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200/60 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default function ServiceListing({
  filters,
  setFilters,
  onClearAll,
  isFilterOpen,
  setIsFilterOpen,
  categoryName,
}: {
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  onClearAll: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  categoryName?: string;
}) {
  const {
    activeCategory,
    searchQuery,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
    currentPage,
    vendorId = "",
    vendorName = "",
    vendorCategories = [],
    devisionId = "",
  } = filters;

  const hasSearchFilters =
    activeCategory !== "all" || !!devisionId || !!searchQuery;

  const searchParams = {
    category_id: activeCategory !== "all" ? Number(activeCategory) : undefined,
    devision_id: devisionId ? Number(devisionId) : undefined,
    q: searchQuery || undefined,
  };

  const { data: categoriesRes, isLoading: isCategoriesLoading } = useGetPublicCategoriesQuery();
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const { data: searchRes, isLoading: isSearchLoading } = useSearchPublicServicesQuery(
    searchParams,
    { skip: !hasSearchFilters },
  );
  const { data: servicesRes, isLoading: isServicesLoading } = useGetPublicServicesQuery(
    undefined,
    { skip: hasSearchFilters },
  );

  const isServicesLoadingCombined = hasSearchFilters ? isSearchLoading : isServicesLoading;
  const allServices =
    (hasSearchFilters ? searchRes?.data : servicesRes?.data) ||
    (hasSearchFilters
      ? Array.isArray(searchRes)
        ? searchRes
        : []
      : Array.isArray(servicesRes)
        ? servicesRes
        : []);

  const mappedListings = useMemo(() => {
    return allServices.map((item: any) => {
      const id = String(item.id);
      const hash = getHash(id);

      // Done options based on actual bookings
      const bookingsCount = item.bookings?.length || 0;
      const done = `${bookingsCount} done`;

      // Availability options
      const availOptions = [
        ["today"],
        ["weekend"],
        ["today", "weekend"],
        ["today", "emergency"],
        ["weekend", "emergency"],
        ["today", "weekend", "emergency"]
      ];
      const availability = availOptions[hash % availOptions.length];

      // Rating based on actual reviews if available, else fallback
      const totalReviews = item.reviews?.length || 0;
      let rating = parseFloat((4.0 + (hash % 11) * 0.1).toFixed(1));
      if (totalReviews > 0) {
        const sumRating = item.reviews.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0);
        rating = parseFloat((sumRating / totalReviews).toFixed(1));
      }

      // Days ago
      const daysAgo = hash % 15;

      const categoryObj = item.category || {};
      const catSlug = categoryObj.slug || categoryObj.name?.toLowerCase().replace(/\s+/g, "-") || "";
      const catLabel = categoryObj.name || "";
      const catId = String(categoryObj.id || "");

      // Price based on nested services minimum price
      let priceVal = 1000;
      if (item.nestedServices && item.nestedServices.length > 0) {
        const prices = item.nestedServices
          .map((ns: any) => Number(ns.starting_price || 0))
          .filter((p: number) => p > 0);
        if (prices.length > 0) {
          priceVal = Math.min(...prices);
        }
      }

      return {
        id,
        title: item.name || "",
        description: item.description || item.subtitle || "",
        image: item.image || "/images/service/service-1.png",
        category: catSlug,
        categoryId: catId,
        categoryLabel: catLabel,
        price: priceVal,
        priceDisplay: priceVal > 0 ? `₹${priceVal.toLocaleString()}` : "Contact for price",
        done,
        bookingsCount,
        rating,
        availability,
        daysAgo,
        slug: item.slug || "",
        vendorId: String(item.vendor?.id || ""),
      };
    });
  }, [allServices]);

  const filteredListings = useMemo(() => {
    let list = [...mappedListings];

    if (vendorId) {
      list = list.filter((s) => (s as any).vendorId === vendorId);
    }

    if (vendorCategories.length > 0) {
      list = list.filter((s) => vendorCategories.includes((s as any).categoryId));
    } else if (!hasSearchFilters && activeCategory !== "all") {
      list = list.filter((s) => s.category === activeCategory || (s as any).categoryId === activeCategory);
    }

    if (!hasSearchFilters && searchQuery) {
      const words = searchQuery
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      list = list.filter((s) => {
        const title = s.title.toLowerCase();
        const desc = s.description.toLowerCase();
        const category = (s.categoryLabel || "").toLowerCase();
        return words.every(
          (word) =>
            title.includes(word) ||
            desc.includes(word) ||
            category.includes(word)
        );
      });
    }
    if (selectedRating)
      list = list.filter((s) => s.rating >= parseFloat(selectedRating));
    list = list.filter((s) => s.price <= priceMax);
    if (selectedAvailability.length)
      list = list.filter((s) =>
        selectedAvailability.every((slot) => s.availability.includes(slot)),
      );
    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => a.daysAgo - b.daysAgo);
        break;
    }
    return list;
  }, [
    mappedListings,
    activeCategory,
    searchQuery,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
    vendorId,
    vendorCategories,
    hasSearchFilters,
  ]);

  const totalPages = Math.ceil(filteredListings.length / PER_PAGE);
  const pagedItems = filteredListings.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const ratingCounts = useMemo(() => {
    const base = mappedListings.filter((s: any) => {
      if (!hasSearchFilters && activeCategory !== "all" && s.category !== activeCategory)
        return false;
      if (!hasSearchFilters && searchQuery) {
        const words = searchQuery
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 0);
        const title = s.title.toLowerCase();
        const desc = s.description.toLowerCase();
        const category = (s.categoryLabel || "").toLowerCase();
        const match = words.every(
          (word) =>
            title.includes(word) ||
            desc.includes(word) ||
            category.includes(word)
        );
        if (!match) return false;
      }
      if (s.price > priceMax) return false;
      if (
        selectedAvailability.length &&
        !selectedAvailability.every((slot) => s.availability.includes(slot))
      )
        return false;
      return true;
    });
    return RATING_OPTIONS.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.value] = base.filter(
        (s: any) => s.rating >= parseFloat(opt.value),
      ).length;
      return acc;
    }, {});
  }, [mappedListings, activeCategory, searchQuery, priceMax, selectedAvailability, hasSearchFilters]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (activeCategory !== "all") n++;
    if (devisionId) n++;
    if (vendorId) n++;
    if (vendorCategories.length > 0) n++;
    if (selectedRating) n++;
    if (priceMax < PRICE_CEIL) n++;
    n += selectedAvailability.length;
    return n;
  }, [activeCategory, devisionId, vendorId, vendorCategories, selectedRating, priceMax, selectedAvailability]);

  const ratingDropdownOptions = useMemo(() => {
    return [
      { value: "all", label: "Min Rating (All)" },
      ...RATING_OPTIONS.map((opt) => ({
        value: opt.value,
        label: `★ ${opt.label} (${ratingCounts[opt.value] ?? 0})`
      }))
    ];
  }, [ratingCounts]);

  const sortDropdownOptions = [
    { value: "popularity", label: "Sort: Popularity" },
    { value: "price-low", label: "Sort: Price: Low → High" },
    { value: "price-high", label: "Sort: Price: High → Low" },
    { value: "rating", label: "Sort: Rating" },
    { value: "newest", label: "Sort: Newest first" },
  ];

  return (
    <section className="py-6 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Results count heading — shown only when a category name is provided (e.g. from category page) */}
        {categoryName && (
          <div className="mb-5">
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900">
              <span className="text-slate-500 font-semibold">
                {filteredListings.length} results found for{" "}
              </span>
              <span className="text-[#FF6014]">{categoryName}</span>
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Verified professionals ready to serve you in Kolkata, West Bengal, India.
            </p>
          </div>
        )}

        {vendorId && vendorName && !categoryName && (
          <div className="mb-5">
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900">
              <span className="text-slate-500 font-semibold">
                {filteredListings.length} service{filteredListings.length === 1 ? "" : "s"} from{" "}
              </span>
              <span className="text-[#FF6014]">{vendorName}</span>
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Book directly from this verified vendor on Rajseba.
            </p>
          </div>
        )}


        {/* Top Search & Actions bar */}
        <div className="flex flex-col gap-4 mb-8 bg-white p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for services, repairs..."
              value={searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value, currentPage: 1 })}
              className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 focus:bg-white rounded-2xl text-xs sm:text-sm font-bold placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/5 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              suppressHydrationWarning
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Min Rating Select */}
            <div className="relative min-w-[150px] flex-1">
              <CustomSelect
                options={ratingDropdownOptions}
                value={selectedRating || "all"}
                onChange={(val) => setFilters({ selectedRating: val === "all" ? "" : val, currentPage: 1 })}
                placeholder="Min Rating (All)"
                triggerClassName="bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-slate-700 focus:outline-none focus:border-[#FF6014] focus-visible:ring-0 focus:ring-0 transition-all cursor-pointer h-[46px] shadow-none w-full"
              />
            </div>

            {/* Sort By Select */}
            <div className="relative min-w-[160px] flex-1">
              <CustomSelect
                options={sortDropdownOptions}
                value={sortBy}
                onChange={(val) => setFilters({ sortBy: val, currentPage: 1 })}
                placeholder="Sort: Popularity"
                triggerClassName="bg-slate-50/70 border border-[#e5e7eb] hover:border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-slate-700 focus:outline-none focus:border-[#FF6014] focus-visible:ring-0 focus:ring-0 transition-all cursor-pointer h-[46px] shadow-none w-full"
              />
            </div>

            {/* Filter Toggle Button + Results count */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex md:hidden items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-50 shadow-sm active:scale-98 transition-all cursor-pointer h-[46px] flex-shrink-0"
            >
              <SlidersHorizontal size={14} className="text-[#FF6014]" strokeWidth={2.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1.5 rounded-full bg-[#FF6014] text-white text-[9px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-xs font-extrabold text-slate-500 bg-slate-100/85 px-4 py-2.5 rounded-2xl border border-slate-200/40 flex-shrink-0 ml-auto">
              {filteredListings.length} {filteredListings.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Desktop Left Sidebar Filters (hidden on mobile, block on md+) */}
          <div className="hidden md:block w-72 shrink-0">
            <FilterPanelDesktop
              filters={filters}
              setFilters={setFilters}
              ratingCounts={ratingCounts}
              resultCount={filteredListings.length}
              onClearAll={onClearAll}
              categories={categories}
              isLoadingCategories={isCategoriesLoading}
            />
          </div>

          {/* Mobile Drawer (visible on mobile drawer triggers) */}
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            setFilters={setFilters}
            ratingCounts={ratingCounts}
            resultCount={filteredListings.length}
            onClearAll={onClearAll}
            categories={categories}
            isLoadingCategories={isCategoriesLoading}
          />

          {/* Services Grid (spans remaining width) */}
          <div className="flex-1 min-w-0 w-full">
            <motion.div
              key={`${activeCategory}-${currentPage}-${searchQuery}-${sortBy}-${selectedRating}-${priceMax}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {isServicesLoadingCombined ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <ListingCardSkeleton key={idx} />
                ))
              ) : (
                pagedItems.map((service) => (
                  <motion.div key={service.id} variants={itemVariants} className="h-full">
                    <ServiceCard service={service} />
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Empty state */}
            {pagedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
                <div className="w-12 h-12 rounded-full bg-[#FFF8F4] flex items-center justify-center text-[#FF6014] mb-4">
                  <SlidersHorizontal size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-medium text-slate-800 mb-1">
                  No services found
                </h3>
                <p className="text-sm text-slate-400 mb-5 max-w-xs font-semibold">
                  Try widening your filters or clearing your search.
                </p>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-6 py-2.5 rounded-xl bg-[#FF6014] text-white text-sm font-bold hover:bg-[#E0530A] transition-all shadow-md cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 disabled:opacity-40 hover:border-[#FF6014] hover:text-[#FF6014] transition-all shadow-sm cursor-pointer"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setFilters({ currentPage: Math.max(1, currentPage - 1) })
                  }
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setFilters({ currentPage: page })}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all shadow-sm cursor-pointer ${currentPage === page
                        ? "bg-[#FF6014] text-white border-[#FF6014]"
                        : "border border-slate-100 bg-white text-slate-600 hover:border-[#FF6014] hover:text-[#FF6014]"
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 disabled:opacity-40 hover:border-[#FF6014] hover:text-[#FF6014] transition-all shadow-sm cursor-pointer"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setFilters({
                      currentPage: Math.min(totalPages, currentPage + 1),
                    })
                  }
                >
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* Custom Service Booking Request Banner */}
            <CustomServiceBanner categoryName={categoryName} className="mt-8" />
          </div>

        </div>
      </div>
    </section>
  );
}
