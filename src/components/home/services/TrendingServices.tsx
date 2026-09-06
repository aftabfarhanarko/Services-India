"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { formatImageUrl } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          className={i <= Math.round(rating) ? "fill-amber-400" : "fill-slate-200"}
        />
      ))}
    </span>
  );
}

const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

interface TrendingServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviews: string;
  price: number;
  badge?: string;
  slug: string;
  done: string;
  bookingsCount?: number;
}

export default function TrendingServices() {
  const { data: servicesRes, isLoading } = useGetPublicServicesQuery();
  const allServices = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);

  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const categorySlug = searchParams.get("category") || "";

  // Map API services or use exact design match fallbacks
  const trendingListings = useMemo<TrendingServiceItem[]>(() => {
    if (!allServices.length) return [];

    let filteredServices = allServices;
    if (q || categorySlug) {
      filteredServices = allServices.filter((service: any) => {
        let match = true;
        if (q) {
          const words = q
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 0);
          const title = (service.name || "").toLowerCase();
          const desc = (service.description || service.subtitle || "").toLowerCase();
          const category = (service.category?.name || "").toLowerCase();
          const allWordsMatch = words.every(
            (word) =>
              title.includes(word) ||
              desc.includes(word) ||
              category.includes(word)
          );
          if (!allWordsMatch) match = false;
        }
        if (categorySlug) {
          if (service.category?.slug !== categorySlug) match = false;
        }
        return match;
      });
    }

    // Sort by most bookings and most reviews
    const sortedServices = [...filteredServices].sort((a: any, b: any) => {
      const aScore = (a.bookings?.length || 0) + (a.reviews?.length || 0);
      const bScore = (b.bookings?.length || 0) + (b.reviews?.length || 0);
      return bScore - aScore;
    });

    const mapped = sortedServices.map((item: any, index: number) => {
      const id = String(item.id);
      const hash = getHash(id);

      // Calculate real rating & reviews if available
      const totalReviews = item.reviews?.length || 0;
      let averageRating = 4.5 + (hash % 6) * 0.1; // fallback

      if (totalReviews > 0) {
        const sumRating = item.reviews.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0);
        averageRating = sumRating / totalReviews;
      }

      // Format reviews count
      const reviewsStr = totalReviews > 0 ? `${totalReviews}+` : `${(1.0 + (hash % 40) * 0.1).toFixed(1)}k`;

      // Done options based on actual bookings
      const bookingsCount = item.bookings?.length || 0;
      const done = `${bookingsCount} done`;

      // Get lowest price from nested services
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
        rating: parseFloat(averageRating.toFixed(1)),
        reviews: reviewsStr,
        price: priceVal,
        badge: index === 0 ? "MOST BOOKED" : index === 1 ? "HOT" : hash % 3 === 0 ? "POPULAR" : undefined,
        slug: item.slug || "",
        done,
        bookingsCount,
      };
    });

    // Return the top 6 items
    return mapped.slice(0, 6);
  }, [allServices, q, categorySlug]);

  if (isLoading) {
    return (
      <section className="py-14 bg-transparent relative overflow-hidden flex items-center justify-center min-h-[250px]">
        <div className="flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#FF6014]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">Loading trending services...</span>
        </div>
      </section>
    );
  }

  if (!allServices.length) {
    return (
      <section className="py-14 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center py-12">
          <h2 className="text-lg font-medium text-slate-800 mb-2">Trending Services</h2>
          <p className="text-sm text-slate-500 font-medium">No trending services available at the moment.</p>
        </div>
      </section>
    );
  }

  const featured = trendingListings[0];
  const secondary = trendingListings[1];

  return (
    <section className="pt-4 pb-0 md:pt-10 md:pb-2 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center md:items-start md:text-left mb-8">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-800 tracking-tight">
              Trending Services
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
              Highly requested by residents in Kolkata this month
            </p>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        {trendingListings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {trendingListings.slice(0, 3).map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group relative bg-white rounded-3xl border border-slate-100 hover:border-[#FF6014]/25 hover:shadow-[0_20px_50px_rgba(255,96,20,0.06)] transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden">
                  <img
                    src={formatImageUrl(service.image)}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge */}
                  {service.badge && (
                    <span className="absolute top-3.5 left-3.5 py-1 px-3 bg-gradient-to-r from-[#FF6014] to-[#ff7a37] text-white text-[9px] font-extrabold tracking-wider rounded-full uppercase shadow-md z-10">
                      {service.badge}
                    </span>
                  )}
                  {/* Star Rating Floating on Image top-right */}
                  <span className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-extrabold text-amber-500 shadow-sm border border-slate-100/50">
                    ★ {service.rating}
                  </span>
                  {/* Bookings Completed Badge */}
                  <div className="absolute bottom-3.5 right-3.5 bg-[#FF6014]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 shadow-[0_4px_12px_rgba(255,96,20,0.25)] border border-white/20 uppercase tracking-wider z-10">
                    <CheckCircle size={10} className="text-white fill-white/10" />
                    <span>{service.bookingsCount || 0} Completed</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold flex-wrap">
                      <StarRating rating={service.rating} />
                      <span>({service.reviews} reviews)</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-wider ml-1">
                        <Clock size={10} strokeWidth={2.5} className="text-[#FF6014]/75" />
                        {service.done}
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-slate-800 leading-snug group-hover:text-[#FF6014] transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {service.description ? service.description.replace(/<[^>]*>/g, "") : "Professional service tailored to your home needs."}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100/60 mt-auto">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">
                        Starting from
                      </p>
                      <p className="text-base font-bold text-slate-800">
                        ₹{service.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={service.slug ? `/categories/service/${service.slug}?book=true` : `/services/${service.id}?book=true`}
                      className="px-4 py-2 border border-[#FF6014]/25 hover:border-[#FF6014] bg-white hover:bg-[#FF6014] text-[#FF6014] hover:text-white text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      Book Now <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-sm font-semibold text-slate-400">
              No trending services available
            </p>
          </div>
        )}
      </div>
    </section>
  );
}