"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { useGetOverviewStatsQuery } from "@/redux/features/admin/dashboardApi";
import { useGetAllProfilesQuery } from "@/redux/features/shared/profileApi";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { CustomTable } from "@/components/ui/table";
import RevenueChart from "./RevenueChart";
import StatsGrid from "./super-admin/StatsGrid";
import UserDemographics from "./super-admin/UserDemographics";
import BookingPipeline from "./super-admin/BookingPipeline";
import OperationalInsights from "./super-admin/OperationalInsights";
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Wallet,
  Activity,
  Clock,
  Calendar,
  User,
  Briefcase,
  Layers,
  CheckCircle2,
  ListFilter
} from "lucide-react";

export default function SuperAdminDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const lang = useAppSelector((state) => state.lang.value);

  const getLabel = (bn: string, hi: string, en: string) => {
    if (lang === "bn") return bn;
    if (lang === "hi") return hi;
    return en;
  };

  const { data: bookingsRes } = useGetAllBookingsQuery(undefined);
  const { data: overviewRes } = useGetOverviewStatsQuery();
  const { data: profilesRes } = useGetAllProfilesQuery(undefined);
  const { data: categoriesRes } = useGetAllCategoriesQuery(undefined);

  const allBookings = bookingsRes?.data || [];
  const overview = overviewRes?.data || {
    revenue: { total: 0, today: 0, weekly: 0, monthly: 0, chart: [] },
    users: { totalClients: 0, totalVendors: 0, totalAgents: 0 },
    bookings: { todayAssigned: 0, completed: 0, pending: 0 },
    withdraws: { totalAmount: 0, todayAmount: 0, weeklyAmount: 0, monthlyAmount: 0 }
  };

  const topVendors = [...(profilesRes?.data || [])]
    .filter((p: any) => p.company_name)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const dynamicChartData = overview.revenue.chart.map((c: any) => ({
    month: c.date,
    value: c.amount
  }));

  const recentBookings = [...allBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(b => ({
      id: String(b.id),
      customer: b.user?.name || "Unknown Customer",
      service: b.nestedService?.name || b.pkg?.name || "Service",
      provider: b.vendor?.name || b.vendor?.email || "Unassigned",
      amount: `₹${Number(b.total_price || 0).toLocaleString()}`,
      status: b.status,
      date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }));

  const adminColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-extrabold text-[#FF6014]">#{b.id}</span>
    },
    {
      key: "customer",
      header: "Customer",
      render: (b: any) => (
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <User size={12} className="text-[#FF6014]" />
          {b.customer}
        </span>
      )
    },
    {
      key: "service",
      header: "Service",
      render: (b: any) => (
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Layers size={11} className="text-slate-400" />
          {b.service}
        </span>
      )
    },
    {
      key: "provider",
      header: "Provider",
      render: (b: any) => (
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
          <Briefcase size={11} className="text-slate-400" />
          {b.provider}
        </span>
      )
    },
    {
      key: "amount",
      header: "Amount",
      render: (b: any) => (
        <span className="font-black text-slate-900 flex items-center gap-0.5">
          <Wallet size={12} className="text-[#FF6014]" />
          {b.amount}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${
            b.status === "completed"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              : b.status === "on_the_way"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
              : b.status === "assigned"
              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
              : b.status === "cancelled"
              ? "bg-red-50 text-red-700 border border-red-200/60"
              : "bg-slate-50 text-slate-700 border border-slate-200/60"
          }`}
        >
          <CheckCircle2 size={10} />
          {b.status.replace(/_/g, " ")}
        </span>
      )
    },
    {
      key: "date",
      header: "Date",
      render: (b: any) => (
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Calendar size={11} className="text-slate-400" />
          {b.date}
        </span>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Premium Header ── */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100/90 shadow-sm px-7 py-6 group"
      >
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-[#FF6014]/15 to-[#FFB3AD]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              {getLabel("লাইভ সিস্টেম ওভারভিউ", "लाइव सिस्टम अवलोकन", "Live System Overview")}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
              {getLabel("হ্যালো", "नमस्ते", "Hello")}, <span className="text-[#FF6014]">{authUser?.name || "Admin"}</span>!
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm font-semibold flex items-center gap-1.5">
              <Activity size={14} className="text-[#FF6014]" />
              {getLabel("রাজসেবার রিয়েল-টাইম পরিসংখ্যান এবং অ্যাডমিন ইনসাইট।", "राजसेबा के लिए वास्तविक समय के आंकड़े और प्रशासनिक अंतर्दृष्टि।", "Real-time statistics and administrative insights for Rajseba.")}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Calendar size={12} className="text-[#FF6014]" />
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                <Clock size={10} className="text-slate-400" />
                Bangladesh Standard Time
              </span>
            </div>
            <div className="w-px h-8 bg-slate-100 hidden sm:block" />
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6014] to-[#E0530A] flex items-center justify-center shadow-lg shadow-[#FF6014]/25 cursor-pointer"
            >
              <Sparkles size={18} className="text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Key Performance Metrics (Revenue & Withdrawals) ── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mt-2 px-1">
        <h2 className="text-base font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
          <DollarSign size={18} className="text-[#FF6014]" />
          Financial Overview
        </h2>
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatsGrid overview={overview} />
      </motion.div>

      {/* ── User & Booking Metrics ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        <UserDemographics users={overview.users} />
        <BookingPipeline bookings={overview.bookings} />
      </motion.div>

      {/* ── Revenue Chart & Platform Insights Grid ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Chart Column (2/3 width) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100/90 shadow-sm hover:border-[#FF6014]/20 hover:shadow-xl hover:shadow-[#FF6014]/5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#FF6014]" />
                  Revenue Trends
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold flex items-center gap-1">
                  <Clock size={11} className="text-slate-400" />
                  Daily breakdown (Last 7 Days)
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-extrabold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-b from-[#FF6014] to-[#FFBAB4]" />
                  Revenue
                </div>
              </div>
            </div>
            <div className="px-4 pt-4 pb-2">
              <RevenueChart data={dynamicChartData} />
            </div>
          </div>
          <div className="mx-6 mb-6 mt-2 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/70 rounded-2xl border border-slate-100/90 overflow-hidden">
            {[
              { label: "This Month Rev", value: `₹${overview.revenue.monthly.toLocaleString()}`, accent: "text-[#FF6014]", icon: Calendar },
              { label: "This Week Rev", value: `₹${overview.revenue.weekly.toLocaleString()}`, accent: "text-indigo-500", icon: Clock },
              { label: "Month Withdraws", value: `₹${overview.withdraws.monthlyAmount.toLocaleString()}`, accent: "text-emerald-500", icon: Wallet },
              { label: "Week Withdraws", value: `₹${overview.withdraws.weeklyAmount.toLocaleString()}`, accent: "text-amber-500", icon: DollarSign },
            ].map((s, i) => {
              const SubIcon = s.icon;
              return (
                <div key={i} className="text-center py-3 px-2">
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
                    <SubIcon size={10} className="text-slate-400" />
                    {s.label}
                  </p>
                  <p className={`text-sm font-black mt-1 ${s.accent}`}>{s.value}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Platform Insights / Activity Column (1/3 width) */}
        <OperationalInsights
          categoriesCount={categoriesRes?.data?.length || 0}
          totalVendorsRegistered={profilesRes?.data?.length || 0}
          topVendors={topVendors}
        />
      </motion.div>

      {/* Recent Bookings Table */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ListFilter size={18} className="text-[#FF6014]" />
            Recent Booking Log
          </h3>
          <Link href="/dashbord/manage-bookings" className="text-xs font-bold text-[#FF6014] hover:underline flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200/60 transition-colors">
            View All Bookings <ArrowUpRight size={14} />
          </Link>
        </div>
        <CustomTable
          columns={adminColumns}
          data={recentBookings}
          searchKey="customer"
          searchPlaceholder="Search bookings by customer..."
          pageSize={5}
        />
      </motion.div>
    </motion.div>
  );
}
