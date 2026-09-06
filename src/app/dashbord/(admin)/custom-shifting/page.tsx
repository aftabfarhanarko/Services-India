/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  Search,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  UserCheck,
  Trash2,
  ExternalLink,
  ChevronDown,
  Home,
  Building2,
  Image as ImageIcon,
  RefreshCw,
  Users,
  Eye,
} from "lucide-react";
import {
  useGetAllCustomShiftingsQuery,
  useAssignVendorToShiftingMutation,
  useUpdateShiftingStatusMutation,
  useDeleteCustomShiftingMutation,
} from "@/redux/features/admin/customShiftingApi";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useAppSelector } from "@/redux/hooks";
import { CustomSelect } from "@/components/ui/select";

/* ── Status helpers ─────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { labelBn: string; labelEn: string; color: string; icon: React.ElementType }> = {
  pending:   { labelBn: "অপেক্ষমান",   labelEn: "Pending",   color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock },
  assigned:  { labelBn: "ভেন্ডর নিযুক্ত", labelEn: "Assigned",  color: "bg-blue-50 text-blue-700 border-blue-200",      icon: UserCheck },
  completed: { labelBn: "সম্পন্ন",    labelEn: "Completed", color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle },
  cancelled: { labelBn: "বাতিল",     labelEn: "Cancelled", color: "bg-red-50 text-red-600 border-red-200",         icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const lang = useAppSelector((state) => state.lang.value);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.color}`}>
      <Icon size={11} />
      {lang === "bn" ? cfg.labelBn : cfg.labelEn}
    </span>
  );
}

/* ── Image Modal ────────────────────────────────────────────────────── */
function ImageModal({ images, onClose }: { images: string[]; onClose: () => void }) {
  const lang = useAppSelector((state) => state.lang.value);
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-800">{lang === "bn" ? "ইনভেন্টরি ছবিসমূহ" : "Inventory Photos"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={16} />
          </button>
        </div>
        {images.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">{lang === "bn" ? "কোনো ছবি আপলোড করা হয়নি" : "No images uploaded"}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-2xl overflow-hidden border border-slate-100 hover:opacity-90 transition-opacity">
                <img src={url} alt={`inventory-${i}`} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ───────────────────────────────────────────── */
function DeleteModal({ id, onConfirm, onClose, isDeleting }: { id: number; onConfirm: () => void; onClose: () => void; isDeleting: boolean }) {
  const lang = useAppSelector((state) => state.lang.value);
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 text-center">{lang === "bn" ? "বুকিং মুছে ফেলবেন?" : "Delete Booking?"}</h3>
        <p className="text-slate-500 text-sm text-center mt-1 mb-5">
          {lang === "bn"
            ? `এই কাজটি ফেরত নেওয়া যাবে না। বুকিং #${id} স্থায়ীভাবে মুছে ফেলা হবে।`
            : `This action cannot be undone. Booking #${id} will be permanently removed.`}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
            {lang === "bn" ? "বাতিল করুন" : "Cancel"}
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isDeleting ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
            {lang === "bn" ? "মুছে ফেলুন" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function CustomShiftingDashboard() {
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.role) || "";
  const lang = useAppSelector((state) => state.lang.value);
  const isSuperAdmin = role === "superadmin";
  const isVendor = role === "vendor";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [imageModalData, setImageModalData] = useState<string[] | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [smsNotice, setSmsNotice] = useState<number | null>(null);

  /* Queries */
  const { data: shiftingsData, isLoading, refetch } = useGetAllCustomShiftingsQuery();
  const { data: vendorsData } = useGetAllUsersQuery({ role: "Vendor" });

  /* Mutations */
  const [assignVendor, { isLoading: isAssigning }] = useAssignVendorToShiftingMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateShiftingStatusMutation();
  const [deleteShifting, { isLoading: isDeleting }] = useDeleteCustomShiftingMutation();

  const shiftings: any[] = Array.isArray(shiftingsData?.data)
    ? shiftingsData.data
    : Array.isArray(shiftingsData)
    ? shiftingsData
    : [];

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

  const filtered = shiftings.filter((s) => {
    const matchesSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search) ||
      s.sourceAddress?.toLowerCase().includes(search.toLowerCase()) ||
      s.destinationAddress?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAssign = async (id: number, vendorId: string) => {
    if (!vendorId) return;
    try {
      await assignVendor({ id, vendorId: Number(vendorId) }).unwrap();
      // Show SMS notification banner
      setSmsNotice(id);
      setTimeout(() => setSmsNotice(null), 4000);
    } catch {}
    setAssigningId(null);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteShifting(deleteId).unwrap();
    } catch {}
    setDeleteId(null);
  };

  /* Stats */
  const stats = {
    total: shiftings.length,
    pending: shiftings.filter((s) => s.status === "pending").length,
    assigned: shiftings.filter((s) => s.status === "assigned").length,
    completed: shiftings.filter((s) => s.status === "completed").length,
    vendorsAssigned: new Set(
      shiftings
        .filter((s) => s.vendor?.id)
        .map((s) => s.vendor.id)
    ).size,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "কাস্টম শিফটিং" : "Custom Shifting"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSuperAdmin
                ? (lang === "bn" ? "সব শিফটিং বুকিং ম্যানেজ করুন এবং ভেন্ডর নিযুক্ত করুন।" : "Manage all shifting bookings and assign vendors.")
                : (lang === "bn" ? "আপনার জন্য বরাদ্দকৃত শিফটিং কাজগুলো দেখুন।" : "View your assigned shifting jobs.")}
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} />
          {lang === "bn" ? "রিফ্রেশ" : "Refresh"}
        </button>
      </div>

      {/* SMS sent banner */}
      {smsNotice !== null && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">
              {lang === "bn" ? "ভেন্ডর নিযুক্ত এবং SMS পাঠানো হয়েছে ✅" : "Vendor Assigned & SMS Sent ✅"}
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {lang === "bn"
                ? `বুকিং #${smsNotice} — ভেন্ডরকে এই কাজের ব্যাপারে SMS এর মাধ্যমে নোটিফাই করা হয়েছে।`
                : `Booking #${smsNotice} — Vendor has been notified via SMS about this shifting job.`}
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards — Super Admin only */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: lang === "bn" ? "মোট বুকিং" : "Total", value: stats.total, color: "text-slate-700", bg: "bg-slate-50 border-slate-200/60", icon: Truck, iconColor: "text-slate-600 bg-slate-100" },
            { label: lang === "bn" ? "অপেক্ষমান" : "Pending", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/50", icon: Clock, iconColor: "text-amber-600 bg-amber-100/80" },
            { label: lang === "bn" ? "নিযুক্ত" : "Assigned", value: stats.assigned, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/50", icon: UserCheck, iconColor: "text-blue-600 bg-blue-100/80" },
            { label: lang === "bn" ? "সম্পন্ন" : "Completed", value: stats.completed, color: "text-green-700", bg: "bg-green-50/60 border-green-200/50", icon: CheckCircle, iconColor: "text-green-600 bg-green-100/80" },
            { label: lang === "bn" ? "সক্রিয় ভেন্ডর" : "Vendors Active", value: stats.vendorsAssigned, color: "text-[#FF6014]", bg: "bg-[#FFF8F4]/80 border-orange-200/50", icon: Users, iconColor: "text-[#FF6014] bg-orange-100/80" },
          ].map((s, index) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.label}
                className={`border rounded-3xl p-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md ${s.bg} ${
                  index === 4 ? "max-sm:col-span-2" : ""
                }`}
              >
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconColor}`}>
                  <IconComponent size={20} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={lang === "bn" ? "নাম, ফোন, ঠিকানা দিয়ে খুঁজুন..." : "Search by name, phone, address..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF6014]/20 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["all", "pending", "assigned", "completed", "cancelled"].map((s) => {
            const filterLabelMap: Record<string, string> = {
              all: lang === "bn" ? "সব বুকিং" : "All",
              pending: lang === "bn" ? "অপেক্ষমান" : "Pending",
              assigned: lang === "bn" ? "নিযুক্ত" : "Assigned",
              completed: lang === "bn" ? "সম্পন্ন" : "Completed",
              cancelled: lang === "bn" ? "বাতিল" : "Cancelled",
            };
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  filterStatus === s
                    ? "bg-[#FF6014] text-white shadow-md shadow-[#FF6014]/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filterLabelMap[s] || s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">{lang === "bn" ? "শিফটিং বুকিং লোড হচ্ছে..." : "Loading shifting bookings..."}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Truck size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">{lang === "bn" ? "কোনো শিফটিং বুকিং পাওয়া যায়নি" : "No Shifting Requests"}</h3>
            <p className="text-slate-400 text-sm">
              {search || filterStatus !== "all"
                ? (lang === "bn" ? "আপনার ফিল্টার অনুযায়ী কোনো বুকিং নেই।" : "No bookings match your filters.")
                : (lang === "bn" ? "এখনো কোনো শিফটিং বুকিং সাবমিট করা হয়নি।" : "No shifting bookings have been submitted yet.")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "গ্রাহক" : "Client"}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "ধরণ" : "Type"}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "ঠিকানা / রুট" : "Route"}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "ছবি" : "Images"}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                  {isSuperAdmin && (
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "ভেন্ডর" : "Vendor"}</th>
                  )}
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "bn" ? "অ্যাকশন" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((shifting) => (
                  <tr
                    key={shifting.id}
                    onClick={() => router.push(`/dashbord/custom-shifting/${shifting.id}`)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    {/* Client */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-sm text-slate-800">{shifting.name}</div>
                      <div className="text-xs text-slate-400">{shifting.phone}</div>
                      {shifting.email && <div className="text-[11px] text-slate-300">{shifting.email}</div>}
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          {shifting.shiftingType === "office" ? (
                            <Building2 size={11} className="text-blue-500" />
                          ) : (
                            <Home size={11} className="text-[#FF6014]" />
                          )}
                          {shifting.shiftingType === "office"
                            ? (lang === "bn" ? "অফিস" : "Office")
                            : (lang === "bn" ? "বাসা" : "Home")}
                        </span>
                        {shifting.price && (
                          <div className="text-xs font-black text-slate-800 flex items-center gap-0.5 mt-1">
                            <span className="text-[#FF6014] font-extrabold">₹</span>
                            {Number(shifting.price).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-5 py-4 max-w-[200px]">
                      <div className="text-xs text-slate-600 font-medium line-clamp-1">
                        <span className="text-[#FF6014]">▸</span> {shifting.sourceAddress}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        <span className="text-green-500">▸</span> {shifting.destinationAddress}
                      </div>
                    </td>

                    {/* Images */}
                    <td className="px-5 py-4">
                      {shifting.images && shifting.images.length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageModalData(shifting.images);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#FF6014] hover:underline"
                        >
                          <ImageIcon size={13} />
                          {shifting.images.length} {lang === "bn" ? "টি ছবি" : `photo${shifting.images.length > 1 ? "s" : ""}`}
                          <ExternalLink size={11} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      {isVendor ? (
                        <CustomSelect
                          options={[
                            { value: "assigned", label: lang === "bn" ? "নিযুক্ত" : "Assigned" },
                            { value: "completed", label: lang === "bn" ? "সম্পন্ন" : "Completed" },
                          ]}
                          value={shifting.status}
                          onChange={(val) => handleStatusUpdate(shifting.id, val)}
                          disabled={isUpdatingStatus}
                          className="min-w-[120px] text-xs font-bold"
                        />
                      ) : (
                        <StatusBadge status={shifting.status} />
                      )}
                    </td>

                    {/* Vendor (Super Admin only) */}
                    {isSuperAdmin && (
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        {shifting.vendor ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 bg-[#FF6014]/10 text-[#FF6014] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#FF6014]/20">
                                <Users size={9} />
                                {lang === "bn" ? "ভেন্ডর" : "Vendor"}
                              </span>
                              {smsNotice === shifting.id && (
                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                                  {lang === "bn" ? "📱 SMS পাঠানো হয়েছে" : "📱 SMS Sent"}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-800">
                              {shifting.vendor.profile?.businessName || shifting.vendor.name || (lang === "bn" ? "ভেন্ডর" : "Vendor")}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">{shifting.vendor.phoneNumber}</div>
                            <button
                              onClick={() => setAssigningId(assigningId === shifting.id ? null : shifting.id)}
                              className="text-[10px] text-[#FF6014] font-bold hover:underline"
                            >
                              {lang === "bn" ? "পুনরায় নিযুক্ত করুন" : "Reassign"}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningId(assigningId === shifting.id ? null : shifting.id)}
                            className="text-xs font-bold text-[#FF6014] flex items-center gap-1 hover:underline"
                          >
                            {lang === "bn" ? "ভেন্ডর নিযুক্ত করুন" : "Assign Vendor"}
                            <ChevronDown size={12} className={`transition-transform ${assigningId === shifting.id ? "rotate-180" : ""}`} />
                          </button>
                        )}
                        {assigningId === shifting.id && (
                          <div className="mt-2">
                            <CustomSelect
                              options={vendorsOptions}
                              value=""
                              onChange={(val) => handleAssign(shifting.id, val)}
                              disabled={isAssigning}
                              placeholder="Select vendor..."
                              className="w-full text-xs"
                            />
                          </div>
                        )}
                      </td>
                    )}

                    {/* Actions */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashbord/custom-shifting/${shifting.id}`)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        {isSuperAdmin && (
                          <>
                            {shifting.status !== "completed" && (
                              <button
                                onClick={() => handleStatusUpdate(shifting.id, "completed")}
                                disabled={isUpdatingStatus}
                                title="Mark Completed"
                                className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {shifting.status !== "cancelled" && (
                              <button
                                onClick={() => handleStatusUpdate(shifting.id, "cancelled")}
                                disabled={isUpdatingStatus}
                                title="Cancel"
                                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                <AlertCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteId(shifting.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {imageModalData && (
        <ImageModal images={imageModalData} onClose={() => setImageModalData(null)} />
      )}
      {deleteId !== null && (
        <DeleteModal
          id={deleteId}
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
