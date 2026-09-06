"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Users, AlertTriangle, Lock, User, Check } from "lucide-react";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

interface Customer {
  id: number | null;
  name: string;
  phone: string;
  email?: string;
  address: string;
  invoiceCount: number;
  totalBilled: number;
  isSystemUser: boolean;
  createdAt?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"directory" | "register">("directory");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [clientRoleId, setClientRoleId] = useState<number | null>(null);

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const [ur, ir, rr] = await Promise.all([
        fetch(`${API}/users`, { headers: authHeader() }),
        fetch(`${API}/api/manual-invoices`, { headers: authHeader() }),
        fetch(`${API}/roles`, { headers: authHeader() }),
      ]);
      if (!ur.ok) throw new Error("Failed to load customers");
      const uData = await ur.json();
      const usersList = uData?.data || (Array.isArray(uData) ? uData : []);

      const invoices = ir.ok ? await ir.json() : [];

      const rData = rr.ok ? await rr.json() : null;
      const rolesList = rData?.data || (Array.isArray(rData) ? rData : []);
      const clientRole = rolesList.find((r: any) => r.name?.toLowerCase() === "client" || r.name?.toLowerCase() === "customer");
      if (clientRole) {
        setClientRoleId(clientRole.id);
      }

      // Map to store unique clients
      const clientsMap = new Map<string, Customer>();

      const formatPhoneForCompare = (p: string) => {
        if (!p) return "";
        const digits = p.replace(/\D/g, "");
        return digits.length >= 11 ? digits.slice(-11) : digits;
      };

      // 1. Add all system clients (with Client/Customer role)
      const clientsOnly = usersList.filter((u: any) => 
        u.role?.name?.toLowerCase() === "client" || u.role?.name?.toLowerCase() === "customer" || !u.role
      );

      clientsOnly.forEach((u: any) => {
        const phoneKey = formatPhoneForCompare(u.phone);
        if (phoneKey) {
          clientsMap.set(phoneKey, {
            id: u.id,
            name: u.name,
            phone: u.phone,
            email: u.email || "",
            address: u.profile?.location || "—",
            invoiceCount: 0,
            totalBilled: 0,
            isSystemUser: true,
            createdAt: u.createdAt,
          });
        }
      });

      // 2. Aggregate information from manual invoices
      invoices.forEach((inv: any) => {
        if (inv.customer && inv.customer.phone) {
          const phoneKey = formatPhoneForCompare(inv.customer.phone);
          if (clientsMap.has(phoneKey)) {
            const client = clientsMap.get(phoneKey)!;
            client.invoiceCount += 1;
            client.totalBilled += Number(inv.totalPayableAmount || 0);
            if (client.address === "—" && inv.customer.address) {
              client.address = inv.customer.address;
            }
          } else {
            // Unregistered client who has received an invoice
            clientsMap.set(phoneKey, {
              id: null,
              name: inv.customer.name,
              phone: inv.customer.phone,
              email: inv.customer.email || "",
              address: inv.customer.address || "—",
              invoiceCount: 1,
              totalBilled: Number(inv.totalPayableAmount || 0),
              isSystemUser: false,
              createdAt: inv.createdAt,
            });
          }
        }
      });

      setCustomers(Array.from(clientsMap.values()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setSuccess("");
    if (!name || !phone || !address) { setFormError("Name, phone and address are required."); return; }
    setSaving(true);
    try {
      if (!clientRoleId) {
        throw new Error("Client role not loaded yet. Please try again in a few seconds.");
      }

      // 1. Create User
      const userRes = await fetch(`${API}/users`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ name, phone, email, roleId: clientRoleId }),
      });
      if (!userRes.ok) {
        const d = await userRes.json();
        throw new Error(d.message || "Failed to register user");
      }
      const newUser = await userRes.json();
      const userId = newUser?.data?.id || newUser?.id;

      // 2. Create User Profile with location
      if (userId && address) {
        const profileRes = await fetch(`${API}/profiles`, {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify({ user_id: userId, type: "personal", location: address }),
        });
        if (!profileRes.ok) {
          const d = await profileRes.json();
          console.warn("Failed to create profile: ", d.message);
        }
      }

      setName(""); setPhone(""); setEmail(""); setAddress("");
      setSuccess("Client registered successfully!");
      toast.success("Client registered successfully!");
      setTab("directory");
      fetchCustomers();
    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message || "Failed to register client");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE", headers: authHeader() });
      if (!res.ok) throw new Error("Failed to delete client");
      setCustomers(prev => prev.filter(c => c.id !== id));
      setSuccess("Client deleted successfully!");
      toast.success("Client deleted successfully!");
    } catch {
      setError("Failed to delete client.");
      toast.error("Failed to delete client.");
    }
    setDeleteId(null);
  };

  const filtered = customers.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Directory</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Manage and register customers for quick invoice autofill.</p>
          </div>
        </div>
        <Link
          href="/dashbord/manual-invoice"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          Dashboard
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold animate-pulse">
          <AlertTriangle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 text-emerald-600 rounded-xl p-4 text-xs font-bold">
          <Check size={18} /> {success}
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
          <Users size={15} /> Client Ledger
        </button>
        <button
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:bg-[#FFF8F4] hover:text-[#FF6014] flex items-center gap-1.5 ${
            tab === "register"
              ? "bg-[#FF6014] text-white border-[#FF6014] hover:bg-[#e0530a] hover:text-white shadow-sm"
              : "bg-white text-slate-550 border-slate-200"
          }`}
          onClick={() => setTab("register")}
        >
          <Plus size={15} /> Register Client
        </button>
      </div>

      {tab === "directory" ? (
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                className="w-full bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                placeholder="Search by name, phone or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-400 text-xs font-medium">
              <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading clients...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
                <Users size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">{search ? "No results" : "No customers yet"}</h3>
              <p className="text-xs text-slate-455 mt-1">Register a new client using the Register tab.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Invoices</th>
                    <th className="px-6 py-4 text-right">Billed Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((c, index) => (
                    <tr key={c.id || `guest-${index}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                          {c.name}
                          {c.isSystemUser ? (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                              System User
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/50">
                              Invoice Guest
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{c.phone}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{c.email || "—"}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium max-w-[200px] truncate" title={c.address}>{c.address}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${c.invoiceCount > 0 ? "text-[#FF6014]" : "text-slate-400"}`}>
                          {c.invoiceCount} {c.invoiceCount === 1 ? "Invoice" : "Invoices"}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${c.totalBilled > 0 ? "text-slate-800" : "text-slate-400"}`}>
                        {c.totalBilled > 0 ? `${Number(c.totalBilled).toLocaleString("en-US")} BDT` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {c.id !== null ? (
                          <button
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            onClick={() => setDeleteId(c.id)}
                            title="Delete Customer"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                            <Lock size={12} className="text-slate-450" /> Locked
                          </span>
                        )}
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
              <h2 className="text-base font-extrabold text-slate-900">Register New Client</h2>
              <p className="text-xs text-slate-455 mt-1">
                Saved clients will appear as autocomplete suggestions when creating invoices.
              </p>
            </div>
            {formError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold">
                <AlertTriangle size={18} /> {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Full Name *</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahim Uddin"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Phone *</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="optional@email.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Address *</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 min-h-[80px]"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Full address..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FF6014] hover:bg-[#e0530a] text-white text-xs font-extrabold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm shadow-orange-500/10 cursor-pointer disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Client"}
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
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Delete Customer?</h3>
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
