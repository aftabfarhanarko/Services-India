"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  tempPriceRange: { min: number; max: number };
  setTempPriceRange: (range: { min: number; max: number }) => void;
  tempMinRating: number | null;
  setTempMinRating: (val: number | null) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  sortBy,
  setSortBy,
  tempPriceRange,
  setTempPriceRange,
  tempMinRating,
  setTempMinRating,
  onApplyFilters,
  onClearFilters
}: FilterSidebarProps) {
  const fillRight = ((tempPriceRange.max - 500) / (10000 - 500)) * 100;

  return (
    <div className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      
      {/* SORT BY Selector */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Sort By
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#FF6014] focus:ring-1 focus:ring-red-100 transition-all cursor-pointer appearance-none"
          >
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-900">Filters</h4>
        <Button 
          variant="link"
          onClick={onClearFilters}
          className="text-xs font-bold text-[#FF6014] hover:underline cursor-pointer bg-transparent border-none outline-none p-0 h-auto"
        >
          Clear All
        </Button>
      </div>

      {/* Price range selector slider inputs */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Price Range
        </label>
        
        {/* Slider bar mock */}
        <div className="h-1.5 bg-slate-100 rounded-full relative">
          <div 
            className="absolute h-full bg-[#FF6014] rounded-full" 
            style={{ left: "0%", right: `${100 - fillRight}%` }}
          />
          <div className="absolute left-0 w-4 h-4 bg-white border-2 border-[#FF6014] rounded-full top-1/2 -translate-y-1/2 shadow-sm" />
          <div 
            className="absolute w-4 h-4 bg-white border-2 border-[#FF6014] rounded-full top-1/2 -translate-y-1/2 shadow-sm" 
            style={{ left: `${fillRight}%`, transform: "translate(-50%, -50%)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">MIN</span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
              <input
                type="number"
                value={tempPriceRange.min}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF6014] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">MAX</span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
              <input
                type="number"
                value={tempPriceRange.max}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: Math.min(10000, parseInt(e.target.value) || 0) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF6014] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating filter select chips */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[3.0, 4.0, 4.5].map((val) => {
            const isSelected = tempMinRating === val;
            return (
              <Button
                variant="outline"
                key={val}
                type="button"
                onClick={() => setTempMinRating(val)}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer h-auto ${
                  isSelected
                    ? "bg-rose-50 border-[#FF6014] text-[#FF6014] hover:bg-rose-50 hover:text-[#FF6014]"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
                }`}
              >
                {val}★+
              </Button>
            );
          })}
        </div>
      </div>

      {/* Rating selector second layer */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-2">
          {["4.5+", "4.0+", "3.5+"].map((label) => {
            const val = parseFloat(label.replace("+", ""));
            const isSelected = tempMinRating === val;
            return (
              <Button
                variant="outline"
                key={label}
                type="button"
                onClick={() => setTempMinRating(val)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer h-auto ${
                  isSelected
                    ? "bg-rose-50 border-[#FF6014] text-[#FF6014] hover:bg-rose-50 hover:text-[#FF6014]"
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100"
                }`}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Apply button */}
      <Button
        onClick={onApplyFilters}
        className="w-full bg-[#FF6014] hover:bg-[#E0530A] text-white font-bold py-3 h-auto rounded-xl transition-all duration-200 shadow-sm active:scale-98 text-sm cursor-pointer"
      >
        Apply Filters
      </Button>
    </div>
  );
}
