"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Target, CheckCircle2, ArrowRight, TrendingUp, MapPin, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAboutState } from "@/app/about/hooks/useAboutState";
import {
  PILLARS, SERVICES_COVERED, RevealSection,
  fadeLeft, fadeRight, fadeUp, stagger
} from "@/app/about/components/AboutComponents";
import ServiceAreas from "@/components/home/sections/home/ServiceAreas";

export default function AboutClientPage() {
  const { displayStats, teamMembers } = useAboutState();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div className="bg-transparent overflow-hidden flex-1 flex flex-col relative">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

      {/* HERO */}
      <section ref={heroRef} className="relative pt-8 pb-6 md:pt-12 md:pb-10 lg:pt-16 overflow-hidden">
        <motion.div style={{ y: glowY }} className="pointer-events-none absolute -top-20 right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FF6014]/5 blur-[130px]" />
        <motion.div style={{ y: glowY2 }} className="pointer-events-none absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-orange-200/8 blur-[100px]" />
        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 border-l border-b border-[#FF6014]/6 rounded-bl-full" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <RevealSection variants={fadeLeft}>
            <div className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />Our Story — Since 2023
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-900 tracking-[-0.03em] leading-[1.1] mb-5">
              Kolkata's Most <span className="text-[#FF6014]">Trusted</span> Home Service Platform
            </h1>
            <p className="text-[14px] text-slate-500 font-medium leading-[1.8] max-w-lg mb-6">
              Rajseba was built with a single mission — to bring reliable, transparent, and affordable home services to every household in Kolkata, West Bengal, and across India.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/services"><Button variant="outline" className="border-[#FF6014] text-[#FF6014] hover:bg-[#FF6014]/5 font-bold px-6 py-3 h-auto rounded-xl text-sm flex items-center gap-2">Explore Services<ArrowRight className="w-4 h-4" /></Button></Link>
              <Link href="/opportunity"><Button variant="outline" className="border-slate-200 text-slate-600 font-bold px-6 py-3 h-auto rounded-xl text-sm flex items-center gap-2">Become a Partner<TrendingUp className="w-4 h-4" /></Button></Link>
            </div>
          </RevealSection>

          <RevealSection variants={fadeRight} className="relative">
            <div className="relative h-[400px] lg:h-[480px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100">
              <Image src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=800&auto=format&fit=crop" alt="Rajseba home service professional at work" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-lg">
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#FF6014] mb-1.5">Trusted by thousands daily</p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black text-lg text-slate-900 leading-none">4.8/5.0</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">App Store Rating</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="font-black text-lg text-slate-900 leading-none">50K+</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Happy Customers</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="font-black text-lg text-slate-900 leading-none">2,500+</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Verified Experts</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* STATS */}
      <section className="py-6 md:py-8 bg-transparent border-t border-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection variants={stagger}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayStats.map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="relative group bg-white rounded-3xl border border-slate-100 p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#FF6014]/20 hover:shadow-[0_10px_40px_rgba(255,96,20,0.05)] transition-all duration-300">
                  <p className="text-3xl md:text-4xl font-black text-[#FF6014] leading-none tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-800 mt-2">{stat.label}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-6 md:py-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-4"><Target className="w-3.5 h-3.5" />The Rajseba Standard</span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight mb-3">What Makes Us Different</h2>
            <p className="text-[13px] text-slate-400 font-medium max-w-md mx-auto leading-relaxed">We've set the highest standards for professional home care in Kolkata, West Bengal, India.</p>
          </RevealSection>
          <RevealSection variants={stagger}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PILLARS.map(({ title, description, icon: Icon, bg }, i) => (
                <motion.div key={i} variants={fadeUp} className="group bg-white rounded-3xl border border-slate-100 p-6 hover:border-[#FF6014]/15 hover:shadow-[0_12px_40px_rgba(255,96,20,0.04)] transition-all duration-300">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${bg} mb-4 group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5" /></div>
                  <h3 className="text-sm font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* MISSION + SERVICES */}
      <section className="py-6 md:py-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <RevealSection variants={fadeLeft}>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-5"><Users className="w-3 h-3" />Our Mission</span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight leading-tight mb-5">Empowering Every Home in Kolkata & India</h2>
            <p className="text-[13px] font-medium text-slate-500 leading-[1.8] mb-6">We believe everyone deserves access to high-quality, affordable home maintenance. By creating economic opportunities for skilled technicians, we are transforming the urban service economy.</p>
            <div className="space-y-3.5">
              {["Reducing unemployment for skilled trades in urban areas", "Creating a transparent, tech-driven service economy", "Ensuring safety and quality standards in every household", "Building a trusted community for clients and vendors alike"].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-[12px] font-semibold text-slate-600">
                  <div className="w-5 h-5 bg-[#FFF8F4] border border-[#FF6014]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-[#FF6014]" /></div>
                  {item}
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection variants={fadeRight}>
            <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-5"><div className="p-2 rounded-xl bg-[#FFF4EE]"><MapPin className="w-4 h-4 text-[#FF6014]" /></div><h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">Services We Cover</h3></div>
              <div className="space-y-3">
                {SERVICES_COVERED.map((service, i) => (
                  <div key={i} className="flex items-center gap-3 text-[12px] font-semibold text-slate-600 py-2.5 border-b border-slate-50 last:border-0">
                    <div className="w-5 h-5 bg-[#FFF8F4] rounded-lg flex items-center justify-center shrink-0 border border-[#FF6014]/15"><Check className="w-3 h-3 text-[#FF6014]" /></div>
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* COVERAGE MAP — ServiceAreas Component */}
      <ServiceAreas />

      {/* TEAM */}
      <section className="py-8 md:py-14 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection className="text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6014] uppercase tracking-wider bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100 mb-3">
              <Users className="w-3.5 h-3.5" /> Leadership & Visionaries
            </span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight mb-3">
              Meet the <span className="text-[#FF6014]">Team</span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              The passionate professionals driving Rajseba's mission of safe, verified, and reliable home care.
            </p>
          </RevealSection>

          <RevealSection variants={stagger}>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative bg-white rounded-3xl border border-[#FF6014]/20 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(255,96,20,0.12)] hover:border-[#FF6014] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Container */}
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-900">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                    
                    {/* Role & Experience Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-[#FF6014] shadow-sm border border-white/60">
                        <Sparkles size={11} className="fill-[#FF6014]" /> {member.role}
                      </span>
                      {member.experience && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                          {member.experience}
                        </span>
                      )}
                    </div>

                    {/* Member Name over Image Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                    <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed mb-6 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Verified Status & Social Connect Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Verified Executive</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF6014] animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-4 md:pt-8 md:pb-6 bg-transparent border-t border-slate-100/60">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <RevealSection>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-5"><Sparkles className="w-3.5 h-3.5" />Ready to Get Started?</span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight leading-tight mb-4">Experience the Rajseba Difference</h2>
            <p className="text-[13px] text-slate-400 font-medium max-w-md mx-auto leading-relaxed mb-8">Join 50,000+ households who rely on Rajseba for professional, reliable home maintenance.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services"><Button variant="outline" className="border-[#FF6014] text-[#FF6014] hover:bg-[#FF6014]/5 font-bold px-8 py-4 h-auto rounded-xl text-sm flex items-center gap-2 shadow-lg">Book a Service<ArrowRight className="w-4 h-4" /></Button></Link>
              <Link href="/opportunity"><Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold px-8 py-4 h-auto rounded-xl text-sm flex items-center gap-2">Join as Partner<TrendingUp className="w-4 h-4" /></Button></Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
