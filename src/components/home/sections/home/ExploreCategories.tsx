"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { LayoutGrid, Loader2 } from "lucide-react";
import { formatImageUrl } from "@/lib/utils";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

// ─── Named export kept for Navbar.tsx dropdown ───────────────────────────────
export const CATEGORIES_CONTENT = {
  title: "Explore Categories",
  subtitle: "Choose from our wide range of professional, verified home services",
  categories: [
    { label: "AC Service & Repair", slug: "ac-service-repair", icon: TbAirConditioning },
    { label: "Home & Office Shifting", slug: "home-office-shifting", icon: TbTruck },
    { label: "Plumbing Service", slug: "plumbing-service", icon: FaFaucet },
    { label: "Home Appliance Repair", slug: "home-appliance-repair", icon: MdLocalLaundryService },
    { label: "Home & Office Cleaning", slug: "home-office-cleaning", icon: MdOutlineCleaningServices },
    { label: "Water Purifier Installation", slug: "water-purifier-installation", icon: FaTint },
    { label: "Home & Office Painting", slug: "home-office-painting", icon: FaPaintRoller },
    { label: "Geyser Installation & Repair", slug: "geyser-installation-repair", icon: FaHotTub },
    { label: "Electrical Service", slug: "electrical-service", icon: FaBolt },
    { label: "Home & Office Renovation", slug: "home-office-renovation", icon: FaHouseDamage },
    { label: "PPM Service", slug: "ppm-service", icon: FaHeadset },
    { label: "Sofa & Carpet Deep Cleaning", slug: "sofa-carpet-deep-cleaning", icon: FaCouch },
  ],
};

// ─── Manual icon map: exact backend category name → icon ────────────────────
// NOTE: এখানে কোনো dynamic/partial string matching ব্যবহার করা হয়নি।
// API থেকে আসা category.name এই ১২টি নামের সাথে EXACT মিলতে হবে।
// নতুন category backend এ যোগ হলে এখানে নতুন entry ম্যানুয়ালি যোগ করতে হবে।
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Service & Repair": TbAirConditioning,
  "AC Service & Cleaning": TbAirConditioning,
  "Home & Office Shifting": TbTruck,
  "Plumbing Service": FaFaucet,
  "Home Appliance Repair": MdLocalLaundryService,
  "Home & Office Cleaning": MdOutlineCleaningServices,
  "Home & Office Deep Cleaning": MdOutlineCleaningServices,
  "Cleaning Service": MdOutlineCleaningServices,
  "Cleaning": MdOutlineCleaningServices,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
} as const;

const ExploreCategories = () => {
  const { data: categoriesRes, isLoading, isError } = useGetPublicCategoriesQuery();
  const [isMounted, setIsMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Support both { data: [...] } and [...] shapes
  const categories: any[] = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  // Determine if pagination is needed (more than 8 categories)
  const needsPagination = categories.length > 8;

  // On desktop (md and up), pagination slices first 7 items + 1 See More button
  const displayedCategories = needsPagination && !showAll
    ? categories.slice(0, 7)
    : categories;

  return (
    <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 py-5 md:py-8 lg:py-10 overflow-hidden">


      <AnimatePresence mode="wait">
        {(!isMounted || isLoading) ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-16"
          >
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
          </motion.div>
        ) : isError ? (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-slate-400 text-sm py-8"
          >
            Unable to load categories right now. Please try again later.
          </motion.p>
        ) : categories.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-slate-400 text-sm py-8"
          >
            No categories found.
          </motion.p>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6 lg:gap-7"
          >
            {categories.map((cat: any) => {
              const IconComponent = CATEGORY_ICON_MAP[cat.name?.trim()] || FALLBACK_ICON;

              return (
                <motion.div
                  key={cat.id}
                  variants={cardVariants}
                  whileTap={{ scale: 0.97 }}
                  className="h-full"
                >
                  <Link href={`/categories/${cat.id}`} className="block h-full">
                    <div
                      className="
                        group relative overflow-hidden
                        flex flex-col items-center justify-center
                        min-h-[110px] sm:min-h-[130px] md:min-h-[185px] lg:min-h-[200px]
                        rounded-2xl md:rounded-[24px] p-2.5 md:p-6 lg:p-7
                        bg-white/40 backdrop-blur-xl
                        border border-[#FF6014]/25
                        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
                        cursor-pointer
                        transition-all duration-350 ease-out
                        hover:bg-white/60 hover:border-[#FF6014]/70
                        hover:shadow-[0_12px_28px_rgba(255,96,20,0.15),0_0_0_3px_rgba(255,96,20,0.1)]
                        hover:-translate-y-[3px]
                      "
                    >
                      {/* Gloss sheen */}
                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl md:rounded-t-[24px] bg-gradient-to-b from-white/65 to-transparent"
                        aria-hidden
                      />

                      {/* Icon orb */}
                      <div
                        className="
                          relative overflow-hidden
                          w-12 h-12 md:w-20 md:h-20 rounded-full mb-2 md:mb-4
                          flex items-center justify-center
                          bg-gradient-to-br from-[#fafbfc] via-[#f0f2f5] to-[#e3e6eb]
                          ring-1 ring-white/60
                          shadow-[3px_3px_8px_rgba(174,180,190,0.3),_-3px_-3px_8px_rgba(255,255,255,0.85)] md:shadow-[4px_4px_10px_rgba(174,180,190,0.35),_-4px_-4px_10px_rgba(255,255,255,0.9)]
                          transition-all duration-500 ease-out
                          group-hover:scale-105
                          group-hover:from-[#ff8a5c] group-hover:via-[#ff6014] group-hover:to-[#e5392f]
                          group-hover:ring-[#ff6014]/30
                          group-hover:shadow-[0_8px_20px_-4px_rgba(229,57,53,0.45),0_0_0_5px_rgba(255,96,20,0.06)]
                        "
                      >
                        {/* Gloss sheen */}
                        <span
                          className="pointer-events-none absolute top-[3px] left-[5px] w-6 h-3 md:top-[4px] md:left-[8px] md:w-10 md:h-5 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.85)_0%,transparent_70%)] group-hover:opacity-80 transition-opacity duration-500"
                          aria-hidden
                        />
                        {/* Soft inner glow on hover */}
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.35),transparent_60%)] transition-opacity duration-500"
                          aria-hidden
                        />
                        {/* If category has an image from backend, show it; else show manually-mapped vector icon with matching orange color */}
                        {cat.image ? (
                          <img
                            src={formatImageUrl(cat.image)}
                            alt={cat.name}
                            className="relative w-6 h-6 md:w-10 md:h-10 object-contain rounded-full drop-shadow-sm transition-all duration-500"
                          />
                        ) : (
                          <IconComponent
                            className="relative w-5 h-5 md:w-9 md:h-9 text-[#ff6014] drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            strokeWidth={1.75}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className="font-semibold text-[10px] md:text-sm lg:text-[15px] text-center text-slate-700 mt-1 transition-colors duration-200 group-hover:text-[#ff6014] line-clamp-2 min-h-[2.2em] md:min-h-[auto] flex items-center justify-center"
                      >
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreCategories;