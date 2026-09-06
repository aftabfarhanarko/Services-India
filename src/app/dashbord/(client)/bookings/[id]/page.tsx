"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useGetBookingByIdQuery } from "@/redux/features/admin/booking";
import { useCreateReviewMutation } from "@/redux/features/shared/reviewApi";
import { Calendar, User, MapPin, Briefcase, Star, ArrowLeft, Loader2, MessageCircle, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { printBookingInvoice } from "@/utils/invoicePrint";

export default function ClientBookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const bookingId = Array.isArray(id) ? id[0] : id;
  const lang = useAppSelector((state) => state.lang.value);

  const { data: response, isLoading } = useGetBookingByIdQuery(bookingId as string, {
    skip: !bookingId
  });

  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();

  const booking = response?.data;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewTarget, setReviewTarget] = useState<string>("service");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    let payload: any = {
      service_id: booking.service?.id || booking.pkg?.id,
      rating,
      comment,
    };

    if (reviewTarget.startsWith('employee_')) {
      payload.employee_id = Number(reviewTarget.split('_')[1]);
    }

    try {
      await createReview(payload).unwrap();

      toast.success(
        lang === "bn" ? "রিভিউ সফলভাবে জমা দেওয়া হয়েছে!" : "Review submitted successfully!"
      );
      setReviewSubmitted(true);

      // Reset form to allow multiple reviews
      setTimeout(() => {
        setReviewSubmitted(false);
        setRating(5);
        setComment("");
      }, 3000);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          (lang === "bn" ? "রিভিউ জমা দিতে ব্যর্থ হয়েছে" : "Failed to submit review")
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#FF6014]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <h2 className="text-xl font-bold text-slate-800">
          {lang === "bn" ? "বুকিং পাওয়া যায়নি" : "Booking not found"}
        </h2>
        <Link href="/dashbord/bookings" className="text-[#FF6014] hover:underline mt-2">
          {lang === "bn" ? "বুকিং তালিকায় ফিরে যান" : "Return to Bookings"}
        </Link>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return lang === "bn" ? "পেন্ডিং" : "Pending";
      case "assigned":
        return lang === "bn" ? "নিযুক্ত" : "Assigned";
      case "on_the_way":
        return lang === "bn" ? "চলমান" : "On The Way";
      case "completed":
        return lang === "bn" ? "সম্পন্ন" : "Completed";
      case "cancelled":
        return lang === "bn" ? "বাতিল" : "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="w-full  mx-auto animate-in fade-in duration-200 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/dashbord/bookings" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-slate-600">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "বুকিংয়ের বিবরণ" : "Booking Details"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {lang === "bn" ? `অর্ডার #${booking.id}` : `Order #${booking.id}`}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => printBookingInvoice(booking)}
            className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Download size={16} />
            <span>{lang === "bn" ? "ইনভয়েস ডাউনলোড" : "Download Invoice"}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Service Details Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-[#FFF8F4] border border-[#FFF0EB] rounded-2xl flex items-center justify-center text-[#FF6014] shrink-0">
                <Briefcase size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {booking.nestedService?.name || booking.pkg?.name || booking.service?.name || (lang === "bn" ? "সার্ভিস বুকিং" : "Service Booking")}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 mt-2 border border-slate-200">
                  {lang === "bn" ? "অবস্থা" : "Status"}: {getStatusText(booking.status).toUpperCase()}
                </span>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-[#FF6014]" />
                    <span className="font-semibold">{new Date(booking.createdAt).toLocaleDateString("en-BD", { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-[#FF6014]" />
                    <span className="font-semibold">{booking.location || (lang === "bn" ? "অবস্থান দেওয়া হয়নি" : "Location not provided")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 min-w-[160px] text-center md:text-right border border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                {lang === "bn" ? "মোট পরিমাণ" : "Total Amount"}
              </p>
              <p className="text-2xl font-black text-slate-800">₹{booking.total_price}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor Details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Briefcase size={12} />
              </div>
              {lang === "bn" ? "নিযুক্ত ভেন্ডর" : "Assigned Vendor"}
            </h4>

            {booking.vendor ? (
              <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {booking.vendor.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{booking.vendor.name}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      {lang === "bn" ? "এজেন্সি পার্টনার" : "Agency Partner"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashbord/live-chat?receiverId=${booking.vendor.id}&receiverName=${encodeURIComponent(booking.vendor.name)}`)}
                  className="p-2 bg-white text-emerald-600 rounded-xl shadow-sm hover:shadow border border-emerald-100 transition-all cursor-pointer"
                  title={lang === "bn" ? "ভেন্ডরের সাথে চ্যাট" : "Chat with vendor"}
                >
                  <MessageCircle size={18} />
                </button>
              </div>
            ) : (
              <div className="text-sm text-slate-500 font-medium bg-slate-50 p-4 rounded-2xl text-center border border-dashed border-slate-200">
                {lang === "bn" ? "ভেন্ডর নিযুক্ত হওয়ার জন্য অপেক্ষা করুন।" : "Waiting for a vendor to be assigned."}
              </div>
            )}
          </div>

          {/* Assigned Technicians / Professionals */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <User size={12} />
              </div>
              {lang === "bn" ? "নিযুক্ত কর্মী" : "Assigned Professionals"}
            </h4>

            {booking.employees && booking.employees.length > 0 ? (
              <div className="space-y-3">
                {booking.employees.map((emp: any) => (
                  <div key={emp.id} className="flex items-center justify-between bg-indigo-50/30 border border-indigo-100/50 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{emp.name}</p>
                        {emp.profile?.category && (
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{emp.profile.category.name}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/dashbord/live-chat?receiverId=${emp.id}&receiverName=${encodeURIComponent(emp.name)}`)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      title={lang === "bn" ? `${emp.name?.split(' ')[0]} এর সাথে চ্যাট` : `Chat with ${emp.name?.split(' ')[0]}`}
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500 font-medium bg-slate-50 p-4 rounded-2xl text-center border border-dashed border-slate-200">
                {booking.vendor
                  ? lang === "bn"
                    ? "ভেন্ডর এখনো কোনো কর্মী নিযুক্ত করেনি।"
                    : "Vendor has not assigned professionals yet."
                  : lang === "bn"
                  ? "নিযুক্তির জন্য অপেক্ষা করা হচ্ছে।"
                  : "Waiting for assignment."}
              </div>
            )}
          </div>
        </div>

        {/* Review Section */}
        {booking.status === 'completed' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center">
                <Star size={20} className="fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {lang === "bn" ? "মতামত/রিভিউ দিন" : "Leave a Review"}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === "bn"
                    ? "আপনাকে সাহায্যকারী সেবাদাতা ও কর্মীদের রেটিং দিন।"
                    : "Rate the service and the professionals who helped you."}
                </p>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in-95">
                <CheckCircle2 size={32} />
                <p className="font-bold">{lang === "bn" ? "আপনার মতামতের জন্য ধন্যবাদ!" : "Thank you for your feedback!"}</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {lang === "bn" ? "রেটিং" : "Rating"}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-110 active:scale-95 cursor-pointer ${star <= rating ? "text-amber-400" : "text-slate-200"}`}
                      >
                        <Star size={32} className={star <= rating ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                {booking.employees && booking.employees.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {lang === "bn" ? "রিভিউয়ের বিষয়" : "Review Subject"}
                    </label>
                    <select
                      value={reviewTarget}
                      onChange={(e) => setReviewTarget(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                    >
                      <option value="service">{lang === "bn" ? "সামগ্রিক সার্ভিস" : "Overall Service"}</option>
                      {booking.employees.map((emp: any) => (
                        <option key={emp.id} value={`employee_${emp.id}`}>
                          {emp.name} {lang === "bn" ? "(কর্মী)" : "(Professional)"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="comment" className="block text-xs font-bold text-slate-700 mb-2">
                    {lang === "bn" ? "আপনার রিভিউ" : "Your Review"}
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={lang === "bn" ? "আপনার অভিজ্ঞতার কথা আমাদের জানান..." : "Tell us about your experience..."}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all min-h-[120px] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-sm font-bold py-3.5 px-8 rounded-2xl transition-all shadow-sm shadow-[#FF6014]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingReview ? <Loader2 size={16} className="animate-spin" /> : null}
                  {lang === "bn" ? "রিভিউ জমা দিন" : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
