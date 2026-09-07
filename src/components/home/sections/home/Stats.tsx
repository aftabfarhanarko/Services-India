"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Users, Wrench, Star, ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetPublicStatsQuery } from '@/redux/features/landing/landingApi';

const DEFAULT_STATS = [
  { id: 1, label: 'Happy Customers', value: 500, suffix: '+', display: '500+', icon: Users },
  { id: 2, label: 'Services Completed', value: 1200, suffix: '+', display: '1,200+', icon: Wrench },
  { id: 3, label: 'Verified Experts', value: 100, suffix: '+', display: '100+', icon: ShieldCheck },
  { id: 4, label: 'Average Rating', value: 4.8, suffix: '/5', display: '4.8/5', icon: Star, isDecimal: true },
];

function useCountUp(target: number, duration: number = 2000, isDecimal = false, triggered = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? parseFloat((eased * target).toFixed(1))
        : Math.floor(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, target, duration, isDecimal]);

  return count;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
} as const;

function StatCard({ stat, triggered }: { stat: typeof DEFAULT_STATS[0]; triggered: boolean }) {
  const count = useCountUp(stat.value, 2200, stat.isDecimal, triggered);

  const formatNumber = (n: number) => {
    if (stat.isDecimal) return n.toFixed(1);
    return n.toLocaleString('en-US');
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center group">
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
        <stat.icon className="w-8 h-8 text-[#FF6014]" />
      </div>
      <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tabular-nums">
        {triggered ? `${formatNumber(count)}${stat.suffix}` : '0'}
      </h3>
      <p className="text-slate-500 font-medium text-sm md:text-base">{stat.label}</p>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const { data: statsRes } = useGetPublicStatsQuery();

  // Merge API data with default stats
  const apiData = statsRes?.data || {};
  const stats = [
    { ...DEFAULT_STATS[0], value: apiData.happyCustomers ?? apiData.customers ?? DEFAULT_STATS[0].value },
    { ...DEFAULT_STATS[1], value: apiData.servicesCompleted ?? apiData.services ?? DEFAULT_STATS[1].value },
    { ...DEFAULT_STATS[2], value: apiData.verifiedExperts ?? apiData.experts ?? DEFAULT_STATS[2].value },
    { ...DEFAULT_STATS[3], value: apiData.averageRating ?? apiData.rating ?? DEFAULT_STATS[3].value },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
        } else {
          setTriggered(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-5 md:py-8 lg:py-10 bg-transparent relative" ref={ref}>
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <TrendingUp size={13} />
            Our Impact
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            Our Platform <span className="text-[#FF6014]">Impact</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Providing top-notch home services with trust and excellence
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
        >
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} triggered={triggered} />
          ))}
        </motion.div>

      </div>
    </div>
  );
}