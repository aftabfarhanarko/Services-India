"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ShieldCheck, Award, Heart, Sparkles } from "lucide-react";

export const PILLARS = [
  { title: "100% Background-Vetted Team", description: "Every technician undergoes biometric Aadhaar & Government ID check, police verification, and a rigorous skills assessment.", icon: ShieldCheck, bg: "bg-[#FFF8F4] text-[#FF6014]" },
  { title: "Transparent Fixed Pricing", description: "Say goodbye to surprise charges. Get detailed rate cards and fixed billing estimates before booking.", icon: Award, bg: "bg-[#FFF8F4] text-[#FF6014]" },
  { title: "Premium Damage Guarantee", description: "All service appointments are backed by Rajseba's damage protection guarantee for absolute peace of mind.", icon: Heart, bg: "bg-[#FFF8F4] text-[#FF6014]" },
  { title: "24/7 Priority Support", description: "Our dedicated helpline handles every booking from dispatch to post-service warranty questions.", icon: Sparkles, bg: "bg-[#FFF8F4] text-[#FF6014]" },
];

export const SERVICES_COVERED = [
  "Air Conditioner (AC) Servicing & Installation",
  "Professional Home & Office Deep Cleaning",
  "Certified Electrical & Plumbing Maintenance",
  "Kitchen Hood & Home Appliance Repair",
  "Professional Wall Painting & Woodwork",
  "Packers & Movers Logistics Services",
];

export const fadeLeft: Variants = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } } };
export const fadeRight: Variants = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } } };
export const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
export const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export function RevealSection({ children, className = "", variants = fadeUp }: { children: React.ReactNode; className?: string; variants?: Variants }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}
