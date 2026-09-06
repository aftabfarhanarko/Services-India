"use client";

import React from "react";
import { Layers, Wrench, DollarSign, Edit2, Trash2, Eye } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import Link from "next/link";
import { NestedService } from "@/redux/features/admin/service";

interface NestedServiceTableProps {
  nestedServices: NestedService[];
  openEditModal: (item: NestedService) => void;
  openDeleteModal: (item: NestedService) => void;
}

export default function NestedServiceTable({
  nestedServices,
  openEditModal,
  openDeleteModal,
}: NestedServiceTableProps) {
  const columns = [
    {
      key: "name",
      header: "সাব-সার্ভিসের বিবরণ",
      render: (item: NestedService) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 font-bold rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-indigo-100/40">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Layers size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
            {item.description && (
              <p className="text-xs text-slate-400 font-medium mt-1 max-w-[200px] truncate">
                {item.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "service",
      header: "প্যারেন্ট সার্ভিস",
      render: (item: NestedService) => (
        <span className="inline-flex items-center gap-1.5 bg-[#FFF8F4]/70 text-[#E0530A] font-bold text-xs px-2.5 py-1 rounded-xl border border-[#FFF0EB]/50">
          <Wrench size={12} />
          {item.service?.name || "—"}
        </span>
      ),
    },
    {
      key: "starting_price",
      header: "শুরুর মূল্য",
      render: (item: NestedService) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <DollarSign size={12} />
          {item.starting_price != null ? `₹${item.starting_price.toLocaleString()}` : "পরিবর্তনশীল"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "তৈরির তারিখ",
      render: (item: NestedService) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "অ্যাকশন",
      render: (item: NestedService) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashbord/nested-services/view/${item.id || (item as any)._id}`}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Eye size={14} /> দেখুন
          </Link>
          <button
            onClick={() => openEditModal(item)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Edit2 size={14} /> এডিট
          </button>
          <button
            onClick={() => openDeleteModal(item)}
            className="bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#E0530A] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> ডিলিট
          </button>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={nestedServices}
      searchKey="name"
      searchPlaceholder="নাম দিয়ে সাব-সার্ভিস খুঁজুন..."
      pageSize={10}
    />
  );
}
