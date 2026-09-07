import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarDays,
  Check,
  Clock,
  LayoutGrid,
  Siren,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { FaBolt, FaBug, FaFaucet, FaLeaf, FaPaintRoller, FaTv, FaHammer } from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
import { TbAirConditioning, TbScissors, TbTruck } from "react-icons/tb";

interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  ratingCounts: Record<string, number>;
  resultCount: number;
  onClearAll: () => void;
  categories: any[];
  isLoadingCategories?: boolean;
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

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity", icon: TrendingUp },
  { value: "price-low", label: "Price: Low → High", icon: ArrowUpNarrowWide },
  { value: "price-high", label: "Price: High → Low", icon: ArrowDownNarrowWide },
  { value: "rating", label: "Rating", icon: Star },
  { value: "newest", label: "Newest first", icon: Sparkles },
];

const AVAILABILITY_OPTIONS = [
  { id: "today", label: "Today", icon: Clock },
  { id: "weekend", label: "This weekend", icon: CalendarDays },
  { id: "emergency", label: "Emergency (24h)", icon: Siren },
];

const PRICE_FLOOR = 500;
const PRICE_CEIL = 5000;

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
        checked ? "bg-[#FF6014]" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function FilterPanel({
  isOpen,
  onClose,
  filters,
  setFilters,
  ratingCounts,
  resultCount,
  onClearAll,
  categories,
  isLoadingCategories = false,
}: FilterPanelProps) {
  const router = useRouter();

  const {
    activeCategory,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
  } = filters;

  const handleSelectCategory = (cat: any, isActive: boolean) => {
    const name = (cat.name || cat.label || "").toLowerCase();
    const slug = (cat.slug || name.replace(/\s+/g, "-") || String(cat.id)).toLowerCase();
    setFilters({
      activeCategory: isActive ? "all" : slug,
      currentPage: 1,
    });
  };

  const fillPct = ((priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glassmorphic Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] transition-opacity"
          />

          {/* Slide-out Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white shadow-2xl z-[10000] flex flex-col h-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filter options"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] flex items-center justify-center text-[#FF6014]">
                  <SlidersHorizontal size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Filters</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">{resultCount} results found</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-bold text-slate-500 hover:text-[#FF6014] hover:bg-[#FFF8F4]/50 transition-colors bg-slate-100 px-3 py-2 rounded-xl cursor-pointer"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:text-[#FF6014] hover:bg-[#FFF8F4] transition-all cursor-pointer"
                  aria-label="Close filters"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-thin">
              
              {/* Category selector */}
              <section className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                  Service Category
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {isLoadingCategories ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-11 bg-slate-100 animate-pulse rounded-xl border border-slate-50"
                      />
                    ))
                  ) : (
                    categories.map((cat: any) => {
                      const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);
                      const name = cat.name || cat.label;
                      const Icon =
                        CATEGORY_ICON_MAP[name] ||
                        CATEGORY_ICON_MAP[Object.keys(CATEGORY_ICON_MAP).find((k) =>
                          name?.toLowerCase().includes(k.toLowerCase())
                        ) || ""] ||
                        LayoutGrid;
                      const isActive = activeCategory === slug;
                      return (
                        <motion.button
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat, isActive)}
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-xs font-bold transition-all duration-200 text-left cursor-pointer ${
                            isActive
                              ? "border-[#FF6014] bg-[#FFF8F4] text-[#FF6014] shadow-[0_4px_12px_rgba(255,90,95,0.08)]"
                              : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <Icon size={15} strokeWidth={2.5} className="shrink-0" />
                          <span className="truncate">{name}</span>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Price range */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                    Price Range limit
                  </h4>
                  <span className="text-[11px] font-extrabold text-[#FF6014] bg-[#FFF8F4] px-2.5 py-1 rounded-lg">
                    ₹{PRICE_FLOOR.toLocaleString()} – ₹{priceMax.toLocaleString()}
                  </span>
                </div>
                <div className="px-1.5 pt-2">
                  <div className="relative h-2 bg-slate-100 rounded-full mb-4">
                    <div
                      className="absolute h-full bg-[#FF6014] rounded-full"
                      style={{ width: `${fillPct}%` }}
                    />
                    <input
                      type="range"
                      min={PRICE_FLOOR}
                      max={PRICE_CEIL}
                      step={100}
                      value={priceMax}
                      onChange={(e) =>
                        setFilters({ priceMax: Number(e.target.value), currentPage: 1 })
                      }
                      className="absolute w-full h-2 top-0 left-0 appearance-none bg-transparent z-10 cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#FF6014]
                        [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:active:scale-110"
                      aria-label="Maximum price"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase">
                    <span>₹{PRICE_FLOOR.toLocaleString()}</span>
                    <span>₹{PRICE_CEIL.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              {/* Rating selection */}
              <section className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                  Minimum Rating
                </h4>
                <div className="flex flex-col gap-2.5">
                  {RATING_OPTIONS.map((opt) => {
                    const isActive = selectedRating === opt.value;
                    return (
                      <motion.label
                        whileHover={{ scale: 1.008 }}
                        key={opt.value}
                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                          isActive
                            ? "border-[#FF6014] bg-[#FFF8F4] shadow-[0_4px_12px_rgba(255,90,95,0.05)]"
                            : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="rating"
                            value={opt.value}
                            checked={isActive}
                            onChange={() =>
                              setFilters({
                                selectedRating: isActive ? "" : opt.value,
                                currentPage: 1,
                              })
                            }
                            className="w-4 h-4 accent-[#FF6014] cursor-pointer"
                          />
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <Star
                              size={13}
                              className="fill-amber-400 text-amber-400"
                            />
                            {opt.label}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                          {ratingCounts[opt.value] ?? 0}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              </section>

              {/* Sort By options */}
              <section className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                  Sort Results
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = sortBy === opt.value;
                    return (
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFilters({ sortBy: opt.value, currentPage: 1 })
                        }
                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "border-[#FF6014] bg-[#FFF8F4] text-[#FF6014]"
                            : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={15} strokeWidth={2.5} className={isActive ? "text-[#FF6014]" : "text-slate-400"} />
                          {opt.label}
                        </span>
                        {isActive && <Check size={14} strokeWidth={3} />}
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              {/* Availability toggles */}
              <section className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                  Availability
                </h4>
                <div className="flex flex-col gap-1">
                  {AVAILABILITY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const checked = selectedAvailability.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                      >
                        <span className="flex items-center gap-3 text-xs font-bold text-slate-700">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Icon size={15} strokeWidth={2.5} />
                          </div>
                          {opt.label}
                        </span>
                        <ToggleSwitch
                          checked={checked}
                          label={opt.label}
                          onChange={() =>
                            setFilters({
                              selectedAvailability: checked
                                ? selectedAvailability.filter((a) => a !== opt.id)
                                : [...selectedAvailability, opt.id],
                              currentPage: 1,
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* Footer Action buttons */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold text-xs shadow-lg shadow-rose-200 hover:shadow-xl active:scale-98 transition-all text-center uppercase tracking-wider cursor-pointer"
              >
                Apply Filters ({resultCount})
              </button>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function FilterPanelDesktop({
  filters,
  setFilters,
  ratingCounts,
  resultCount,
  onClearAll,
  categories,
  isLoadingCategories = false,
}: Omit<FilterPanelProps, "isOpen" | "onClose">) {
  const router = useRouter();

  const handleSelectCategory = (cat: any, isActive: boolean) => {
    const name = (cat.name || cat.label || "").toLowerCase();
    const slug = (cat.slug || name.replace(/\s+/g, "-") || String(cat.id)).toLowerCase();
    setFilters({
      activeCategory: isActive ? "all" : slug,
      currentPage: 1,
    });
  };

  const {
    activeCategory,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
  } = filters;

  const fillPct = ((priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  return (
    <aside className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#FF6014]" strokeWidth={2.5} />
          <span className="text-sm font-extrabold text-slate-800">Filters</span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-bold text-slate-500 hover:text-[#FF6014] transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* Category selector */}
      <section className="space-y-2.5">
        <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
          Category
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {isLoadingCategories ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-slate-100 animate-pulse rounded-xl border border-slate-50"
              />
            ))
          ) : (
            categories.map((cat: any) => {
              const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);
              const name = cat.name || cat.label;
              const Icon =
                CATEGORY_ICON_MAP[name] ||
                CATEGORY_ICON_MAP[Object.keys(CATEGORY_ICON_MAP).find((k) =>
                  name?.toLowerCase().includes(k.toLowerCase())
                ) || ""] ||
                LayoutGrid;
              const isActive = activeCategory === slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat, isActive)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 text-left cursor-pointer truncate ${
                    isActive
                      ? "border-[#FF6014] bg-[#FFF8F4] text-[#FF6014]"
                      : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={14} strokeWidth={2.5} className="shrink-0" />
                  <span className="truncate">{name}</span>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Price range */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
            Price Range
          </h4>
          <span className="text-[11px] font-extrabold text-[#FF6014] bg-[#FFF8F4] px-2 py-0.5 rounded-lg">
            ₹{PRICE_FLOOR} - ₹{priceMax}
          </span>
        </div>
        <div className="px-1 pt-1">
          <div className="relative h-2 bg-slate-100 rounded-full mb-3">
            <div
              className="absolute h-full bg-[#FF6014] rounded-full"
              style={{ width: `${fillPct}%` }}
            />
            <input
              type="range"
              min={PRICE_FLOOR}
              max={PRICE_CEIL}
              step={100}
              value={priceMax}
              onChange={(e) =>
                setFilters({ priceMax: Number(e.target.value), currentPage: 1 })
              }
              className="absolute w-full h-2 top-0 left-0 appearance-none bg-transparent z-10 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#FF6014]
                [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
              aria-label="Maximum price"
              suppressHydrationWarning
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>₹{PRICE_FLOOR}</span>
            <span>₹{PRICE_CEIL}</span>
          </div>
        </div>
      </section>


      {/* Availability toggles */}
      <section className="space-y-2">
        <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
          Availability
        </h4>
        <div className="flex flex-col gap-1">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const checked = selectedAvailability.includes(opt.id);
            return (
              <div
                key={opt.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Icon size={14} className="text-slate-400" />
                  {opt.label}
                </span>
                <ToggleSwitch
                  checked={checked}
                  label={opt.label}
                  onChange={() =>
                    setFilters({
                      selectedAvailability: checked
                        ? selectedAvailability.filter((a) => a !== opt.id)
                        : [...selectedAvailability, opt.id],
                      currentPage: 1,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
