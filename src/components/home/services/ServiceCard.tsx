"use client";

import { Clock, Heart, Star, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useToggleSavedServiceMutation, useGetSavedServicesQuery } from "@/redux/features/admin/user";
import { toast } from "sonner";

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
  bookingsCount?: number;
}

import { formatImageUrl } from "@/lib/utils";

export default function ServiceCard({ service }: { service: ServiceListing }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // Fetch saved services only when logged in
  const { data: savedRes } = useGetSavedServicesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const savedServices: any[] = savedRes?.data || [];
  const isWishlisted = savedServices.some(
    (s) => String(s.id) === String(service.id)
  );

  const [toggleSaved, { isLoading: isToggling }] = useToggleSavedServiceMutation();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save to wishlist");
      return;
    }

    try {
      await toggleSaved(service.id).unwrap();
      toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const cleanDesc = service.description ? service.description.replace(/<[^>]*>/g, "") : "";
  const truncatedDesc = cleanDesc.length > 95
    ? cleanDesc.slice(0, 95) + "..."
    : cleanDesc;

  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white/40 backdrop-blur-xl border border-[#FF6014]/25 hover:border-[#FF6014]/70 hover:bg-white/60 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_12px_40px_0_rgba(255,96,20,0.15)] no-underline flex flex-col hover-card-premium transition-all duration-300 h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={formatImageUrl(service.image)}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 py-1 px-2.5 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-extrabold rounded-lg uppercase tracking-wider shadow-sm border border-slate-100/50">
          {service.categoryLabel}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 py-1 px-2 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-extrabold text-[#FF6014] shadow-sm border border-slate-100/50">
          <Star size={11} className="fill-[#FF6014] text-[#FF6014]" strokeWidth={0} />
          {service.rating}
        </span>

        {/* Bookings Completed Badge */}
        <div className="absolute bottom-3 left-3 bg-[#FF6014]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 shadow-[0_4px_12px_rgba(255,96,20,0.25)] border border-white/20 uppercase tracking-wider z-10">
          <CheckCircle size={10} className="text-white fill-white/10" />
          <span>{service.bookingsCount || 0} Completed</span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          disabled={isToggling}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 z-20 ${isWishlisted
              ? "bg-[#FF6014] text-white scale-110"
              : "bg-white/90 text-slate-400 hover:bg-rose-50 hover:text-[#FF6014] hover:scale-110"
            }`}
        >
          <Heart
            size={14}
            className={isWishlisted ? "fill-white" : ""}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800 mb-1.5 leading-snug group-hover:text-[#FF6014] transition-colors duration-200">
            {service.title}
          </h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed line-clamp-3">
            {truncatedDesc}
          </p>
        </div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-base font-black text-[#FF6014]">
              {service.priceDisplay}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#9ca3af] mt-0.5 uppercase tracking-wider">
              <Clock size={10} strokeWidth={2.5} className="text-[#FF6014]/75" />
              {service.done}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-[10px] font-extrabold text-[#FF6014] group-hover:bg-[#FF6014] group-hover:text-white transition-all duration-300 border border-slate-100 group-hover:border-[#FF6014]">
            Details
            <ArrowRight size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
