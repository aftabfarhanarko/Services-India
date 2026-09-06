"use client";

import React from "react";
import { Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expert } from "./types";
import VendorCategoryTags from "./VendorCategoryTags";
import VendorLocationInfo from "./VendorLocationInfo";

interface ExpertCardProps {
  expert: Expert;
  onViewDetails: () => void;
}

export default function ExpertCard({ expert, onViewDetails }: ExpertCardProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-white/60 hover:border-[#FF6014]/60 hover:shadow-[0_12px_40px_0_rgba(255,96,20,0.15)] transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 relative">
      <div className="flex-1 space-y-4">
        <div className="flex items-start gap-4">
          {expert.avatar ? (
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0"
            />
          ) : null}

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold tracking-wider bg-rose-50 border border-rose-100 text-[#FF6014] px-3 py-1 rounded-full uppercase">
                {expert.badge}
              </span>

              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {expert.rating}
                <span className="text-xs text-slate-400 font-bold ml-1">
                  ({expert.reviews} reviews)
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {expert.name}
              </h3>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
                <VendorLocationInfo expert={expert} />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5 text-blue-600">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  {expert.status}
                </div>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-500 leading-relaxed pr-0 md:pr-10">
              {expert.description}
            </p>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Service Categories
              </p>
              <VendorCategoryTags categories={expert.categories} max={8} size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-4">
        <div>
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
            Starting At
          </span>
          <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            ₹{expert.price.toLocaleString()}
          </span>
        </div>

        <Button
          onClick={onViewDetails}
          className="px-6 py-3 bg-[#FF6014] hover:bg-[#E0530A] text-white font-bold rounded-2xl text-sm md:text-base transition-all shadow-sm hover:shadow-md active:scale-97 text-center w-auto md:w-full cursor-pointer h-auto"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
