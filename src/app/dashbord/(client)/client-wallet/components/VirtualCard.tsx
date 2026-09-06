"use client";

import React from "react";

interface VirtualCardProps {
  profileData: any;
  totalExpense: number;
  walletBalance: number;
  lang?: string;
}

export default function VirtualCard({ profileData, totalExpense, walletBalance, lang = "bn" }: VirtualCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-[#E0530A] p-6 sm:p-8 text-white shadow-xl shadow-slate-950/20 border border-slate-800 flex flex-col justify-between aspect-[1.75/1] w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] group hover:shadow-2xl hover:shadow-[#FF6014]/5 transition-all duration-300">
      {/* Mesh/Grid Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#FF6014]/20 blur-3xl pointer-events-none" />

      {/* Card Top Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Microchip */}
          <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#FFE0B2] to-[#FFA726] border border-amber-300 relative shadow-inner overflow-hidden flex flex-col justify-between p-1 shrink-0">
            <div className="flex justify-between w-full h-px bg-amber-700/30" />
            <div className="flex justify-between w-full h-px bg-amber-700/30" />
            <div className="flex justify-between w-full h-px bg-amber-700/30" />
            {/* Chip lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between h-4 border-x border-amber-700/30">
              <div className="w-full h-px bg-amber-700/30 my-auto" />
            </div>
          </div>
          {/* Contactless Icon */}
          <svg
            className="w-5 h-5 text-white/60 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
            <path d="M3 12c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M7 12c0-1.1.9-2 2-2s2 .9 2 2" />
          </svg>
        </div>
        <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
          Rajseba Pay
        </span>
      </div>

      {/* Card Middle Row (Total Expenses) */}
      <div className="relative z-10 space-y-1 mt-6 sm:mt-8">
        <span className="text-[9px] sm:text-[11px] font-bold text-slate-300 tracking-widest uppercase block">
          {lang === "bn" ? "মোট খরচ" : "Total Expenses"}
        </span>
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl opacity-90">₹</span>
          <span className="drop-shadow-lg">
            {Number(totalExpense).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Card Bottom Row */}
      <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4 mt-6">
        <div>
          <span className="text-[7px] font-bold text-slate-300 tracking-wider uppercase block">
            {lang === "bn" ? "কার্ডধারী" : "Card Holder"}
          </span>
          <span className="text-xs font-bold text-white block mt-0.5 tracking-wide">
            {profileData?.data?.name || (lang === "bn" ? "সম্মানিত গ্রাহক" : "Valued Client")}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[7px] font-bold text-slate-300 tracking-wider uppercase block">
            {lang === "bn" ? "চলতি ব্যালেন্স" : "Current Balance"}
          </span>
          <span className="text-xs font-bold text-white block mt-0.5 tracking-wide">
            ₹ {Number(walletBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
