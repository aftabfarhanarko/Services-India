"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, FolderOpen, AlertTriangle, Settings } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

interface ServiceItem { id: number; name: string; rate: number; createdAt: string; }

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"directory" | "register">("directory");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/manual-services`, { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to load services");
      setServices(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setSuccess("");
    if (!name || rate === "") { setFormError("Service name and rate are required."); return; }
    if (Number(rate) < 0) { setFormError("Rate cannot be negative."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/manual-services`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ name, rate: Number(rate) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to save service");
      }
      setName(""); setRate("");
      setSuccess("Service saved successfully!");
      setTab("directory");
      fetchServices();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-services/${id}`, { method: "DELETE", headers: authHeader() });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch {
      setError("Failed to delete service.");
    }
    setDeleteId(null);
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Services & Rates Catalog</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Pre-configure default rates to speed up invoice creation.</p>
          </div>
        </div>
        <Link
          href="/dashbord/manual-invoice"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <Plus size={18} /> Dashboard
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold">
          <AlertTriangle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 text-emerald-600 rounded-xl p-4 text-xs font-bold">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2.5 border-b border-slate-100 pb-3">
        <button
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:bg-[#FFF8F4] hover:text-[#FF6014] flex items-center gap-1.5 ${
            tab === "directory"
              ? "bg-[#FF6014] text-white border-[#FF6014] hover:bg-[#e0530a] hover:text-white shadow-sm"
              : "bg-white text-slate-550 border-slate-200"
          }`}
          onClick={() => setTab("directory")}
        >
          <FolderOpen size={15} /> Catalog Services
        </button>
        <button
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:bg-[#FFF8F4] hover:text-[#FF6014] flex items-center gap-1.5 ${
            tab === "register"
              ? "bg-[#FF6014] text-white border-[#FF6014] hover:bg-[#e0530a] hover:text-white shadow-sm"
              : "bg-white text-slate-550 border-slate-200"
          }`}
          onClick={() => setTab("register")}
        >
          <Plus size={15} /> Register Service
        </button>
      </div>

      {tab === "directory" ? (
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                className="w-full bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                placeholder="Search by service name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-400 text-xs font-medium">
              <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading services...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
                <Settings size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">{search ? "No results" : "No services yet"}</h3>
              <p className="text-xs text-slate-455 mt-1">Register a service in the Register tab to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4 w-16">Icon</th>
                    <th className="px-6 py-4">Service / Description</th>
                    <th className="px-6 py-4">Billing Rate</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                          <Settings size={18} className="text-[#FF6014]" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                      <td className="px-6 py-4 font-bold text-[#FF6014]">
                        {Number(s.rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                        <span className="font-medium text-[10px] text-slate-400">BDT</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          onClick={() => setDeleteId(s.id)}
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Register Catalog Service</h2>
              <p className="text-xs text-slate-455 mt-1">
                Add a service and its rate. It will appear as autocomplete in the invoice builder.
              </p>
            </div>
            {formError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold">
                <AlertTriangle size={18} /> {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Service Name / Description *</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 min-h-[90px] resize-y"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Logo Design for Brand Identity"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Default Billing Rate (BDT) *</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  type="number"
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  placeholder="e.g. 5000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FF6014] hover:bg-[#e0530a] text-white text-xs font-extrabold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm shadow-orange-500/10 cursor-pointer disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Catalog Item"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <AlertTriangle size={32} />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Delete Service?</h3>
            <p className="text-xs text-slate-455 leading-relaxed mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:bg-slate-100 active:scale-95"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-rose-600/10 active:scale-95"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
