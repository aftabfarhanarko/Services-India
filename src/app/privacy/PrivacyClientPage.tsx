"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Eye, Lock, Share2, UserCheck, HelpCircle, ArrowLeft, Sparkles } from "lucide-react";

const SECTIONS = [
  { id: "overview", title: "Welcome & Overview", icon: Shield },
  { id: "collect", title: "Information We Collect", icon: Eye },
  { id: "use", title: "How We Use Info", icon: UserCheck },
  { id: "share", title: "Sharing & Disclosure", icon: Share2 },
  { id: "security", title: "Data Security", icon: Lock },
  { id: "rights", title: "Your Rights & Contact", icon: HelpCircle },
];

export default function PrivacyClientPage() {
  const [activeTab, setActiveTab] = useState("overview");
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
            className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-3 hover:bg-[#FF6014]/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <h1 className="text-[clamp(24px,4vw,36px)] font-black text-slate-900 tracking-[-0.03em] leading-[1.1] mb-2.5">
            Privacy <span className="text-[#FF6014]">Policy</span>
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
      <section className="pb-4 md:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-12 gap-4 sm:gap-6 items-start">
            
            {/* Left sidebar navigation (Visible only on md and up) */}
            <div className="hidden md:block md:col-span-4 sticky md:top-24 space-y-3">
              <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1.5">
                  Privacy Sections
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

              {/* Quick Security Tip */}
              <div className="bg-gradient-to-br from-[#FFFDFB] to-[#FFF9F6] border border-rose-100/40 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6014]" />
                  <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                    Data Control
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  We use session cookies and secure web tokens purely to offer you a seamless login experience and booking flow. We never lease your data to advertisers.
                </p>
              </div>
            </div>

            {/* Right column details */}
            <div className="md:col-span-8 space-y-4">
              
              {/* 1. Welcome & Overview */}
              {activeTab === "overview" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        1. Welcome & Overview
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Our commitment to user privacy and information security.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      At Rajseba, operated officially by Rajseba IT Limited, we hold your trust as our highest priority. This Privacy Policy details how we collect, process, manage, and safeguard your personal details when you interact with our home services marketplace, mobile application, and website.
                    </p>
                    <p>
                      Our system is designed strictly in compliance with the Information Technology (IT) Act of India and standard global data protection frameworks. We guarantee that your personal information is never sold, leased, or distributed to third-party marketing companies for promotional gains.
                    </p>
                    <p>
                      By registering an account, booking home care services, or navigating our portal, you explicitly consent to the collection, tracking, and processing of your details as detailed in this policy document.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Information We Collect */}
              {activeTab === "collect" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Eye className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        2. Information We Collect
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Detailed data points we retrieve to run the platform.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      To ensure smooth booking placements and dispatch verified technicians to your door steps, we collect the following sets of data:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Account Credentials:</strong> Full name, phone number, secure login password hash, email address, profile photos, and verification badges.
                      </li>
                      <li>
                        <strong className="text-slate-700">Booking Location Details:</strong> Complete physical home/office address, district, landmarks, and precise GPS coordinates to calculate exact distance metrics for dispatch.
                      </li>
                      <li>
                        <strong className="text-slate-700">Transaction & Billing Logs:</strong> Reference IDs, payment methods used, discount coupons applied, and billing history. We do not store card or banking passwords on our local servers.
                      </li>
                      <li>
                        <strong className="text-slate-700">Technical Device Data:</strong> Device IP addresses, browser specifications, page view logs, and session interactions gathered via cookie tracking.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 3. How We Use Info */}
              {activeTab === "use" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <UserCheck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        3. How We Use Info
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        What operations utilize your personal profile details.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      Your information is integrated directly into our scheduling algorithms to serve you better. Specifically, we use it for:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Technician Matching:</strong> Sharing address coordinates with the nearest registered service technician to optimize arrival time and travel distance.
                      </li>
                      <li>
                        <strong className="text-slate-700">Notification Alerts:</strong> Sending instant booking confirmations, active tracking links, SMS alerts, Whatsapp reminders, and verification codes (OTPs).
                      </li>
                      <li>
                        <strong className="text-slate-700">Customer Support:</strong> Connecting you with customer happiness officers when troubleshooting order issues or processing refunds.
                      </li>
                      <li>
                        <strong className="text-slate-700">Platform Optimization:</strong> Researching user interaction paths to simplify layouts, filter irrelevant listings, and launch helpful services.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 4. Sharing & Disclosure */}
              {activeTab === "share" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Share2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        4. Sharing & Disclosure
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Specific guidelines on third-party data transfers.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      Rajseba maintains a strict policy against selling user profiles. Data disclosure is limited to the following essential channels:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>
                        <strong className="text-slate-700">Assigned Professionals:</strong> The matched service provider receives your name, phone number, and booking location solely to coordinate and deliver the requested job.
                      </li>
                      <li>
                        <strong className="text-slate-700">Secure Payment Gateways:</strong> Sharing transaction details with gateway partners (SSLCommerz, bKash, Nagad) to authorize debit card or digital wallet checkout charges.
                      </li>
                      <li>
                        <strong className="text-slate-700">Legal Directives:</strong> If requested by official regulatory bodies, courts, or law enforcement units under Indian legal framework during fraud prevention audits.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 5. Data Security */}
              {activeTab === "security" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        5. Data Security
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Safety locks and database encryption specifications.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      We enforce rigorous administrative and digital safeguards to keep your records safe from unauthorized leakage, altering, or intrusion.
                    </p>
                    <p>
                      Our database communication layers are protected by Secure Socket Layer (SSL/TLS) encryption, secure hosting configurations, and isolated database instances. Access to user data is limited strictly to authorized internal teams on a need-to-know basis.
                    </p>
                    <p>
                      While we deploy top-tier protection methods, no database transmission over the internet or storage system is 100% immune to breach risks. Consequently, we cannot guarantee absolute data security.
                    </p>
                  </div>
                </div>
              )}

              {/* 6. Your Rights & Contact */}
              {activeTab === "rights" && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                      <HelpCircle className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-xs md:text-sm font-black text-slate-900">
                        6. Your Rights & Contact
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        How you can manage or request deletion of your data.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium space-y-3">
                    <p>
                      You have full ownership of your records. You can log into your Client Dashboard to view, edit, or remove your personal phone number, saved addresses, and active profiles at any time.
                    </p>
                    <p>
                      If you decide to delete your account permanently, or wish to pull a full copy of your transaction logs, simply contact our support desk using the information below:
                    </p>
                    <div className="bg-[#FFFDFB] border border-rose-100/30 rounded-xl p-3 text-[11px] font-semibold text-slate-600 space-y-1">
                      <p>📧 Email: <span className="text-[#FF6014]">info@rajseba.com</span></p>
                      <p>📞 Hotline: <span className="text-[#FF6014]">01813-333373</span></p>
                      <p>📍 Address: Kolkata, West Bengal, India</p>
                    </div>
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
