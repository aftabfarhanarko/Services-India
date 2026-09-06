"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle2, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Expert } from "./types";
import { buildVendorServicesUrl } from "./mapVendorUtils";
import VendorCategoryTags from "./VendorCategoryTags";
import VendorLocationInfo from "./VendorLocationInfo";

interface DetailModalProps {
  expert: Expert | null;
  onClose: () => void;
}

export default function DetailModal({ expert, onClose }: DetailModalProps) {
  const router = useRouter();

  const handleBookAppointment = () => {
    if (!expert) return;
    router.push(buildVendorServicesUrl(expert));
    onClose();
  };

  return (
    <AnimatePresence>
      {expert && (
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 relative flex flex-col max-h-[85vh]"
          >
            
            {/* Header Visual Cover */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-500 to-[#FF6014] text-white relative">
              <Button
                variant="ghost"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 h-auto rounded-full cursor-pointer border-none outline-none"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 sm:gap-4">
                {expert.avatar ? (
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-white/30 shrink-0"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] sm:text-[10px] font-extrabold tracking-wider bg-white/20 px-2 sm:px-2.5 py-0.5 rounded-full inline-block mb-1 sm:mb-2 uppercase">
                    {expert.badge}
                  </span>
                  
                  <h3 className="text-base sm:text-2xl font-black tracking-tight truncate sm:whitespace-normal">{expert.name}</h3>
                  {expert.companyName && expert.companyName !== expert.name ? (
                    <p className="text-[10px] sm:text-xs text-white/90 mt-0.5 sm:mt-1 font-semibold truncate">{expert.companyName}</p>
                  ) : null}
                  <div className="mt-1.5 sm:mt-2">
                    <VendorLocationInfo expert={expert} variant="light" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 sm:space-y-6 custom-scrollbar">
              
              {/* Scorecards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold block uppercase">Rating</span>
                  <span className="text-sm sm:text-lg font-black text-slate-900 flex items-center justify-center gap-0.5 sm:gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {expert.rating}
                  </span>
                </div>
                <div className="p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold block uppercase">Jobs Done</span>
                  <span className="text-sm sm:text-lg font-black text-slate-900 block mt-0.5">{expert.completedJobs}+</span>
                </div>
                <div className="p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold block uppercase">Reviews</span>
                  <span className="text-sm sm:text-lg font-black text-slate-900 block mt-0.5">{expert.reviews}</span>
                </div>
              </div>

              {/* About Profile */}
              <div className="space-y-2">
                <h4 className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">About Expert</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                  {expert.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Service Categories
                </h4>
                <VendorCategoryTags categories={expert.categories} max={12} size="md" />
              </div>

              {/* Details info */}
              <div className="space-y-3 pt-1">
                <h4 className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Expertise Details</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                    <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                    <span className="truncate">Vetted Service Provider ({expert.status})</span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                    <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[#FF6014]/5 text-[#FF6014] flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                    <span>Book online instantly with secure checkout</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action booking footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block uppercase">Pricing</span>
                <span className="text-xs sm:text-lg font-black text-slate-900">₹{expert.price.toLocaleString()}+</span>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={handleBookAppointment}
                  className="px-3 sm:px-6 py-2 sm:py-3 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold rounded-xl text-[10px] sm:text-xs shadow-sm transition-all active:scale-97 border-none cursor-pointer h-auto"
                >
                  Book Appointment
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
