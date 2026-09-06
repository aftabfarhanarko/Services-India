/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCustomShiftingByIdQuery,
  useAssignVendorToShiftingMutation,
  useUpdateShiftingStatusMutation,
  useUpdateShiftingPriceMutation,
  useDeleteCustomShiftingMutation,
} from "@/redux/features/admin/customShiftingApi";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useAppSelector } from "@/redux/hooks";
import { CustomSelect } from "@/components/ui/select";
import { useConfirm } from "@/context/ConfirmDialogContext";
import {
  ArrowLeft,
  Truck,
  Clock,
  UserCheck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Home,
  Building2,
  Image as ImageIcon,
  Users,
  Phone,
  User,
  Coins,
} from "lucide-react";

/* ── Status helpers ─────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock },
  assigned:  { label: "Assigned",  color: "bg-blue-50 text-blue-700 border-blue-200",      icon: UserCheck },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-200",         icon: XCircle },
};

function StatusBadge({ status, lang }: { status: string; lang?: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  
  let label = cfg.label;
  if (lang === "bn") {
    if (status === "pending") label = "পেন্ডিং";
    else if (status === "assigned") label = "নিযুক্ত";
    else if (status === "completed") label = "সম্পন্ন";
    else if (status === "cancelled") label = "বাতিল";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

export default function CustomShiftingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const confirm = useConfirm();
  const { id } = use(params);
  const router = useRouter();

  const role = useAppSelector((state) => state.auth.role) || "";
  const lang = useAppSelector((state) => state.lang.value);
  const isSuperAdmin = role === "superadmin";
  const isVendor = role === "vendor";

  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [isReassigning, setIsReassigning] = useState(false);
  const [smsNotice, setSmsNotice] = useState(false);

  /* Queries & Mutations */
  const { data: shiftingRes, isLoading, refetch } = useGetCustomShiftingByIdQuery(id);
  const { data: vendorsData } = useGetAllUsersQuery({ role: "Vendor" });

  const [assignVendor, { isLoading: isAssigning }] = useAssignVendorToShiftingMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateShiftingStatusMutation();
  const [updatePrice, { isLoading: isSavingPrice }] = useUpdateShiftingPriceMutation();
  const [deleteShifting] = useDeleteCustomShiftingMutation();

  const shifting = shiftingRes?.data;

  useEffect(() => {
    if (shifting?.price) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriceInput(String(shifting.price));
    }
  }, [shifting?.price]);

  const handleSavePrice = async () => {
    if (!priceInput) return;
    try {
      await updatePrice({ id: Number(id), price: Number(priceInput) }).unwrap();
      refetch();
    } catch {}
  };

  const vendors: any[] = Array.isArray(vendorsData?.data)
    ? vendorsData.data
    : Array.isArray(vendorsData)
    ? vendorsData
    : [];

  const vendorsOptions = vendors.map((v) => ({
    value: String(v.id),
    label: v.profile?.businessName || v.name || `Vendor #${v.id}`,
    desc: v.phone || undefined,
  }));

  const handleAssign = async () => {
    if (!selectedVendorId) return;
    try {
      await assignVendor({ id: Number(id), vendorId: Number(selectedVendorId) }).unwrap();
      setSmsNotice(true);
      setIsReassigning(false);
      setTimeout(() => setSmsNotice(false), 4000);
      refetch();
    } catch {}
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus({ id: Number(id), status }).unwrap();
      refetch();
    } catch {}
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: lang === "bn" ? "বুকিং মুছে ফেলবেন?" : "Delete Booking?",
      message: lang === "bn"
        ? "আপনি কি নিশ্চিত যে আপনি এই বুকিংটি স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি আর পূর্বাবস্থায় ফেরানো যাবে না।"
        : "Are you sure you want to permanently delete this booking? This action cannot be undone.",
      confirmText: lang === "bn" ? "মুছুন" : "Delete",
      cancelText: lang === "bn" ? "বাতিল" : "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteShifting(Number(id)).unwrap();
      router.push("/dashbord/custom-shifting");
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">{lang === "bn" ? "বিস্তারিত লোড হচ্ছে..." : "Loading details..."}</p>
      </div>
    );
  }

  if (!shifting) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8 max-w-md mx-auto mt-10 shadow-sm">
        <AlertCircle size={48} className="text-amber-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-extrabold text-slate-800">{lang === "bn" ? "বুকিং পাওয়া যায়নি" : "Booking Not Found"}</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          {lang === "bn" ? "অনুরোধকৃত কাস্টম শিফটিং বুকিং আইডিটির কোনো অস্তিত্ব নেই।" : "The requested custom shifting booking ID does not exist."}
        </p>
        <button
          onClick={() => router.push("/dashbord/custom-shifting")}
          className="px-5 py-2.5 bg-[#FF6014] text-white font-extrabold text-xs rounded-xl hover:bg-[#e04f0f] transition-colors"
        >
          {lang === "bn" ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => router.push("/dashbord/custom-shifting")}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-slate-900">
                {lang === "bn" ? "শিফটিং বুকিংয়ের বিবরণ" : "Shifting Details"}
              </h1>
              <span className="text-xs font-black px-2.5 py-0.5 bg-slate-150 text-slate-600 rounded-full border border-slate-200">
                #{shifting.id}
              </span>
              <StatusBadge status={shifting.status} lang={lang} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "bn" ? "দাখিল করা হয়েছে " : "Submitted on "} {new Date(shifting.createdAt).toLocaleString(lang === "bn" ? 'bn-BD' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 text-xs font-bold text-red-650 bg-red-50/50 hover:bg-red-50 border border-red-100 hover:border-red-200 px-4.5 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Trash2 size={14} className="text-red-500" />
            {lang === "bn" ? "বুকিং মুছে ফেলুন" : "Delete Booking"}
          </button>
        )}
      </div>

      {/* SMS notification banner */}
      {smsNotice && (
        <div className="flex items-center gap-3 bg-green-55 border border-green-200 rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">
              {lang === "bn" ? "ভেন্ডর নিযুক্ত এবং SMS পাঠানো হয়েছে ✅" : "Vendor Assigned & SMS Sent ✅"}
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {lang === "bn" ? "ভেন্ডরকে এই শিফটিং কাজের ব্যাপারে SMS এর মাধ্যমে নোটিফাই করা হয়েছে।" : "Vendor has been notified via SMS about this custom shifting job."}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Details */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} className="text-[#FF6014]" />
              {lang === "bn" ? "গ্রাহকের তথ্য" : "Client Information"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 bg-[#FFF8F4]/30 rounded-2xl p-5 border border-orange-100/50">
              <div>
                <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">{lang === "bn" ? "সম্পূর্ণ নাম" : "Full Name"}</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{shifting.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{lang === "bn" ? "ফোন নাম্বার" : "Phone Number"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-extrabold text-slate-800">{shifting.phone}</span>
                  <a
                    href={`tel:${shifting.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-55 hover:bg-green-100 text-green-600 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
                  >
                    <Phone size={11} />
                    {lang === "bn" ? "গ্রাহককে কল দিন" : "Call Client"}
                  </a>
                </div>
              </div>
              {shifting.email && (
                <div className="sm:col-span-2 border-t border-orange-100/30 pt-4 mt-2">
                  <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">{lang === "bn" ? "ইমেইল অ্যাড্রেস" : "Email Address"}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{shifting.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shifting Details */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Truck size={16} className="text-[#FF6014]" />
              {lang === "bn" ? "শিফটিংয়ের তথ্য" : "Shifting Information"}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{lang === "bn" ? "শিফটিংয়ের ধরণ" : "Shifting Type"}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-150 px-3 py-1.5 rounded-full shadow-sm">
                  {shifting.shiftingType === "office" ? (
                    <Building2 size={12} className="text-blue-500" />
                  ) : (
                    <Home size={12} className="text-[#FF6014]" />
                  )}
                  {shifting.shiftingType === "office"
                    ? (lang === "bn" ? "অফিস শিফটিং" : "Office Shifting")
                    : (lang === "bn" ? "বাসা শিফটিং" : "Home Shifting")}
                </span>
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === "bn" ? "দাখিলের সময়" : "Submission Time"}</p>
                <p className="text-xs text-slate-500 font-extrabold mt-1">
                  {new Date(shifting.createdAt).toLocaleString(lang === "bn" ? 'bn-BD' : 'en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-4 pt-2">
              <div className="relative pl-6 pb-2">
                <div className="absolute left-1.5 top-1.5 bottom-0 w-0.5 bg-dashed border-l-2 border-slate-200" />
                <div className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full bg-[#FFF8F4] border-2 border-[#FF6014] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
                </div>
                <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">{lang === "bn" ? "পিকআপ ঠিকানা (Source)" : "Pickup Address (Source)"}</h4>
                <p className="text-sm font-semibold text-slate-805 mt-1 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-2xl">
                  {shifting.sourceAddress}
                </p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-505" />
                </div>
                <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">{lang === "bn" ? "ড্রপঅফ ঠিকানা (Destination)" : "Dropoff Address (Destination)"}</h4>
                <p className="text-sm font-semibold text-slate-805 mt-1 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-2xl">
                  {shifting.destinationAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Actions & Images & Assignment */}
        <div className="lg:col-span-1 space-y-6">
          {/* Vendor Assignment Section (Super Admin only) */}
          {isSuperAdmin && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users size={16} className="text-[#FF6014]" />
                {lang === "bn" ? "ভেন্ডর নিযুক্তকরণ" : "Vendor Assignment"}
              </h3>

              {shifting.vendor && !isReassigning ? (
                <div className="space-y-4">
                  <div className="bg-[#FFF8F4]/30 border border-orange-100/50 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-[#FF6014] uppercase tracking-wider">{lang === "bn" ? "সক্রিয় ভেন্ডর" : "Active Vendor"}</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-1">
                      {shifting.vendor.profile?.businessName || shifting.vendor.name || (lang === "bn" ? "ভেন্ডর" : "Vendor")}
                    </p>
                    {shifting.vendor.phone && (
                      <p className="text-xs text-slate-550 font-bold mt-0.5">{shifting.vendor.phone}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {shifting.vendor.phone && (
                      <a
                        href={`tel:${shifting.vendor.phone}`}
                        className="px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm flex-1 justify-center"
                      >
                        <Phone size={11} />
                        {lang === "bn" ? "ভেন্ডরকে কল দিন" : "Call Vendor"}
                      </a>
                    )}
                    <button
                      onClick={() => setIsReassigning(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded-xl text-xs font-bold transition-colors flex-1"
                    >
                      {lang === "bn" ? "পুনরায় নিযুক্ত করুন" : "Reassign"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{lang === "bn" ? "ভেন্ডর সিলেক্ট করুন" : "Select Vendor"}</label>
                    <CustomSelect
                      options={vendorsOptions}
                      value={selectedVendorId}
                      onChange={(val) => setSelectedVendorId(val)}
                      disabled={isAssigning}
                      placeholder={lang === "bn" ? "ভেন্ডর সিলেক্ট করুন..." : "Choose a vendor..."}
                      className="w-full text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAssign}
                      disabled={!selectedVendorId || isAssigning}
                      className="w-full py-3 bg-[#FF6014] hover:bg-[#e04f0f] text-white text-xs font-black rounded-xl transition-colors disabled:opacity-50 shadow-md shadow-[#FF6014]/15"
                    >
                      {isAssigning
                        ? (lang === "bn" ? "নিযুক্ত করা হচ্ছে..." : "Assigning...")
                        : (lang === "bn" ? "ভেন্ডর নিযুক্ত করুন" : "Assign Vendor")}
                    </button>
                    {isReassigning && (
                      <button
                        onClick={() => setIsReassigning(false)}
                        className="py-3 px-4 border border-slate-200 text-slate-500 hover:bg-slate-55 text-xs font-bold rounded-xl transition-all"
                      >
                        {lang === "bn" ? "বাতিল" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick status actions */}
          {isSuperAdmin && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={16} className="text-[#FF6014]" />
                {lang === "bn" ? "কাজের অবস্থা নিয়ন্ত্রণ" : "Job Status Controls"}
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {shifting.status !== "completed" && (
                  <button
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={isUpdatingStatus}
                    className="w-full py-3 bg-green-55 hover:bg-green-100 text-green-600 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 border border-green-200/40"
                  >
                    <CheckCircle size={13} />
                    {lang === "bn" ? "সম্পন্ন হিসেবে চিহ্নিত করুন" : "Mark Completed"}
                  </button>
                )}
                {shifting.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={isUpdatingStatus}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-550 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 border border-red-200/40"
                  >
                    <AlertCircle size={13} />
                    {lang === "bn" ? "কাজটি বাতিল করুন" : "Cancel Shifting Job"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Job Pricing (Super Admin can set/update, Client & Vendor can view) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Coins size={16} className="text-[#FF6014]" />
              {lang === "bn" ? "শিফটিং খরচ / মূল্য" : "Shifting Cost / Price"}
            </h3>
            
            {isSuperAdmin ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{lang === "bn" ? "সার্ভিস মূল্য নির্ধারণ করুন (₹)" : "Set Service Price (₹)"}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-sm">₹</span>
                    <input
                      type="number"
                      placeholder={lang === "bn" ? "টাকার পরিমাণ লিখুন..." : "Enter amount..."}
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      disabled={isSavingPrice}
                      className="pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6014]/20 w-full disabled:opacity-60 transition-all font-extrabold text-slate-800 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSavePrice}
                  disabled={!priceInput || isSavingPrice}
                  className="w-full py-3 bg-[#FF6014] hover:bg-[#e04f0f] text-white text-xs font-black rounded-xl transition-all disabled:opacity-50 shadow-md shadow-[#FF6014]/15 flex items-center justify-center gap-1.5"
                >
                  {isSavingPrice ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (lang === "bn" ? "মূল্য সংরক্ষণ এবং গ্রাহককে নোটিফাই করুন" : "Save Price & Notify Client")}
                </button>
              </div>
            ) : (
              <div className="bg-[#FFF8F4]/40 border border-orange-100/40 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-[#FF6014] uppercase tracking-wider">{lang === "bn" ? "শিফটিং খরচ" : "Shifting Cost"}</p>
                  <p className="text-lg font-black text-slate-800 mt-1">
                    {shifting.price 
                      ? (lang === "bn" ? `₹${Number(shifting.price).toLocaleString('bn-BD')}` : `₹${Number(shifting.price).toLocaleString('en-US')}`) 
                      : (lang === "bn" ? "মূল্যায়ন পেন্ডিং" : "Pending Evaluation")}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-[#FF6014]">
                  <Coins size={20} />
                </div>
              </div>
            )}
          </div>

          {/* Inventory Photos */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon size={16} className="text-[#FF6014]" />
              {lang === "bn" ? `ছবি (${shifting.images?.length || 0})` : `Photos (${shifting.images?.length || 0})`}
            </h3>

            {!shifting.images || shifting.images.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-6 text-center">
                {lang === "bn" ? "কোনো ছবি আপলোড করা হয়নি" : "No photos uploaded"}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl p-2.5">
                {shifting.images.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 transition-all hover:scale-[0.98] shadow-sm bg-white"
                  >
                    <img src={url} alt={`inventory-${i}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
