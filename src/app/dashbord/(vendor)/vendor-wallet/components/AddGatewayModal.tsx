"use client";

import React from "react";
import { XCircle } from "lucide-react";

interface AddGatewayModalProps {
  isAddGatewayModalOpen: boolean;
  setIsAddGatewayModalOpen: (open: boolean) => void;
  newGatewayType: string;
  setNewGatewayType: (val: string) => void;
  newGatewayInfo: string;
  setNewGatewayInfo: (val: string) => void;
  handleAddGateway: () => void;
  isCreatingGateway: boolean;
}

export default function AddGatewayModal({
  isAddGatewayModalOpen,
  setIsAddGatewayModalOpen,
  newGatewayType,
  setNewGatewayType,
  newGatewayInfo,
  setNewGatewayInfo,
  handleAddGateway,
  isCreatingGateway,
}: AddGatewayModalProps) {
  if (!isAddGatewayModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Add Payment Method</h3>
          <button onClick={() => setIsAddGatewayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Gateway Type</label>
            <select
              value={newGatewayType}
              onChange={(e) => setNewGatewayType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none"
            >
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
              <option value="binance">Binance</option>
              <option value="bank">Bank</option>
              <option value="visa_card">Visa Card</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Account Details</label>
            <input
              type="text"
              placeholder="e.g. +919876543210 or Account No."
              value={newGatewayInfo}
              onChange={(e) => setNewGatewayInfo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              Enter the phone number, email, or account details for this method.
            </p>
          </div>
          <button
            onClick={handleAddGateway}
            disabled={isCreatingGateway || !newGatewayInfo}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
          >
            {isCreatingGateway ? "Saving..." : "Save Payment Method"}
          </button>
        </div>
      </div>
    </div>
  );
}
