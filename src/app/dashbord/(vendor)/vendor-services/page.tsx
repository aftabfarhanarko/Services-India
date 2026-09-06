"use client";

import React from "react";
import {
  ShieldAlert,
  Trash2,
  PlusCircle,
  Edit2,
  Wrench,
  Globe,
  Eye,
} from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import type { TableAction } from "@/components/ui/table";
import { Service } from "@/redux/features/admin/service";
import { useVendorServicesState } from "./hooks/useVendorServicesState";
import { formatImageUrl } from "@/lib/utils";
import DeleteServiceModal from "./components/DeleteServiceModal";

export default function VendorServicesPage() {
  const state = useVendorServicesState();

  if (state.role !== "superadmin" && state.role !== "vendor") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">প্রবেশাধিকার নেই</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">এই প্যানেলটি শুধুমাত্র ভেন্ডরদের জন্য।</p>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: "সার্ভিসের নাম",
      render: (item: Service) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFF8F4] text-[#FF6014] rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-[#FFF0EB]/40">
            {item.image ? (
              <img src={formatImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Wrench size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "স্লাগ",
      render: (item: Service) => (
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 font-mono font-bold text-xs px-2.5 py-1 rounded-xl">
          <Globe size={11} />
          {item.slug}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "তারিখ",
      render: (item: Service) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const tableActions: TableAction<Service>[] = [
    {
      label: "দেখুন",
      icon: Eye,
      onClick: (item) => state.router.push(`/dashbord/vendor-services/${item.id}`),
      variant: "default",
    },
    { label: "এডিট", icon: Edit2, onClick: (item) => state.router.push(`/dashbord/vendor-services/edit/${item.id}`), variant: "secondary" },
    { label: "ডিলিট", icon: Trash2, onClick: state.openDeleteModal, variant: "destructive" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">আমার সার্ভিসেস</h1>
            <p className="text-xs text-slate-400 mt-0.5">প্ল্যাটফর্মে আপনার সার্ভিস অফারগুলো ম্যানেজ করুন।</p>
          </div>
        </div>
        <button
          onClick={() => state.router.push("/dashbord/vendor-services/create")}
          className="bg-[#FF6014] hover:bg-[#E0530A] text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/10"
        >
          <PlusCircle size={18} /> সার্ভিস যোগ করুন
        </button>
      </div>

      {state.isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : state.services.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Wrench size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">কোনো সার্ভিস পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            ক্লায়েন্টদের অফার করতে আপনার প্রথম সার্ভিস তৈরি করুন।
          </p>
          <button
            onClick={() => state.router.push("/dashbord/vendor-services/create")}
            className="mt-4 bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#FF6014] font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            নতুন সার্ভিস যোগ করুন
          </button>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={state.services}
          actions={tableActions}
          searchKey="name"
          searchPlaceholder="সার্ভিস খুঁজুন..."
          pageSize={10}
        />
      )}

      {/* Delete Modal */}
      <DeleteServiceModal
        isDeleteModalOpen={state.isDeleteModalOpen}
        setIsDeleteModalOpen={state.setIsDeleteModalOpen}
        itemToDelete={state.itemToDelete}
        setItemToDelete={state.setItemToDelete}
        handleDelete={state.handleDelete}
      />
    </div>
  );
}
