"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Loader2, Star, CalendarCheck } from "lucide-react";
import {
  useGetPublicCategoriesQuery,
  useGetPublicServicesQuery,
} from "@/redux/features/landing/landingApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 15 },
  },
} as const;

const SectionHeader = ({ title, viewAllHref }: { title: string; viewAllHref?: string }) => (
  <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
    <div className="relative">
      <h3 className="text-lg md:text-xl font-medium text-slate-800 tracking-tight capitalize">
        {title}
      </h3>
      <div className="absolute -bottom-[3px] left-0 w-12 h-[3px] bg-[#FF6014] rounded-full" />
    </div>
    {viewAllHref && (
      <Link
        href={viewAllHref}
        className="text-xs font-extrabold text-[#FF6014] hover:text-[#E0530A] transition-colors flex items-center gap-1 uppercase tracking-wider"
      >
        View All <ArrowRight size={13} strokeWidth={2.5} />
      </Link>
    )}
  </div>
);

const getServicePrice = (service: any) => {
  if (service.nestedServices?.length > 0) {
    const prices = service.nestedServices
      .map((ns: any) => Number(ns.starting_price || 0))
      .filter((p: number) => p > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  return Number(service.starting_price || service.price || 0);
};

export default function CategorizedSections() {
  const { data: categoriesRes, isLoading: isCategoriesLoading } = useGetPublicCategoriesQuery();
  const { data: servicesRes, isLoading: isServicesLoading } = useGetPublicServicesQuery();

  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);
  const allServices = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);

  const groupedData = useMemo(() => {
    if (!categories.length) return [];

    const mapped = categories
      .map((cat: any) => {
        const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";

        const servicesForCategory = allServices.filter((service: any) => {
          const serviceCategoryId = service.category_id || service.category?.id;
          if (serviceCategoryId && cat.id) {
            return String(serviceCategoryId) === String(cat.id);
          }
          const serviceCategorySlug = service.category?.slug;
          if (serviceCategorySlug && cat.slug) {
            return serviceCategorySlug === cat.slug;
          }
          return false;
        });

        return {
          ...cat,
          slug: catSlug,
          services: servicesForCategory,
        };
      });

    // Sort categories: active services at the top, empty categories at the bottom
    return [...mapped].sort((a: any, b: any) => {
      const aHasServices = a.services.length > 0 ? 1 : 0;
      const bHasServices = b.services.length > 0 ? 1 : 0;
      return bHasServices - aHasServices;
    });
  }, [categories, allServices]);

  if (isCategoriesLoading || isServicesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
          <p className="text-xs font-bold text-slate-400">Loading categorized services...</p>
        </div>
      </div>
    );
  }

  if (groupedData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
          <Sparkles size={13} />
          Explore By Category
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight mb-8">
          Services Category
        </h2>
      </div>

      {groupedData.map((category: any) => (
        <section key={category.id} className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeader
            title={category.name}
            viewAllHref={`/services?category=${category.slug}`}
          />

          {category.services.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              No available services in this category.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {category.services.slice(0, 6).map((item: any) => {
                const priceVal = getServicePrice(item);
                const totalReviews = item.reviews?.length || 0;
                const totalBookings = item.bookings?.length || 0;
                const serviceImage = item.image || "/images/service/service-1.png";

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="bg-white rounded-3xl overflow-hidden border border-blue-200 shadow-sm hover:shadow-lg hover:shadow-blue-100/60 hover:border-blue-500 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-40 bg-slate-50 shrink-0">
                      <img
                        src={serviceImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 py-1 px-2.5 bg-white/95 text-slate-800 text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-sm">
                        {category.name}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm mb-1 leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                          {item.description
                            ? item.description.replace(/<[^>]*>/g, "")
                            : "Professional services tailored for your home needs."}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarCheck size={12} className="text-[#FF6014]" />
                            {totalBookings} {totalBookings === 1 ? "Booking" : "Bookings"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Price starts at</span>
                          <span className="text-sm font-black text-slate-900">
                            {priceVal > 0 ? `₹${priceVal.toLocaleString()}` : "Contact"}
                          </span>
                        </div>
                        <Link
                          href={`/services/${item.id}`}
                          className="text-xs font-bold text-[#FF6014] hover:text-[#E0530A] transition-colors flex items-center gap-1"
                        >
                          Book Now <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      ))}
    </div>
  );
}