"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ChevronRight, Zap, Layers, Briefcase, MapPin, Tag, Award } from "lucide-react";

interface OperationalInsightsProps {
  categoriesCount: number;
  totalVendorsRegistered: number;
  topVendors: any[];
}

export default function OperationalInsights({
  categoriesCount,
  totalVendorsRegistered,
  topVendors,
}: OperationalInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      whileHover={{ y: -3 }}
      className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 hover:border-[#FF6014]/20 hover:shadow-xl hover:shadow-[#FF6014]/5 transition-all duration-300 p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-[#FF6014]" />
              Operational Insights
            </h3>
            <p className="text-xs text-slate-400 font-medium">Top vendors & category activity</p>
          </div>
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-orange-100 shadow-xs">
            <Zap size={20} />
          </div>
        </div>

        {/* Quick stats indicators */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <motion.div whileHover={{ scale: 1.03 }} className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100/80 flex flex-col">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Layers size={10} className="text-slate-400" />
              Categories
            </span>
            <span className="text-sm font-black text-slate-800 mt-1">{categoriesCount} Active</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100/80 flex flex-col">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Briefcase size={10} className="text-[#FF6014]" />
              Total Vendors
            </span>
            <span className="text-sm font-black text-[#FF6014] mt-1">{totalVendorsRegistered} Registered</span>
          </motion.div>
        </div>

        {/* Top Vendors Section */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Award size={13} className="text-[#FF6014]" />
            Top Performing Vendors
          </h4>
          <div className="space-y-3">
            {topVendors.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-medium bg-slate-50/40 rounded-2xl border border-slate-100">
                No vendor profiles found.
              </div>
            ) : (
              topVendors.map((vendor: any, idx: number) => (
                <motion.div
                  key={vendor.id || idx}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-orange-50/40 transition-colors border border-transparent hover:border-orange-200/60 group/v cursor-pointer"
                >
                  {vendor.avatar ? (
                    <img
                      src={vendor.avatar}
                      alt={vendor.company_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6014] to-orange-400 flex items-center justify-center text-xs font-black text-white shadow-xs">
                      {vendor.company_name?.substring(0, 2).toUpperCase() || "VD"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-800 truncate group-hover/v:text-[#FF6014] transition-colors flex items-center gap-1">
                      {vendor.company_name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5 flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400" />
                      {vendor.serviceArea || "Kolkata Region"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 text-amber-500 font-extrabold text-[10px]">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{vendor.rating || "5.0"}</span>
                    </div>
                    <p className="text-[10px] text-[#FF6014] font-bold mt-0.5 flex items-center justify-end gap-0.5">
                      <Tag size={9} className="text-[#FF6014]" />
                      ₹{vendor.min_starting_price || 400}+
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick action button */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <Link
          href="/dashbord/vendors"
          className="w-full py-2.5 bg-slate-50 hover:bg-[#FF6014] hover:text-white rounded-2xl border border-slate-100 hover:border-[#FF6014] transition-all text-xs font-black text-slate-600 flex items-center justify-center gap-1 shadow-2xs group/btn"
        >
          <span>Manage Vendors</span>
          <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
