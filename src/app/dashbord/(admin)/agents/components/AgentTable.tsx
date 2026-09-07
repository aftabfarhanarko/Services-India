"use client";

import React from "react";
import Link from "next/link";
import { Eye, ShieldCheck, XCircle, Ban, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";

interface AgentItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
  categoryName?: string;
  companyName?: string;
  location?: string;
  description?: string;
  shop_image1?: string;
  shop_image2?: string;
  nid_number?: string;
  nid_front?: string;
  nid_back?: string;
  devision?: string;
  district?: string;
  area?: string;
}

interface AgentTableProps {
  agents: AgentItem[];
  openDropdownId: string | null;
  setOpenDropdownId: (val: string | null) => void;
  setSelectedUser: (val: AgentItem | null) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function AgentTable({
  agents,
  setSelectedUser,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: AgentTableProps) {
  const columns = [
    {
      key: "name",
      header: "Agent Details",
      render: (user: AgentItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            {user.phone && user.phone !== "No Phone" && (
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "companyName",
      header: "Company Name",
      render: (user: AgentItem) => <span className="font-bold text-slate-700 text-xs">{user.companyName}</span>,
    },
    {
      key: "nid_number",
      header: "Govt ID (Aadhaar)",
      render: (user: AgentItem) => <span className="font-bold text-slate-600 text-xs">{user.nid_number || "N/A"}</span>,
    },
    {
      key: "devision",
      header: "Territory Region",
      render: (user: AgentItem) => (
        <span className="font-bold text-slate-500 text-xs">
          {user.devision && user.devision !== "N/A" ? `${user.devision} / ${user.district} / ${user.area}` : "Not Set"}
        </span>
      ),
    },
    { key: "joined", header: "Joined Date" },
    {
      key: "status",
      header: "Status",
      render: (user: AgentItem) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            user.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : user.status === "blocked"
              ? "bg-[#FFF8F4] text-[#E0530A]"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: AgentItem) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details */}
          <Link
            href={`/dashbord/agents/${user.id}`}
            title="View Agent Details (ডিটেইলস দেখুন)"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95 group relative"
          >
            <Eye size={16} />
          </Link>

          {/* Activate */}
          {user.status !== "active" && (
            <button
              onClick={() => handleActivate(user.id)}
              title="Activate Agent (সক্রিয় করুন)"
              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 active:scale-95 group relative"
            >
              <ShieldCheck size={16} />
            </button>
          )}

          {/* Deactivate */}
          {user.status !== "inactive" && (
            <button
              onClick={() => handleDeactivate(user.id)}
              title="Deactivate Agent (নিষ্ক্রিয় করুন)"
              className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-200 active:scale-95 group relative"
            >
              <XCircle size={16} />
            </button>
          )}

          {/* Block */}
          {user.status !== "blocked" && (
            <button
              onClick={() => handleBlock(user.id)}
              title="Block Agent (ব্লক করুন)"
              className="p-2 text-[#E0530A] hover:text-[#C84500] hover:bg-[#FFF8F4] rounded-xl transition-all duration-200 active:scale-95 group relative"
            >
              <Ban size={16} />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => handleDelete(user.id)}
            title="Delete Agent (ডিলিট করুন)"
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95 group relative"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={agents}
      searchKey="name"
      searchPlaceholder="Search agents by name..."
      filterKey="status"
      filterPlaceholder="All Statuses"
      filterOptions={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Blocked", value: "blocked" },
      ]}
      pageSize={10}
    />
  );
}
