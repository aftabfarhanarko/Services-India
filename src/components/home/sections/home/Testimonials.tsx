"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";
import { motion, AnimatePresence } from "framer-motion";

/* How many cards visible per viewport */
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0, scale: 0.95 }),
};

const Testimonials = () => {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const visibleCount = useVisibleCount();

  const { data: reviewsRes, isLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  const dummyReviews = [
    {
      name: "Bonnie M. Pattison",
      location: "Happy mom from New York",
      rating: 5,
      comment: "Thanks to the personalized attention and guidance provided by the Prenatal Center. I highly recommend them to any Quisque faucibus quam justo, sit amet fermentum...",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Bonnie M. Pattison",
      location: "Happy mom from New York",
      rating: 5,
      comment: "Thanks to the personalized attention and guidance provided by the Prenatal Center. I highly recommend them to any Quisque faucibus quam justo, sit amet fermentum...",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Bonnie M. Pattison",
      location: "Happy mom from New York",
      rating: 5,
      comment: "Thanks to the personalized attention and guidance provided by the Prenatal Center. I highly recommend them to any Quisque faucibus quam justo, sit amet fermentum...",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Bonnie M. Pattison",
      location: "Happy mom from New York",
      rating: 5,
      comment: "Thanks to the personalized attention and guidance provided by the Prenatal Center. I highly recommend them to any Quisque faucibus quam justo, sit amet fermentum...",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Bonnie M. Pattison",
      location: "Happy mom from New York",
      rating: 5,
      comment: "Thanks to the personalized attention and guidance provided by the Prenatal Center. I highly recommend them to any Quisque faucibus quam justo, sit amet fermentum...",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Bonnie M. Pattison",
      location: "Happy mom from New York",
      rating: 5,
      comment: "Thanks to the personalized attention and guidance provided by the Prenatal Center. I highly recommend them to any Quisque faucibus quam justo, sit amet fermentum...",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Sarah Jenkins",
      location: "Salt Lake, Kolkata",
      rating: 5,
      comment: "The service exceeded my expectations! Very professional staff and quick response times.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Michael Chen",
      location: "Park Street, Kolkata",
      rating: 5,
      comment: "Great experience working with Rajseba. Highly organized and reliable team.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Sophia Martinez",
      location: "Ballygunge, Kolkata",
      rating: 5,
      comment: "Prompt service and transparent pricing. Will definitely use their service again!",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
    {
      name: "Alex Turner",
      location: "New Town, Kolkata",
      rating: 5,
      comment: "Top notch quality and amazing support. Truly happy with the results.",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
      hasVideo: true,
    },
  ];

  const fetchedReviews = rawReviews
    .filter((r: any) => (r.comment || r.content || r.review || "").trim().length > 0)
    .map((r: any) => ({
      name: r.user?.name || "Valued Customer",
      location: r.user?.profile?.address || "Kolkata, West Bengal",
      rating: r.rating || 5,
      comment: r.comment || r.content || r.review || "",
      avatar:
        r.user?.profile?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=FF7C71&color=fff&size=100`,
      hasVideo: false,
    }));

  // If fetched reviews are less than 10, append 10 hardcoded items
  const reviews = fetchedReviews.length >= 10 ? fetchedReviews : [...fetchedReviews, ...dummyReviews];

  useEffect(() => { setMounted(true); }, []);

  const Header = () => (
    <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
      <div className="inline-flex items-center gap-2 bg-[#FFF4EE] border border-[#FF6014]/25 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
        <MessageSquare size={13} />
        Customer Reviews
      </div>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2">
        <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
        What Our Clients <span className="text-[#FF6014]">Say About Us</span>
      </h2>
      <p className="mt-3 text-slate-500 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
        Trusted by thousands of happy households across Kolkata & India.
      </p>
    </div>
  );

  if (!mounted) {
    return (
      <div className="py-5 md:py-8 lg:py-10 relative overflow-hidden bg-transparent">
        <div className="w-full mx-auto px-4 md:px-6">
          <Header />
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF6014]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10 relative overflow-hidden bg-transparent w-full">
      <div className="w-full mx-auto px-4 md:px-6">
        <Header />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF6014]" />
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5 overflow-hidden relative">
            {/* Gradient masks for continuous smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            {/* Row 1: Right to Left (Scroll Left) */}
            <div className="flex w-max gap-4 animate-marquee-left hover:[animation-play-state:paused]">
              {[...reviews, ...reviews, ...reviews].map((review, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="w-[380px] md:w-[430px] flex-shrink-0 bg-white border border-slate-100 rounded-[24px] p-4 flex items-stretch gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.09)] transition-all duration-300 h-[185px] md:h-[225px]"
                >
                  {/* Left: Image */}
                  <div className="relative w-[45%] flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 h-full">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=FF5A5F&color=fff&size=200`;
                      }}
                    />
                  </div>

                  {/* Right: Content */}
                  <div className="w-[55%] flex flex-col justify-between py-1 overflow-hidden">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-2">
                        {[...Array(Math.min(review.rating || 5, 5))].map((_, i) => (
                          <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Review Comment */}
                      <p className="text-slate-500 text-xs md:text-[13px] leading-relaxed font-normal line-clamp-4">
                        {review.comment}
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="mt-2">
                      <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-tight truncate">{review.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Left to Right (Scroll Right) */}
            <div className="flex w-max gap-4 animate-marquee-right hover:[animation-play-state:paused]">
              {[...reviews, ...reviews, ...reviews].reverse().map((review, idx) => (
                <div
                  key={`row2-${idx}`}
                  className="w-[380px] md:w-[430px] flex-shrink-0 bg-white border border-slate-100 rounded-[24px] p-4 flex items-stretch gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.09)] transition-all duration-300 h-[185px] md:h-[225px]"
                >
                  {/* Left: Image */}
                  <div className="relative w-[45%] flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 h-full">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=FF5A5F&color=fff&size=200`;
                      }}
                    />
                  </div>

                  {/* Right: Content */}
                  <div className="w-[55%] flex flex-col justify-between py-1 overflow-hidden">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-2">
                        {[...Array(Math.min(review.rating || 5, 5))].map((_, i) => (
                          <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Review Comment */}
                      <p className="text-slate-500 text-xs md:text-[13px] leading-relaxed font-normal line-clamp-4">
                        {review.comment}
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="mt-2">
                      <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-tight truncate">{review.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;