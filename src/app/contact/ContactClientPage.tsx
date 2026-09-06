"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactState } from "@/app/contact/hooks/useContactState";
import {
  ContactChannelsList, TRUST_BARS, FAQS, SocialLinksBar, OFFICE_HOURS, RevealSection
} from "@/app/contact/components/ContactComponents";
import { ContactForm } from "@/app/contact/components/ContactForm";
import ServiceAreas from "@/components/home/sections/home/ServiceAreas";

import { useGetPublicCompanyBrandingQuery } from "@/redux/features/landing/landingApi";

export default function ContactClientPage() {
  const { form, errors, submitted, setSubmitted, activeFaq, setActiveFaq, isLoading, heroRef, glowY, glowY2, handleChange, handleSubmit } = useContactState();
  const { data: brandingRes } = useGetPublicCompanyBrandingQuery();
  const branding = brandingRes?.data;

  return (
    <div className="relative bg-transparent flex-1 flex flex-col">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

      {/* HERO */}
      <section ref={heroRef} className="relative pt-12 pb-10 md:pt-16 md:pb-12">
        <motion.div style={{ y: glowY }} className="pointer-events-none absolute -top-32 right-0 w-[500px] h-[500px] bg-[#FF6014]/5 blur-[120px] rounded-full" />
        <motion.div style={{ y: glowY2 }} className="pointer-events-none absolute -bottom-16 left-1/4 w-[300px] h-[300px] bg-[#FF6014]/4 blur-[100px] rounded-full" />
        <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 border-l border-b border-[#FF6014]/6 rounded-bl-full" />
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />Support Center
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-900 tracking-[-0.03em] leading-[1.12] mb-4">
            How can we <span className="relative inline-block text-[#FF6014]">help you today?<span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#FF6014]/15 rounded-full" /></span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="text-[13px] text-slate-400 font-medium max-w-md mx-auto leading-[1.75] mb-7">
            Reach our customer desk for bookings, billing, partner inquiries, or warranty claims. We reply within 4 hours.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }} className="flex flex-wrap justify-center gap-2.5">
            {TRUST_BARS.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-[11px] font-extrabold text-slate-700 bg-white border border-slate-200/80 px-4 py-2 rounded-full shadow-xs">
                <Icon className="w-3.5 h-3.5 text-[#FF6014]" />
                <span>{text}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="py-6 md:py-8 bg-transparent border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection>
            <ContactChannelsList />
          </RevealSection>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="py-8 md:py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <RevealSection className="lg:col-span-7">
              <ContactForm form={form} errors={errors} submitted={submitted} setSubmitted={setSubmitted} isLoading={isLoading} handleChange={handleChange} handleSubmit={handleSubmit} />
            </RevealSection>

            <RevealSection className="lg:col-span-5 flex flex-col gap-4" delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden h-[210px] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" alt="Rajseba HQ" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                  <span className="inline-block text-[9px] font-black tracking-[.1em] text-[#FF6014] bg-white/95 px-2.5 py-1 rounded-full uppercase mb-2 w-fit">Headquarters</span>
                  <h3 className="font-black text-[13px] text-white mb-0.5">{branding?.companyName || "Rajseba"} Operations Center</h3>
                  <p className="text-[11px] text-white/55 font-medium">{branding?.address ? `${branding.address}${branding.cityLocation ? `, ${branding.cityLocation}` : ''}` : "Kolkata, West Bengal, India"}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 mb-4"><div className="p-1.5 rounded-lg bg-[#FFF4EE]"><Clock className="w-3.5 h-3.5 text-[#FF6014]" /></div><h4 className="font-black text-[10px] text-slate-800 uppercase tracking-[.1em]">Office Hours</h4></div>
                <ul className="space-y-2.5">
                  {OFFICE_HOURS.map(([day, time], idx) => (
                    <li key={idx} className="flex justify-between items-center text-[11px] pb-2.5 border-b border-slate-50 last:border-0 last:pb-0"><span className="text-slate-400 font-medium">{day}</span><span className="font-black text-slate-800">{time}</span></li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#FFF4EE] border border-[#FF6014]/10 rounded-2xl p-5">
                <h4 className="font-black text-[11px] text-slate-800 mb-1.5">Join Our Community</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">Get updates on discount offers, appliance safety, and local technician audits.</p>
                <SocialLinksBar />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* FAQ Cards Grid */}
      <section className="pt-10 pb-16 md:py-16 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection className="text-center mb-10 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#FF6014] uppercase tracking-widest bg-[#FFF8F4] px-4 py-1.5 rounded-full border border-[#FF6014]/20 mb-3 shadow-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Knowledge Center
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Find quick answers to common questions about Rajseba booking, technician verification, warranty claims, and policies.
            </p>
          </RevealSection>

          <RevealSection delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-[#FF6014]/30 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF8F4] text-[#FF6014] border border-[#FF6014]/20 flex items-center justify-center font-black text-sm group-hover:bg-[#FF6014] group-hover:text-white transition-colors duration-300 shadow-xs">
                      {i + 1}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#FF6014] transition-colors leading-snug">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-[10px] font-black text-[#FF6014] uppercase tracking-wider">
                    <span>Verified Support Info</span>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Coverage Map Section */}
      <ServiceAreas />
    </div>
  );
}