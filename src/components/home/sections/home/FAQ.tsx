"use client";
import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, CalendarCheck, ShieldCheck, RefreshCw, DollarSign, Award, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const faqs = [
  {
    icon: CalendarCheck,
    question: "How do I book a service on Rajseba?",
    answer: "Booking is simple! Just browse our categories, select the service you need, choose a convenient time slot, and confirm your booking. Our professional will arrive at your doorstep."
  },
  {
    icon: ShieldCheck,
    question: "Are the service professionals verified?",
    answer: "Yes, absolutely. All our service professionals go through a rigorous background check and skill assessment before they are onboarded to ensure your safety and quality of service."
  },
  {
    icon: RefreshCw,
    question: "What if I am not satisfied with the service?",
    answer: "Customer satisfaction is our top priority. If you're not happy with the service, please reach out to our support team within 24 hours, and we will arrange a rework or provide a refund."
  },
  {
    icon: DollarSign,
    question: "Are there any hidden charges?",
    answer: "No, we maintain 100% transparency. The price you see during checkout is the final price for the service. Any extra parts or materials needed will be billed separately with your approval."
  },
  {
    icon: Award,
    question: "How does Rajseba guarantee service quality and safety?",
    answer: "We back every service with our 7-Day Service Warranty and up to ₹10,000 Damage Protection. Our technicians use genuine spare parts, standardized pricing, and strict safety guidelines for every home task."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-6 pb-4 md:py-12 lg:py-14 bg-transparent relative overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: "spring", stiffness: 85, damping: 16 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-start"
        >

          {/* Left — Ultra-Premium Glass Header (Background Box Removed) */}
          <div className="md:col-span-5 md:sticky md:top-24 flex flex-col items-start text-left space-y-4">
            <span className="inline-flex items-center gap-2 bg-[#FFF4EE] border border-[#FF6014]/25 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" /> Got Questions?
            </span>

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 tracking-tight leading-tight flex items-center gap-2 whitespace-nowrap">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014] shrink-0" />
              <span>Frequently Asked <span className="text-[#FF6014]">Questions</span></span>
            </h2>

            {/* Left 4-line description details with background removed */}
            <div className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed space-y-2.5 pt-1 text-left">
              <p className="flex items-start gap-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] mt-1.5 shrink-0" />
                <span>Have queries regarding booking, pricing, or technician safety?</span>
              </p>
              <p className="flex items-start gap-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] mt-1.5 shrink-0" />
                <span>We provide transparent upfront costs, 7-day service guarantee, and instant expert allocation.</span>
              </p>
              <p className="flex items-start gap-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] mt-1.5 shrink-0" />
                <span>Our background-checked professionals are available 24/7 across Dhaka and major districts.</span>
              </p>
              <p className="flex items-start gap-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] mt-1.5 shrink-0" />
                <span>Feel free to explore our answers or reach out directly to our support team for help.</span>
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6014] to-[#E0530A] rounded-2xl px-6 py-3.5 shadow-[0_4px_20px_rgba(255,96,20,0.25)] hover:shadow-[0_8px_25px_rgba(255,96,20,0.35)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Still need help? Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — Glassmorphism Accordion List */}
          <div className="md:col-span-7 flex flex-col gap-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const Icon = faq.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 100, damping: 18 }}
                  className={`rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white/70 backdrop-blur-xl border-[#FF6014]/60 shadow-[0_12px_40px_0_rgba(255,96,20,0.14)] ring-1 ring-[#FF6014]/20'
                      : 'bg-white/40 backdrop-blur-xl border-white/60 hover:bg-white/60 hover:border-[#FF6014]/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4.5 md:py-5 text-left focus:outline-none cursor-pointer"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? 'bg-[#FF6014] text-white shadow-[0_4px_12px_rgba(255,96,20,0.3)]'
                          : 'bg-white/80 backdrop-blur-md border border-[#FF6014]/20 text-[#FF6014]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm md:text-base leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    {/* Plus / Minus Toggle Button (+ / -) with Smooth Rotation */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ease-out ${
                        isOpen
                          ? 'bg-[#FF6014] text-white shadow-[0_4px_12px_rgba(255,96,20,0.35)] rotate-180'
                          : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:border-[#FF6014]/50 hover:bg-[#FFF4EE] hover:text-[#FF6014] rotate-0'
                      }`}
                    >
                      <motion.div
                        key={isOpen ? "minus" : "plus"}
                        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        {isOpen ? <Minus className="w-4 h-4 stroke-[2.8]" /> : <Plus className="w-4 h-4 stroke-[2.8]" />}
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                          className="px-5 pb-5 pt-1.5 border-t border-slate-100/60 ml-13"
                        >
                          <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </div>
  );
}