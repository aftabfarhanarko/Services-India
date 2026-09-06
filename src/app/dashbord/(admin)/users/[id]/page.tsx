"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/features/admin/user";
import { useGetBookingsByUserQuery } from "@/redux/features/admin/booking";
import { ArrowLeft, User, Phone, Mail, Calendar, DollarSign, Star, Briefcase, MapPin, Activity } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: userRes, isLoading: isUserLoading } = useGetUserByIdQuery(id);
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetBookingsByUserQuery(id);

  const user = userRes?.data;
  const bookings = bookingsRes?.data || [];

  const [totalExpense, setTotalExpense] = useState(0);

  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const currentUser = useAppSelector((state) => state.auth.user);
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : (rawRole as any)?.name?.toLowerCase() || "superadmin";

  const vendorBookings = role === "vendor" 
    ? bookings.filter((b: any) => b.vendor?.id?.toString() === currentUser?.id?.toString() || b.vendor_id?.toString() === currentUser?.id?.toString())
    : bookings;

  useEffect(() => {
    if (vendorBookings.length > 0) {
      const total = vendorBookings.reduce((sum: number, booking: any) => {
        return sum + Number(booking.total_price || 0);
      }, 0);
      setTotalExpense(total);
    }
  }, [bookings]);

  if (isUserLoading || isBookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800">User not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-brand-primary hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Client Details</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Overview of client's bookings and activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-50 text-[#FF6014] rounded-full flex items-center justify-center mb-4 text-3xl font-black shadow-inner">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-[#FFF8F4] text-[#E0530A]"
              }`}>
                {user.status || "Unknown"}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-slate-700">{user.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="font-semibold text-slate-700">{user.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</p>
                  <p className="font-semibold text-slate-700">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                <p className="text-2xl font-black text-slate-900">{vendorBookings.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expense</p>
                <p className="text-2xl font-black text-slate-900">₹{totalExpense.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reviews Left</p>
                <p className="text-2xl font-black text-slate-900">0</p>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-[#FF6014]" /> Recent Bookings
              </h3>
            </div>

            {vendorBookings.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">This client hasn't made any bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorBookings.map((booking: any) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm bg-slate-50/50 transition-all gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {booking.subServices && booking.subServices.length > 0 
                            ? booking.subServices.map((s:any)=>s.name).join(', ') 
                            : booking.pkg?.name || "Unknown Service"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {booking.location}</span>
                          <span>•</span>
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                        ₹{booking.total_price || 0}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'cancelled' ? 'bg-[#FFF0EB] text-[#E0530A]' :
                        booking.status === 'assigned' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
