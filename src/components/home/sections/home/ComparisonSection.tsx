"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ShieldCheck, Sparkles, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

const COMPARISONS = [
  {
    feature: "Pricing Transparency",
    rajseba: "Fixed rate upfront, zero hidden charges",
    local: "Unpredictable & extra hidden costs",
  },
  {
    feature: "Technician Reliability",
    rajseba: "100% NID & Police verified experts",
    local: "Unverified technicians with zero checks",
  },
  {
    feature: "Service Warranty",
    rajseba: "7 Days free warranty & damage cover",
    local: "No warranty or post-service support",
  },
  {
    feature: "Safety & Security",
    rajseba: "Uniformed pros with OTP security code",
    local: "No identity verification at your doorstep",
  },
  {
    feature: "Customer Support",
    rajseba: "24/7 Helpline & instant chat assistance",
    local: "Unreachable after payment is done",
  },
];

export default function ComparisonSection() {
  return (
    <section className="py-5 md:py-8 lg:py-10 relative overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* Section Header - Matching exact website typography & badges */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#FF6014] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="fill-[#FF6014]" />
            Why Choose Rajseba
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            Rajseba Standard <span className="text-[#FF6014]">vs Local Technicians</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            See why thousands of households across Kolkata & India trust Rajseba for guaranteed safety, quality, and transparent pricing.
          </p>
        </div>

        {/* Side-by-Side Layout: Generated Illustration Image (Left) & Glassmorphism Comparison (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Image with website primary orange accents */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/60 shadow-[0_12px_40px_0_rgba(255,96,20,0.15)] bg-gradient-to-b from-[#FFF4EE] to-white p-2">
              <img
                src="/rajseba-standard.png"
                alt="Rajseba Quality Standard Verified Technician"
                className="w-full h-auto rounded-2xl object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Glassmorphism Badge overlay on image */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/70 backdrop-blur-md p-3.5 rounded-xl border border-white/80 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6014] text-white flex items-center justify-center font-extrabold shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">100% Verified Quality</h4>
                  <p className="text-[11px] font-medium text-slate-500">Rajseba Certified Standard</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Glassmorphism Comparison Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden">
              
              {/* Table Header (Clean style without orange background box) */}
              <div className="grid grid-cols-12 bg-white/50 backdrop-blur-md border-b border-white/60 p-3.5 text-xs font-extrabold items-center">
                <div className="col-span-5 pl-2 text-slate-800 uppercase tracking-wider">Features</div>
                <div className="col-span-4 text-center text-[#FF6014] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#FF6014]" /> Rajseba
                </div>
                <div className="col-span-3 text-center text-slate-500 text-[11px] uppercase tracking-wider">
                  Local
                </div>
              </div>

              {/* Rows with staggered entrance animation (one by one delay) */}
              <div className="divide-y divide-white/50">
                {COMPARISONS.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                    className="grid grid-cols-12 p-3 text-xs md:text-sm items-center hover:bg-white/60 backdrop-blur-sm transition-all"
                  >
                    {/* Feature Title */}
                    <div className="col-span-5 font-bold text-slate-800 flex items-center gap-2 pl-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6014] shrink-0" />
                      <span className="text-xs">{item.feature}</span>
                    </div>

                    {/* Rajseba Side (Clean text with green checkmark - background box removed) */}
                    <div className="col-span-4 text-left md:text-center font-bold flex items-center justify-start md:justify-center gap-1.5 px-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="leading-tight text-xs font-extrabold text-slate-800">{item.rajseba}</span>
                    </div>

                    {/* Local Side */}
                    <div className="col-span-3 text-center text-slate-500 font-semibold p-1.5 flex items-center justify-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="leading-tight text-[11px] text-rose-600/90 truncate">{item.local}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Action Footer */}
              <div className="p-3.5 bg-white/40 backdrop-blur-md border-t border-white/60 flex items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-slate-700">
                  ⚡ Experience hassle-free service today.
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                >
                  <span>Explore Services</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
