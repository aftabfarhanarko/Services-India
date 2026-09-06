"use client";

import React from "react";
import { ShieldCheck, Award, Clock, Star, ShoppingCart, Trash2, X, Minus, Plus, Loader2 } from "lucide-react";
import { CouponApply } from "@/components/home/booking/CouponApply";
import { CustomCalendar } from "@/components/ui/calendar";
import { CustomSelect } from "@/components/ui/select";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
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
        <div className="space-y-4">
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

      <div className="space-y-3 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-thumb]:bg-slate-200">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex justify-between items-start gap-3 text-xs pb-3 border-b border-slate-50 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-700 truncate">{item.name}</p>
              <p className="text-slate-400 font-semibold truncate text-[10px]">{item.parentTitle}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                <button type="button" onClick={() => onUpdateQuantity(item.id, -1)} className="w-5 h-5 rounded-md text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"><Minus size={10} strokeWidth={3} /></button>
                <span className="w-5 text-center text-[10px] font-black text-slate-800">{item.quantity}</span>
                <button type="button" onClick={() => onUpdateQuantity(item.id, 1)} className="w-5 h-5 rounded-md text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"><Plus size={10} strokeWidth={3} /></button>
              </div>
              <span className="font-black text-slate-700 min-w-[3.5rem] text-right">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
              <button type="button" onClick={() => onRemoveFromCart(item.id)} className="text-slate-400 hover:text-rose-500 transition cursor-pointer"><X size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 space-y-2">
        <CouponApply subtotal={cartTotal} serviceId={serviceId} onApplied={setAppliedCoupon} />
      </div>

      <div className="bg-[#FFF8F4] rounded-2xl p-4 border border-[#FF6014]/10 space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-600 font-semibold">
          <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-600 font-bold">
            <span>Coupon ({appliedCoupon.coupon.code})</span>
            <span>-₹{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm font-black text-slate-800 pt-2 border-t border-slate-200/50">
          <span>Total Price</span>
          <span className="text-[#FF6014] text-base">₹{payableTotal.toLocaleString()}</span>
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
    </div>
  );
}
