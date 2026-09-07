"use client";

import React from "react";
import { ShieldCheck, Award, Clock, Star, ShoppingCart, Trash2, X, Minus, Plus, Loader2, Calendar, ChevronRight } from "lucide-react";
import { CouponApply } from "@/components/home/booking/CouponApply";
import { CustomCalendar } from "@/components/ui/calendar";
import { CustomSelect } from "@/components/ui/select";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "@/redux/features/admin/booking";
import Link from "next/link";
import { toast } from "sonner";
import dayjs from "dayjs";

const TIME_SLOT_OPTIONS = [
  { value: "08:00 AM", label: "08:00 AM", desc: "Morning Slot" },
  { value: "09:00 AM", label: "09:00 AM", desc: "Morning Slot" },
  { value: "10:00 AM", label: "10:00 AM", desc: "Morning Slot" },
  { value: "11:00 AM", label: "11:00 AM", desc: "Morning Slot" },
  { value: "12:00 PM", label: "12:00 PM", desc: "Noon Slot" },
  { value: "01:00 PM", label: "01:00 PM", desc: "Noon Slot" },
  { value: "02:00 PM", label: "02:00 PM", desc: "Afternoon Slot" },
  { value: "03:00 PM", label: "03:00 PM", desc: "Afternoon Slot" },
  { value: "04:00 PM", label: "04:00 PM", desc: "Late Afternoon Slot" },
  { value: "05:00 PM", label: "05:00 PM", desc: "Evening Slot" },
  { value: "06:00 PM", label: "06:00 PM", desc: "Evening Slot" },
  { value: "07:00 PM", label: "07:00 PM", desc: "Night Slot" },
  { value: "08:00 PM", label: "08:00 PM", desc: "Night Slot" },
  { value: "09:00 PM", label: "09:00 PM", desc: "Night Slot" },
];

const trustPoints = [
  { icon: ShieldCheck, text: "Insured and bonded work" },
  { icon: Award, text: "License verified experts" },
  { icon: Clock, text: "On-time guarantee" },
  { icon: Star, text: "98% satisfaction rate" },
];

interface BookingSidebarProps {
  cartItems: any[];
  cartItemCount: number;
  cartTotal: number;
  payableTotal: number;
  appliedCoupon: ValidateCouponResult | null;
  setAppliedCoupon: (coupon: ValidateCouponResult | null) => void;
  bookingDetails: { date: string; time: string; location: string; notes: string };
  setBookingDetails: (details: any) => void;
  isBooking: boolean;
  onSubmit: (e: React.FormEvent) => void;
  serviceId: number;
  serviceImage?: string;
  serviceName?: string;
  onUpdateQuantity: (subId: number, delta: number) => void;
  onRemoveFromCart: (subId: number) => void;
  onClearCart: () => void;
}

export function DesktopBookingSidebar({
  cartItems, cartItemCount, cartTotal, payableTotal, appliedCoupon, setAppliedCoupon,
  bookingDetails, setBookingDetails, isBooking, onSubmit, serviceId, serviceImage,
  serviceName, onUpdateQuantity, onRemoveFromCart, onClearCart,
}: BookingSidebarProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: bookingsRes } = useGetAllBookingsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
  });
  const [updateStatus] = useUpdateBookingStatusMutation();

  const allBookings = bookingsRes?.data || [];
  const activeBookings = allBookings.filter(
    (b: any) => b.status === "pending" || b.status === "assigned" || b.status === "on_the_way"
  );

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await updateStatus({ id, status: "cancelled" }).unwrap();
      toast.success("Booking cancelled successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel booking.");
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-700 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">PENDING</span>;
      case "assigned":
        return <span className="bg-blue-100 text-blue-700 border border-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">ASSIGNED</span>;
      case "on_the_way":
        return <span className="bg-purple-100 text-purple-700 border border-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">ON THE WAY</span>;
      case "completed":
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">COMPLETED</span>;
      case "cancelled":
        return <span className="bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">CANCELLED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">{status}</span>;
    }
  };

  const renderActiveBookingsCards = () => {
    if (!isAuthenticated || activeBookings.length === 0) return null;

    return (
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
              Active Placed Bookings ({activeBookings.length})
            </h4>
          </div>
          <Link href="/bookings" className="text-[11px] font-bold text-[#FF6014] hover:underline flex items-center gap-0.5">
            View All <ChevronRight size={12} />
          </Link>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
          {activeBookings.map((b: any) => {
            const title = b.nestedService?.name || b.pkg?.name || b.service?.name || "Premium Home Service";
            const formattedDate = b.date ? dayjs(b.date).format("MMM D, YYYY") : "Pending Date";
            const price = b.total_price || b.subtotal || 0;

            return (
              <div
                key={b.id}
                className="group relative bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 hover:to-orange-50/60 border border-amber-200/80 hover:border-[#FF6014]/60 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col gap-2.5"
              >
                {/* Top row: Icon, Title & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm shadow-3xs group-hover:scale-105 transition-transform">
                      📄
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-slate-800 text-xs truncate group-hover:text-[#FF6014] transition-colors">
                        {title}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-slate-400" />
                          {formattedDate}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[110px]">
                          {b.employees && b.employees.length > 0 ? b.employees[0]?.name : "Expert assignment pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {renderStatusBadge(b.status)}
                </div>

                {/* Bottom row: Price & View Details Link */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-100/60">
                  <div className="text-left">
                    {price > 0 ? (
                      <span className="font-black text-[#FF6014] text-xs">
                        ₹{Number(price).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Order #{b.id}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Cancel Booking"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <Link
                      href={`/dashbord/bookings/track/${b.id}`}
                      className="inline-flex items-center gap-1 bg-white hover:bg-[#FFF8F4] text-slate-700 hover:text-[#FF6014] border border-slate-200 hover:border-[#FF6014]/40 px-3 py-1 rounded-xl text-xs font-extrabold shadow-3xs transition-all cursor-pointer"
                    >
                      View Details <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShoppingCart size={18} className="text-[#FF6014]" />
          <h3 className="font-black text-slate-900 text-sm md:text-base">Booking Summary</h3>
        </div>
        <div className="bg-[#FFF8F4] border border-[#FF6014]/10 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-slate-500">Select services from the list to start booking.</p>
        </div>

        {/* Placed Active Bookings Cards Section */}
        {renderActiveBookingsCards()}

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6014]">Why Choose Rajseba</p>
          <div className="space-y-3.5">
            {trustPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFF8F4] rounded-xl flex items-center justify-center shrink-0 border border-[#FF6014]/10">
                  <Icon className="w-4 h-4 text-[#FF6014]" />
                </div>
                <span className="text-sm text-slate-600 font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xl space-y-5 max-h-[calc(100vh-170px)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-rose-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-black text-slate-900 flex items-center gap-2">
          <ShoppingCart size={18} className="text-[#FF6014]" />
          Booking Summary
        </h3>
        <button type="button" onClick={onClearCart} className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer">
          <Trash2 size={13} />Clear All
        </button>
      </div>

      {/* E-Commerce Shopping Cart Style Selected Service Cards */}
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
        {cartItems.map((item: any) => (
          <div
            key={item.id}
            className="group relative bg-gradient-to-r from-slate-50/90 to-orange-50/20 hover:from-white hover:to-orange-50/40 border border-slate-200/90 hover:border-[#FF6014]/40 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col gap-2.5"
          >
            {/* Header: Service Name, Subtitle & Delete Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6014]/15 to-orange-100 text-[#FF6014] flex items-center justify-center shrink-0 font-bold text-sm shadow-3xs group-hover:scale-105 transition-transform">
                  🛠️
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-800 text-xs truncate group-hover:text-[#FF6014] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 truncate">
                    {item.parentTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFromCart(item.id)}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Remove service"
              >
                <X size={14} />
              </button>
            </div>

            {/* Bottom: Quantity Controls & Price */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl p-0.5 shadow-3xs">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-5 h-5 rounded-lg text-[#FF6014] hover:bg-orange-50 flex items-center justify-center transition cursor-pointer"
                >
                  <Minus size={10} strokeWidth={3} />
                </button>
                <span className="w-6 text-center text-xs font-black text-slate-800">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-5 h-5 rounded-lg text-[#FF6014] hover:bg-orange-50 flex items-center justify-center transition cursor-pointer"
                >
                  <Plus size={10} strokeWidth={3} />
                </button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">
                  ₹{Number(item.price).toLocaleString()} × {item.quantity}
                </span>
                <span className="font-black text-[#FF6014] text-xs">
                  ₹{(Number(item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1 space-y-2">
        <CouponApply subtotal={cartTotal} serviceId={serviceId} onApplied={setAppliedCoupon} />
      </div>

      {/* E-Commerce Order Price Summary */}
      <div className="bg-gradient-to-br from-[#FFF8F4] to-orange-50/40 rounded-2xl p-4 border border-[#FF6014]/20 space-y-2 text-xs shadow-2xs">
        <div className="flex justify-between items-center text-slate-600 font-semibold">
          <span>Subtotal ({cartItemCount} item{cartItemCount === 1 ? "" : "s"})</span>
          <span className="font-bold text-slate-800">₹{cartTotal.toLocaleString()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80">
            <span className="flex items-center gap-1">🎉 Coupon ({appliedCoupon.coupon.code})</span>
            <span>-₹{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-slate-600 font-semibold">
          <span>Service Inspection Fee</span>
          <span className="text-emerald-600 font-bold">FREE</span>
        </div>
        <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-200/80">
          <span>Total Payable Amount</span>
          <span className="text-[#FF6014] text-base font-black">₹{payableTotal.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3 items-end">
          <div className="space-y-1 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date *</label>
            <CustomCalendar value={bookingDetails.date ? dayjs(bookingDetails.date) : null} onChange={(date) => setBookingDetails({ ...bookingDetails, date: date ? date.format("YYYY-MM-DD") : "" })} placeholder="Select Date" minDate={dayjs()} className="w-full" />
          </div>
          <div className="space-y-1 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
            <CustomSelect options={TIME_SLOT_OPTIONS} value={bookingDetails.time} onChange={(val) => setBookingDetails({ ...bookingDetails, time: val })} placeholder="Select Time" className="w-full" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address *</label>
          <textarea required rows={2} placeholder="Street address, house no, area..." value={bookingDetails.location} onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })} className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs rounded-2xl p-3 outline-none transition-all font-semibold resize-none" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</label>
          <textarea rows={1} placeholder="Specific requests..." value={bookingDetails.notes} onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })} className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs rounded-2xl p-3 outline-none transition-all font-semibold resize-none" />
        </div>

        <button type="submit" disabled={isBooking} className="w-full py-3.5 mt-2 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold rounded-2xl text-sm transition-all shadow-md shadow-rose-100 hover:shadow-lg cursor-pointer flex items-center justify-center gap-2">
          {isBooking ? (<><Loader2 size={16} className="animate-spin" />Placing Booking...</>) : (`Book ${cartItemCount} Service${cartItemCount === 1 ? "" : "s"}`)}
        </button>
      </form>

      {/* Placed Active Bookings Cards Section */}
      {renderActiveBookingsCards()}
    </div>
  );
}

