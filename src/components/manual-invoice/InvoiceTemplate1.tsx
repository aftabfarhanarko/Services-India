"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

interface InvoiceItem {
  serviceName?: string;
  description: string;
  inceFit?: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceTemplateProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    customer: { name: string; phone: string; email?: string; address: string };
    items: InvoiceItem[];
    totalAmount: number;
    discount?: number;
    totalPayableAmount: number;
    paidAmount: number;
    dueAmount: number;
    paymentStatus: string;
    amountInWords: string;
    paymentOptions?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch: string;
      routingNumber: string;
    };
    signeeName?: string;
    signeeRole?: string;
  };
}

const fmt = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
};

export default function InvoiceTemplate1({ invoice }: InvoiceTemplateProps) {
  const isPaid = invoice.paymentStatus?.toLowerCase() === "paid";
  const badgeText = isPaid ? "PAID" : "DUE";
  const badgeColor = isPaid ? "#10b981" : "#ff6014";

  return (
    <div
      className="inv-page"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
      }}
    >
      <div>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}
        >
          <div>
            <img
              src="/rajshiblogo.png"
              alt="Rajseba Logo"
              style={{ height: "52px", width: "auto", objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #ff6014 0%, #e0530a 100%)",
              color: "#ffffff",
              padding: "18px 24px",
              borderRadius: "12px",
              fontSize: "11px",
              lineHeight: "1.6",
              width: "280px",
              position: "relative",
              boxShadow: "0 4px 12px rgba(255,96,20,0.2)",
              boxSizing: "border-box",
            }}
          >
            {/* Stamp Badge */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#ffffff",
                color: badgeColor,
                border: `3px solid ${badgeColor}`,
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "16px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                transform: "rotate(8deg)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {badgeText}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0" }}>
              <Phone size={13} style={{ color: "rgba(255, 255, 255, 0.85)" }} />
              <span style={{ fontWeight: 500 }}>+91 1788775100</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0" }}>
              <Mail size={13} style={{ color: "rgba(255, 255, 255, 0.85)" }} />
              <span style={{ fontWeight: 500 }}>info@rajseba.in</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: "6px 0" }}>
              <MapPin size={13} style={{ color: "rgba(255, 255, 255, 0.85)", marginTop: "3px", flexShrink: 0 }} />
              <span style={{ fontWeight: 500 }}>Kaikhali, Kolkata, West Bengal 700052, India</span>
            </div>
          </div>
        </div>

        {/* Invoice Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              fontSize: "11px",
              fontWeight: 500,
              color: "#64748b",
              backgroundColor: "#f8fafc",
              padding: "6px 16px",
              borderRadius: "100px",
              border: "1px solid #f1f5f9",
            }}
          >
            <div>
              Date: <span style={{ fontWeight: 700, color: "#0f172a" }}>{fmtDate(invoice.date)}</span>
            </div>
            <span style={{ width: "1px", height: "12px", backgroundColor: "#e2e8f0" }} />
            <div>
              Invoice #: <span style={{ fontWeight: 700, color: "#0f172a" }}>{invoice.invoiceNumber}</span>
            </div>
          </div>
        </div>

        {/* Bill To Block */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #f1f5f9",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}
            >
              Bill To:
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", lineHeight: 1.5 }}>
              {invoice.customer.name}
            </div>
          </div>
          <div style={{ flex: "0 0 140px", paddingLeft: "15px", boxSizing: "border-box" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}
            >
              Phone:
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", lineHeight: 1.5 }}>
              {invoice.customer.phone}
            </div>
          </div>
          <div style={{ flex: 1.2, paddingLeft: "15px", boxSizing: "border-box" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}
            >
              Address:
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", lineHeight: 1.5 }}>
              {invoice.customer.address}
            </div>
          </div>
        </div>

        {/* Service Details Table */}
        <p
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Service Details:
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "30px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Description of Service
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "12px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  width: "15%",
                }}
              >
                Ince/Fit
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "12px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  width: "10%",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "12px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  width: "20%",
                }}
              >
                Rate (BDT)
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "12px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  width: "20%",
                }}
              >
                Amount (BDT)
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                  {item.serviceName && <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{item.serviceName}</div>}
                  {item.description && (item.description !== item.serviceName) && (
                    <div style={{ fontSize: "12px", color: item.serviceName ? "#64748b" : "#1e293b" }}>{item.description}</div>
                  )}
                  {!item.serviceName && !item.description && "-"}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  {item.inceFit || "-"}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  {item.qty}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#475569",
                    textAlign: "right",
                  }}
                >
                  {fmt(item.rate)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0f172a",
                    textAlign: "right",
                  }}
                >
                  {fmt(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Summary */}
        <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "20px", marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#0f172a",
              marginTop: 0,
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Payment Summary:
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "14px" }}>●</span>
            <div style={{ flex: 1 }}>
              Subtotal:{" "}
              <span style={{ fontWeight: 800, color: "#0f172a" }}>
                {fmt(invoice.totalAmount || (Number(invoice.totalPayableAmount) + Number(invoice.discount || 0)))} BDT
              </span>
            </div>
          </div>

          {Number(invoice.discount || 0) > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#10b981",
              }}
            >
              <span style={{ marginRight: "8px", fontSize: "14px" }}>●</span>
              <div style={{ flex: 1 }}>
                Discount:{" "}
                <span style={{ fontWeight: 800, color: "#10b981" }}>
                  - {fmt(invoice.discount || 0)} BDT
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#2563eb",
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "14px" }}>●</span>
            <div style={{ flex: 1 }}>
              Total Payable Amount:{" "}
              <span style={{ fontWeight: 800, color: "#0f172a" }}>{fmt(invoice.totalPayableAmount)} BDT</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#2563eb",
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "14px" }}>●</span>
            <div style={{ flex: 1 }}>
              Paid Amount:{" "}
              <span style={{ fontWeight: 800, color: "#0f172a" }}>{fmt(invoice.paidAmount)} BDT</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#ff6014",
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "14px" }}>●</span>
            <div style={{ flex: 1 }}>
              Due Amount: <span style={{ fontWeight: 800, color: "#ff6014" }}>{fmt(invoice.dueAmount)} BDT</span>
            </div>
          </div>

          <div style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginTop: "15px" }}>
            <span style={{ marginRight: "8px", fontSize: "14px", color: "#475569" }}>●</span>
            In Words: <span style={{ fontWeight: 700, color: "#1e293b" }}>{invoice.amountInWords} BDT Only</span>
          </div>
        </div>
      </div>

      {/* Signature & Footer Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "50px",
            marginBottom: "20px",
          }}
        >
          <div>{/* Spacer */}</div>
          <div style={{ fontSize: "13px" }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#475569", fontWeight: 500 }}>Sincerely,</p>
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "20px",
                color: "#0f172a",
                marginBottom: "4px",
                fontWeight: 600,
              }}
            >
              {invoice.signeeName ? invoice.signeeName.split(" ")[0] : "Arif"}
            </div>
            <p style={{ fontWeight: 800, color: "#0f172a", margin: 0 }}>{invoice.signeeName || "Ariful Islam Arif"}</p>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", margin: "2px 0 0 0" }}>
              {invoice.signeeRole || "CEO, Rajseba"}
            </p>
          </div>
        </div>

        {/* Footer Pattern */}
        <div
          style={{
            width: "100%",
            height: "50px",
            marginTop: "auto",
            overflow: "hidden",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "50px", display: "block" }}
          >
            <polygon
              points="0,100 120,60 240,100 360,50 480,100 600,55 720,100 840,40 960,100 1080,60 1200,100 1320,50 1440,100"
              fill="#FF6222"
              opacity="0.4"
            />
            <polygon
              points="80,100 180,75 300,100 420,65 540,100 660,70 780,100 900,60 1020,100 1140,70 1260,100 1380,65 1440,100"
              fill="#FF6222"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
