"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Eye, Users, Settings, FileText, AlertTriangle, Receipt, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { CustomSelect } from "@/components/ui/select";

const API = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

interface CatalogService { id: number; name: string; rate: number; }
interface InvoiceItem { description: string; inceFit?: string; qty: number; rate: number; amount: number; }
interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string; address: string };
  items?: InvoiceItem[];
  totalPayableAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "Paid" | "Due";
  templateName: string;
  createdAt: string;
}

const fmt = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return d; }
};

export default function ManualInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Paid" | "Due">("all");
  const [servicesList, setServicesList] = useState<CatalogService[]>([]);
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "";
      const res = await fetch(`${API}/api/manual-invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || "Could not load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogServices = async () => {
    try {
      const token = localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "";
      const res = await fetch(`${API}/api/manual-services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setServicesList(Array.isArray(data) ? data : []);
      }
    } catch { /* non-blocking */ }
  };

  useEffect(() => {
    fetchInvoices();
    fetchCatalogServices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "";
      const res = await fetch(`${API}/api/manual-invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete invoice");
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      setError(err.message || "Failed to move invoice to trash.");
    }
  };

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customer.name.toLowerCase().includes(q) ||
      inv.customer.phone.includes(q) ||
      (inv.items && inv.items.some((it) => it.description?.toLowerCase().includes(q) || it.inceFit?.toLowerCase().includes(q)));
    const matchesFilter = filter === "all" || inv.paymentStatus === filter;
    const matchesService =
      serviceFilter === "all" ||
      !serviceFilter ||
      (inv.items && inv.items.some((it) => it.description?.toLowerCase() === serviceFilter.toLowerCase()));
    return matchesSearch && matchesFilter && matchesService;
  });

  const totalRevenue = invoices.reduce((s, i) => s + Number(i.totalPayableAmount), 0);
  const totalPaid = invoices.reduce((s, i) => s + Number(i.paidAmount), 0);
  const totalDue = invoices.reduce((s, i) => s + Number(i.dueAmount), 0);
  const countPaid = invoices.filter((i) => i.paymentStatus === "Paid").length;
  const countDue = invoices.filter((i) => i.paymentStatus === "Due").length;

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manual Invoice Dashboard</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Manage all your manual invoices, track payments and due amounts.</p>
          </div>
        </div>
        <Link href="/dashbord/manual-invoice/create" className="flex items-center gap-2 bg-[#FF6014] text-white hover:bg-[#e0530a] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer active:scale-[0.98]">
          <Plus size={18} /> Create Invoice
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        {/* Total Invoices */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-sm transition-all hover:translate-y-[-3px] hover:border-[#FF6014]/20 hover:shadow-md duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-350 group-hover:bg-[#FF6014] transition-colors" />
          <div className="flex justify-between items-start pl-1">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Invoices</div>
              <div className="text-3xl font-black text-slate-800 mt-2.5 leading-none">{invoices.length}</div>
              <div className="text-xs text-slate-500 mt-3 font-semibold flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" /> {countPaid} paid
                <span className="text-slate-300">·</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" /> {countDue} due
              </div>
            </div>
            <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100/60 shadow-xs transition-colors group-hover:bg-[#FF6014]/5 group-hover:text-[#FF6014] group-hover:border-[#FF6014]/10">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-sm transition-all hover:translate-y-[-3px] hover:border-[#FF6014]/20 hover:shadow-md duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF6014]" />
          <div className="flex justify-between items-start pl-1">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Revenue</div>
              <div className="text-3xl font-black text-[#FF6014] mt-2.5 leading-none">{fmt(totalRevenue)}</div>
              <div className="text-xs text-slate-500 mt-3 font-semibold">BDT · all generated invoices</div>
            </div>
            <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs transition-colors group-hover:bg-[#FF6014] group-hover:text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-sm transition-all hover:translate-y-[-3px] hover:border-emerald-250 hover:shadow-md duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex justify-between items-start pl-1">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Collected</div>
              <div className="text-3xl font-black text-emerald-600 mt-2.5 leading-none">{fmt(totalPaid)}</div>
              <div className="text-xs text-slate-500 mt-3 font-semibold">BDT · paid amount</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/60 shadow-xs transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Outstanding Due */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-sm transition-all hover:translate-y-[-3px] hover:border-rose-250 hover:shadow-md duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="flex justify-between items-start pl-1">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Outstanding Due</div>
              <div className="text-3xl font-black text-rose-600 mt-2.5 leading-none">{fmt(totalDue)}</div>
              <div className="text-xs text-slate-500 mt-3 font-semibold">BDT · pending collection</div>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100/60 shadow-xs transition-colors group-hover:bg-rose-500 group-hover:text-white">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm overflow-hidden print:hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
              placeholder="Search by invoice #, customer name, phone, or service catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {servicesList.length > 0 && (
              <div className="w-64">
                <CustomSelect
                  options={[
                    { value: "all", label: "Catalog Services: All" },
                    ...servicesList.map((svc) => ({
                      value: svc.name,
                      label: svc.name,
                      desc: `${Number(svc.rate).toLocaleString()} BDT`,
                    })),
                  ]}
                  value={serviceFilter}
                  onChange={(val) => setServiceFilter(val || "all")}
                  placeholder="Catalog Services: All"
                  size="sm"
                />
              </div>
            )}
            {(["all", "Paid", "Due"] as const).map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-205 cursor-pointer hover:bg-[#FFF8F4] hover:text-[#FF6014] ${
                  filter === f
                    ? "bg-[#FF6014] text-white border-[#FF6014] hover:bg-[#e0530a] hover:text-white"
                    : "bg-white text-slate-550 border-slate-200"
                }`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 m-6 text-xs font-bold">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 text-xs font-medium">
            <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading invoices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <FileText size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">{search || filter !== "all" ? "No results found" : "No invoices yet"}</h3>
            <p className="text-xs text-slate-450 mt-1">
              {search || filter !== "all" ? "Try adjusting your search or filter." : "Click \"Create Invoice\" to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total (BDT)</th>
                  <th className="px-6 py-4">Paid (BDT)</th>
                  <th className="px-6 py-4">Due (BDT)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-[#FF6014]">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{inv.customer.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{inv.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">{fmtDate(inv.date)}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{fmt(inv.totalPayableAmount)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{fmt(inv.paidAmount)}</td>
                    <td className={`px-6 py-4 font-bold ${inv.dueAmount > 0 ? "text-rose-600" : "text-slate-500"}`}>
                      {fmt(inv.dueAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block ${
                        inv.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                          : "bg-rose-50 text-rose-600 border border-rose-200/50"
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/dashbord/manual-invoice/invoice/${inv.id}`}
                          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 hover:bg-[#FFF8F4] hover:text-[#FF6014] text-slate-600 font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <Eye size={14} /> View
                        </Link>
                        <button
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          onClick={() => setDeleteConfirmId(inv.id)}
                          title="Move to Trash"
                        >
                          <Trash2 size={16} />
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

      {/* Quick links */}
      <div className="flex items-center gap-3 flex-wrap print:hidden">
        <Link
          href="/dashbord/manual-invoice/customers"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <Users size={16} /> Client Directory
        </Link>
        <Link
          href="/dashbord/manual-invoice/services"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <Settings size={16} /> Service Catalog
        </Link>
        <Link
          href="/dashbord/manual-invoice/trash"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <Trash2 size={16} /> Trash Bin
        </Link>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <AlertTriangle size={32} />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Move to Trash?</h3>
            <p className="text-xs text-slate-450 leading-relaxed mb-6">
              The invoice will be moved to the trash bin and can be restored within 14 days.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:bg-slate-100 active:scale-95"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-rose-600/10 active:scale-95"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
