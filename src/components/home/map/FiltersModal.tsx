"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempPriceRange: { min: number; max: number };
  setTempPriceRange: (range: { min: number; max: number }) => void;
  tempMinRating: number | null;
  setTempMinRating: (val: number | null) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function FiltersModal({
  isOpen,
  onClose,
  tempPriceRange,
  setTempPriceRange,
  tempMinRating,
  setTempMinRating,
  sortBy,
  setSortBy,
  onApplyFilters,
  onClearFilters
}: FiltersModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden z-10 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Advanced Filters</h3>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 h-auto bg-slate-50 rounded-full cursor-pointer border-none outline-none"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Price range selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Range (₹)</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">MIN</span>
                  <input
                    type="number"
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF6014]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">MAX</span>
                  <input
                    type="number"
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF6014]"
                  />
                </div>
              </div>
            </div>

            {/* Rating selection chips */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum Rating</h4>
              <div className="grid grid-cols-3 gap-2">
                {[3.0, 4.0, 4.5].map((val) => {
                  const isSelected = tempMinRating === val;
                  return (
                    <Button
                      variant="outline"
                      key={val}
                      type="button"
                      onClick={() => setTempMinRating(val)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer h-auto ${
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

            {/* Sorting option (mobile only) */}
            <div className="space-y-2 lg:hidden">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort List</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-[#FF6014]"
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-4 border-t border-slate-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={onClearFilters}
                className="flex-1 py-3 h-auto text-slate-500 hover:text-slate-800 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Clear All
              </Button>
              <Button
                type="button"
                onClick={onApplyFilters}
                className="flex-1 py-3 h-auto bg-[#FF6014] hover:bg-[#E0530A] text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer border-none"
              >
                Apply Filters
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
