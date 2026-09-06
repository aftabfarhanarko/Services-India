"use client";

import React from "react";
import { Component, Wrench, DollarSign, Edit2, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { SubService } from "@/redux/features/admin/service";

interface SubServiceTableProps {
  subServices: SubService[];
  openEditModal: (item: SubService) => void;
  openDeleteModal: (item: SubService) => void;
}

export default function SubServiceTable({
  subServices,
  openEditModal,
  openDeleteModal,
}: SubServiceTableProps) {
  const columns = [
    {
      key: "name",
      header: "Sub-Service Details",
      render: (item: SubService) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 font-bold rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-indigo-100/40">
            {item.image1 ? (
              <img src={item.image1} alt={item.name} className="w-full h-full object-cover" />
            ) : item.image2 ? (
              <img src={item.image2} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Component size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "nestedService",
      header: "Parent Nested Service",
      render: (item: SubService) => (
        <span className="inline-flex items-center gap-1.5 bg-rose-50/70 text-rose-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-rose-100/50">
          <Wrench size={12} />
          {item.nestedService?.name || "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: SubService) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <DollarSign size={12} />
          {item.price != null ? `₹${item.price.toLocaleString()}` : "Variable"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: SubService) => <span className="text-slate-400 text-xs font-medium">—</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: SubService) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(item)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => openDeleteModal(item)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={subServices}
      searchKey="name"
      searchPlaceholder="Search sub-services by name..."
      pageSize={10}
    />
  );
}
