"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, Calendar, CreditCard, ShieldAlert, Award, FileText, ArrowLeft, Sparkles } from "lucide-react";

const SECTIONS = [
  { id: "acceptance", title: "Acceptance of Terms", icon: Scale },
  { id: "booking", title: "Booking & Cancellations", icon: Calendar },
  { id: "billing", title: "Pricing & Payments", icon: CreditCard },
  { id: "warranty", title: "Service Warranty", icon: Award },
  { id: "liability", title: "Liability & Damages", icon: ShieldAlert },
  { id: "conduct", title: "User Conduct & Rules", icon: FileText },
];

export default function TermsClientPage() {
  const [activeTab, setActiveTab] = useState("acceptance");
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="bg-transparent overflow-hidden relative flex-1 flex flex-col">
      {/* Background pattern */}
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />

      {/* Ambient glows */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute top-[-5%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF6014]/4 blur-[130px] z-0"
      />
      <div className="pointer-events-none absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/3 blur-[120px] z-0" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-8 pb-4 md:pt-12 md:pb-6 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3 py-1.5 rounded-full border border-[#FF6014]/20 mb-3 hover:bg-[#FF6014]/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <h1 className="text-[clamp(24px,4vw,36px)] font-black text-slate-900 tracking-[-0.03em] leading-[1.1] mb-2.5">
            Terms of <span className="text-[#FF6014]">Service</span>
          </h1>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Last Updated: July 01, 2026
          </p>
        </div>
      </section>

      {/* Mobile Tabs Selector (Visible only on viewports < md) */}
      <div className="md:hidden max-w-7xl mx-auto px-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[11px] font-extrabold transition-all shrink-0 snap-align-none ${
                  isActive
                    ? "bg-[#FF6014] text-white border-[#FF6014] shadow-sm"
                    : "bg-white border-slate-200/60 text-slate-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Guides Content layout */}
      <section className="pb-4 md:pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-12 gap-4 sm:gap-6 items-start">
            
            {/* Left sidebar navigation (Visible only on md and up) */}
            <div className="hidden md:block md:col-span-4 sticky md:top-24 space-y-3">
              <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1.5">
                  Terms Sections
                </h3>
                
                {/* Category Buttons */}
                <div className="flex flex-col gap-1.5">
                  {SECTIONS.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeTab === sec.id;

                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveTab(sec.id)}
                        className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                          isActive
                            ? "bg-[#FF6014] text-white border-[#FF6014] shadow-[0_4px_12px_rgba(255,96,20,0.12)] scale-[1.01]"
                            : "bg-white/60 border-slate-100 text-slate-600 hover:border-[#FF6014]/20 hover:bg-white"
                        }`}
                      >
                        <div className={`p-1 rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-slate-50 text-slate-500"}`}>
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <span className="truncate">{sec.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Warranty Note */}
              <div className="bg-gradient-to-br from-[#FFFDFB] to-[#FFF9F6] border border-rose-100/40 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6014]" />
                  <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                    Official Booking
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  To keep the 7-day service warranty valid, always pay through our platform and never hire technicians off-platform.
                </p>
              </div>
            </div>

            {/* Right column details */}
            <div className="md:col-span-8 space-y-4">
              
              {/* 1. Acceptance of Terms */}
              {activeTab === "acceptance" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Scale className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        1. Acceptance of Terms
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        User agreements and binding rules of Rajseba.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      Welcome to Rajseba, a premium home service marketplace operated by Rajseba IT Limited. By creating an account, browsing listings, scheduling jobs, or interacting with our mobile application, you explicitly agree to follow and be bound by these Terms of Service.
                    </p>
                    <p>
                      These terms constitute a legally binding agreement between you ("Customer", "Client") and Rajseba. If you represent another individual or a corporate entity when booking, you warrant that you are legally authorized to sign agreements on their behalf.
                    </p>
                    <p>
                      We reserve the right to modify, adjust, or replace these terms at any time. Changes will be posted immediately on this page with an updated "Last Updated" date. Continued use of the platform indicates acceptance of any new terms.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Booking & Cancellation Policy */}
              {activeTab === "booking" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        2. Booking & Cancellation Policy
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Dispatch rules, timing, and fee boundaries.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      When placing an order for home maintenance, cleaning, or repair services, you agree to the following guidelines:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Dispatch Slots:</strong> We make every effort to allocate and dispatch certified service professionals within your selected hours. Delays caused by force majeure or transit congestion will be notified in real-time.
                      </li>
                      <li>
                        <strong className="text-slate-700">Cancellation Window:</strong> You can reschedule or cancel any scheduled service up to 2 hours prior to the slot commencement through your Client Dashboard without charge.
                      </li>
                      <li>
                        <strong className="text-slate-700">Late Cancellation Fee:</strong> Cancellations made less than 2 hours before the schedule will incur a convenience dispatch fee of ₹200 to cover travel costs for the allocated technician.
                      </li>
                      <li>
                        <strong className="text-slate-700">No-Show Rule:</strong> If the technician arrives at your location and cannot gain access or reach you via phone within 20 minutes, the order will be cancelled, and the late fee will be charged.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 3. Pricing & Payments */}
              {activeTab === "billing" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <CreditCard className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        3. Pricing & Payments
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Transparent pricing policies and wallet transactions.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      All standard pricing displayed on Rajseba is fixed and transparent. Here is how billing is regulated:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Payment Gateways:</strong> We support payments via Cash on Delivery (COD), digital cards, MFS (bKash, Nagad), or deductions from your pre-loaded Rajseba Wallet.
                      </li>
                      <li>
                        <strong className="text-slate-700">Inspection Charges:</strong> If a service requires physical diagnosis first, a minimal inspection fee of ₹150 applies. This fee is waived if you proceed with the suggested repair job.
                      </li>
                      <li>
                        <strong className="text-slate-700">Additional Spare Parts:</strong> If the repair requires additional spare materials, the technician will present a cost estimate. Extra materials are only purchased and billed upon your explicit dashboard approval.
                      </li>
                      <li>
                        <strong className="text-slate-700">Refunds:</strong> Cancelled bookings paid online are eligible for instant refunds to the Rajseba Wallet or within 3-5 business days to your original payment channel.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 4. Rajseba Service Warranty */}
              {activeTab === "warranty" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        4. Rajseba Service Warranty
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Our quality trust policies for repairs.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      We stand behind the quality of our home services and offer peace of mind through a structured warranty:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">7-Day Warranty:</strong> We offer a 7-day service warranty on completed bookings. If the exact same issue reoccurs within 7 days, we will dispatch an expert to resolve it free of charge.
                      </li>
                      <li>
                        <strong className="text-slate-700">Platform Strict Restriction:</strong> The warranty is ONLY valid if the booking, cost estimates, and payment transactions are officially tracked and recorded on the Rajseba platform.
                      </li>
                      <li>
                        <strong className="text-slate-700">Void Terms:</strong> If you contact or pay the technician directly off-platform, Rajseba is not responsible for any subsequent damages, and all warranty guarantees will be immediately voided.
                      </li>
                      <li>
                        <strong className="text-slate-700">Parts Warranty:</strong> Warranty covers service labor. Spare parts purchased independently by the customer are subject to the manufacturer's warranty policies.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 5. Damage Protection and Limitation of Liability */}
              {activeTab === "liability" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <ShieldAlert className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        5. Damage Protection & Liability
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Insurance coverage limits and wear-and-tear exceptions.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      While our service professionals are rigorously trained and verified, accidents can sometimes happen. We offer property damage safety limits as follows:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Damage Protection:</strong> Rajseba offers coverage up to <strong className="text-slate-700">₹10,000</strong> in case of accidental property damage caused directly by technician negligence during service delivery.
                      </li>
                      <li>
                        <strong className="text-slate-700">Exclusions:</strong> We are not liable for pre-existing structural issues, appliance wear-and-tear (e.g. old corroded copper lines breaking during basic AC servicing), or issues caused by cheap/faulty parts supplied directly by the client.
                      </li>
                      <li>
                        <strong className="text-slate-700">Indirect Losses:</strong> Under no circumstances is Rajseba liable for business losses, data recovery costs, or indirect/consequential damages.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 6. User Conduct and Account Termination */}
              {activeTab === "conduct" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        6. User Conduct and Account Termination
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Misuse parameters and regulatory terms.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      To keep our platform secure, users must adhere to code-of-conduct guidelines:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Fair Interactions:</strong> Verbal, physical, or discriminatory harassment of our assigned service technicians or support staff is strictly prohibited.
                      </li>
                      <li>
                        <strong className="text-slate-700">Spam Prevention:</strong> Creating fake accounts, spamming mock booking requests, using temporary phone numbers, or manipulating platform coupon codes will result in immediate profile suspension.
                      </li>
                      <li>
                        <strong className="text-slate-700">Payment Bypassing:</strong> Attempting to negotiate off-platform services with technicians to evade commission and platform fees will result in account closure.
                      </li>
                      <li>
                        <strong className="text-slate-700">Account Closure:</strong> Rajseba reserves the right to suspend or permanently delete any user profile that violates our terms, without prior warning.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
