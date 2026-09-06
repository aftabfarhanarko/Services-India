"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, MessageSquare, Shield, Headphones, HelpCircle
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useGetPublicCompanyBrandingQuery } from "@/redux/features/landing/landingApi";

export const TRUST_BARS = [
  { icon: Shield, text: "100% Encrypted Enquiry" },
  { icon: Headphones, text: "Dedicated Customer Manager" },
  { icon: MessageSquare, text: "Response Within 4 Hours" },
];

export const FAQS = [
  { question: "How do I schedule a home service on Rajseba?", answer: "Browse our service directory, pick the task required, and choose your preferred date/time slot using our calendar. A verified Rajseba professional will be matched to your booking instantly." },
  { question: "What verification procedures do professionals go through?", answer: "Every technician goes through a multi-tier vetting process, including biometric National ID verification, criminal background checks, and a practical skill examination at the Rajseba Academy." },
  { question: "What happens if there is accidental damage during service?", answer: "Your satisfaction and safety are our priorities. All Rajseba appointments are protected under our service insurance, covering accidental damages up to ₹10,000." },
  { question: "Can I cancel or change my booking slot?", answer: "Yes, you can reschedule or cancel any scheduled booking up to 2 hours before the service slot begins directly through your dashboard without any cancellation penalty fee." },
  { question: "How does the warranty claim process work?", answer: "All completed services come with a 7-day Rajseba Service Warranty. If any issue reoccurs, submit a ticket or call us for a free follow-up inspection and fix." }
];

export function ContactChannelsList() {
  const { data: brandingRes } = useGetPublicCompanyBrandingQuery();
  const branding = brandingRes?.data;

  const phone = branding?.phone || "01813-333373";
  const email = branding?.email || "info@rajseba.com";
  const address = branding?.address || "Kolkata, West Bengal, India";

  const channels = [
    { icon: Phone, label: "Call Support", primary: phone, href: `tel:${phone.replace(/[^0-9+]/g, '')}`, secondary: `Hotline: ${phone}`, badge: "24/7 Hotline" },
    { icon: Mail, label: "Email Support", primary: email, href: `mailto:${email}`, secondary: `Official: ${email}`, badge: "Replies in 4 hrs" },
    { icon: MapPin, label: "Visit HQ", primary: address.split(',')[0], href: `https://maps.google.com/?q=${encodeURIComponent(address)}`, secondary: address, badge: "Sat – Thu (9AM-6PM)" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-3">
      {channels.map(({ icon: Icon, label, primary, href, secondary, badge }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 flex items-start gap-4 hover:border-[#FF6014]/40 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6014]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <span className="relative p-3 rounded-xl bg-[#FFF8F4] text-[#FF6014] flex-shrink-0 border border-[#FF6014]/20 shadow-xs">
            <Icon className="w-5 h-5" />
          </span>
          <div className="relative min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-[9px] uppercase tracking-widest text-slate-400">{label}</h3>
              <span className="text-[9px] font-black text-[#FF6014] bg-[#FFF8F4] border border-[#FF6014]/20 px-2 py-0.5 rounded-full whitespace-nowrap">{badge}</span>
            </div>
            <p className="text-[13px] font-black text-slate-900 group-hover:text-[#FF6014] transition-colors truncate">{primary}</p>
            <p className="text-[11px] text-slate-500 font-semibold truncate">{secondary}</p>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

export function SocialLinksBar() {
  const { data: brandingRes } = useGetPublicCompanyBrandingQuery();
  const social = brandingRes?.data?.socialLinks || {};

  const links = [
    { icon: FaFacebookF, href: social.facebook || "https://facebook.com/rajseba", label: "Facebook" },
    { icon: FaInstagram, href: social.instagram || "https://instagram.com/rajseba", label: "Instagram" },
    { icon: FaLinkedinIn, href: social.linkedin || "https://linkedin.com/company/rajseba", label: "LinkedIn" },
    { icon: FaWhatsapp, href: social.whatsapp ? `https://wa.me/${social.whatsapp.replace(/[^0-9]/g, '')}` : "https://wa.me/880181333373", label: "WhatsApp" },
  ];

  return (
    <div className="flex gap-2">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#FF6014] flex items-center justify-center hover:bg-[#FF6014] hover:text-white hover:border-[#FF6014] transition-all duration-200 hover:scale-110 shadow-xs"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}

export const OFFICE_HOURS = [
  ["Saturday – Thursday", "9:00 AM – 6:00 PM"],
  ["Friday Hotline Support", "10:00 AM – 2:00 PM"],
  ["Emergency Services", "24/7 Dispatch"]
];

export function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: "easeOut", delay }} className={className}>
      {children}
    </motion.div>
  );
}
