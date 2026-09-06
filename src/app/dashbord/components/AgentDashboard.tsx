"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { CustomTable } from "@/components/ui/table";
import {
  Briefcase,
  Zap,
  DollarSign,
  Clock,
} from "lucide-react";

export default function AgentDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);

  const { data: bookingsRes } = useGetAllBookingsQuery();

  const myBookings =
    bookingsRes?.data?.filter(
      (b: any) => b.agent?.id === authUser?.id || b.user?.agent?.id === authUser?.id
    ) || [];

  const totalBookings = myBookings.length;
  const thisWeekBookings = myBookings.filter((b: any) => {
    const bookingDate = new Date(b.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - bookingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const totalOrderVolume = myBookings.reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0);
  const totalCommission = myBookings.reduce(
    (sum: number, b: any) =>
      sum +
      (Number(b.total_price || 0) *
        Number(b.service?.agent_commission_percentage || authUser?.commission_percentage || 0)) /
        100,
    0
  );

  const stats = [
    {
      label: "Bookings Placed",
      value: `${totalBookings} Orders`,
      desc: `${thisWeekBookings} active this week`,
      icon: Briefcase,
      color: "text-[#E0530A] bg-[#FFF8F4]",
    },
    {
      label: "Total Order Volume",
      value: `₹${totalOrderVolume.toLocaleString()}`,
      desc: "Lifetime booking value",
      icon: Zap,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Est. Commission",
      value: `₹${totalCommission.toLocaleString()}`,
      desc: "Total potential earnings",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Wallet Balance",
      value: `₹${authUser?.wallet_balance || 0}`,
      desc: "Available for withdrawal",
      icon: Clock,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  const agentOrders = [...myBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map((b) => ({
      id: `RS-${b.id}`,
      customer: b.user?.name || "Unknown",
      service: b.service?.name || "Custom Service",
      amount: `₹${b.total_price}`,
      commission: `₹${
        (Number(b.total_price || 0) *
          Number(b.service?.agent_commission_percentage || authUser?.commission_percentage || 0)) /
        100
      }`,
      status: b.status,
      date: new Date(b.createdAt).toLocaleDateString(),
    }));

  const agentColumns = [
    {
      key: "id",
      header: "Order ID",
      render: (o: any) => <span className="font-bold text-brand-primary">{o.id}</span>,
    },
    { key: "customer", header: "Client" },
    { key: "service", header: "Service" },
    { key: "amount", header: "Price" },
    {
      key: "commission",
      header: "Commission",
      render: (o: any) => <span className="font-bold text-emerald-600">+{o.commission}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (o: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
            o.status === "completed"
              ? "bg-emerald-50 text-emerald-700"
              : o.status === "cancelled"
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {o.status.replace("_", " ")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-indigo-100/50 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              Agent Partner
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agent Partner Desk</h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">
              Hello, <span className="text-slate-600 font-semibold">{authUser?.name || "Agent"}</span>! Book services on
              behalf of clients and track your commissions.
            </p>
          </div>
          <Link
            href="/dashbord/quick-booking"
            className="shrink-0 bg-gradient-to-br from-[#FF6014] to-[#E0530A] hover:from-[#E0530A] hover:to-[#CC5049] text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#FF6014]/25 text-sm transition-all active:scale-[0.985] text-center flex items-center gap-2 w-fit"
          >
            <Zap size={15} /> Quick Booking Console
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 sm:gap-4 hover:shadow-lg hover:shadow-slate-100/80 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <div
                className={`p-2.5 sm:p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-200 shrink-0`}
              >
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 font-semibold truncate">{stat.label}</p>
                <h4 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 leading-tight tracking-tight">
                  {stat.value}
                </h4>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block font-medium leading-tight">
                  {stat.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commission Analytics & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
            <h3 className="text-lg font-bold text-slate-900">Recent Placed Orders</h3>
            <Link href="/dashbord/orders" className="text-xs font-semibold text-[#FF6014] hover:underline">
              View All Orders
            </Link>
          </div>
          <CustomTable
            columns={agentColumns}
            data={agentOrders}
            searchKey="customer"
            searchPlaceholder="Search orders..."
            pageSize={5}
          />
        </div>

        {/* Commission Tier */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Commission Tier</h3>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>Current Default Rate</span>
              <span className="text-[#FF6014] text-sm">{authUser?.commission_percentage || 0}% Commission</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF6014] rounded-full w-3/4" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Complete 26 more bookings to unlock **18% Silver Partner commission** rate!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">Partner Benefits</h4>
            <div className="space-y-2">
              {[
                { title: "Direct Payouts", desc: "Withdraw to bKash instantly" },
                { title: "Custom Agent Coupons", desc: "Offer 5% off to your clients" },
              ].map((b, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <span className="text-[#FF6014] font-bold">✓</span>
                  <div>
                    <h5 className="font-semibold text-slate-800">{b.title}</h5>
                    <p className="text-slate-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
