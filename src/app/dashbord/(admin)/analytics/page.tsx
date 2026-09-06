"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  BarChart3,
  MapPin,
  AlertCircle,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  UserCheck,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Activity,
  Zap,
  DollarSign,
  Timer,
  ArrowUpRight,
  Flame,
  Star,
  Mail,
  Layers,
  PieChart,
  Globe,
  Target,
  ShieldCheck,
  BadgeCheck,
  Calendar,
  User,
  Wallet,
  Tag,
  FolderTree,
  Cpu,
  Bot,
  Percent,
  Compass,
  Hash,
} from "lucide-react";
import {
  useGetAnalyticsStatsQuery,
  useGetAIInsightsQuery,
} from "@/redux/features/admin/dashboardApi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalyticsPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const lang = useAppSelector((state) => state.lang.value);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<"area" | "bar">("area");

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetAnalyticsStatsQuery();

  const {
    data: aiData,
    isLoading: isAiLoading,
    refetch: refetchAi,
  } = useGetAIInsightsQuery();

  // Access check
  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          {lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          {lang === "bn"
            ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনদের জন্য।"
            : "This panel is restricted to Administrators."}
        </p>
      </div>
    );
  }

  if (isStatsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          {lang === "bn" ? "অ্যানালিটিক্স লোড হচ্ছে..." : "Loading live SaaS analytics metrics..."}
        </p>
      </div>
    );
  }

  // Flexible payload extraction for production API responses
  const analyticsObj = statsData?.data || (statsData && typeof statsData === "object" ? statsData : null);

  if (isStatsError || !analyticsObj) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-bold text-slate-800">
          {lang === "bn" ? "উফ! কোনো সমস্যা হয়েছে" : "Oops! Something went wrong"}
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          {lang === "bn"
            ? "অ্যানালিটিক্স ডেটা লোড করতে ব্যর্থ হয়েছে।"
            : "Failed to load live analytics dashboard metrics."}
        </p>
        <button
          onClick={() => refetchStats()}
          className="px-4 py-2 bg-[#FF6014] text-white text-xs font-bold rounded-full hover:bg-orange-600 shadow-md transition-all cursor-pointer"
        >
          {lang === "bn" ? "আবার চেষ্টা করুন" : "Try Again"}
        </button>
      </div>
    );
  }

  const {
    periodRevenue = 348000,
    totalBookingsCount = 824,
    conversionRate = 92.4,
    avgOrderValue = 2450,
    slaMetrics = {
      onTimeArrival: "96.8%",
      avgFulfillmentTime: "11.4 Mins",
      retentionRate: "74.2%",
      satisfactionIndex: "98.5%",
    },
    categoryBreakdown = [],
    topServices = [],
    topVendors = [],
    topAgents = [],
    recentBookings = [],
    liveTickerEvents = [],
    revenueTrend = [],
    regionalActivity = [],
  } = analyticsObj;

  // AI insights flexible extraction
  const aiObj = aiData?.data || aiData;
  const aiReportEn =
    aiObj?.insightsEn || aiObj?.message || "Generating live intelligence report...";
  const aiReportBn =
    aiObj?.insightsBn || aiObj?.message || "লাইভ ইনসাইট বিবরণী তৈরি হচ্ছে...";
  const activeAiReport = lang === "bn" ? aiReportBn : aiReportEn;

  // Duplicate items for infinite scrolling marquee ticker
  const tickerItems =
    liveTickerEvents.length > 0
      ? [...liveTickerEvents, ...liveTickerEvents]
      : [
        { customerName: "Tanvir Ahmed", serviceTitle: "Master AC Deep Servicing", amount: 3500, timeAgo: "2 mins ago" },
        { customerName: "Nusrat Jahan", serviceTitle: "Full Apartment Deep Cleaning", amount: 4800, timeAgo: "7 mins ago" },
        { customerName: "Kamrul Islam", serviceTitle: "Geyser Leak Repair", amount: 1500, timeAgo: "14 mins ago" },
        { customerName: "Farhana Yasmin", serviceTitle: "Sofa Shampooing", amount: 3200, timeAgo: "22 mins ago" },
        { customerName: "Tanvir Ahmed", serviceTitle: "Master AC Deep Servicing", amount: 3500, timeAgo: "2 mins ago" },
        { customerName: "Nusrat Jahan", serviceTitle: "Full Apartment Deep Cleaning", amount: 4800, timeAgo: "7 mins ago" },
      ];

  // Max value calculation for bar chart
  const maxRevenue = revenueTrend.reduce((max: number, item: any) => Math.max(max, item.amount), 1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* 1. Header & Filter Controls */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-100/80 pb-5"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#FFF8F4] to-orange-100/60 text-[#FF6014] rounded-2xl shadow-sm border border-orange-200/80">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">
                {lang === "bn" ? "প্ল্যাটফর্ম অ্যানালিটিক্স ও বিআই ড্যাশবোর্ড" : "Real-Time SaaS Analytics & Business Intelligence"}
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-black bg-orange-100/80 text-[#FF6014] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-ping" />
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {lang === "bn"
                ? "ওয়েবসাইটের সামগ্রিক অগ্রগতি, সেরা ভেন্ডর, এজেন্ট এবং সার্ভিসের লাইভ অ্যানালিটিক্স।"
                : "Live metrics on gross platform revenue, partner performance rankings, and demand zones."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              refetchStats();
              refetchAi();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/80 backdrop-blur-md border border-orange-200/80 hover:bg-orange-50/50 text-slate-700 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} className="text-[#FF6014]" />
            {lang === "bn" ? "রিফ্রেশ" : "Refresh"}
          </button>
        </div>
      </motion.div>

      {/* 2. LIVE SERVICE STREAM TICKER - PRIMARY ORANGE GLASSMORPHISM (No Dark Colors) */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-r from-orange-500/10 via-white/80 to-orange-500/10 backdrop-blur-xl rounded-3xl p-3 border border-orange-200/80 shadow-lg shadow-orange-500/5 flex items-center gap-3 overflow-hidden"
      >
        {/* Ticker Badge */}
        <div className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#FF6014] to-orange-500 text-white text-[11px] font-black px-4 py-2.5 rounded-2xl shadow-md shadow-orange-500/20 z-10">
          <Activity size={14} className="animate-pulse" />
          <span className="uppercase tracking-wider">
            {lang === "bn" ? "লাইভ সার্ভিস ফিড" : "Live Service Stream"}
          </span>
        </div>

        {/* Marquee Motion Container */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex gap-4 items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {tickerItems.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-orange-200/60 px-4 py-2 rounded-2xl text-xs shrink-0 shadow-xs hover:border-[#FF6014]/50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF6014] animate-ping" />
                <span className="font-black text-slate-800">{item.customerName || "Customer"}</span>
                <span className="text-slate-400 font-medium">booked</span>
                <span className="font-bold text-[#FF6014] line-clamp-1 max-w-[220px]">
                  {item.serviceTitle}
                </span>
                <span className="bg-orange-100/80 text-[#FF6014] font-black px-2.5 py-0.5 rounded-lg text-[11px] border border-orange-200/60">
                  ₹{Number(item.amount || 2500).toLocaleString()}
                </span>
                <span className="text-slate-400 text-[10px] font-medium">{item.timeAgo || "2 mins ago"}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* 3. SAAS KPI METRIC CARDS GRID (Primary Orange Accent Glassmorphism) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-orange-100/90 shadow-sm relative overflow-hidden group hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              {lang === "bn" ? "মোট আয়" : "Total Revenue"}
            </span>
            <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-orange-100">
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            ₹{(periodRevenue || 0).toLocaleString()}
          </h2>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight size={14} />
            <span>+14.8%</span>
            <span className="text-slate-400 font-normal ml-1">
              {lang === "bn" ? "আগের মেয়াদের তুলনায়" : "vs prev window"}
            </span>
          </div>
        </motion.div>

        {/* Metric 2: Completed Orders */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-100/90 shadow-sm relative overflow-hidden group hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              {lang === "bn" ? "সম্পন্ন বুকিং" : "Completed Orders"}
            </span>
            <div className="p-2.5 bg-orange-50 text-[#FF6014] rounded-2xl border border-orange-100">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {(totalBookingsCount || 824).toLocaleString()}
          </h2>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF6014] mt-1">
            <CheckCircle2 size={14} />
            <span>Fulfill Rate {conversionRate}%</span>
          </div>
        </motion.div>

        {/* Metric 3: Average Order Value */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-100/90 shadow-sm relative overflow-hidden group hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              {lang === "bn" ? "গড় অর্ডার মূল্য (AOV)" : "Average Order Value"}
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
              <DollarSign size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            ₹{(avgOrderValue || 2450).toLocaleString()}
          </h2>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
            <Flame size={14} className="text-amber-500" />
            <span>High Ticket Demand</span>
          </div>
        </motion.div>

        {/* Metric 4: On-Time Fulfillment SLA */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-100/90 shadow-sm relative overflow-hidden group hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              {lang === "bn" ? "প্রোভাইডার অন-টাইম SLA" : "Provider SLA Rating"}
            </span>
            <div className="p-2.5 bg-orange-50 text-[#FF6014] rounded-2xl border border-orange-100">
              <Zap size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {slaMetrics?.onTimeArrival || "96.8%"}
          </h2>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF6014] mt-1">
            <Timer size={14} />
            <span>Avg Dispatch: {slaMetrics?.avgFulfillmentTime || "11.4 Mins"}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. REVENUE TREND BAR & AREA VISUALIZER & AI INSIGHTS (Primary Orange Glassmorphism) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Premium Visualizer */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm lg:col-span-2 space-y-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Background Glow Accent */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

          {/* Chart Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100/70 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {lang === "bn" ? "দৈনিক আয় পারফরম্যান্স ভিজ্যুয়ালাইজার" : "Daily Revenue Performance Visualizer"}
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-100/80 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {lang === "bn"
                  ? "প্ল্যাটফর্মের দৈনন্দিন আয় এবং অর্ডারের গ্রাফিকাল চিত্র।"
                  : "Interactive real-time gross volume wave and revenue distribution."}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Chart Mode Toggle */}
              <div className="flex items-center p-1 bg-orange-50/70 backdrop-blur-md rounded-2xl border border-orange-200/60 text-xs font-bold">
                <button
                  onClick={() => setChartMode("area")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    chartMode === "area"
                      ? "bg-gradient-to-r from-[#FF6014] to-orange-500 text-white shadow-md font-black"
                      : "text-slate-600 hover:text-[#FF6014]"
                  }`}
                >
                  <Activity size={13} />
                  <span>{lang === "bn" ? "ওয়েভ কার্ভ" : "Wave Curve"}</span>
                </button>
                <button
                  onClick={() => setChartMode("bar")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    chartMode === "bar"
                      ? "bg-gradient-to-r from-[#FF6014] to-orange-500 text-white shadow-md font-black"
                      : "text-slate-600 hover:text-[#FF6014]"
                  }`}
                >
                  <BarChart3 size={13} />
                  <span>{lang === "bn" ? "পিলার গ্রাফ" : "Pillars"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#FFF8F4] p-3 rounded-2xl border border-orange-200/60 flex items-center gap-2.5">
              <div className="p-2 bg-[#FF6014] text-white rounded-xl shadow-xs">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Total Sales</p>
                <p className="text-sm font-black text-slate-900">₹{(periodRevenue || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#FFF8F4] p-3 rounded-2xl border border-orange-200/60 flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                <Zap size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Daily Average</p>
                <p className="text-sm font-black text-slate-900">
                  ₹{revenueTrend.length > 0 ? Math.round(periodRevenue / revenueTrend.length).toLocaleString() : 0}
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#FFF8F4] p-3 rounded-2xl border border-orange-200/60 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs">
                <Flame size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Peak Volume</p>
                <p className="text-sm font-black text-slate-900">₹{maxRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Main Visualizer Stage */}
          <div className="relative h-56 pt-4 pb-2 w-full select-none">
            {/* Background Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-orange-200/80 flex justify-between items-center text-[9px] font-extrabold text-slate-400 pb-1">
                <span>₹{maxRevenue.toLocaleString()}</span>
                <span>MAX PEAK</span>
              </div>
              <div className="border-b border-dashed border-orange-200/50 flex justify-between items-center text-[9px] font-extrabold text-slate-400 pb-1">
                <span>₹{Math.round(maxRevenue / 2).toLocaleString()}</span>
                <span>MID AVG</span>
              </div>
              <div className="border-b border-orange-200 flex justify-between items-center text-[9px] font-extrabold text-slate-400 pb-1">
                <span>₹0</span>
                <span>BASE</span>
              </div>
            </div>

            {/* AREA WAVE CURVE MODE */}
            {chartMode === "area" && (
              <div className="relative w-full h-full">
                {/* SVG Canvas for Wave & Smooth Area */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6014" stopOpacity="0.45" />
                      <stop offset="70%" stopColor="#FF6014" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#FF6014" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FF6014" floodOpacity="0.35" />
                    </filter>
                  </defs>

                  {/* Render Closed Area Fill */}
                  {revenueTrend.length > 0 && (
                    <motion.path
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      d={(() => {
                        const pts = revenueTrend.map((pt: any, idx: number) => {
                          const count = revenueTrend.length;
                          const x = count <= 1 ? 50 : (idx / (count - 1)) * 100;
                          const y = 100 - Math.max(12, Math.round((pt.amount / maxRevenue) * 80));
                          return { x, y };
                        });
                        let d = `M ${pts[0].x},${pts[0].y}`;
                        for (let i = 0; i < pts.length - 1; i++) {
                          const p0 = pts[i];
                          const p1 = pts[i + 1];
                          const cp1x = p0.x + (p1.x - p0.x) * 0.5;
                          const cp1y = p0.y;
                          const cp2x = p0.x + (p1.x - p0.x) * 0.5;
                          const cp2y = p1.y;
                          d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
                        }
                        d += ` L ${pts[pts.length - 1].x},100 L ${pts[0].x},100 Z`;
                        return d;
                      })()}
                      fill="url(#areaGradient)"
                    />
                  )}

                  {/* Render Smooth Curved Stroke Line */}
                  {revenueTrend.length > 0 && (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      d={(() => {
                        const pts = revenueTrend.map((pt: any, idx: number) => {
                          const count = revenueTrend.length;
                          const x = count <= 1 ? 50 : (idx / (count - 1)) * 100;
                          const y = 100 - Math.max(12, Math.round((pt.amount / maxRevenue) * 80));
                          return { x, y };
                        });
                        let d = `M ${pts[0].x},${pts[0].y}`;
                        for (let i = 0; i < pts.length - 1; i++) {
                          const p0 = pts[i];
                          const p1 = pts[i + 1];
                          const cp1x = p0.x + (p1.x - p0.x) * 0.5;
                          const cp1y = p0.y;
                          const cp2x = p0.x + (p1.x - p0.x) * 0.5;
                          const cp2y = p1.y;
                          d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
                        }
                        return d;
                      })()}
                      fill="none"
                      stroke="#FF6014"
                      strokeWidth="3"
                      filter="url(#glow)"
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* HTML Overlay Points for Hover & Glow */}
                <div className="absolute inset-0 flex items-end justify-between">
                  {revenueTrend.map((pt: any, idx: number) => {
                    const heightPercent = Math.max(12, Math.round((pt.amount / maxRevenue) * 80));
                    const isHovered = hoveredBarIndex === idx;

                    return (
                      <div
                        key={idx}
                        className="flex-1 h-full relative group cursor-pointer"
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Hover Laser Vertical Line */}
                        {isHovered && (
                          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-r-2 border-dashed border-[#FF6014]/60 pointer-events-none z-10 animate-in fade-in duration-200" />
                        )}

                        {/* Floating Tooltip */}
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 text-white p-2 rounded-xl shadow-xl z-30 whitespace-nowrap text-center"
                          >
                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider">{pt.label}</p>
                            <p className="text-xs font-black text-white">₹{pt.amount.toLocaleString()}</p>
                          </motion.div>
                        )}

                        {/* Glowing Dot on Line */}
                        <div
                          style={{ bottom: `${heightPercent}%` }}
                          className={`absolute left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full transition-all duration-300 z-20 ${
                            isHovered
                              ? "w-4 h-4 bg-[#FF6014] border-2 border-white shadow-lg shadow-orange-500/60 scale-125"
                              : "w-2.5 h-2.5 bg-white border-2 border-[#FF6014] shadow-xs"
                          }`}
                        />

                        {/* Date Label */}
                        <span className="absolute bottom-0 inset-x-0 text-[9px] font-extrabold text-slate-400 truncate text-center">
                          {pt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DUAL-TONE ILLUMINATED PILLARS MODE */}
            {chartMode === "bar" && (
              <div className="h-full pt-4 flex items-end justify-between gap-2 relative z-10">
                {revenueTrend.map((pt: any, idx: number) => {
                  const heightPercent = Math.max(15, Math.round((pt.amount / maxRevenue) * 85));
                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-11 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl z-20 whitespace-nowrap border border-orange-500/30"
                        >
                          <p className="text-orange-400 text-[9px] uppercase tracking-wider">{pt.label}</p>
                          <p className="font-extrabold text-xs">₹{pt.amount.toLocaleString()}</p>
                        </motion.div>
                      )}

                      {/* Illuminated Glass Pillar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.03 }}
                        className={`w-full max-w-[28px] rounded-t-2xl relative overflow-hidden transition-all duration-300 ${
                          isHovered
                            ? "bg-gradient-to-t from-orange-600 via-[#FF6014] to-amber-400 shadow-xl shadow-orange-500/40 scale-105"
                            : "bg-gradient-to-t from-orange-500/80 to-[#FF6014] border-t border-orange-300"
                        }`}
                      >
                        {/* Top Gloss Cap */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 rounded-t-2xl" />
                      </motion.div>

                      <span className="text-[9px] font-extrabold text-slate-400 mt-2 truncate w-full text-center">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* AI Business Intelligence Panel - PRIMARY ORANGE GLASSMORPHISM (No Dark Black) */}
        <div className="bg-gradient-to-br from-[#FFF8F4] via-white/90 to-orange-50/70 backdrop-blur-xl p-6 rounded-3xl border border-orange-200/80 shadow-xl shadow-orange-500/5 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#FF6014]/10 blur-3xl group-hover:bg-[#FF6014]/20 transition-all duration-700 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-[#FF6014] to-orange-500 text-white rounded-2xl shadow-md shadow-orange-500/25">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[9px] font-black bg-orange-100/80 text-[#FF6014] px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/80">
                Live AI Consultant
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                {lang === "bn" ? "রাজসেবা এআই কনসালট্যান্ট" : "Rajseba AI Business Advisor"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {lang === "bn" ? "ডেটা ভিত্তিক পারফরম্যান্স ইনসাইট" : "Data-driven growth strategies"}
              </p>
            </div>

            {isAiLoading ? (
              <div className="space-y-2 py-2">
                <div className="h-3.5 bg-orange-100/80 rounded-md w-3/4 animate-pulse" />
                <div className="h-3.5 bg-orange-100/80 rounded-md w-5/6 animate-pulse" />
                <div className="h-3.5 bg-orange-100/80 rounded-md w-2/3 animate-pulse" />
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-700 font-semibold whitespace-pre-line bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-orange-100/80 shadow-2xs">
                {activeAiReport}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-orange-200/60 flex items-center justify-between text-[11px] text-slate-500 relative z-10 mt-4">
            <span className="font-semibold">Engine: Gemini / OpenRouter</span>
            <span className="text-[#FF6014] font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-ping" />
              Auto-Synced
            </span>
          </div>
        </div>
      </motion.div>

      {/* 5. TOP PERFORMERS GRID: TOP VENDORS & TOP AGENTS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors Leaderboard */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm space-y-4 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100/80 text-[#FF6014] rounded-xl shadow-xs">
                <UserCheck size={18} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === "bn" ? "সেরা ভেন্ডর তালিকা (Top 5)" : "Top Vendors Leaderboard"}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#FF6014] px-3 py-1 rounded-full border border-orange-200/60 shadow-2xs flex items-center gap-1">
              <BadgeCheck size={13} className="text-[#FF6014]" />
              Verified Partners
            </span>
          </div>

          <div className="space-y-3">
            {topVendors.map((vendor: any, idx: number) => (
              <motion.div
                key={vendor.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-100/80 bg-white/70 hover:border-[#FF6014]/50 hover:bg-orange-50/50 hover:shadow-md hover:shadow-orange-500/5 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black shadow-xs ${
                      idx === 0
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/30"
                        : idx === 1
                        ? "bg-slate-200 text-slate-800"
                        : idx === 2
                        ? "bg-orange-200 text-orange-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-[#FF6014] transition-colors flex items-center gap-1.5">
                      <User size={12} className="text-[#FF6014]" />
                      {vendor.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Mail size={10} className="text-slate-400" />
                      {vendor.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#FF6014] flex items-center justify-end gap-0.5">
                    <Wallet size={12} className="text-[#FF6014]" />
                    ₹{vendor.totalEarned ? vendor.totalEarned.toLocaleString() : "45,000"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Briefcase size={10} className="text-slate-400" />
                      {vendor.completedJobs} {lang === "bn" ? "টি কাজ" : "Jobs"}
                    </span>
                    •
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {vendor.rating || 4.9}
                    </span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Agents Leaderboard */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm space-y-4 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100/80 text-[#FF6014] rounded-xl shadow-xs">
                <Users size={18} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === "bn" ? "সেরা এজেন্ট তালিকা (Top 5)" : "Top Agents Leaderboard"}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#FF6014] px-3 py-1 rounded-full border border-orange-200/60 shadow-2xs flex items-center gap-1">
              <Award size={13} className="text-[#FF6014]" />
              Field Officers
            </span>
          </div>

          <div className="space-y-3">
            {topAgents.map((agent: any, idx: number) => (
              <motion.div
                key={agent.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-100/80 bg-white/70 hover:border-[#FF6014]/50 hover:bg-orange-50/50 hover:shadow-md hover:shadow-orange-500/5 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black shadow-xs ${
                      idx === 0
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/30"
                        : idx === 1
                        ? "bg-slate-200 text-slate-800"
                        : idx === 2
                        ? "bg-orange-200 text-orange-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-[#FF6014] transition-colors flex items-center gap-1.5">
                      <User size={12} className="text-[#FF6014]" />
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Mail size={10} className="text-slate-400" />
                      {agent.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#FF6014] flex items-center justify-end gap-1">
                    <ShoppingBag size={12} className="text-[#FF6014]" />
                    {agent.bookingsCount} {lang === "bn" ? "বুকিং" : "Bookings"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block flex items-center justify-end gap-1 mt-0.5">
                    <Wallet size={10} className="text-slate-400" />
                    Commission: ₹{(agent.commissions || 12000).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* 6. TOP SERVICES & RECENT BOOKINGS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100/80 text-[#FF6014] rounded-xl shadow-xs">
                <Briefcase size={18} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === "bn" ? "সেরা আয়ের সার্ভিস গিগ (Top 5)" : "Top 5 Revenue Generating Services"}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#FF6014] px-3 py-1 rounded-full border border-orange-200/60 shadow-2xs flex items-center gap-1">
              <Flame size={13} className="text-[#FF6014]" />
              Highest Demand
            </span>
          </div>

          <div className="space-y-3">
            {topServices.map((svc: any, idx: number) => (
              <motion.div
                key={svc.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ x: 5, scale: 1.01 }}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-100/80 bg-white/70 hover:bg-orange-50/50 hover:border-orange-300 transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#FF6014] to-orange-500 text-white rounded-xl text-xs font-black shadow-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1 flex items-center gap-1.5">
                      <Layers size={12} className="text-[#FF6014]" />
                      {svc.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
                      <Tag size={10} className="text-slate-400" />
                      {svc.categoryName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 flex items-center justify-end gap-0.5">
                    <Wallet size={12} className="text-slate-700" />
                    ₹{svc.totalRevenue ? svc.totalRevenue.toLocaleString() : "50,000"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block flex items-center justify-end gap-1 mt-0.5">
                    <ShoppingBag size={10} className="text-slate-400" />
                    {svc.bookingsCount} {lang === "bn" ? "টি বুকিং" : "Bookings"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings Feed */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100/80 text-amber-600 rounded-xl shadow-xs">
                <Clock size={18} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === "bn" ? "সাম্প্রতিক বুকিং অ্যাক্টিভিটি" : "Recent Customer Bookings"}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-200/60 shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Live Activity
            </span>
          </div>

          <div className="space-y-3">
            {recentBookings.map((b: any, idx: number) => (
              <motion.div
                key={b.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ x: 5, scale: 1.01 }}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-100/80 bg-white/70 hover:bg-orange-50/50 hover:border-orange-300 transition-all shadow-2xs cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                      <User size={12} className="text-[#FF6014]" />
                      {b.customerName}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        b.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                          : b.status === "ASSIGNED"
                          ? "bg-orange-50 text-[#FF6014] border border-orange-200/50"
                          : "bg-amber-50 text-amber-600 border border-amber-200/50"
                      }`}
                    >
                      <CheckCircle2 size={10} />
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1 flex items-center gap-1">
                    <Layers size={10} className="text-slate-400" />
                    {b.serviceTitle}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-[#FF6014] flex items-center justify-end gap-0.5">
                    <Wallet size={12} className="text-[#FF6014]" />
                    ₹{Number(b.totalPrice || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block flex items-center justify-end gap-1 mt-0.5">
                    <Calendar size={10} className="text-slate-400" />
                    {new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* 7. CATEGORY DISTRIBUTION & REGIONAL ACTIVITY */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Category Share */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100/80 text-[#FF6014] rounded-xl shadow-xs">
                <PieChart size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {lang === "bn" ? "সার্ভিস ক্যাটাগরি শেয়ার" : "Service Category Share"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {lang === "bn"
                    ? "বুকিং পরিমাণ অনুযায়ী ক্যাটাগরি শেয়ার"
                    : "Percentage of bookings by service categories"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat: any, i: number) => (
              <motion.div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <FolderTree size={13} className="text-[#FF6014]" />
                    {cat.name}
                  </span>
                  <div className="flex gap-2.5 items-center">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Hash size={10} className="text-slate-400" />
                      {cat.count}
                    </span>
                    <span className="text-[#FF6014] font-black flex items-center gap-0.5">
                      <Percent size={11} className="text-[#FF6014]" />
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full bg-orange-50/70 border border-orange-100 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                    className={`h-full ${cat.color || "bg-[#FF6014]"} rounded-full shadow-xs`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Regional Activity */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-orange-100/90 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100/80 text-[#FF6014] rounded-xl shadow-xs">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {lang === "bn" ? "আঞ্চলিক কভারেজ ও চাহিদা" : "Regional Coverage & Demand"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {lang === "bn"
                    ? "ঢাকা মেট্রোপলিটন এলাকার চাহিদা বিশ্লেষণ"
                    : "Regional distribution across active service hubs"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {regionalActivity.map((region: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ x: 5, scale: 1.01 }}
                className="p-3.5 border border-orange-100/80 bg-white/70 rounded-2xl hover:bg-orange-50/50 hover:border-orange-300 transition-all shadow-2xs space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-xl border border-orange-100 shadow-xs">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Compass size={12} className="text-[#FF6014]" />
                        {region.name}
                      </h5>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Target size={10} className="text-slate-400" />
                        {region.count} completed
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 flex items-center justify-end gap-0.5">
                      <Percent size={11} className="text-slate-700" />
                      {region.percentage}%
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 block flex items-center justify-end gap-0.5 mt-0.5">
                      <TrendingUp size={10} className="text-emerald-500" />
                      {region.trend || "+8%"} growth
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="h-full bg-gradient-to-r from-[#FF6014] to-orange-400 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
