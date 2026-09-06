"use client";

import React from "react";
import { ArrowDownRight, Send, Loader2, Coins } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { CustomSelect } from "@/components/ui/select";
import AccessDenied from "../../(client)/components/AccessDenied";
import { useAgentCommissions } from "./hooks/useAgentCommissions";
import { useAppSelector } from "@/redux/hooks";

export default function CommissionPage() {
  const state = useAgentCommissions();
  const lang = useAppSelector((state) => state.lang.value);

  if (state.role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  const columns = [
    {
      key: "id",
      header: lang === "bn" ? "উত্তোলন আইডি" : "Withdraw ID",
      render: (w: any) => <span className="font-mono text-slate-500 font-bold text-xs">WD-{w.id}</span>,
    },
    {
      key: "amount",
      header: lang === "bn" ? "পরিমাণ" : "Amount",
      render: (w: any) => <span className="font-bold text-slate-800">₹{Number(w.amount).toLocaleString()}</span>,
    },
    {
      key: "status",
      header: lang === "bn" ? "অবস্থা" : "Status",
      render: (w: any) => (
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            w.status === "approved"
              ? "bg-emerald-50 text-emerald-700"
              : w.status === "rejected"
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {w.status === "approved"
            ? (lang === "bn" ? "অনুমোদিত" : "approved")
            : w.status === "rejected"
            ? (lang === "bn" ? "প্রত্যাখ্যাত" : "rejected")
            : (lang === "bn" ? "পেন্ডিং" : w.status)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: lang === "bn" ? "অনুরোধের তারিখ" : "Date Requested",
      render: (w: any) => <span>{new Date(w.createdAt).toLocaleDateString("en-BD")}</span>,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "কমিশন ট্র্যাকিং" : "Commission Tracking"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn"
                ? "আপনার ওয়ালেট ব্যালেন্স ট্র্যাক করুন এবং সরাসরি পে-আউট অনুরোধ করুন।"
                : "Track your wallet balance and request direct payouts."}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Panel & Quick Withdraw Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawable Balance card */}
        <div className="bg-gradient-to-br from-rose-500 to-[#FF6014] text-white p-6 rounded-2xl shadow-lg shadow-[#FF6014]/10 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-bl-full flex items-center justify-center font-bold text-white/10 text-3xl">
            ₹
          </div>
          <div>
            <span className="text-xs font-bold text-rose-100 uppercase tracking-widest block">
              {lang === "bn" ? "উত্তোলনযোগ্য ব্যালেন্স" : "Withdrawable Balance"}
            </span>
            <h2 className="text-4xl font-black mt-2">₹{Number(state.walletBalance).toLocaleString()}</h2>
          </div>
          <p className="text-xs text-rose-100/80 font-medium">
            {lang === "bn"
              ? "প্রতি মাসের ১ এবং ১৫ তারিখে স্বয়ংক্রিয় দ্বি-মাসিক পে-আউট।"
              : "Automatic bi-monthly payouts on 1st and 15th."}
          </p>
        </div>

        {/* Quick Withdraw Console */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ArrowDownRight className="text-[#FF6014]" />{" "}
            {lang === "bn" ? "তাত্ক্ষণিক পে-আউটের অনুরোধ করুন" : "Request Immediate Payout"}
          </h3>
          <form onSubmit={state.handleWithdraw} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                {lang === "bn" ? "পরিমাণ (₹)" : "Amount (₹)"}
              </label>
              <input
                type="number"
                placeholder={lang === "bn" ? "উদা: ১৫০০" : "e.g. 1500"}
                value={state.withdrawAmount}
                onChange={(e) => state.setWithdrawAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                label={lang === "bn" ? "স্থানান্তর পদ্ধতি" : "Transfer Method"}
                options={[
                  {
                    value: "bKash Mobile Wallet",
                    label: lang === "bn" ? "বিকাশ মোবাইল ওয়ালেট" : "bKash Mobile Wallet",
                  },
                  {
                    value: "Nagad Wallet",
                    label: lang === "bn" ? "নগদ ওয়ালেট" : "Nagad Wallet",
                  },
                  {
                    value: "Bank Wire",
                    label: lang === "bn" ? "ব্যাংক ওয়্যার ট্রান্সফার" : "Bank Wire Transfer",
                  },
                ]}
                value={state.transferMethod}
                onChange={(val) => state.setTransferMethod(val)}
                placeholder={lang === "bn" ? "পদ্ধতি নির্বাচন করুন" : "Select method"}
              />
            </div>

            <button
              type="submit"
              disabled={state.requesting}
              className="bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-70 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md shadow-[#FF6014]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              {state.requesting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {lang === "bn" ? "অনুরোধ করুন" : "Request Out"}
            </button>
          </form>
        </div>
      </div>

      {/* Payout History Log */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          {lang === "bn" ? "পে-আউট লগসমূহ" : "Payout Logs"}
        </h3>
        {state.loadingWithdraws ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={28} className="animate-spin text-[#FF6014]" />
          </div>
        ) : state.myWithdraws.length > 0 ? (
          <CustomTable
            columns={columns}
            data={state.myWithdraws}
            searchKey="id"
            searchPlaceholder={lang === "bn" ? "পে-আউট লগ খুঁজুন..." : "Search payout logs..."}
            pageSize={5}
          />
        ) : (
          <div className="bg-white p-10 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400 text-sm">
            {lang === "bn" ? "এখনো কোনো অর্থ উত্তোলনের অনুরোধ নেই।" : "No withdrawal requests yet."}
          </div>
        )}
      </div>
    </div>
  );
}
