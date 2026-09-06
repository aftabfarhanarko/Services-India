"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  Calendar,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetSavedServicesQuery,
  useToggleSavedServiceMutation,
} from "@/redux/features/admin/user";
import { toast } from "sonner";
import { formatImageUrl } from "@/lib/utils";

interface CategorizedHeroProps {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
  categoryName?: string;
  rating?: number | string;
  reviewsCount?: number;
  bookingsCount?: number;
}

export function CategorizedHero({
  id,
  name,
  description,
  image,
  categoryName,
  rating = 0,
  reviewsCount = 0,
  bookingsCount = 0,
}: CategorizedHeroProps) {
  const router = useRouter();

  const displayName = name || "Certified Electrical Experts in Kolkata";
  const displayDesc =
    description ||
    "From flickering lights to full-house wiring, our certified technicians ensure your home's safety with premium electrical solutions.";

  const authUser = useAppSelector((state) => state.auth.user);

  const { data: savedRes } = useGetSavedServicesQuery(undefined, {
    skip: !authUser,
  });
  const savedServices: any[] = savedRes?.data || [];
  const isSaved = id
    ? savedServices.some((s) => String(s.id) === String(id))
    : false;

  const [toggleSaved, { isLoading: isToggling }] =
    useToggleSavedServiceMutation();

  const handleToggleSave = async () => {
    if (!authUser) {
      toast.error("Please login to save to wishlist");
      return;
    }
    if (!id) return;
    try {
      await toggleSaved(id).unwrap();
      toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist ❤️");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleBookNow = () => {
    if (!authUser) {
      toast.error("Please login to proceed with booking.");
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    const target = document.getElementById("specialized-services");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/booking/${id}`);
    }
  };

  const handleViewRateCard = () => {
    const target = document.getElementById("specialized-services");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderHighlightedTitle = (title: string) => {
    const words = title.split(" ");
    if (words.length <= 1) return title;

    const stopWords = ["and", "or", "in", "for", "with", "of", "to", "a", "the", "at", "by", "from", "on", "service", "services"];

    // Find the best word to highlight:
    const middleIndex = Math.floor(words.length / 2);
    let highlightIndex = middleIndex;

    // Check if middle word is a stop word, if so, look around
    if (stopWords.includes(words[middleIndex].toLowerCase())) {
      if (middleIndex - 1 >= 0 && !stopWords.includes(words[middleIndex - 1].toLowerCase())) {
        highlightIndex = middleIndex - 1;
      } else if (middleIndex + 1 < words.length && !stopWords.includes(words[middleIndex + 1].toLowerCase())) {
        highlightIndex = middleIndex + 1;
      }
    }

    return (
      <>
        {words.map((word, idx) => {
          const isHighlighted = idx === highlightIndex;
          return (
            <React.Fragment key={idx}>
              <span className={isHighlighted ? "text-[#FF6014]" : ""}>
                {word}
              </span>
              {idx < words.length - 1 ? " " : ""}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div className="py-10 md:py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_460px] gap-8 md:gap-12 items-center">

          {/* ── Left Content ── */}
          <div className="flex flex-col gap-5 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 bg-[#fff0f0] text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                Top Rated Services
              </div>
              {categoryName && (
                <div className="inline-flex items-center gap-1.5 bg-[#FFF8F4] border border-[#FF6014]/20 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  {categoryName}
                </div>
              )}
            </div>

            {/* Title + Wishlist */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-slate-900 max-w-xl">
                {renderHighlightedTitle(displayName)}
              </h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleSave}
                disabled={isToggling}
                className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm flex-shrink-0 focus:outline-none cursor-pointer disabled:opacity-60"
              >
                <Heart
                  size={20}
                  className={isSaved ? "fill-[#FF6014] text-[#FF6014]" : "text-slate-300"}
                />
              </motion.button>
            </div>

            {/* Ratings & Bookings */}
            {(Number(rating) > 0 || bookingsCount > 0) && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {Number(rating) > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-100/60 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span>{rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({reviewsCount} reviews)
                    </span>
                  </div>
                )}
                {bookingsCount > 0 && (
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl border border-emerald-100/60 font-semibold">
                    <span className="font-bold text-emerald-800">{bookingsCount}</span>{" "}
                    Bookings Done
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {/<[a-z]/.test(displayDesc) ? (
              <div
                className="text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed rich-content line-clamp-5"
                dangerouslySetInnerHTML={{ __html: displayDesc }}
              />
            ) : (
              <p className="text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed line-clamp-5">
                {displayDesc}
              </p>
            )}

            {/* ── Action Buttons ── */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 pt-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBookNow}
                className="flex items-center justify-center gap-2 bg-[#FF6014] hover:bg-[#E0530A]
                  text-white px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm
                  transition-all shadow-lg shadow-rose-100 cursor-pointer w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4" />
                Book Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleViewRateCard}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200
                  hover:border-slate-300 hover:bg-slate-50
                  px-7 py-3.5 rounded-full font-semibold text-slate-700 text-xs sm:text-sm
                  transition-all cursor-pointer w-full sm:w-auto"
              >
                Rate Card
              </motion.button>
            </div>
          </div>

          {/* ── Right Image ── */}
          <div className="relative w-full flex-shrink-0 order-first md:order-last">
            {/*
              KEY FIX: outer div is `relative` only, NO overflow-hidden here.
              The inner image div has overflow-hidden + rounded corners.
              Badge sits outside image div but inside this relative wrapper,
              positioned at bottom-left overlapping the image edge.
            */}
            <div className="relative">
              {/* Image frame */}
              <div className="w-full h-56 sm:h-64 md:h-[320px] lg:h-[380px] rounded-[28px] overflow-hidden border-4 border-white shadow-xl">
                {image ? (
                  <img
                    src={formatImageUrl(image)}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-rose-100" />
                )}
              </div>

              {/* ── Verified badge — overlaps bottom-left of image ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="absolute bottom-4 left-4
                  bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg
                  px-3.5 py-2.5 flex items-center gap-2.5
                  border border-slate-100/80"
              >
                {/* Blue shield icon container */}
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    Verified Professional
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-none">
                    Rajseba Guarantee
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}