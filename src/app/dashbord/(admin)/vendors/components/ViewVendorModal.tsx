"use client";

import React from "react";
import { XCircle } from "lucide-react";

interface VendorItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  categoryName?: string;
  profile?: any;
  commission_percentage: number;
  wallet_balance: number;
}

interface ViewVendorModalProps {
  selectedUser: VendorItem | null;
  setSelectedUser: (val: VendorItem | null) => void;
}

export default function ViewVendorModal({ selectedUser, setSelectedUser }: ViewVendorModalProps) {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Vendor Details</h2>
          <button
            onClick={() => setSelectedUser(null)}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Name</span>
            <span className="text-sm font-bold text-slate-900">{selectedUser.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Email</span>
            <span className="text-sm font-bold text-slate-900">{selectedUser.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Phone</span>
            <span className="text-sm font-bold text-slate-900">{selectedUser.phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Category</span>
            <span className="text-sm font-bold text-slate-900">{selectedUser.categoryName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Commission</span>
            <span className="text-sm font-bold text-slate-900">{selectedUser.commission_percentage}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Wallet Balance</span>
            <span className="text-sm font-bold text-emerald-600">
              ₹{(selectedUser.wallet_balance || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Status</span>
            <span className="text-sm font-bold text-slate-900">{selectedUser.status}</span>
          </div>
        </div>
        <div className="pt-6 flex justify-end">
          <button
            onClick={() => setSelectedUser(null)}
            className="px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
