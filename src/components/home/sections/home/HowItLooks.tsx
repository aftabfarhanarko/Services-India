"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Check, ArrowRight, X } from "lucide-react";
import Link from "next/link";

const HIGHLIGHTS = [
  "Comprehensive Deep Cleaning & Sanitization",
  "Precision Diagnostics for All Appliances",
  "Verified & Uniformed Service Specialists",
  "Eco-Friendly & Safe Cleaning Supplies",
];

// High quality home service demonstration video
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/oCOq0L2xeag?autoplay=1&rel=0";

export default function HowItLooks() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-5 md:py-8 lg:py-10 relative overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* Outer Glassmorphism Container */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] grid lg:grid-cols-12 items-center">
          
          {/* Left Column: Visual Showcase Card / Embedded Video */}
          <div className="lg:col-span-6 relative h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden bg-slate-950 group">
            {isPlaying ? (
              <div className="relative w-full h-full">
                <iframe
                  src={YOUTUBE_EMBED_URL}
                  title="Rajseba Service Video Showcase"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop"
                  alt="Rajseba Service in Action"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6014] text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,96,20,0.6)] cursor-pointer pl-1 group-hover:bg-[#E0530A] transition-colors"
                  >
                    <Play className="w-8 h-8 fill-white" />
                  </motion.div>
                </div>

                {/* Floating Live Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-[11px] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6014] animate-ping" />
                  <span>Click to Watch Video</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Details & Value Proposition */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 text-slate-900">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#FF6014] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} className="fill-[#FF6014]" />
              High Standards Delivered
            </div>

            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight leading-snug mb-3">
              See How We Transform Your <span className="text-[#FF6014]">Living Space</span>
            </h2>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              We bring professional equipment, expert technique, and courteous service right to your doorstep. No hassle, no compromise on quality.
            </p>

            {/* Checkmark List */}
            <div className="space-y-3 mb-6">
              {HIGHLIGHTS.map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-[#FFF4EE] border border-[#FF6014]/30 flex items-center justify-center text-[#FF6014] shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/services"
                className="px-5 py-2.5 rounded-xl bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Explore All Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:01813333373"
                className="px-4.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
              >
                Call Hotline: +91 6290257347
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
