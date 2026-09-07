"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, FileText, Palette, Package, Plus, Trash2, Check, AlertTriangle, FilePlus2, Sparkles, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import { CustomSelect } from "@/components/ui/select";

const API = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

interface Customer { id: number; name: string; phone: string; email?: string; address?: string; profile?: { location?: string }; }
interface ServiceItem { id: number; name: string; rate: number; }
interface LineItem { serviceName?: string; description: string; inceFit?: string; qty: number; rate: number; amount: number; }

const EMPTY_ITEM: LineItem = { serviceName: "", description: "", inceFit: "", qty: 1, rate: 0, amount: 0 };
const DEFAULT_PO = { accountName: "RAJSEBA.IN", accountNumber: "02433002451", bankName: "HDFC Bank / ICICI Bank", branch: "Kolkata Branch", routingNumber: "IFSC000123" };

function toWords(n: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (n === 0) return "Zero";
  const convert = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
    if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "");
  };
  const whole = Math.floor(n);
  return convert(whole) + " Taka Only";
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Customer form
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custSuggestions, setCustSuggestions] = useState<Customer[]>([]);
  const [showCustDrop, setShowCustDrop] = useState(false);

  // Invoice meta
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [templateName, setTemplateName] = useState<"template1" | "template2">("template1");
  const [discount, setDiscount] = useState<number | string>("");
  const [signeeName, setSigneeName] = useState("Ariful Islam Arif");
  const [signeeRole, setSigneeRole] = useState("CEO, Rajseba Design Studio");

  // Items
  const [items, setItems] = useState<LineItem[]>([{ ...EMPTY_ITEM }]);
  const [svcSuggestions, setSvcSuggestions] = useState<ServiceItem[][]>([[]]);
  const [showSvcDrop, setShowSvcDrop] = useState<boolean[]>([false]);
  const [activeCatalogIndex, setActiveCatalogIndex] = useState<number | null>(null);

  // Loading & Submit state
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // System roles and registration option
  const [clientRoleId, setClientRoleId] = useState<number | null>(null);
  const [registerAsUser, setRegisterAsUser] = useState(true);

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const [cr, sr, rr] = await Promise.all([
          fetch(`${API}/users`, { headers: authHeader() }),
          fetch(`${API}/api/manual-services`, { headers: authHeader() }),
          fetch(`${API}/roles`, { headers: authHeader() }),
        ]);
        const uData = await cr.json();
        setCustomers(uData?.data || (Array.isArray(uData) ? uData : []));
        setServices(await sr.json());

        const rData = await rr.json();
        const rolesList = rData?.data || (Array.isArray(rData) ? rData : []);
        const clientRole = rolesList.find((r: any) => r.name?.toLowerCase() === "client" || r.name?.toLowerCase() === "customer");
        if (clientRole) {
          setClientRoleId(clientRole.id);
        }
      } catch { /* non-blocking */ } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
    // Auto-generate invoice number
    const now = new Date();
    setInvoiceNumber(`INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 900 + 100)}`);
  }, []);

  const formatPhoneForCompare = (p: string) => {
    if (!p) return "";
    const digits = p.replace(/\D/g, "");
    return digits.length >= 11 ? digits.slice(-11) : digits;
  };

  const isPhoneRegistered = customers.some(
    c => formatPhoneForCompare(c.phone) === formatPhoneForCompare(custPhone)
  );

  // Customer autocomplete
  const handleCustNameChange = (v: string) => {
    setCustName(v);
    if (v.trim().length > 0) {
      const q = v.toLowerCase();
      setSugg(customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)));
      setShowCustDrop(true);
    } else { setShowCustDrop(false); }
  };
  const setSugg = (s: Customer[]) => setCustSuggestions(s.slice(0, 5));
  const selectCustomer = (c: Customer) => {
    setCustName(c.name); setCustPhone(c.phone);
    setCustEmail(c.email || ""); setCustAddress(c.profile?.location || "");
    setShowCustDrop(false);
  };

  // Items
  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    const updated = [...items];
    const isStringField = field === "description" || field === "serviceName" || field === "inceFit";
    const item = { ...updated[i], [field]: isStringField ? value : Number(value) };
    item.amount = item.qty * item.rate;
    updated[i] = item;
    setItems(updated);
  };

  const selectService = (i: number, svc: ServiceItem) => {
    const updated = [...items];
    updated[i] = {
      ...updated[i],
      serviceName: svc.name,
      description: updated[i].description || svc.name,
      rate: Number(svc.rate),
      amount: updated[i].qty * Number(svc.rate),
    };
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { ...EMPTY_ITEM }]);
    setSvcSuggestions([...svcSuggestions, []]);
    setShowSvcDrop([...showSvcDrop, false]);
  };

  const removeItem = (i: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== i));
    setSvcSuggestions(svcSuggestions.filter((_, idx) => idx !== i));
    setShowSvcDrop(showSvcDrop.filter((_, idx) => idx !== i));
  };

  const totalAmount = items.reduce((s, it) => s + it.amount, 0);
  const totalPayable = Math.max(0, totalAmount - Number(discount));
  const amountInWords = toWords(totalPayable);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!invoiceNumber.trim() || !custName.trim() || !custPhone.trim() || !custAddress.trim()) {
      setError("Invoice number and customer details are required."); return;
    }
    if (items.some(it => (!it.serviceName?.trim() && !it.description.trim()) || it.qty <= 0)) {
      setError("All line items must have a service or description and valid quantity."); return;
    }
    setSubmitting(true);
    try {
      let finalCustName = custName.trim();
      let finalCustPhone = custPhone.trim();
      let finalCustEmail = custEmail.trim();
      let finalCustAddress = custAddress.trim();

      // Register user if requested and not already registered
      if (!isPhoneRegistered && registerAsUser && clientRoleId) {
        const userPayload = {
          name: finalCustName,
          phone: finalCustPhone,
          email: finalCustEmail || undefined,
          roleId: clientRoleId,
        };

        const createRes = await fetch(`${API}/users`, {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify(userPayload),
        });

        if (!createRes.ok) {
          const errData = await createRes.json();
          throw new Error(errData.message || "Failed to register new customer as a user");
        }

        const newUser = await createRes.json();
        const newUserId = newUser?.data?.id || newUser?.id;

        if (newUserId && finalCustAddress) {
          const profilePayload = {
            user_id: newUserId,
            type: "personal",
            location: finalCustAddress,
          };
          await fetch(`${API}/profiles`, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify(profilePayload),
          });
        }
        toast.success("Client registered successfully!");
      }

      const body = {
        invoiceNumber: invoiceNumber.trim(),
        date,
        customer: { name: finalCustName, phone: finalCustPhone, email: finalCustEmail, address: finalCustAddress },
        items,
        totalAmount,
        discount: Number(discount),
        totalPayableAmount: totalPayable,
        paidAmount: 0,
        dueAmount: totalPayable,
        paymentStatus: "Due",
        amountInWords,
        templateName,
        paymentOptions: DEFAULT_PO,
        signeeName,
        signeeRole,
      };
      const res = await fetch(`${API}/api/manual-invoices`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to create invoice");
      }
      const created = await res.json();
      toast.success("Invoice created successfully!");
      router.push(`/dashbord/manual-invoice/invoice/${created.id}`);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full space-y-8 animate-in fade-in duration-300 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
              <FilePlus2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Invoice</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Generate a manual billing invoice for offline customers.</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-semibold animate-pulse">Loading Invoice Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Invoice</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Fill in the details below to generate a professional invoice.</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold animate-pulse">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* ── Customer ── */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
              <User size={18} className="text-[#FF6014]" /> Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Customer Name *</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  value={custName}
                  onChange={e => handleCustNameChange(e.target.value)}
                  placeholder="Start typing to search..."
                  autoComplete="off"
                  required
                />
                {showCustDrop && custSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-slate-50">
                    {custSuggestions.map(c => (
                      <div
                        key={c.id}
                        className="px-4 py-2.5 text-xs text-slate-700 hover:bg-[#FFF8F4] hover:text-[#FF6014] cursor-pointer transition-colors"
                        onMouseDown={() => selectCustomer(c)}
                      >
                        <strong>{c.name}</strong> — {c.phone}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Phone *</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  value={custPhone}
                  onChange={e => setCustPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                />
                {!isPhoneRegistered && custPhone.replace(/\D/g, '').length >= 11 && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="registerAsUser"
                      checked={registerAsUser}
                      onChange={(e) => setRegisterAsUser(e.target.checked)}
                      className="w-4 h-4 text-[#FF6014] border-slate-300 rounded focus:ring-[#FF6014]/20 cursor-pointer accent-[#FF6014]"
                    />
                    <label htmlFor="registerAsUser" className="text-xs text-slate-500 font-bold cursor-pointer">
                      🆕 Register as system user (Client)
                    </label>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  type="email"
                  value={custEmail}
                  onChange={e => setCustEmail(e.target.value)}
                  placeholder="customer@email.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Address *</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                  value={custAddress}
                  onChange={e => setCustAddress(e.target.value)}
                  placeholder="Full address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Invoice Meta ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
                <FileText size={18} className="text-[#FF6014]" /> Invoice Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Invoice Number *</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Date *</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Discount (BDT)</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={e => setDiscount(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* ── Template ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Palette size={18} className="text-[#FF6014]" /> Template & Signee
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Template</label>
                  <CustomSelect
                    options={[
                      { value: "template1", label: "Template 1 — RDS Dark Style" },
                      { value: "template2", label: "Template 2 — Rajseba Orange Style" },
                    ]}
                    value={templateName}
                    onChange={val => setTemplateName(val as any)}
                    placeholder="Select template..."
                    size="sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Signee Name</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                    value={signeeName}
                    onChange={e => setSigneeName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Signee Role</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                    value={signeeRole}
                    onChange={e => setSigneeRole(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Line Items ── */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 overflow-visible">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Package size={18} className="text-[#FF6014]" /> Line Items
              </h2>
              <button
                type="button"
                className="flex items-center gap-1.5 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                onClick={addItem}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-xs text-slate-750 border-collapse overflow-visible">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-450 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3 w-10">#</th>
                    <th className="px-4 py-3 min-w-[180px]">Service</th>
                    <th className="px-4 py-3 min-w-[200px]">Description</th>
                    <th className="px-4 py-3 w-28">Ince/Fit</th>
                    <th className="px-4 py-3 w-24">Qty</th>
                    <th className="px-4 py-3 w-28">Rate (BDT)</th>
                    <th className="px-4 py-3 w-32">Amount (BDT)</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 overflow-visible">
                  {items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors overflow-visible">
                      <td className="px-4 py-3.5 text-slate-400 font-bold text-xs">{i + 1}</td>
                      <td className="px-4 py-3.5 relative overflow-visible">
                        {services.length > 0 ? (
                          <CustomSelect
                            options={services.map((s) => ({
                              value: s.name,
                              label: s.name,
                              desc: `${Number(s.rate).toLocaleString()} BDT`,
                            }))}
                            value={item.serviceName || ""}
                            onChange={(val) => {
                              const selectedSvc = services.find((s) => s.name === val);
                              if (selectedSvc) {
                                selectService(i, selectedSvc);
                              } else {
                                updateItem(i, "serviceName", val || "");
                              }
                            }}
                            placeholder="Select Service..."
                            size="sm"
                          />
                        ) : (
                          <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40"
                            value={item.serviceName || ""}
                            onChange={(e) => updateItem(i, "serviceName", e.target.value)}
                            placeholder="Service name..."
                            autoComplete="off"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          placeholder="Item description / details..."
                          autoComplete="off"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                          type="text"
                          placeholder="e.g. 10x12"
                          value={item.inceFit || ""}
                          onChange={e => updateItem(i, "inceFit", e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e => updateItem(i, "qty", e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 transition-all"
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={e => updateItem(i, "rate", e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-800 text-xs">
                        {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          onClick={() => removeItem(i)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals summary */}
            <div className="mt-6 ml-auto max-w-xs space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs text-slate-455 font-medium">
                <span>Subtotal</span>
                <span>{totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
              </div>
              {Number(discount) > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- {Number(discount).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-[#FF6014] border-t border-slate-100 pt-2">
                <span>Total Payable</span>
                <span>{totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold italic text-right">
                {amountInWords}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer hover:bg-slate-100 active:scale-95"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-[#FF6014] hover:bg-[#e0530a] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-orange-500/10 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                Creating...
              </>
            ) : (
              <><Check size={16} /> Create Invoice</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
