"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Calendar,
  CreditCard,
  LifeBuoy,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  Compass,
  LayoutGrid,
} from "lucide-react";

const SECTIONS = [
  {
    id: "login",
    title: "Login & Authentication",
    icon: Lock,
    shortDesc: "Password resets, OTP verification, and account access issues.",
  },
  {
    id: "booking",
    title: "Booking & Troubleshooting",
    icon: Calendar,
    shortDesc: "Checkout failures, address errors, and service area availability.",
  },
  {
    id: "features",
    title: "Platform Core Features",
    icon: Compass,
    shortDesc: "Searching services, category browsing, maps, and promotions.",
  },
  {
    id: "dashboard",
    title: "Client Dashboard Guide",
    icon: LayoutGrid,
    shortDesc: "Track orders, live chat, wallet payments, and managing profiles.",
  },
];

export default function HelpClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Section contents filtered by search
  const contentData = useMemo(() => {
    return {
      login: {
        title: "Login & Authentication Support",
        icon: Lock,
        items: [
          {
            title: "Issue: Incorrect Password or Login Credentials",
            problem: "You are receiving an 'Invalid Credentials' error when trying to sign in.",
            steps: [
              "On the Login page, click the 'Forgot Password' link.",
              "Enter your registered phone number or email address.",
              "You will receive a 6-digit verification code (OTP) via SMS or email.",
              "Enter the OTP code on the verification screen, set a new password, and click confirm.",
              "Try logging in again with your new password.",
            ],
          },
          {
            title: "Issue: OTP (Verification Code) Not Received",
            problem: "You didn't receive the SMS verification code to verify your phone number.",
            steps: [
              "Ensure your mobile network is stable and you entered the correct phone number (with prefix +880).",
              "Wait 60 seconds for the countdown timer to finish and click 'Resend OTP'.",
              "Check if your SMS inbox is full or if you have blocked promo messages from your carrier.",
              "If you still do not receive the OTP, contact our hotline at 01813-333373 for manual verification.",
            ],
          },
          {
            title: "Issue: Account Verification Requirement",
            problem: "You cannot place a booking because your account is unverified.",
            steps: [
              "Rajseba requires a verified phone number for all booking placements to prevent spam.",
              "Go to your Profile settings in the client dashboard, click 'Verify Phone', and enter the OTP sent to you.",
              "Once verified, your account status will show a green badge, and checkout will be enabled.",
            ],
          },
        ],
      },
      booking: {
        title: "Booking & Reservation Troubleshooting",
        icon: Calendar,
        items: [
          {
            title: "Issue: Unable to Confirm Booking at Checkout",
            problem: "The checkout confirm button is disabled, or booking confirmation fails.",
            steps: [
              "Verify your Service Address: Ensure you have selected a saved address or entered a complete address (House, Road, Area).",
              "Select a Date & Time Slot: Bookings cannot be confirmed without choosing a valid, open schedule slot.",
              "Check Cart Status: Re-verify that the service packages you added to your booking cart are still active.",
            ],
          },
          {
            title: "Issue: 'Service Not Available in My Area' Warning",
            problem: "You receive a message saying we cannot deliver services to your selected address.",
            steps: [
              "Rajseba currently delivers premium home care inside designated zones in Kolkata and West Bengal, India.",
              "Check our Service Areas page or the live map to verify if your location falls within active coverage.",
              "If you are just outside the boundary, reach out to our custom support desk to check if special scheduling is possible.",
            ],
          },
          {
            title: "Issue: Price Differences in Cart vs. Service Page",
            problem: "The price at checkout is different than what you saw on the service list page.",
            steps: [
              "Ensure you selected the correct package option (e.g., 1.5 Ton AC repair vs. 2.0 Ton AC repair). Price varies based on capacity or size.",
              "Check if a promotional coupon code was applied or expired during your session.",
              "If the service required physical inspection, the professional may update parts costs at your door, but only with your final approval.",
            ],
          },
        ],
      },
      features: {
        title: "Rajseba Platform Core Features",
        icon: Compass,
        items: [
          {
            title: "1. Search & Filter Services",
            problem: "Finding the right service out of hundreds of options.",
            steps: [
              "Use the main search bar on the homepage or navbar to type keywords like 'AC Repair', 'Cleaning', or 'Plumber'.",
              "Click on 'All Services' to view our clean, filterable catalog sorted by price and popularity.",
            ],
          },
          {
            title: "2. Interactive Service Maps",
            problem: "Checking if a professional is available near your home.",
            steps: [
              "Click the 'Map' tab on the navigation bar to see a live view of active service locations.",
              "Search for active hubs and see provider pins located near your neighborhood.",
            ],
          },
          {
            title: "3. Special Deals & Seasonal Promotions",
            problem: "Saving money on home maintenance bookings.",
            steps: [
              "Visit the 'Special Offers' section on the homepage to find discounted cleaning, AC, and home repair bundles.",
              "Select promotional packages during checkout to automatically apply active discounts.",
            ],
          },
        ],
      },
      dashboard: {
        title: "Your Client Dashboard Guide",
        icon: LayoutGrid,
        items: [
          {
            title: "1. Booking History & Live Status Tracking",
            problem: "Tracking where your service professional is and the progress of your service.",
            steps: [
              "Go to your Client Dashboard and click 'My Bookings'.",
              "View active bookings to see status badges: 'Pending', 'Assigned', 'In-Progress', or 'Completed'.",
              "Once a professional is assigned, you can view their name, contact details, and rating.",
            ],
          },
          {
            title: "2. The Rajseba Digital Wallet System",
            problem: "Making cashless payments and receiving refunds instantly.",
            steps: [
              "Go to the 'Wallet' tab in your client dashboard to view your current balance.",
              "You can top up your balance using credit/debit cards or mobile financial services (bKash, Nagad).",
              "If you cancel a booking, you can choose to receive your refund instantly in your Wallet for future bookings.",
            ],
          },
          {
            title: "3. Live Chat with Support & Technicians",
            problem: "Need to send instructions to your service expert or contact support directly.",
            steps: [
              "Click the 'Live Chat' option inside the dashboard.",
              "Select an ongoing service booking to chat directly with the assigned technician.",
              "Or open a support channel to chat in real-time with a customer care manager for instant resolution.",
            ],
          },
          {
            title: "4. Saved Services & Profile Settings",
            problem: "Managing your addresses, saved services, and account security.",
            steps: [
              "Saved Services: Go to 'Saved' to see bookmarked services. Click 'Book Now' for quick 1-click booking.",
              "Address Manager: Save and tag multiple addresses (Home, Office, Parents) inside 'Profile Settings' to avoid typing them during checkouts.",
              "Security: Update your passwords and email settings inside 'Settings'.",
            ],
          },
        ],
      },
    };
  }, []);

  // Filter sections by search text
  const filteredContent = useMemo(() => {
    if (!searchQuery) return contentData;

    const query = searchQuery.toLowerCase();
    const result: any = {};

    Object.entries(contentData).forEach(([key, section]) => {
      const matchedItems = section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.problem.toLowerCase().includes(query) ||
          item.steps.some((step) => step.toLowerCase().includes(query))
      );

      if (matchedItems.length > 0) {
        result[key] = {
          ...section,
          items: matchedItems,
        };
      }
    });

    return result;
  }, [searchQuery, contentData]);

  const hasResults = Object.keys(filteredContent).length > 0;

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
      <motion.div
        style={{ y: glowY2 }}
        className="pointer-events-none absolute top-[40%] left-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/3 blur-[120px] z-0"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-8 pb-4 md:pt-12 md:pb-6 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3 py-1 rounded-full border border-[#FF6014]/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />
            Support Center
          </div>

          <h1 className="text-[clamp(24px,4vw,36px)] font-black text-slate-900 tracking-[-0.03em] leading-[1.1] mb-2.5">
            Client <span className="text-[#FF6014]">Help Center</span> & Guides
          </h1>

          <p className="text-[11px] md:text-xs text-slate-500 font-medium max-w-lg mx-auto mb-4">
            Detailed guides on login issues, booking checkout, website features, and client dashboard management.
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto">
            <div className="flex items-center bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-xl px-3 py-2 focus-within:border-[#FF6014] focus-within:ring-2 focus-within:ring-[#FF6014]/15 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search troubleshooting guides, dashboard features..."
                className="w-full bg-transparent border-0 outline-none text-xs text-slate-700 placeholder-slate-400 font-semibold focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-[#FF6014] text-[10px] font-extrabold px-1.5 py-0.5 rounded hover:bg-slate-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Tabs Selector (Visible only on viewports < md) */}
      {!searchQuery && (
        <div className="md:hidden max-w-7xl mx-auto px-4 mb-4 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[11px] font-extrabold transition-all shrink-0 snap-align-none ${isActive
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
      )}

      {/* Main Guides Content layout */}
      <section className="pb-4 md:pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {hasResults ? (
            <div className="grid md:grid-cols-12 gap-4 sm:gap-6 items-start">

              {/* Left sidebar navigation (Visible only on md and up) */}
              <div className="hidden md:block md:col-span-4 sticky md:top-24 space-y-3">
                <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1.5">
                    Guides Index
                  </h3>

                  {/* Category Buttons */}
                  <div className="flex flex-col gap-1.5">
                    {SECTIONS.map((sec) => {
                      const Icon = sec.icon;
                      const isAvailable = filteredContent[sec.id] !== undefined;
                      const isActive = activeTab === sec.id;

                      if (!isAvailable && searchQuery) return null;

                      return (
                        <button
                          key={sec.id}
                          onClick={() => setActiveTab(sec.id)}
                          className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${isActive
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

                {/* Quick Tip box */}
                <div className="bg-gradient-to-br from-[#FFFDFB] to-[#FFF9F6] border border-rose-100/40 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6014]" />
                    <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                      Quick Tip
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    You can easily resolve most issues regarding payments or service rescheduling directly by logging into your account and opening the Client Dashboard.
                  </p>
                </div>
              </div>

              {/* Right column details */}
              <div className="md:col-span-8 space-y-4">
                {/* Render active section content */}
                {Object.entries(filteredContent).map(([key, section]: [string, any]) => {
                  const Icon = section.icon;
                  const isVisible = searchQuery || activeTab === key;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={key}
                      className="bg-white border border-slate-100/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden space-y-4"
                    >
                      {/* Section Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] shrink-0">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h2 className="text-xs md:text-sm font-black text-slate-900">
                            {section.title}
                          </h2>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Guides & solutions for client user queries.
                          </p>
                        </div>
                      </div>

                      {/* Section Guide Items */}
                      <div className="space-y-5">
                        {section.items.map((item: any, idx: number) => (
                          <div key={idx} className="space-y-2 group/item">
                            <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 group-hover/item:text-[#FF6014] transition-colors duration-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
                              {item.title}
                            </h3>

                            {/* Problem definition */}
                            <div className="bg-[#FFFDFB] border border-rose-100/30 rounded-xl px-3 py-2 text-[10px] sm:text-[11px] font-semibold text-slate-600 flex gap-2">
                              <span className="text-[#FF6014] shrink-0">What happens:</span>
                              <p className="font-medium text-slate-500">{item.problem}</p>
                            </div>

                            {/* Resolution Steps */}
                            <div className="pl-1 space-y-1">
                              <p className="text-[9px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Steps to Resolve:
                              </p>
                              <ol className="space-y-1">
                                {item.steps.map((step: string, sIdx: number) => (
                                  <li key={sIdx} className="flex gap-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                                    <span className="w-4 h-4 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700 font-bold text-[9px] mt-0.5">
                                      {sIdx + 1}
                                    </span>
                                    <span className="flex-1">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-sm border border-dashed border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto">
              <div className="w-10 h-10 rounded-full bg-[#FFF8F4] flex items-center justify-center mx-auto mb-2 text-[#FF6014]">
                <LifeBuoy className="w-5 h-5 animate-spin" />
              </div>
              <h4 className="font-black text-xs text-slate-800 mb-1">No matching guides found</h4>
              <p className="text-[10px] text-slate-400">
                We couldn't find any guides matching "{searchQuery}". Try using different terms.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Direct support helpline */}
      <section className="py-8 md:py-10 border-t border-slate-100 bg-[#FFFDFB]/40 relative z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3 py-1 rounded-full border border-[#FF6014]/20 mb-2">
              <LifeBuoy className="w-3.5 h-3.5" />
              Direct Support
            </span>
            <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              Still Need Assistance?
            </h2>
            <p className="text-[10px] text-slate-400 font-medium max-w-sm mx-auto mt-0.5 leading-relaxed">
              Our professional support desk is here to help you resolve any issues instantly.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {/* Support Card 1: Call */}
            <div className="bg-white border border-slate-100 hover:border-[#FF6014]/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col items-center text-center transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4EE] border border-[#FF6014]/15 flex items-center justify-center text-[#FF6014] mb-2.5 group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 mb-0.5">24/7 Hotline</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-2.5 max-w-[190px]">
                Speak directly to our Customer happiness agents.
              </p>
              <a
                href="tel:01813333373"
                className="text-[10px] font-bold text-[#FF6014] hover:underline flex items-center gap-0.5 mt-auto"
              >
                01813-333373
                <ExternalLink className="w-2 h-2" />
              </a>
            </div>

            {/* Support Card 2: Live Chat */}
            <div className="bg-white border border-slate-100 hover:border-[#FF6014]/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col items-center text-center transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2.5 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 mb-0.5">Instant Live Chat</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-2.5 max-w-[190px]">
                Chat with our representative in real-time.
              </p>
              <Link
                href="/dashbord/live-chat"
                className="text-[10px] font-bold text-amber-600 hover:underline flex items-center gap-0.5 mt-auto"
              >
                Start Live Chat
                <ArrowRight className="w-2 h-2" />
              </Link>
            </div>

            {/* Support Card 3: Email */}
            <div className="bg-white border border-slate-100 hover:border-[#FF6014]/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col items-center text-center transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600 mb-2.5 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 mb-0.5">Email Queries</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-2.5 max-w-[190px]">
                Drop us a line and we will reply within 4 hours.
              </p>
              <a
                href="mailto:info@rajseba.com"
                className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5 mt-auto"
              >
                info@rajseba.com
                <Mail className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
