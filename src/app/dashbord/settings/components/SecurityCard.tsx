"use client";

import React from "react";

interface SecurityCardProps {
  twoFactor: boolean;
  onTwoFactorChange: () => void;
  Switch: React.ComponentType<{ checked: boolean; onChange: () => void }>;
  lang?: string;
}

export default function SecurityCard({ twoFactor, onTwoFactorChange, Switch, lang = "bn" }: SecurityCardProps) {
  return (
    <div id="security" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 scroll-mt-6">
      <h3 className="text-lg font-bold text-slate-900">
        {lang === "bn" ? "লগইন ও নিরাপত্তা" : "Login & Security"}
      </h3>

      <div className="divide-y divide-slate-100">
        {/* Password Row */}
        <div className="py-4 flex items-center justify-between gap-4 first:pt-0">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              {lang === "bn" ? "৩ মাস আগে সর্বশেষ আপডেট করা হয়েছে" : "Last updated 3 months ago"}
            </p>
          </div>
          <button className="text-[#FF6014] hover:text-[#E0530A] text-xs font-bold focus:outline-none hover:underline">
            {lang === "bn" ? "আপডেট করুন" : "Update"}
          </button>
        </div>

        {/* 2FA Row */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {lang === "bn" ? "দ্বি-ধাপ প্রমাণীকরণ (২FA)" : "Two-Factor Authentication"}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              {lang === "bn"
                ? "আপনার অ্যাকাউন্টে নিরাপত্তার একটি অতিরিক্ত স্তর যুক্ত করুন।"
                : "Add an extra layer of security to your account."}
            </p>
          </div>
          <Switch checked={twoFactor} onChange={onTwoFactorChange} />
        </div>

        {/* Recent Logins Row */}
        <div className="py-4 flex items-center justify-between gap-4 last:pb-0">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {lang === "bn" ? "সাম্প্রতিক লগইনসমূহ" : "Recent Logins"}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              {lang === "bn" ? "ক্রোম ম্যাকওএস • কলকাতা, পশ্চিমবঙ্গ" : "Chrome on MacOS • Kolkata, WB"}
            </p>
          </div>
          <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl border border-slate-100 transition-colors">
            {lang === "bn" ? "পর্যালোচনা করুন" : "Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
