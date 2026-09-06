"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";
import { useGetAllDevisionsQuery } from "@/redux/features/admin/location";
import { CustomSelect } from "@/components/ui/select";
import { TbAirConditioning, TbTruck } from "react-icons/tb";
import {
  FaFaucet,
  FaBolt,
  FaCouch,
  FaPaintRoller,
  FaTint,
  FaHotTub,
  FaHouseDamage,
  FaHeadset,
} from "react-icons/fa";
import { MdOutlineCleaningServices, MdLocalLaundryService } from "react-icons/md";
import { LayoutGrid } from "lucide-react";

// ─── Manual icon map: exact backend category name → icon ────────────────────
// ExploreCategories.tsx এবং Navbar.tsx এর সাথে EXACT same map, যাতে homepage
// grid, navbar dropdown, এবং এই hero pills — সব জায়গায় same icon দেখায়।
// কোনো dynamic/partial (.includes()) matching নেই — শুধু exact name match।
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Service & Repair": TbAirConditioning,
  "AC Service & Cleaning": TbAirConditioning,
  "Home & Office Shifting": TbTruck,
  "Plumbing Service": FaFaucet,
  "Home Appliance Repair": MdLocalLaundryService,
  "Home & Office Cleaning": MdOutlineCleaningServices,
  "Home & Office Deep Cleaning": MdOutlineCleaningServices,
  "Water Purifier Installation": FaTint,
  "Home & Office Painting": FaPaintRoller,
  "Geyser Installation & Repair": FaHotTub,
  "Electrical Service": FaBolt,
  "Home & Office Renovation": FaHouseDamage,
  "PPM Service": FaHeadset,
  "PPM Service (Planned Preventive Maintenance)": FaHeadset,
  "Planned Preventive Maintenance": FaHeadset,
  "Sofa & Carpet Deep Cleaning": FaCouch,
};

const FALLBACK_ICON = LayoutGrid;

const ServiceHero = () => {
  const { data: categoriesRes, isLoading: isCategoriesLoading } = useGetPublicCategoriesQuery();
  const apiCategories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);
  const { data: divisionsRes } = useGetAllDevisionsQuery();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedDivision, setSelectedDivision] = useState(searchParams.get("devision") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const activeCategory = searchParams.get("category") || "";

  const categoryOptions = useMemo(() => {
    return apiCategories
      .filter((cat: { parent?: unknown }) => !cat.parent)
      .map((cat: { id: number; name: string }) => ({
        value: String(cat.id),
        label: cat.name,
      }));
  }, [apiCategories]);

  const divisionOptions = useMemo(() => {
    const divisions = divisionsRes?.data || [];
    return divisions.map((div: { id: number; name: string }) => ({
      value: String(div.id),
      label: div.name,
    }));
  }, [divisionsRes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedDivision) params.set("devision", selectedDivision);
    if (selectedCategory) params.set("category", selectedCategory);

    router.push(`/services?${params.toString()}`);
  };

  // ─── Mobile auto-slide + swipe carousel for category pills ────────────────
  const trackRef = useRef<HTMLDivElement>(null);
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteracting = useRef(false);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
      autoSlideTimer.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    autoSlideTimer.current = setInterval(() => {
      const el = trackRef.current;
      if (!el || isInteracting.current) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const pillWidth = (el.firstElementChild as HTMLElement)?.offsetWidth || 140;
      const step = pillWidth + 10; // pill width + gap

      const nextScroll =
        el.scrollLeft + step >= maxScroll - 4 ? 0 : el.scrollLeft + step;

      el.scrollTo({ left: nextScroll, behavior: "smooth" });
    }, 2000);
  }, [stopAutoSlide]);

  // Pause on user touch/drag/wheel, resume shortly after they stop
  const handleUserInteractionStart = useCallback(() => {
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleUserInteractionEnd = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2500);
  }, []);

  useEffect(() => {
    if (isCategoriesLoading || apiCategories.length === 0) return;

    // Only auto-slide on mobile / small viewports
    const mql = window.matchMedia("(max-width: 767px)");
    if (mql.matches) {
      startAutoSlide();
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    };
    mql.addEventListener("change", handleChange);

    return () => {
      stopAutoSlide();
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      mql.removeEventListener("change", handleChange);
    };
  }, [isCategoriesLoading, apiCategories.length, startAutoSlide, stopAutoSlide]);

  return (
    <section className="bg-white pt-6 pb-6 md:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-900 leading-tight mb-4 max-w-3xl mx-auto">
          Find the best home <span className="text-[#FF6014]">services</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-5 md:mb-8 font-medium leading-relaxed">
          Premium, reliable, and effortless solutions for your urban lifestyle in Kolkata, West Bengal, India.
        </p>

        {/* Floating Search Bar Card */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-slate-100 p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2.5 sm:gap-3 md:gap-0 mb-10"
        >
          {/* Category Select */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-1 relative">
            <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <CustomSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select Category"
              className="w-full"
              triggerClassName="border-none bg-transparent hover:bg-transparent shadow-none px-0 py-1.5 h-auto text-slate-700 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Location Select */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-1">
            <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <CustomSelect
              options={divisionOptions}
              value={selectedDivision}
              onChange={setSelectedDivision}
              placeholder="Select Division"
              className="w-full"
              triggerClassName="border-none bg-transparent hover:bg-transparent shadow-none px-0 py-1.5 h-auto text-slate-700 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full md:w-auto bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold px-6 sm:px-8 py-3.5 h-auto rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-sm sm:text-base flex-shrink-0 cursor-pointer"
          >
            Search
          </Button>
        </motion.form>

        {/* Quick-nav Category Pills */}
        {isCategoriesLoading ? (
          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-24 bg-slate-100 animate-pulse rounded-full border border-slate-50"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop / tablet — centered wrapping pills */}
            <div className="hidden md:flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
              {apiCategories.map((cat: any) => {
                const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);
                const label = cat.name || cat.label || "";
                const Icon = CATEGORY_ICON_MAP[label?.trim()] || FALLBACK_ICON;
                const isActive = activeCategory === slug;

                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full border font-extrabold text-xs transition-all duration-200 hover:-translate-y-0.5 no-underline cursor-pointer shadow-sm ${isActive
                      ? "border-[#FF6014] text-[#FF6014] bg-gradient-to-br from-[#FFF8F4] to-[#FFEDE3]"
                      : "border-slate-100 text-slate-600 bg-white hover:border-[#FF6014]/40 hover:text-slate-800 hover:shadow-md"
                      }`}
                  >
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-200 ${isActive ? "bg-[#FF6014]/15" : "bg-slate-50 group-hover:bg-[#FF6014]/10"
                        }`}
                    >
                      <Icon size={12} className={isActive ? "text-[#FF6014]" : "text-slate-400 group-hover:text-[#FF6014]"} />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile — premium auto-sliding + swipeable carousel */}
            <div className="md:hidden relative -mx-4 px-4">
              {/* Edge fade gradients */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />

              <div
                ref={trackRef}
                onTouchStart={handleUserInteractionStart}
                onTouchEnd={handleUserInteractionEnd}
                onPointerDown={handleUserInteractionStart}
                onPointerUp={handleUserInteractionEnd}
                onScroll={handleUserInteractionStart}
                className="flex gap-2.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {apiCategories.map((cat: any) => {
                  const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);
                  const label = cat.name || cat.label || "";
                  const Icon = CATEGORY_ICON_MAP[label?.trim()] || FALLBACK_ICON;
                  const isActive = activeCategory === slug;

                  return (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className={`group snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border font-extrabold text-xs transition-all duration-200 active:scale-95 no-underline cursor-pointer shadow-sm ${isActive
                        ? "border-[#FF6014] text-[#FF6014] bg-gradient-to-br from-[#FFF8F4] to-[#FFEDE3]"
                        : "border-slate-100 text-slate-600 bg-white"
                        }`}
                    >
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-200 ${isActive ? "bg-[#FF6014]/15" : "bg-slate-50"
                          }`}
                      >
                        <Icon size={12} className={isActive ? "text-[#FF6014]" : "text-slate-400"} />
                      </span>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServiceHero;