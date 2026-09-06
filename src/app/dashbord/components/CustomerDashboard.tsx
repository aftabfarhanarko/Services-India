"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { CustomTable } from "@/components/ui/table";
import {
  Clock,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Plus,
  MessageCircle,
  MapPin,
} from "lucide-react";

export default function CustomerDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const { data: bookingsRes } = useGetAllBookingsQuery();
  const myBookings = bookingsRes?.data || [];

  const activeBookings = myBookings.filter(
    (b: any) => b.status === "assigned" || b.status === "on_the_way" || b.status === "pending"
  );
  const completedBookings = myBookings.filter((b: any) => b.status === "completed");
  const totalSpent = completedBookings.reduce(
    (sum: number, b: any) => sum + Number(b.total_price || 0),
    0
  );

  const stats = [
    {
      label: "Active Orders",
      value: `${activeBookings.length} Service(s)`,
      desc: activeBookings.length > 0 ? "Provider is assigned" : "No active orders",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Completed Bookings",
      value: `${completedBookings.length} Service(s)`,
      desc: "Expert home care received",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      desc: "Lifetime expenditure",
      icon: DollarSign,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: "Active Promos",
      value: "3 Available",
      desc: "Up to 20% off next booking",
      icon: Sparkles,
      color: "text-[#E0530A] bg-[#FFF8F4]",
    },
  ];

  const customerBookings = [...myBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((b) => ({
      id: `RS-${b.id}`,
      service: b.service?.name || "Custom Service",
      provider: b.vendor?.name || "Pending Assignment",
      amount: `₹${b.total_price || 0}`,
      date: new Date(b.createdAt).toLocaleDateString(),
      status: b.status,
      vendorId: b.vendor?.id,
    }));

  const customerColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">{b.id}</span>,
    },
    { key: "service", header: "Service Booked" },
    { key: "provider", header: "Expert Provider" },
    { key: "amount", header: "Amount Paid" },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
            b.status === "completed"
              ? "bg-emerald-50 text-emerald-700"
              : b.status === "cancelled"
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {b.status.replace("_", " ")}
        </span>
      ),
    },
    { key: "date", header: "Date Completed" },
    {
      key: "actions",
      header: "Actions",
      render: (b: any) =>
        b.vendorId ? (
          <button
            onClick={() =>
              router.push(
                `/dashbord/live-chat?receiverId=${b.vendorId}&receiverName=${encodeURIComponent(
                  b.provider
                )}`
              )
            }
            className="text-xs bg-[#FFF8F4] text-[#FF6014] px-3 py-1.5 rounded-lg font-bold hover:bg-[#FFF0EB] transition-colors"
          >
            Chat Provider
          </button>
        ) : (
          <span className="text-xs text-slate-400">Waiting for provider</span>
        ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[#FF6014]/10 to-amber-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              Client Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-[#FF6014]">{authUser?.name || "Client"}</span>!
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">
              Keep track of your active services and book premium care for your home.
            </p>
          </div>
          <button className="shrink-0 bg-gradient-to-br from-[#FF6014] to-[#E0530A] hover:from-[#E0530A] hover:to-[#CC5049] text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#FF6014]/25 text-sm transition-all active:scale-[0.985] flex items-center gap-2">
            <Plus size={16} /> Book a New Service
          </button>
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

      {/* Tracking Active Booking & Quick Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Booking Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Active Service Tracker</h3>
            <span className="text-xs text-[#FF6014] font-semibold bg-[#FFF8F4] px-2.5 py-1 rounded-lg">
              Real-time update
            </span>
          </div>

          {activeBookings.length > 0 ? (
            activeBookings.map((activeBooking: any) => (
              <div key={activeBooking.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Booking ID</span>
                    <p className="text-base font-bold text-[#FF6014]">RS-{activeBooking.id}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Service Category</span>
                    <p className="text-base font-bold text-slate-800">
                      {activeBooking.service?.name || "Service"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Provider</span>
                    <p className="text-base font-bold text-slate-800">{activeBooking.vendor?.name || "Pending..."}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Timeline</p>
                    <div className="flex items-center gap-2">
                      {activeBooking.vendor?.id && (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashbord/live-chat?receiverId=${activeBooking.vendor.id}&receiverName=${encodeURIComponent(
                                activeBooking.vendor.name
                              )}`
                            )
                          }
                          className="bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#FF6014] border border-[#FF6014]/20 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <MessageCircle size={14} /> Chat
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/dashbord/bookings/track/${activeBooking.id}`)}
                        className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <MapPin size={14} /> Track Flow
                      </button>
                    </div>
                  </div>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FFF0EB]">
                    {[
                      {
                        title: "Booking Confirmed",
                        desc: "Your booking was accepted.",
                        done: true,
                        current: activeBooking.status === "pending",
                      },
                      {
                        title: "Expert Assigned",
                        desc: "A provider has been assigned.",
                        done: activeBooking.status === "assigned" || activeBooking.status === "on_the_way",
                        current: activeBooking.status === "assigned",
                      },
                      {
                        title: "En Route / Travelling",
                        desc: "Technician will start journey to your address",
                        done: activeBooking.status === "on_the_way",
                        current: activeBooking.status === "on_the_way",
                      },
                      {
                        title: "Service Complete",
                        desc: "Final verification and payment completion",
                        done: false,
                        current: false,
                      },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <span
                          className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 ring-white ${
                            step.done
                              ? "bg-[#FF6014] border-[#FF6014]"
                              : step.current
                              ? "bg-[#FF6014] border-[#FF6014] animate-pulse"
                              : "bg-slate-200 border-slate-200"
                          }`}
                        />
                        <div>
                          <h5
                            className={`text-sm font-semibold ${
                              step.done || step.current ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {step.title}
                          </h5>
                          <p className={`text-xs ${step.done || step.current ? "text-slate-500" : "text-slate-400"}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2">
              <p className="text-sm font-bold text-slate-500">No active bookings right now</p>
              <p className="text-xs text-slate-400">Book a new service and track its real-time progress here.</p>
            </div>
          )}
        </div>

        {/* Promo Code Banners */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Active Offers</h3>

          <div className="space-y-4">
            {[
              { code: "ACCOOL20", discount: "20% OFF", service: "Valid on AC Repairs", expiry: "Exp: June 30" },
              { code: "CLEANHOMY", discount: "₹500 OFF", service: "Valid on Deep Cleaning", expiry: "Exp: July 05" },
            ].map((promo, i) => (
              <div key={i} className="p-4 bg-[#FFF8F4] border border-[#FFF0EB]/50 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-[#FF6014]/5 rounded-bl-full flex items-center justify-center font-bold text-[#FF6014] text-xs">
                  %
                </div>
                <span className="text-xs font-bold text-[#E0530A] tracking-wider bg-[#FFF0EB]/60 px-2 py-0.5 rounded-lg">
                  {promo.code}
                </span>
                <h4 className="text-lg font-bold text-slate-800 mt-2">{promo.discount}</h4>
                <p className="text-xs text-slate-500 mt-1">{promo.service}</p>
                <span className="text-[10px] text-slate-400 mt-3 block font-semibold">{promo.expiry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <h3 className="text-lg font-bold text-slate-900">Booking History</h3>
        </div>
        <CustomTable
          columns={customerColumns}
          data={customerBookings}
          searchKey="service"
          searchPlaceholder="Search bookings by service..."
          pageSize={5}
        />
      </div>
    </div>
  );
}
