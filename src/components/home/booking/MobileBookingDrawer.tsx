"use client";

import React, { useEffect } from "react";
import { X, Calendar, ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

interface MobileBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  onUpdateQuantity: (subId: number, delta: number) => void;
  onRemoveFromCart: (subId: number) => void;
  onClearCart: () => void;
}

export function MobileBookingDrawer({
  isOpen, onClose, cartItems, cartItemCount, cartTotal, payableTotal,
  appliedCoupon, setAppliedCoupon, bookingDetails, setBookingDetails,
  isBooking, onSubmit, serviceId, onUpdateQuantity, onRemoveFromCart, onClearCart,
}: MobileBookingDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 240 }} className="relative bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[32px] shadow-2xl max-h-[90dvh] md:max-h-[85vh] flex flex-col overflow-hidden z-10 border-t md:border border-slate-100">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0 md:hidden" />

            <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-[#FF6014]" />
                Complete Booking Info
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-5 space-y-5 [&::-webkit-scrollbar]:w-0.5">
                {cartItems.length > 0 && (
                  <div className="bg-[#FFF8F4] border border-[#FF6014]/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-[#FF6014] uppercase tracking-wider pb-2 border-b border-[#FF6014]/10">
                      <span className="flex items-center gap-1"><ShoppingCart size={12} />Selected Services ({cartItemCount})</span>
                      <button type="button" onClick={onClearCart} className="text-slate-400 hover:text-rose-500">Clear All</button>
                    </div>
                    <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                      {cartItems.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-start gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-700 truncate">{item.name}</p>
                            <p className="text-slate-400 font-semibold truncate text-[10px]">{item.parentTitle}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-0.5 bg-white border border-slate-100 rounded-lg p-0.5">
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
                    <div className="pt-2 border-t border-[#FF6014]/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600 font-semibold"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Coupon ({appliedCoupon.coupon.code})</span>
                          <span>-₹{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-black text-slate-800 pt-1.5 border-t border-slate-100">
                        <span>Total Price</span><span className="text-[#FF6014] text-base">₹{payableTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <CouponApply subtotal={cartTotal} serviceId={serviceId} onApplied={setAppliedCoupon} />
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-1 w-full animate-none">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date *</label>
                      <CustomCalendar value={bookingDetails.date ? dayjs(bookingDetails.date) : null} onChange={(date) => setBookingDetails({ ...bookingDetails, date: date ? date.format("YYYY-MM-DD") : "" })} placeholder="Select Date" minDate={dayjs()} className="w-full" />
                    </div>
                    <div className="space-y-1 w-full animate-none">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
                      <CustomSelect options={TIME_SLOT_OPTIONS} value={bookingDetails.time} onChange={(val) => setBookingDetails({ ...bookingDetails, time: val })} placeholder="Select Time" className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address *</label>
                    <textarea required rows={2} placeholder="Enter your street address, house no, area..." value={bookingDetails.location} onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })} className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs sm:text-sm rounded-2xl p-3 outline-none transition-all font-semibold resize-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                    <textarea rows={1} placeholder="Any specific requests or instructions..." value={bookingDetails.notes} onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })} className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs sm:text-sm rounded-2xl p-3 outline-none transition-all font-semibold resize-none" />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <button type="button" onClick={onClose} className="px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex-1">Cancel</button>
                <button type="submit" disabled={isBooking} className="px-6 py-3 text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl transition shadow-md disabled:opacity-70 flex-1 flex items-center justify-center gap-2 cursor-pointer">
                  {isBooking ? (<><Loader2 size={16} className="animate-spin" />Placing...</>) : "Confirm Booking"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
