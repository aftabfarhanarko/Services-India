"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { useAppSelector } from "@/redux/hooks";
import { useGetSavedServicesQuery, useToggleSavedServiceMutation } from "@/redux/features/admin/user";
import { toast } from "sonner";
import { formatImageUrl } from "@/lib/utils";


// ─── Color pairs for cards (cycling) ────────────────────────────────────────
const COLOR_PAIRS = [
  { bgColor: "bg-blue-50", iconColor: "text-blue-500" },
  { bgColor: "bg-teal-50", iconColor: "text-teal-500" },
  { bgColor: "bg-amber-50", iconColor: "text-amber-500" },
  { bgColor: "bg-yellow-50", iconColor: "text-yellow-500" },
  { bgColor: "bg-rose-50", iconColor: "text-rose-500" },
  { bgColor: "bg-purple-50", iconColor: "text-purple-500" },
  { bgColor: "bg-green-50", iconColor: "text-green-500" },
  { bgColor: "bg-indigo-50", iconColor: "text-indigo-500" },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.22, // Balanced smooth stagger
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6, // Smooth 0.6s duration
      ease: [0.2, 0.8, 0.2, 1], // Natural fluid easing
    },
  },
} as const;

// ─── Placeholder illustration ────────────────────────────────────────────────
function ServiceIllustration({ bgColor, iconColor }: { bgColor: string; iconColor: string }) {
  return (
    <div className={`relative h-48 md:h-52 ${bgColor} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-32 h-32 rounded-full opacity-10 border-[12px] border-current ${iconColor}`} />
      </div>
      <div className={`relative z-10 ${iconColor} drop-shadow-sm`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0 3.09 3.09Z" />
        </svg>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopServices() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: servicesRes, isLoading, isError } = useGetPublicServicesQuery();

  const { data: savedRes } = useGetSavedServicesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const savedServices: any[] = savedRes?.data || [];

  const [toggleSaved] = useToggleSavedServiceMutation();

  // Support both { data: [...] } and [...] shapes
  const allServices: any[] = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);

  // Show skeleton if loading
  if (isLoading) {
    return (
      <section className="py-5 md:py-8 lg:py-10 bg-transparent">
        <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-8 md:mb-14">
            <div className="w-24 h-6 rounded-full bg-slate-100 animate-pulse" />
            <div className="w-64 md:w-80 h-8 bg-slate-100 rounded-xl animate-pulse" />
            <div className="w-72 md:w-96 h-4 bg-slate-50 rounded-lg animate-pulse" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-50 rounded-3xl animate-pulse border border-slate-100/50" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || allServices.length === 0) {
    return null;
  }

  // Sort by highest bookings and reviews
  const sortedServices = [...allServices].sort((a, b) => {
    const aBookings = a.bookings?.length || 0;
    const bBookings = b.bookings?.length || 0;

    // Primary sort: Number of bookings
    if (aBookings !== bBookings) {
      return bBookings - aBookings;
    }

    // Secondary sort: Average rating
    const aReviews = a.reviews?.length || 0;
    const bReviews = b.reviews?.length || 0;
    const aAvg = aReviews > 0 ? a.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / aReviews : 0;
    const bAvg = bReviews > 0 ? b.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / bReviews : 0;

    return bAvg - aAvg;
  });

  // Display top 4 services
  const displayServices = sortedServices.slice(0, 4);

  const toggleLike = async (service: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save to wishlist");
      return;
    }

    const isWishlisted = savedServices.some((s) => String(s.id) === String(service.id));
    try {
      await toggleSaved(service.id).unwrap();
      toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <section className="py-5 md:py-8 lg:py-10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] rounded-bl-full pointer-events-none" />
      <div className="absolute -left-32 bottom-0 w-96 h-96 bg-[#FF6014]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none" />

      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#FF6014] text-xs font-bold uppercase tracking-wider mb-3">
            <Star size={13} className="fill-[#FF6014]" />
            Most Booked
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014] fill-[#FF6014]" />
            Top Rated <span className="text-[#FF6014]">Services</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Hand-picked professional services highly rated by our community.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {displayServices.map((service: any, i: number) => {
            const colors = COLOR_PAIRS[i % COLOR_PAIRS.length];
            const slug = service.slug || String(service.id);
            const categoryName = service.category?.name || "";

            // Calculate starting price from service.price, or fall back to minimum price of nestedServices
            let price = service.price ? Number(service.price) : null;
            if (!price && service.nestedServices && service.nestedServices.length > 0) {
              const prices = service.nestedServices
                .map((ns: any) => Number(ns.starting_price || ns.price || 0))
                .filter((p: number) => p > 0);
              if (prices.length > 0) {
                price = Math.min(...prices);
              }
            }

            // Calculate original price (before discount)
            const originalPrice = price ? Math.round(price * 1.18) : null;

            const totalReviews = service.reviews?.length || 0;
            const averageRating = totalReviews > 0
              ? (service.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
              : "0.0";
            const totalBookings = service.bookings?.length || 0;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="bg-white/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#FF6014]/25 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] group flex flex-col h-full hover-card-premium transition-all duration-300 hover:bg-white/60 hover:border-[#FF6014]/70 hover:shadow-[0_12px_40px_0_rgba(255,96,20,0.15)]"
              >
                {/* ── Illustration or image ── */}
                <div className="relative">
                  {service.image ? (
                    <div className="relative h-48 md:h-52 overflow-hidden">
                      <img
                        src={formatImageUrl(service.image)}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  ) : (
                    <ServiceIllustration bgColor={colors.bgColor} iconColor={colors.iconColor} />
                  )}

                  {/* Verified badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 shadow-sm text-slate-700 uppercase">
                    Verified
                  </div>

                  {/* Category pill */}
                  {categoryName && (
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {categoryName}
                    </div>
                  )}

                  {/* Bookings Completed Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#FF6014]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 shadow-[0_4px_12px_rgba(255,96,20,0.25)] border border-white/20 uppercase tracking-wider z-10">
                    <span>{totalBookings} Completed</span>
                  </div>

                  {/* Wishlist heart */}
                  <Button
                    variant="ghost"
                    onClick={(e) => toggleLike(service, e)}
                    className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white/90 flex items-center justify-center shadow-sm border border-slate-100/60 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${savedServices.some((s) => String(s.id) === String(service.id))
                        ? "fill-[#FF6014] text-[#FF6014]"
                        : "text-slate-500"
                        }`}
                    />
                  </Button>
                </div>

                {/* ── Text + CTA ── */}
                <div className="p-5 flex flex-col flex-1 justify-between bg-transparent">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                        {service.name}
                      </h3>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-0.5 text-[#FF6014] font-black text-sm whitespace-nowrap">
                          <Star className="w-3 h-3 fill-[#FF6014]" />
                          <span>{averageRating}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{totalReviews} Reviews</span>
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-xs font-semibold text-slate-400 line-clamp-2">
                        {service.description.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 font-semibold pt-1.5 flex items-center gap-1">
                      <span><span className="text-emerald-600 font-bold">{totalBookings}</span> bookings completed</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50">
                    <div className="text-sm font-black text-slate-900">
                      {price ? (
                        <>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting at</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-base font-black text-slate-900">₹{price.toLocaleString()}</span>
                            {originalPrice && (
                              <span className="text-[11px] text-slate-400 font-medium line-through">
                                ₹{originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Contact for price</span>
                      )}
                    </div>
                    <Link href={`/services/${service.id}`}>
                      <Button className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-extrabold px-4 py-2 h-auto rounded-xl transition-all cursor-pointer hover:scale-105 border-none shadow-md hover:shadow-lg flex items-center gap-1.5">
                        Details <ArrowRight size={13} strokeWidth={3} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div >



        {/* Empty state */}
        {
          !isLoading && !isError && displayServices.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No services found.</p>
          )
        }

      </div>
    </section>
  )
}