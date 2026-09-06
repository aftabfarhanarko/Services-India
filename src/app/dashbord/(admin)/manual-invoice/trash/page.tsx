"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Trash2, RotateCcw, AlertTriangle, ArrowLeft, Hourglass } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string };
  totalPayableAmount: number;
  deletedAt?: string;
}

const fmtDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

const daysRemaining = (deletedAt?: string) => {
  if (!deletedAt) return "Unknown";
  const expiry = new Date(new Date(deletedAt).getTime() + 14 * 24 * 60 * 60 * 1000);
  const diff = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `${diff} days left` : "Expiring soon";
};

export default function TrashPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{ id: number; type: "restore" | "force" } | null>(null);

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/manual-invoices/trash`, { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to load trashed invoices");
      setInvoices(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-invoices/${id}/restore`, { method: "PUT", headers: authHeader() });
      setInvoices(prev => prev.filter(i => i.id !== id));
    } catch {
      setError("Failed to restore invoice.");
    }
    setConfirm(null);
  };

  const handleForceDelete = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-invoices/${id}/force`, { method: "DELETE", headers: authHeader() });
      setInvoices(prev => prev.filter(i => i.id !== id));
    } catch {
      setError("Failed to permanently delete invoice.");
    }
    setConfirm(null);
  };

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.phone.includes(search)
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trash Bin</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Deleted invoices are kept here for 14 days before automatic removal.</p>
          </div>
        </div>
        <Link
          href="/dashbord/manual-invoice"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
              placeholder="Search trashed invoices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 text-xs font-medium">
            <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading trashed invoices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <Trash2 size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">Trash is empty</h3>
            <p className="text-xs text-slate-455 mt-1">{search ? "No results match your search." : "No deleted invoices found."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Deleted On</th>
                  <th className="px-6 py-4">Time Remaining</th>
                  <th className="px-6 py-4 text-right">Amount (BDT)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-slate-400">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{inv.customer.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{inv.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{fmtDate(inv.date)}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{inv.deletedAt ? fmtDate(inv.deletedAt) : "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-200/50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        <Hourglass size={12} /> {daysRemaining(inv.deletedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">
                      {Number(inv.totalPayableAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-600 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                          onClick={() => setConfirm({ id: inv.id, type: "restore" })}
                        >
                          <RotateCcw size={14} /> Restore
                        </button>
                        <button
                          className="flex items-center gap-1 bg-rose-50 border border-rose-200 hover:bg-rose-650 hover:text-white text-rose-600 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                          onClick={() => setConfirm({ id: inv.id, type: "force" })}
                        >
                          Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              {confirm.type === "restore" ? (
                <div className="p-3 bg-emerald-50 text-emerald-650 rounded-2xl">
                  <RotateCcw size={32} />
                </div>
              ) : (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <AlertTriangle size={32} />
                </div>
              )}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              {confirm.type === "restore" ? "Restore Invoice?" : "Permanently Delete?"}
            </h3>
            <p className="text-xs text-slate-450 leading-relaxed mb-6">
              {confirm.type === "restore"
                ? "The invoice will be moved back to the main dashboard."
                : "This action cannot be undone. The invoice will be permanently removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:bg-slate-100 active:scale-95"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className={`flex-1 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95 ${
                  confirm.type === "restore"
                    ? "bg-[#FF6014] hover:bg-[#e0530a] text-white shadow-orange-500/10"
                    : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10"
                }`}
                onClick={() => confirm.type === "restore" ? handleRestore(confirm.id) : handleForceDelete(confirm.id)}
              >
                {confirm.type === "restore" ? "Restore" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
