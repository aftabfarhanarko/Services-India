"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, Globe, Building2, ShieldCheck } from "lucide-react";
import {
  useGetAllDevisionsQuery,
  useGetAllDistrictsQuery,
} from "@/redux/features/admin/location";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
} as const;

export default function ServiceAreas() {
  const { data: divRes, isLoading: isDivisionsLoading } = useGetAllDevisionsQuery();
  const { data: distRes, isLoading: isDistrictsLoading } = useGetAllDistrictsQuery();

  const divisions = divRes?.data || [];
  const allDistricts = distRes?.data || [];

  const areas = useMemo(() => {
    return divisions.map((division: any) => {
      const nestedDistricts = division.districts || [];
      const districts =
        nestedDistricts.length > 0
          ? nestedDistricts
          : allDistricts.filter(
            (district: any) => String(district.devision?.id) === String(division.id)
          );

      return {
        id: division.id,
        city: division.name,
        zones: districts.map((district: any) => district.name),
        active: districts.length > 0,
        highlight: division.name?.toLowerCase() === "kolkata",
      };
    });
  }, [divisions, allDistricts]);

  const activeCount = areas.filter((area) => area.active).length;
  const totalDistricts = areas.reduce((sum, area) => sum + area.zones.length, 0);
  const isLoading = isDivisionsLoading || isDistrictsLoading;

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* ── Modern Centered Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFF4EE] border border-[#FF6014]/20 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs">
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Coverage Areas</span>
          </div>

          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            We Serve Across <span className="text-[#FF6014]">Kolkata & India</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            {isLoading
              ? "Mapping our service coverage areas..."
              : `Verified Rajseba service partners operate across ${activeCount} active divisions and ${totalDistricts} districts.`}
          </p>

          {/* ── High-end Glassmorphic Coverage Summary Pill ── */}
          {!isLoading && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/90 backdrop-blur-xl border border-orange-100 p-2 sm:p-2.5 rounded-2xl shadow-sm mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 px-3 py-1 rounded-xl bg-orange-50/80 border border-orange-100">
                <MapPin size={13} className="text-[#FF6014]" />
                {activeCount} Active Divisions
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-100">
                <Building2 size={13} className="text-emerald-600" />
                {totalDistricts} Districts
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 px-3 py-1 rounded-xl bg-blue-50/80 border border-blue-100">
                <ShieldCheck size={13} className="text-blue-600" />
                500+ Verified Experts
              </span>
            </div>
          )}
        </div>

        {/* ── Division Grid ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
            <p className="text-xs font-bold text-slate-400">Loading coverage map...</p>
          </div>
        ) : areas.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-sm font-semibold text-slate-500">No coverage areas available yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {areas.map((area) => (
              <motion.div
                key={area.id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className={`group relative rounded-[28px] border-2 p-5 transition-all duration-300 flex flex-col justify-between ${area.highlight
                  ? "bg-gradient-to-br from-white via-white to-[#FFF8F4] border-[#FF6014]/40 shadow-md hover:shadow-xl hover:border-[#FF6014]"
                  : area.active
                    ? "bg-white/90 backdrop-blur-xl border-orange-100/90 hover:border-[#FF6014]/40 shadow-xs hover:shadow-lg"
                    : "bg-slate-50/70 border-slate-200/60 opacity-75"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${area.active ? "bg-orange-50 text-[#FF6014] border border-orange-200/60 shadow-2xs" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                        <MapPin size={17} />
                      </div>
                      <h3 className={`font-black text-sm ${area.active ? "text-slate-900" : "text-slate-400"}`}>
                        {area.city}
                      </h3>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${area.highlight
                        ? "bg-[#FF6014] text-white border-[#FF6014] shadow-2xs"
                        : area.active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-black"
                          : "bg-slate-200 text-slate-500 border-slate-300"
                        }`}
                    >
                      {area.active && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                      )}
                      {area.highlight ? "🏙️ HQ" : area.active ? "Active" : "Soon"}
                    </span>
                  </div>

                  {area.zones.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {area.zones.map((zone: string) => (
                        <span
                          key={zone}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border transition-colors ${area.active
                            ? "bg-slate-50/90 border-slate-200/80 text-slate-600 group-hover:bg-[#FFF8F4] group-hover:border-[#FF6014]/30 group-hover:text-[#FF6014]"
                            : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}
                        >
                          {zone}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-semibold italic pl-1">Districts coming soon</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
