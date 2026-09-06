import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PartnerCta() {
  return (
    <div className="py-16 md:py-24 relative">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6014]/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          
          <div className="md:w-2/3 z-10 mb-12 md:mb-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 mb-8 backdrop-blur-sm">
              <Briefcase className="w-4 h-4 text-[#FF6014]" />
              <span className="text-sm font-semibold tracking-wide">JOIN OUR NETWORK</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
              Earn More As A Professional <br className="hidden lg:block"/> Partner With Rajseba
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl font-medium leading-relaxed">
              Join thousands of professionals on Rajseba who are growing their business, finding more customers, and earning consistently.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 mb-10 text-slate-300 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6014]" />
                Flexible working hours
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6014]" />
                Guaranteed payments
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6014]" />
                Access to a large customer base
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6014]" />
                Training & support
              </li>
            </ul>
            <Link 
              href="#" 
              className="inline-flex items-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white px-8 py-4 rounded-xl font-bold transition-all hover:gap-4 shadow-lg hover:shadow-[#FF6014]/20 hover:-translate-y-0.5"
            >
              Become a Partner
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="md:w-1/3 z-10 flex justify-center lg:justify-end">
             <div className="w-full max-w-[320px] aspect-square rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 shadow-2xl p-8 flex flex-col justify-center items-center relative transform hover:scale-105 transition-transform duration-500">
                <div className="absolute top-5 right-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  Active
                </div>
                <div className="w-24 h-24 rounded-full bg-slate-800 mb-5 border-4 border-slate-600 flex items-center justify-center shadow-inner">
                  <Briefcase className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">Md. Rahim</h3>
                <p className="text-slate-400 font-medium mb-6">Master Plumber</p>
                <div className="w-full bg-slate-900/80 rounded-2xl p-4 text-center border border-slate-700 backdrop-blur-sm">
                  <p className="text-slate-400 text-sm mb-1 font-medium">Monthly Earnings</p>
                  <p className="text-[#FF6014] font-extrabold text-2xl">₹ 45,000+</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
