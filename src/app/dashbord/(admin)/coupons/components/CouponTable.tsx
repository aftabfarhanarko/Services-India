"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { Coupon } from "@/redux/features/admin/coupon";

interface CouponTableProps {
  coupons: Coupon[];
  openEdit: (coupon: Coupon) => void;
  setDeleteTarget: (coupon: Coupon | null) => void;
}

export default function CouponTable({ coupons, openEdit, setDeleteTarget }: CouponTableProps) {
  const columns = [
    {
      key: "code",
      header: "Code",
      render: (item: Coupon) => <span className="font-black text-slate-800 tracking-wide">{item.code}</span>,
    },
    {
      key: "discount",
      header: "Discount",
      render: (item: Coupon) => (
        <span className="font-bold text-[#FF6014]">
          {item.discount_type === "percentage"
            ? `${item.discount_value}%`
            : `₹${Number(item.discount_value).toLocaleString()}`}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      render: (item: Coupon) => (
        <span className="text-xs font-semibold text-slate-600">
          {item.used_count}
          {item.usage_limit ? ` / ${item.usage_limit}` : " / ∞"}
        </span>
      ),
    },
    {
      key: "validity",
      header: "Validity",
      render: (item: Coupon) => (
        <span className="text-xs text-slate-500 font-medium">
          {item.valid_from || "—"} → {item.valid_until || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Coupon) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            item.is_active
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Coupon) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(item)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={coupons} />;
}
