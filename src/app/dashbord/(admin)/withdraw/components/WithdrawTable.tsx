"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import type { TableAction } from "@/components/ui/table";
import { Withdraw } from "@/redux/features/shared/withdrawApi";

interface WithdrawTableProps {
  withdraws: Withdraw[];
  setSelectedItem: (val: Withdraw | null) => void;
  setActionModal: (val: { type: "approved" | "rejected"; item: Withdraw } | null) => void;
}

export default function WithdrawTable({ withdraws, setSelectedItem, setActionModal }: WithdrawTableProps) {
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      rejected: "bg-[#FFF8F4] text-[#E0530A] border-[#FFF0EB]",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock size={11} />,
      approved: <CheckCircle2 size={11} />,
      rejected: <XCircle size={11} />,
    };
    const cls = map[status] || "bg-slate-100 text-slate-600 border-slate-200";
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-xl border ${cls}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: "vendor",
      header: "Vendor",
      render: (item: Withdraw) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center text-sm">
            {item.vendor?.name?.charAt(0)?.toUpperCase() || "V"}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.vendor?.name || "—"}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.vendor?.email || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "booking",
      header: "Booking",
      render: (item: Withdraw) => (
        <span className="text-sm font-medium text-slate-700">
          {item.booking?.id ? `#${item.booking.id}` : "Manual Request"}
        </span>
      ),
    },
    {
      key: "service",
      header: "Service & Client",
      render: (item: Withdraw) => (
        <div className="flex flex-col">
          <span className="text-slate-800 font-bold text-sm">
            {item.booking?.service?.name || item.booking?.pkg?.name || "—"}
          </span>
          <span className="text-xs text-slate-500">{item.booking?.user?.name || "—"}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: Withdraw) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          ₹{(item.amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Withdraw) => statusBadge(item.status),
    },
    {
      key: "createdAt",
      header: "Requested",
      render: (item: Withdraw) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const tableActions: TableAction<Withdraw>[] = [
    {
      label: "Approve",
      icon: CheckCircle2,
      onClick: (item) => setActionModal({ type: "approved", item }),
      variant: "default",
    },
    {
      label: "Reject",
      icon: XCircle,
      onClick: (item) => setActionModal({ type: "rejected", item }),
      variant: "destructive",
    },
    {
      label: "View Details",
      onClick: (item) => setSelectedItem(item),
      variant: "secondary",
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={withdraws}
      actions={tableActions}
      searchKey="status"
      filterKey="status"
      filterPlaceholder="All Statuses"
      filterOptions={[
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ]}
      pageSize={10}
    />
  );
}
