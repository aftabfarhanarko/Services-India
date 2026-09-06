"use client";

import React from "react";
import { Clock, ShieldCheck, Phone, Compass, CheckCircle2 } from "lucide-react";

export function ServiceDeliveryDetails() {
  const steps = [
    {
      title: "1. Select Service & Customise",
      desc: "Choose from our list of standard services and add matching sub-services.",
    },
    {
      title: "2. Schedule Date & Time",
      desc: "Pick any preferred time slot. We operate from 08:00 AM to 10:00 PM daily.",
    },
    {
      title: "3. Expert Service Delivery",
      desc: "A verified, background-checked professional arrives equipped at your doorstep.",
    },
    {
      title: "4. Relax & Pay Safely",
      desc: "Your service is fully insured. Pay securely online or after service completion.",
    },
  ];

  return (
    <div className="bg-white border border-slate-100/80 rounded-[32px] p-6 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
      {/* Operating Hours */}
      <div className="bg-gradient-to-br from-[#FF6014]/8 to-[#FF6014]/2 border border-[#FF6014]/10 rounded-2xl p-4 flex gap-4 items-center">
        <div className="w-10 h-10 rounded-xl bg-white text-[#FF6014] flex items-center justify-center shadow-xs border border-[#FF6014]/5 shrink-0">
          <Clock size={20} className="stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 leading-snug">Service Operating Hours</h4>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Daily: 08:00 AM - 10:00 PM (Kolkata City)</p>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <Compass size={16} className="text-[#FF6014]" />
          <h4 className="font-black text-slate-800 text-xs md:text-sm tracking-tight uppercase">How Rajseba Works</h4>
        </div>
        <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-5 py-1">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[22.5px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-200 group-hover:bg-[#FF6014] group-hover:scale-110 transition-all duration-300" />
              <h5 className="text-xs font-bold text-slate-700 group-hover:text-[#FF6014] transition-colors duration-250">
                {step.title}
              </h5>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Support Guarantee */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <ShieldCheck size={16} className="text-[#FF6014]" />
          <h4 className="font-black text-slate-800 text-xs md:text-sm tracking-tight uppercase">Our Trust Guarantees</h4>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-600 font-semibold">100% Insured & Protected Services</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-600 font-semibold">Background-checked & Certified Experts</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-600 font-semibold">Post-Service Warranty up to 7 Days</span>
          </div>
        </div>
      </div>

      {/* Helpline support */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h5 className="text-[11px] font-bold text-slate-700 leading-none">Need booking assistance?</h5>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Talk to our service support team.</p>
        </div>
        <a
          href="tel:+8809612444888"
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#FF6014] border border-slate-200 rounded-xl transition duration-200 shadow-xs text-[10px] font-bold shrink-0 cursor-pointer"
        >
          <Phone size={12} className="text-[#FF6014]" />
          Call Us
        </a>
      </div>
    </div>
  );
}
