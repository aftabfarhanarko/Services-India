"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle, ArrowRight } from "lucide-react";
import { DisplayPackage } from "./packageOfferUtils";

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.2, 0.8, 0.2, 1],
    },
  },
} as const;

import { formatImageUrl } from "@/lib/utils";

export function PackageOfferCard({
  pkg,
  index = 0,
  onBook,
}: {
  pkg: DisplayPackage;
  index?: number;
  onBook?: (pkg: DisplayPackage) => void;
}) {
  const isPopular = pkg.variant === "popular" || pkg.badge === "POPULAR";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group rounded-3xl relative flex flex-col h-full overflow-hidden backdrop-blur-xl border transition-all duration-300 ${
        isPopular
          ? "bg-white/50 border-[#FF6014]/60 shadow-[0_12px_40px_0_rgba(255,96,20,0.18)] ring-2 ring-[#FF6014]/30 hover:bg-white/70 hover:border-[#FF6014]"
          : "bg-white/40 border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-white/60 hover:border-[#FF6014]/60 hover:shadow-[0_12px_40px_0_rgba(255,96,20,0.15)]"
      }`}
    >
      {/* Glass Shimmer Overlay on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none z-20" />

      {/* Badge */}
      {pkg.badge && (
        <div className="absolute top-3.5 right-3.5 bg-gradient-to-r from-[#FF6014] to-[#FF8142] text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full z-10 shadow-md">
          {pkg.badge}
        </div>
      )}

      {/* Image Block */}
      {pkg.image ? (
        <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
          <img
            src={formatImageUrl(pkg.image)}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Gradient overlay so bottom text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Bookings Completed Badge */}
          {(pkg.bookingsCount !== undefined && pkg.bookingsCount !== null) && (
            <div className="absolute top-3.5 left-3.5 bg-[#FF6014]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 shadow-[0_4px_12px_rgba(255,96,20,0.25)] border border-white/20 uppercase tracking-wider z-10">
              <CheckCircle size={10} className="text-white fill-white/10" />
              <span>{pkg.bookingsCount} Completed</span>
            </div>
          )}

          {/* Service label bottom-left */}
          {pkg.serviceName && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {pkg.serviceName}
              </span>
            </div>
          )}
        </div>
      ) : pkg.serviceName ? (
        /* No image — show service pill at top */
        <div className="px-6 pt-6 pb-2">
          <span className="inline-block bg-[#FFF4EE] text-[#FF6014] border border-[#FF6014]/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-xs">
            {pkg.serviceName}
          </span>
        </div>
      ) : null}

      {/* Card Body */}
      <div
        className={`p-6 flex flex-col flex-1 ${!pkg.image && !pkg.serviceName ? "pt-8" : ""
          }`}
      >
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug tracking-tight group-hover:text-[#FF6014] transition-colors">
            {pkg.title}
          </h3>
          {pkg.description && (
            <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">
              {pkg.description}
            </p>
          )}
          {pkg.price ? (
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-[#FF6014]">
                ₹{pkg.price}
              </span>
              <span className="text-xs font-bold text-slate-400">/package</span>
            </div>
          ) : (
            <div className="text-2xl font-black text-[#FF6014]">Get Quote</div>
          )}
        </div>

        {pkg.features.length > 0 ? (
          <div className="mb-5 flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Included Services & Features
            </p>
            <ul className="space-y-2">
              {pkg.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                  <Check className="w-4 h-4 text-[#FF6014] mt-0.5 flex-shrink-0 stroke-[2.5]" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-5 flex-1" />
        )}

        {/* Compact Ultra-Premium Footer & Button */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Exclusive Deal
          </div>
          <button
            type="button"
            onClick={() => onBook?.(pkg)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-[#FF6014] to-[#FF8142] hover:from-[#E0530A] hover:to-[#FF6014] shadow-md shadow-[#FF6014]/25 hover:shadow-xl hover:shadow-[#FF6014]/35 transition-all cursor-pointer active:scale-95 group/btn"
          >
            <span>{pkg.buttonText}</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}