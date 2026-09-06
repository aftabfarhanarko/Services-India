"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, X, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
import { useGetPublicProfilesQuery } from "@/redux/features/landing/landingApi";
import { getFallbackVendorId } from "@/utils/vendorResolution";
import { CouponApply } from "@/components/home/booking/CouponApply";
import { DisplayPackage } from "./packageOfferUtils";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { CustomCalendar } from "@/components/ui/calendar";
import { CustomSelect } from "@/components/ui/select";

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

export function PackageBookingModal({
  selectedPackage,
  onClose,
  onSuccess,
}: {
  selectedPackage: DisplayPackage | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const { data: profilesRes } = useGetPublicProfilesQuery();
  const authUser = useAppSelector((state) => state.auth.user);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [packageQuantity, setPackageQuantity] = useState(1);
  const [packageDuration, setPackageDuration] = useState(1);
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(
    null
  );

  // Disable body scroll when modal is open on mobile
  useEffect(() => {
    if (selectedPackage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPackage]);

  if (!selectedPackage) return null;

  const packageUnitPrice = selectedPackage.price
    ? Number(String(selectedPackage.price).replace(/,/g, ""))
    : 0;
  const packageSubtotal = packageUnitPrice * packageQuantity * packageDuration;
  const packagePayableTotal = appliedCoupon
    ? appliedCoupon.final_price
    : packageSubtotal;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser) {
      toast.error("Please login to place a booking.");
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!bookingDetails.date || !bookingDetails.location) {
      toast.error("Booking Date and Service Location are required!");
      return;
    }

    const payload = {
      user_id: Number(authUser?.id),
      package_id: Number(selectedPackage.id),
      service_id: Number(selectedPackage.serviceId),
      vendor_id: Number(selectedPackage.vendorId || getFallbackVendorId(profilesRes)),
      quantity: packageQuantity,
      duration_months: packageDuration,
      coupon_code: appliedCoupon?.coupon.code,
      date: bookingDetails.date,
      time: bookingDetails.time || undefined,
      location: bookingDetails.location,
      notes: bookingDetails.notes || undefined,
    };

    console.log("Submitting Package Booking Payload:", payload);

    try {
      await createBooking(payload).unwrap();
      toast.success("Your package booking has been placed successfully!");
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error("Package booking submission error details:", err);
      const errorMsg = err?.data?.message || err?.message || JSON.stringify(err) || "Unknown error";
      toast.error(`Failed to place booking: ${errorMsg}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      {/* Sheet / Modal Container */}
      <motion.div
        initial={{ y: "100%", scale: 1 }}
        className="relative bg-white w-full sm:max-w-lg sm:rounded-[32px] rounded-t-[32px]
          shadow-2xl overflow-hidden border border-slate-100 max-h-[92dvh] sm:max-h-[90vh] flex flex-col z-10"
        breakpoints-class="sm:animate-in sm:zoom-in-95"
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 230 }}
      >
        {/* Grab handle indicator for mobile */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0 sm:hidden" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar size={18} className="text-[#FF6014]" />
            Complete Booking Info
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
          {/* Selected Package Details */}
          <div className="bg-[#FFF8F4] border border-[#FF6014]/10 rounded-2xl p-4 space-y-3 text-xs">
            <div className="text-[10px] font-bold text-[#FF6014] uppercase tracking-wider">
              Selected Package
            </div>
            <div className="flex justify-between items-center text-sm font-black text-slate-800">
              <span>{selectedPackage.title}</span>
              {selectedPackage.price && (
                <span className="text-[#FF6014] text-base">
                  ₹{packagePayableTotal.toLocaleString()}
                </span>
              )}
            </div>
            {appliedCoupon && (
              <p className="text-[10px] font-bold text-emerald-600">
                Coupon {appliedCoupon.coupon.code} applied — saved ₹
                {Number(appliedCoupon.discount_amount).toLocaleString()}
              </p>
            )}
          </div>

          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <CouponApply
              subtotal={packageSubtotal}
              serviceId={selectedPackage.serviceId}
              packageId={selectedPackage.id}
              onApplied={setAppliedCoupon}
            />

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPackageQuantity((qty) => Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-xl border border-slate-200 text-[#FF6014] font-black hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="w-10 text-center text-base font-black text-slate-800">
                  {packageQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setPackageQuantity((qty) => qty + 1)}
                  className="w-9 h-9 rounded-xl border border-slate-200 text-[#FF6014] font-black hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Duration
              </label>
              <CustomSelect
                options={[
                  { value: "1", label: "1 Month" },
                  { value: "3", label: "3 Months" },
                  { value: "6", label: "6 Months" },
                  { value: "12", label: "1 Year" },
                ]}
                value={String(packageDuration)}
                onChange={(val) => setPackageDuration(Number(val))}
                placeholder="Select Duration"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="space-y-1 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Booking Date *
                </label>
                <CustomCalendar
                  value={bookingDetails.date ? dayjs(bookingDetails.date) : null}
                  onChange={(date) =>
                    setBookingDetails({
                      ...bookingDetails,
                      date: date ? date.format("YYYY-MM-DD") : "",
                    })
                  }
                  placeholder="Select Date"
                  minDate={dayjs()}
                  className="w-full"
                />
              </div>
              <div className="space-y-1 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Booking Time
                </label>
                <CustomSelect
                  options={TIME_SLOT_OPTIONS}
                  value={bookingDetails.time}
                  onChange={(val) => setBookingDetails({ ...bookingDetails, time: val })}
                  placeholder="Select Time"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Service Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Enter your street address, house no, area..."
                value={bookingDetails.location}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, location: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none transition font-semibold resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Additional Notes
              </label>
              <textarea
                rows={1}
                placeholder="Any specific requests or requirements..."
                value={bookingDetails.notes}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, notes: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none transition font-semibold resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBooking}
                className="px-6 py-3 text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
              >
                {isBooking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Placing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
