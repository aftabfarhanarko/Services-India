"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import Lottie from "lottie-react"

const stats = [
  { value: "50K+", label: "Happy Clients" },
  { value: "4.9★", label: "Avg Rating" },
  { value: "200K+", label: "Jobs Done" },
  { value: "24/7", label: "Support" },
]

const features = [
  "On-time service guarantee",
  "Secure payment & full refund policy",
  "Live booking tracking",
]

interface LoginLeftPanelProps {
  lottieAnimation: any;
}

export default function LoginLeftPanel({ lottieAnimation }: LoginLeftPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#FF6014]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-10">
        <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/25 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-bold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />
          Kolkata & India's #1 Home Service Platform
        </div>

        <div className="w-full max-w-[420px] xl:max-w-[480px] aspect-square flex items-center justify-center">
          {lottieAnimation ? (
            <Lottie animationData={lottieAnimation} loop autoplay className="w-full h-auto" />
          ) : (
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute w-16 h-16 border-4 border-slate-200 border-t-[#FF6014] rounded-full animate-spin" />
            </div>
          )}
        </div>

        <h2 className="text-2xl xl:text-3xl font-black text-slate-800 leading-tight mt-4">
          Welcome back to <span className="text-[#FF6014]">Rajseba</span>
        </h2>

        <ul className="mt-6 space-y-2.5 text-left w-full max-w-xs">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-xs text-slate-650 font-bold">
              <div className="w-5 h-5 rounded-full bg-[#FF6014]/15 border border-[#FF6014]/25 flex items-center justify-center shrink-0">
                <CheckCircle2 size={12} className="text-[#FF6014]" />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-8 mt-8 pt-6 border-t border-slate-200/60 w-full justify-center">
          {stats.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-px h-10 bg-slate-200" />}
              <div className="text-center">
                <p className="text-xl font-black text-slate-800">{s.value}</p>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
