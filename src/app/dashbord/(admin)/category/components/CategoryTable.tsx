"use client";

import React from "react";
import { Folder } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { formatImageUrl } from "@/lib/utils";
import { Category } from "@/redux/features/admin/category";

interface CategoryTableProps {
  categories: Category[];
  openEditModal: (cat: Category) => void;
  openDeleteModal: (cat: Category) => void;
}

export default function CategoryTable({ categories, openEditModal, openDeleteModal }: CategoryTableProps) {
  const columns = [
    {
      key: "name",
      header: "Category Name",
      render: (cat: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFF8F4] text-[#FF6014] font-bold rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            {cat.icon ? (
              cat.icon.startsWith("http") || cat.icon.startsWith("/") ? (
                <img src={formatImageUrl(cat.icon)} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base">{cat.icon}</span>
              )
            ) : (
              <Folder size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{cat.name}</p>
            {cat.parent && (
              <span className="inline-block bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold mt-1">
                Parent: {cat.parent.name}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (cat: Category) => (
        <span className="text-slate-500 text-xs font-medium max-w-[200px] block truncate">
          {cat.description || "—"}
        </span>
      ),
    },
    {
      key: "order",
      header: "Display Order",
      render: (cat: Category) => (
        <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2 py-0.5 rounded-lg">
          {cat.order ?? 0}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (cat: Category) => (
        <span className="text-slate-500 font-medium text-xs">
          {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (cat: Category) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(cat)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(cat)}
            className="bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#E0530A] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={categories}
      searchKey="name"
      searchPlaceholder="Search categories by name..."
      pageSize={10}
    />
  );
}
