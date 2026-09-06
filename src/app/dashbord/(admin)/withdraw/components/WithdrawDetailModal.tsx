"use client";

import React from "react";
import { X, Wallet } from "lucide-react";
import { Withdraw } from "@/redux/features/shared/withdrawApi";

interface WithdrawDetailModalProps {
  selectedItem: Withdraw | null;
  setSelectedItem: (val: Withdraw | null) => void;
  isUpdating: boolean;
  handleUpdateStatus: (id: number | string, status: "approved" | "rejected" | "pending", admin_note?: string) => void;
  handleDelete: (item: Withdraw) => void;
}

export default function WithdrawDetailModal({
  selectedItem,
  setSelectedItem,
  isUpdating,
  handleUpdateStatus,
  handleDelete,
}: WithdrawDetailModalProps) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8F4] text-[#FF6014] border border-[#FF6014]/20 flex items-center justify-center font-black">
              <Wallet size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Withdraw Request Details</h2>
              <p className="text-[11px] text-slate-400 font-semibold">Request ID #{selectedItem.id}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {[
            { label: "Request ID", value: `#${selectedItem.id}` },
            { label: "Booking ID", value: selectedItem.booking?.id ? `#${selectedItem.booking.id}` : "Manual Request" },
            { label: "Vendor Name", value: selectedItem.vendor?.name || "—" },
            { label: "Vendor Email", value: selectedItem.vendor?.email || "—" },
            { label: "Amount", value: `₹${(selectedItem.amount || 0).toLocaleString()}` },
            { label: "Status", value: selectedItem.status.toUpperCase() },
            { label: "Admin Note", value: selectedItem.admin_note },
            {
              label: "Requested Date",
              value: selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : "—",
            },
          ]
            .filter((item) => item.value !== undefined && item.value !== null)
            .map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-100 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">{label}</span>
                <span className="font-black text-slate-900">{value}</span>
              </div>
            ))}
          <div className="pt-2">
            {selectedItem.getway ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-2 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payment Method / Gateway</p>
                <p className="font-black text-slate-900 uppercase text-xs">{selectedItem.getway.getway_type}</p>
                <p className="text-xs font-mono text-slate-600 truncate mt-1">
                  {selectedItem.getway.info?.details || JSON.stringify(selectedItem.getway.info)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mb-2 font-medium">No payment gateway details attached.</p>
            )}
            {selectedItem.status === "pending" && (
              <div className="mb-4 space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase">
                  Admin Note / Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  id="adminNoteInput"
                  placeholder="e.g., TrxID 987654321"
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl focus:ring-[#FF6014] focus:border-[#FF6014] p-3 outline-none font-semibold shadow-xs"
                />
              </div>
            )}
          </div>
          <div className="pt-2 flex gap-3 justify-end">
            {selectedItem.status === "pending" && (
              <>
                <button
                  disabled={isUpdating}
                  onClick={() => {
                    const note = (document.getElementById("adminNoteInput") as HTMLInputElement)?.value;
                    handleUpdateStatus(selectedItem.id, "approved", note);
                    setSelectedItem(null);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Approve
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => {
                    const note = (document.getElementById("adminNoteInput") as HTMLInputElement)?.value;
                    handleUpdateStatus(selectedItem.id, "rejected", note);
                    setSelectedItem(null);
                  }}
                  className="bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => handleDelete(selectedItem)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
