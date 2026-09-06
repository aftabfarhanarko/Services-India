"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, Download, Printer, Check, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import InvoiceTemplate1 from "@/components/manual-invoice/InvoiceTemplate1";
import InvoiceTemplate2 from "@/components/manual-invoice/InvoiceTemplate2";

const API = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

export default function InvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState("");

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rajseba_access_token") || localStorage.getItem("token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`${API}/api/manual-invoices/${id}`, { headers: authHeader() });
        if (!res.ok) throw new Error("Invoice not found");
        setInvoice(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => window.print();

  const handlePayment = async () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) { setError("Enter a valid payment amount"); return; }
    setPaying(true);
    try {
      const res = await fetch(`${API}/api/manual-invoices/${id}/payment`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ amountPaid: amount }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Payment update failed");
      }
      const updated = await res.json();
      setInvoice(updated);
      setShowPayModal(false);
      setPayAmount("");
      setPaySuccess(`Payment of ${amount.toLocaleString()} BDT recorded.`);
      setTimeout(() => setPaySuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadPDF = () => {
    // We use the browser's native print engine (Save as PDF) because html2pdf 
    // causes freezing and crashes due to Turbopack compilation issues.
    const originalTitle = document.title;
    document.title = `Invoice-${invoice.invoiceNumber}`;
    
    // This will open the native print dialog where the user can click "Save as PDF"
    window.print();
    
    // Restore the original title
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };


  if (loading) {
    return (
      <div className="mi-container">
        <div className="mi-empty"><div className="mi-spinner" /><p>Loading invoice...</p></div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="mi-container">
        <div className="mi-alert mi-alert-error" style={{ margin: "0 0 20px" }}><AlertTriangle size={18} /> {error}</div>
        <button className="mi-btn mi-btn-secondary" onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      {/* Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Invoice #{invoice.invoiceNumber}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 font-semibold">{invoice.customer.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                invoice.paymentStatus === "Paid"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                  : "bg-rose-50 text-rose-600 border border-rose-200/50"
              }`}>
                {invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            onClick={() => router.push("/dashbord/manual-invoice")}
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          {invoice.paymentStatus !== "Paid" && (
            <button
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 hover:bg-emerald-600 hover:text-white text-emerald-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              onClick={() => setShowPayModal(true)}
            >
              <DollarSign size={16} /> Receive Payment
            </button>
          )}
          <button
            className="flex items-center gap-2 bg-slate-50 border border-slate-205 hover:bg-slate-105 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            onClick={handleDownloadPDF}
          >
            <Download size={16} /> Download PDF
          </button>
          <button
            className="flex items-center gap-2 bg-[#FF6014] hover:bg-[#e0530a] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm shadow-orange-500/10 cursor-pointer active:scale-95"
            onClick={handlePrint}
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {paySuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 text-emerald-600 rounded-xl p-4 text-xs font-bold print:hidden">
          <Check size={18} /> {paySuccess}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/50 text-rose-600 rounded-xl p-4 text-xs font-bold print:hidden">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* Due amount warning banner */}
      {invoice.paymentStatus === "Due" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 print:hidden">
          <span className="text-amber-800 font-bold text-xs flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" /> Outstanding due: <strong>{Number(invoice.dueAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</strong>
          </span>
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
            onClick={() => setShowPayModal(true)}
          >
            Receive Payment
          </button>
        </div>
      )}

      {/* Invoice template */}
      <div id="invoice-print-area" className="max-w-[210mm] mx-auto w-full overflow-x-auto">
        {invoice.templateName === "template2" ? (
          <InvoiceTemplate2 invoice={invoice} />
        ) : (
          <InvoiceTemplate1 invoice={invoice} />
        )}
      </div>

      {/* Payment modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 print:hidden">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-50 text-[#FF6014] rounded-2xl">
                <DollarSign size={32} />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Receive Payment</h3>
            <p className="text-xs text-slate-455 mb-6">
              Total Due: <strong className="text-rose-600">{Number(invoice.dueAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</strong>
            </p>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014]/40 mb-6"
              type="number"
              placeholder="Enter amount received (BDT)"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
              min="1"
              max={invoice.dueAmount}
              autoFocus
            />
            <div className="flex gap-3 justify-center">
              <button
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:bg-slate-100 active:scale-95"
                onClick={() => setShowPayModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-[#FF6014] hover:bg-[#e0530a] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-orange-500/10 active:scale-95"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? "Saving..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
