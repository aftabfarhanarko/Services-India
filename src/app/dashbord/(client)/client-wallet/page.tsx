"use client";

import React from "react";
import {
  Plus,
  CreditCard,
  Download,
  ChevronRight,
  Trash2,
  Copy,
  FileText,
  Gift,
  Loader2,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import AccessDenied from "../components/AccessDenied";
import VirtualCard from "./components/VirtualCard";
import TransactionHistory from "./components/TransactionHistory";
import { useClientWalletState } from "./hooks/useClientWalletState";

export default function WalletPage() {
  const {
    role,
    copied,
    autoRecharge,
    setAutoRecharge,
    profileData,
    myCompletedBookings,
    totalExpense,
    walletBalance,
    handleCopyCode,
    isLoading,
  } = useClientWalletState();
  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "client" && role !== "agent") {
    return <AccessDenied roleRequired="Customer or Agent" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#FF6014]" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-200 flex justify-center">
      <div className="w-full max-w-5xl space-y-6 md:space-y-8 relative z-10">
        {/* Premium Header Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15 animate-in fade-in duration-300">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#FF6014]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-[#FF6014] border border-white/10 flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {lang === "bn" ? "আমার ওয়ালেট" : "My Wallet"}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold leading-relaxed">
                  {lang === "bn"
                    ? "রাজসেবায় আপনার পেমেন্ট অপশন, ইনভয়েস ও প্রোমো কুপন পরিচালনা করুন।"
                    : "Manage payment options, invoices, and promo coupons at Rajseba."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Balance & Quick Manage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 flex flex-col items-center lg:items-start">
            <VirtualCard
              profileData={profileData}
              totalExpense={totalExpense}
              walletBalance={walletBalance}
              lang={lang}
            />

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px]">
              <button className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs sm:text-sm font-bold px-8 py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-[#FF6014]/10 active:scale-[0.98] transition-all w-full sm:w-auto flex-1 cursor-pointer">
                <Plus size={18} /> {lang === "bn" ? "টাকা যোগ করুন" : "Add Funds"}
              </button>
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold px-8 py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all w-full sm:w-auto flex-1 cursor-pointer">
                <FileText size={18} /> {lang === "bn" ? "উত্তোলন করুন" : "Withdraw"}
              </button>
            </div>
          </div>

          {/* Quick Manage Card */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
            <h3 className="font-extrabold text-slate-800 text-base">
              {lang === "bn" ? "কুইক ম্যানেজ" : "Quick Manage"}
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-500 border border-slate-100">
                    <CreditCard size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {lang === "bn" ? "কার্ড ম্যানেজ করুন" : "Manage Cards"}
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-500 border border-slate-100">
                    <Download size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {lang === "bn" ? "অটো-রিচার্জ" : "Auto-Recharge"}
                  </span>
                </div>
                <button
                  onClick={() => setAutoRecharge(!autoRecharge)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    autoRecharge ? "bg-[#FF6014]" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${
                      autoRecharge ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-500 border border-slate-100">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {lang === "bn" ? "ট্যাক্স ইনভয়েস" : "Tax Invoices"}
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Refer & Earn */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-base">
                {lang === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment Methods"}
              </h3>
              <button className="text-xs font-bold text-[#FF6014] hover:underline focus:outline-none cursor-pointer">
                {lang === "bn" ? "নতুন যুক্ত করুন" : "Add New"}
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-extrabold text-[10px] tracking-widest shrink-0">
                    VISA
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Visa Platinum</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">**** **** **** 4242</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#FF6014] bg-[#FFF8F4] px-2 py-0.5 rounded-lg">
                  {lang === "bn" ? "প্রাথমিক" : "Primary"}
                </span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-extrabold text-[9px] shrink-0">
                    bKash
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">
                      {lang === "bn" ? "ব্যক্তিগত অ্যাকাউন্ট" : "Personal Account"}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">+91 98765 ****</span>
                  </div>
                </div>
                <button className="p-2 bg-slate-50 hover:bg-[#FFF8F4] text-slate-400 hover:text-[#FF6014] rounded-xl transition-colors focus:outline-none cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Refer & Earn Coupon Card */}
          <div className="lg:col-span-2 bg-[#FF6014] text-white p-6 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
              <Gift size={160} />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black tracking-tight">
                {lang === "bn" ? "রেফার করুন এবং ৫০০₹ জিতুন" : "Refer & Earn ₹500"}
              </h3>
              <p className="text-xs text-rose-100 leading-relaxed font-semibold max-w-[240px]">
                {lang === "bn"
                  ? "আপনার বন্ধুদের রাজসেবায় আমন্ত্রণ জানান এবং তাদের প্রথম বুকিংয়ে উভয়ই বোনাস পান।"
                  : "Invite your friends to Rajseba and both of you will get credit upon their first booking."}
              </p>
            </div>

            <div className="relative z-10 mt-6 bg-white/10 border border-white/20 rounded-2xl p-2.5 flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold tracking-widest pl-2 font-mono">RAJSEBA500</span>
              <button
                onClick={handleCopyCode}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} />
                <span className="text-[10px] font-bold">
                  {copied ? (lang === "bn" ? "কপি হয়েছে" : "Copied") : (lang === "bn" ? "কপি করুন" : "Copy")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <TransactionHistory myCompletedBookings={myCompletedBookings} lang={lang} />
      </div>
    </div>
  );
}
