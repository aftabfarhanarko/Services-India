"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetBookingByIdQuery } from "@/redux/features/admin/booking";
import { useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  User,
  Shield,
  MapPin,
  AlertCircle,
  MessageCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function DynamicBookingTracker() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const lang = useAppSelector((state) => state.lang.value);

  const { data, isLoading, error } = useGetBookingByIdQuery(id, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 3000, // Real-time automatic polling every 3 seconds
  });
  const booking = data?.data;

  const prevStatusRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (booking?.status && prevStatusRef.current && prevStatusRef.current !== booking.status) {
      const formattedStatus = booking.status.replace(/_/g, ' ').toUpperCase();
      toast.success(`Booking Status Updated: ${formattedStatus}`, {
        description: `Your booking #${booking.id} is now ${formattedStatus}`,
      });
    }
    if (booking?.status) {
      prevStatusRef.current = booking.status;
    }
  }, [booking?.status, booking?.id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF6014] border-t-transparent"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading live tracking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-rose-50 rounded-full text-rose-500 border border-rose-100">
          <AlertCircle size={36} className="stroke-[2.5]" />
        </div>
        <p className="text-slate-600 font-bold text-sm">
          {lang === "bn" ? "বুকিং পাওয়া যায়নি বা একটি ত্রুটি ঘটেছে।" : "Booking not found or an error occurred."}
        </p>
        <button
          onClick={() => router.back()}
          className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-black py-2.5 px-6 rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
        >
          {lang === "bn" ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    );
  }

  const steps = [
    {
      id: "pending",
      label: lang === "bn" ? "পেন্ডিং" : "Pending",
      desc: lang === "bn" ? "অর্ডার করা হয়েছে" : "Order Placed",
    },
    {
      id: "assigned",
      label: lang === "bn" ? "নিযুক্ত" : "Assigned",
      desc: lang === "bn" ? "কর্মী নিযুক্ত করা হয়েছে" : "Pro Assigned",
    },
    {
      id: "on_the_way",
      label: lang === "bn" ? "চলমান" : "On The Way",
      desc: lang === "bn" ? "কর্মী আসছে" : "Pro is coming",
    },
    {
      id: "completed",
      label: lang === "bn" ? "সম্পন্ন" : "Completed",
      desc: lang === "bn" ? "সার্ভিস সম্পন্ন" : "Service Done",
    },
  ];

  const rawStatus = (booking.status || "").toLowerCase().trim();
  const isCancelled = rawStatus === "cancelled";

  const statusMap: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    assigned: 1,
    on_the_way: 2,
    "on the way": 2,
    completed: 3,
  };

  const currentStepIndex = statusMap[rawStatus] ?? 0;

  return (
    <div className="w-full animate-in fade-in duration-300 pb-10 relative">
      {/* Background Ambient Glass Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6014]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-200/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-9/10 mx-auto space-y-6">

        {/* Top Header Row */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-[#FF6014] text-xs font-extrabold transition-all bg-white/90 backdrop-blur-md py-2.5 px-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <ArrowLeft size={15} /> {lang === "bn" ? "ফিরে যান" : "Back"}
          </button>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Real-Time
            </span>
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                {lang === "bn" ? "বুকিং আইডি" : "Booking ID"}
              </span>
              <span className="text-base font-black text-[#FF6014]">#{booking.id}</span>
            </div>
          </div>
        </motion.div>

        {/* Glassmorphic Main Tracker Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-[32px] border border-orange-100/80 shadow-xl shadow-[#FF6014]/5 space-y-8 relative overflow-hidden"
        >
          {/* Glass Card Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F4] border border-[#FF6014]/20 text-[11px] font-black text-[#FF6014] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "লাইভ ট্র্যাকিং" : "Live Service Status"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === "bn" ? "আপনার বুকিং ট্র্যাক করুন" : "Track Your Booking"}
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              {lang === "bn" ? "রিয়েল-টাইমে আপনার সার্ভিসের অগ্রগতি দেখুন" : "Keep an eye on your service progress in real-time"}
            </p>
          </div>

          {isCancelled ? (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-rose-50/80 backdrop-blur-md border border-rose-200/80 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 mx-auto shadow-sm">
                <AlertCircle size={26} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-600">
                  {lang === "bn" ? "বুকিং বাতিল করা হয়েছে" : "Booking Cancelled"}
                </h3>
                <p className="text-xs font-semibold text-rose-400 mt-0.5">
                  {lang === "bn" ? "এই বুকিংটি বাতিল করা হয়েছে এবং এটি আর প্রক্রিয়া করা হবে না।" : "This booking has been cancelled and will not proceed."}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="relative pt-4 pb-2">
              {/* Desktop Animated Stepper */}
              <div className="hidden sm:block">
                <div className="flex items-center justify-between relative z-10">
                  {steps.map((step, index) => {
                    const isCompleted = currentStepIndex > index;
                    const isActive = currentStepIndex === index;

                    return (
                      <div key={step.id} className="flex flex-col items-center relative w-1/4">
                        {/* Connecting Line */}
                        {index !== 0 && (
                          <div className="absolute top-5 left-[-50%] w-full h-[3px] bg-slate-100/90 -z-10 overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: currentStepIndex >= index ? "100%" : "0%" }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              className="h-full bg-gradient-to-r from-[#FF6014] to-[#E0530A]"
                            />
                          </div>
                        )}

                        {/* Animated Circle Node */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          animate={{
                            scale: isActive ? [1, 1.12, 1] : 1,
                          }}
                          transition={{
                            repeat: isActive ? Infinity : 0,
                            repeatDelay: 2.5,
                            duration: 0.8,
                          }}
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-sm border-2 border-white ${
                            isCompleted
                              ? "bg-[#FF6014] text-white shadow-md shadow-[#FF6014]/20"
                              : isActive
                              ? "bg-[#FF6014] text-white ring-4 ring-[#FF6014]/25 shadow-lg shadow-[#FF6014]/30"
                              : "bg-slate-100/80 text-slate-400 border-slate-200/60"
                          }`}
                        >
                          {isCompleted ? <Check size={18} className="stroke-[3]" /> : index + 1}
                        </motion.div>

                        {/* Stepper Labels */}
                        <div className="mt-3 text-center">
                          <span
                            className={`text-xs font-extrabold block tracking-wide ${
                              isActive ? "text-[#FF6014]" : isCompleted ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className={`text-[10px] font-semibold mt-0.5 block ${isActive ? "text-slate-600 font-bold" : "text-slate-400"}`}>
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Animated Stepper */}
              <div className="sm:hidden space-y-6 relative ml-3">
                <div className="absolute left-4 top-4 bottom-4 w-[3px] bg-slate-100 -z-10" />
                <motion.div
                  className="absolute left-4 top-4 bottom-4 w-[3px] bg-[#FF6014] -z-10 origin-top"
                  initial={{ height: "0%" }}
                  animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />

                {steps.map((step, index) => {
                  const isCompleted = currentStepIndex > index;
                  const isActive = currentStepIndex === index;

                  return (
                    <div key={step.id} className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-sm border-2 border-white ${
                          isCompleted
                            ? "bg-[#FF6014] text-white"
                            : isActive
                            ? "bg-[#FF6014] text-white ring-4 ring-[#FF6014]/20 scale-105"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <Check size={15} className="stroke-[3]" /> : index + 1}
                      </motion.div>
                      <div>
                        <span className={`text-xs font-extrabold block tracking-wide ${isActive ? "text-[#FF6014]" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                          {step.label}
                        </span>
                        <span className={`text-[10px] font-semibold mt-0.5 block ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Booking & Assigned Info Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Glassmorphic Service Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-6 sm:p-7 rounded-[28px] border border-slate-100/90 shadow-sm space-y-5 hover:border-orange-200/60 transition-all"
          >
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                {lang === "bn" ? "সার্ভিসের বিবরণ" : "Service Details"}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {booking.service?.name || booking.pkg?.name || (lang === "bn" ? "সার্ভিসের বিবরণ" : "Service Details")}
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50/80 text-[#FF6014] border border-orange-100 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    {lang === "bn" ? "সময়সূচী" : "Schedule"}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {new Date(booking.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50/80 text-[#FF6014] border border-orange-100 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    {lang === "bn" ? "অবস্থান" : "Location"}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">{booking.location || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                {lang === "bn" ? "মোট পরিমাণ" : "Total Amount"}
              </span>
              <span className="text-lg font-black text-[#FF6014]">₹{booking.total_price || booking.service?.price || booking.pkg?.price || 0}</span>
            </div>
          </motion.div>

          {/* Glassmorphic Assigned Personnel Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/80 backdrop-blur-xl p-6 sm:p-7 rounded-[28px] border border-slate-100/90 shadow-sm space-y-5 hover:border-orange-200/60 transition-all"
          >
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                {lang === "bn" ? "নিযুক্ত কর্মী/ভেন্ডর" : "Assigned To"}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === "bn" ? "প্রফেশনালস" : "Professionals"}
              </h3>
            </div>

            {!booking.vendor && (!booking.employees || booking.employees.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#FF6014] mb-2 border border-orange-100">
                  <User size={18} />
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {lang === "bn" ? "আমরা আপনার সার্ভিসের জন্য সেরা কর্মীদের নিযুক্ত করছি।" : "We are assigning the best professionals for your service."}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Vendor */}
                {booking.vendor && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 bg-white/70 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6014] border border-orange-100 flex items-center justify-center font-black text-sm shrink-0">
                      <Shield size={18} />
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block">
                          {booking.vendor.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                          {lang === "bn" ? "সার্ভিস ভেন্ডর" : "Service Vendor"}
                        </span>
                      </div>

                      <button
                        onClick={() => router.push(`/dashbord/live-chat?receiverId=${booking.vendor.id}&receiverName=${encodeURIComponent(booking.vendor.name)}`)}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-[#FF6014] bg-orange-50 hover:bg-[#FFF8F4] px-3 py-1.5 rounded-xl border border-orange-100 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={13} /> {lang === "bn" ? "মেসেজ" : "Message"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Technicians/Employees */}
                {booking.employees?.map((emp: any) => (
                  <div key={emp.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 bg-white/70 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-sm shrink-0">
                      {emp.name?.charAt(0).toUpperCase() || <User size={18} />}
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block">{emp.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                          {lang === "bn" ? "নিযুক্ত টেকনিশিয়ান" : "Assigned Technician"}
                        </span>
                      </div>

                      <button
                        onClick={() => router.push(`/dashbord/live-chat?receiverId=${emp.id}&receiverName=${encodeURIComponent(emp.name)}`)}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100/60 px-3 py-1.5 rounded-xl border border-blue-100 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={13} /> {lang === "bn" ? "মেসেজ" : "Message"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
