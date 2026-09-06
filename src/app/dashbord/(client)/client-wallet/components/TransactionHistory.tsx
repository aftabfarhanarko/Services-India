"use client";

import React from "react";
import { ArrowRight, SlidersHorizontal, Sparkles, FileText, Download } from "lucide-react";
import { printBookingInvoice, printClientStatement } from "@/utils/invoicePrint";

interface TransactionHistoryProps {
  myCompletedBookings: any[];
  lang?: string;
}

export default function TransactionHistory({ myCompletedBookings, lang = "bn" }: TransactionHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-slate-800 text-lg">
          {lang === "bn" ? "লেনদেনের ইতিহাস" : "Transaction History"}
        </h3>
        <div className="flex gap-2">
          {myCompletedBookings.length > 0 && (
            <button
              onClick={() => {
                const totalAmount = myCompletedBookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
                printClientStatement(myCompletedBookings, totalAmount);
              }}
              className="p-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] rounded-xl shadow-xs transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer text-[10px] font-bold"
            >
              <FileText size={14} />
              <span>{lang === "bn" ? "স্টেটমেন্ট ডাউনলোড" : "Download Statement"}</span>
            </button>
          )}
          <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer">
            <SlidersHorizontal size={14} />
            <span className="text-[10px] font-bold text-slate-600">
              {lang === "bn" ? "ফিল্টার" : "Filter"}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                <th className="px-3 md:px-6 py-3 md:py-4">
                  {lang === "bn" ? "সার্ভিস / বিবরণ" : "Service / Description"}
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4">
                  {lang === "bn" ? "তারিখ" : "Date"}
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4">
                  {lang === "bn" ? "পরিমাণ" : "Amount"}
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4">
                  {lang === "bn" ? "অবস্থা" : "Status"}
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 pr-6 text-right">
                  {lang === "bn" ? "অ্যাকশন" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {myCompletedBookings.length > 0 ? (
                myCompletedBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl shrink-0 bg-[#FFF8F4] text-[#FF6014]">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850">
                          {b.nestedService?.name || b.pkg?.name || (lang === "bn" ? "সার্ভিস বুকিং" : "Service Booking")}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                          {lang === "bn" ? `অর্ডার #${b.id}` : `Order #${b.id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs font-extrabold text-[#FF6014]">
                      - ₹ {Number(b.total_price || 0).toLocaleString("en-BD")}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF8F4] text-[#FF6014] uppercase">
                        {lang === "bn" ? "খরচ" : "EXPENSE"}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 pr-6 text-right">
                      <button
                        onClick={() => printBookingInvoice(b)}
                        className="inline-flex items-center gap-1 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                        title={lang === "bn" ? "ইনভয়েস ডাউনলোড করুন" : "Download Invoice"}
                      >
                        <Download size={11} />
                        <span>{lang === "bn" ? "ডাউনলোড" : "Download"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 md:px-6 py-6 text-center text-xs text-slate-400 font-semibold">
                    {lang === "bn" ? "কোনো সম্পন্ন বুকিং পাওয়া যায়নি।" : "No completed bookings found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center border-t border-slate-50">
          <button className="text-xs font-bold text-[#FF6014] hover:underline focus:outline-none flex items-center gap-1 mx-auto cursor-pointer">
            {lang === "bn" ? "সব লেনদেন দেখুন" : "View All Transactions"} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
