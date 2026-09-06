"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/ui/table";
import { Calendar, User, Phone, Package as PkgIcon, MapPin, Clock, Trash2, Briefcase, FileText, Download, Eye } from "lucide-react";
import AssignEmployeeModal from "./AssignEmployeeModal";
import { printBookingInvoice } from "@/utils/invoicePrint";

interface BookingTableProps {
  filteredBookings: any[];
  setDeleteModalBookingId: (id: number) => void;
  lang: "bn" | "en";
  handleStatusChange: (id: number, status: string) => void;
  roleName?: string;
}

const translations = {
  bn: {
    schedule: "শিডিউল",
    clientLocation: "ক্লায়েন্ট এবং লোকেশন",
    serviceDetails: "সার্ভিস ডিটেইলস",
    totalPrice: "মোট মূল্য",
    status: "স্ট্যাটাস",
    actions: "অ্যাকশন",
    na: "প্রযোজ্য নয়",
    unknown: "অজানা",
    noService: "কোনো সার্ভিস নির্বাচন করা হয়নি",
    viewDetails: "বিস্তারিত দেখুন",
    updateStatus: "স্ট্যাটাস আপডেট করুন",
    markPending: "পেন্ডিং",
    markAssigned: "অ্যাসাইনড",
    markOnTheWay: "অন দ্যা ওয়ে",
    markCompleted: "কমপ্লিটেড",
    markCancelled: "ক্যান্সেলড",
    phone: "ফোন",
    notes: "নোটস",
    noNotes: "কোনো নোট নেই",
    address: "ঠিকানা",
    assignedVendor: "অ্যাসাইন করা ভেন্ডর"
  },
  en: {
    schedule: "Schedule",
    clientLocation: "Client & Location",
    serviceDetails: "Service Details",
    totalPrice: "Total Price",
    status: "Status",
    actions: "Actions",
    na: "N/A",
    unknown: "Unknown",
    noService: "No service selected",
    viewDetails: "View Details",
    updateStatus: "Update Status",
    markPending: "Pending",
    markAssigned: "Assigned",
    markOnTheWay: "On the Way",
    markCompleted: "Completed",
    markCancelled: "Cancelled",
    phone: "Phone",
    notes: "Notes",
    noNotes: "No notes",
    address: "Address",
    assignedVendor: "Assigned Vendor"
  }
};

import { useGetAllNestedServicesQuery } from '@/redux/features/admin/service';

export default function BookingTable({ filteredBookings, setDeleteModalBookingId, lang, handleStatusChange, roleName }: BookingTableProps) {
  const t = translations[lang];
  const router = useRouter();
  const [assignBooking, setAssignBooking] = useState<any>(null);

  // Fetch all nested services to map sub-services accurately
  const { data: nestedServicesRes } = useGetAllNestedServicesQuery();
  const allNestedServices = nestedServicesRes?.data || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "assigned":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "on_the_way":
        return "bg-purple-50 text-purple-600 border border-purple-200";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border border-rose-200";
      default:
        return "bg-slate-100 text-slate-650";
    }
  };

  const columns = [
    {
      key: "date",
      header: t.schedule,
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap border border-slate-200/50">
            <Calendar size={14} className="text-slate-400" />
            {item.date
              ? new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : t.na}
          </span>
          {item.time && (
             <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-semibold mt-1 ml-1 border border-slate-200/50">
               <Clock size={10} /> {item.time}
             </span>
          )}
        </div>
      ),
    },
    {
      key: "user",
      header: t.clientLocation,
      accessorKey: "user",
      render: (item: any) => {
        const notesStr = item.notes || "";
        const nameInNotes = notesStr.match(/(?:Client Name|Customer Name|Client|Name):\s*([^|\n]+)/i)?.[1]?.trim();
        const phoneInNotes = notesStr.match(/(?:Client Phone|Phone Number|Phone|Tel|Mobile):\s*([^|\n]+)/i)?.[1]?.trim();

        const clientName = nameInNotes || item.user?.name || item.user?.fullName || t.unknown;
        const clientPhone = phoneInNotes || item.user?.phone || item.user?.phoneNumber || item.user?.mobile;

        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
              <User size={14} className="text-slate-400 shrink-0" />
              <span className="truncate max-w-[160px]">{clientName}</span>
            </div>
            {clientPhone && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Phone size={12} className="text-[#FF6014] shrink-0" />
                <span>{clientPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate max-w-[150px]">{item.location}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "service",
      header: t.serviceDetails,
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          {item.subServices && item.subServices.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {item.subServices.map((ss: any) => {
                const qty = item.sub_service_items?.find(
                  (entry: any) => entry.sub_service_id === ss.id
                )?.quantity;
                return (
                  <span
                    key={ss.id}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-semibold"
                  >
                    <Briefcase size={12} /> {ss.name}
                    {qty && qty > 1 ? ` ×${qty}` : ""}
                  </span>
                );
              })}
            </div>
          ) : item.pkg ? (
            <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-lg text-xs font-semibold">
              <PkgIcon size={12} /> {item.pkg.name}
              {item.quantity && item.quantity > 1 ? ` ×${item.quantity}` : ""}
            </span>
          ) : (
            <span className="text-slate-400 italic text-xs font-medium">{t.noService}</span>
          )}
        </div>
      ),
    },
    {
      key: "price",
      header: t.totalPrice,
      accessorKey: "total_price",
      render: (item: any) => <span className="font-bold text-slate-800">₹{item.total_price || 0}</span>,
    },
    {
      key: "status",
      header: t.status,
      accessorKey: "status",
      render: (item: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: t.actions,
      accessorKey: "actions",
      render: (item: any) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => router.push(`/dashbord/manage-bookings/${item.id}`)}
            className="p-2 rounded-xl border border-slate-200 hover:border-slate-800 hover:text-white hover:bg-slate-900 text-slate-700 bg-white transition-all shadow-xs cursor-pointer"
            title={t.viewDetails}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => printBookingInvoice(item)}
            className="p-2 rounded-xl border border-[#FF6014]/20 hover:border-[#FF6014] hover:text-white hover:bg-[#FF6014] text-[#FF6014] bg-[#FF6014]/5 transition-all shadow-xs cursor-pointer"
            title="Download Invoice"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => setDeleteModalBookingId(item.id)}
            className="p-2 rounded-xl border border-rose-200 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-rose-500 bg-rose-50 transition-all shadow-xs cursor-pointer"
            title="Delete Booking"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const getRowClassName = (row: any) => {
    return "bg-white hover:bg-slate-50/80 cursor-pointer transition-colors duration-150";
  };

  const renderExpandedContent = (row: any) => {
    return (
      <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {/* Client Info Section */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><User size={14} /> {t.clientLocation}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                <p className="text-sm font-semibold text-slate-800">{row.user?.name || t.unknown}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{t.phone}</p>
                <p className="text-sm font-semibold text-slate-800">{row.user?.phone || row.phone || t.na}</p>
              </div>
              <div className="md:col-span-2 border-b border-indigo-100 pb-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{t.address}</p>
                <p className="text-sm font-semibold text-slate-800">{row.location || t.na}</p>
              </div>
              <div className="md:col-span-2 pt-1">
                <button 
                  onClick={() => printBookingInvoice(row)}
                  className="w-full flex justify-center items-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Briefcase size={14} /> Service Details</h4>
            
            <div className="space-y-4">
              {roleName !== "vendor" && (
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.assignedVendor}</p>
                  <p className="text-sm font-semibold text-emerald-700">{row.vendor?.name || t.na}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {(() => {
                  // Filter down to only the sub-services that were actually booked (quantity > 0)
                  const actualSubServices = row.subServices?.filter((ss: any) => {
                    if (row.sub_service_items && row.sub_service_items.length > 0) {
                      const qty = row.sub_service_items.find((entry: any) => entry.sub_service_id === ss.id)?.quantity;
                      return qty && qty > 0;
                    }
                    return true;
                  }) || [];

                  // Try to find the nested service name directly from the row
                  let nestedServiceName = row.nestedService?.name || row.nested_service?.name;
                  if (!nestedServiceName && actualSubServices.length > 0) {
                    nestedServiceName = actualSubServices[0].nestedService?.name || actualSubServices[0].nested_service?.name;
                  }

                  // Frontend extraction logic using allNestedServices API
                  if (!nestedServiceName && actualSubServices.length > 0 && allNestedServices.length > 0) {
                    const firstSubServiceId = actualSubServices[0].id;
                    const matchedNs = allNestedServices.find((ns: any) => 
                      ns.subServices?.some((ss: any) => ss.id === firstSubServiceId)
                    );
                    if (matchedNs) {
                      nestedServiceName = matchedNs.name;
                    }
                  }

                  return (
                    <div className="w-full">
                      {/* Service Headers */}
                      {(() => {
                        if (nestedServiceName) {
                          return (
                            <div className="mb-3 p-3 bg-purple-100/50 border border-purple-200 rounded-xl shadow-sm">
                              <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mb-1">Nested Service</p>
                              <p className="text-lg font-black text-purple-700 flex items-center gap-2">
                                <PkgIcon size={18} className="text-purple-600" /> {nestedServiceName}
                              </p>
                            </div>
                          );
                        } else if (row.pkg) {
                          return (
                            <div className="mb-3 p-3 bg-fuchsia-100/50 border border-fuchsia-200 rounded-xl shadow-sm">
                              <p className="text-[10px] text-fuchsia-500 font-black uppercase tracking-widest mb-1">Selected Package</p>
                              <p className="text-lg font-black text-fuchsia-700 flex items-center gap-2">
                                <PkgIcon size={18} className="text-fuchsia-600" /> {row.pkg.name}
                              </p>
                              {row.duration_months && (
                                <p className="text-xs font-semibold text-fuchsia-600 mt-2">
                                  Duration: {row.duration_months} Month(s) {row.expire_date && `(Expires: ${new Date(row.expire_date).toLocaleDateString()})`}
                                </p>
                              )}
                            </div>
                          );
                        } else if (row.service) {
                          return (
                            <div className="mb-3 p-3 bg-blue-100/50 border border-blue-200 rounded-xl shadow-sm">
                              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">Main Service</p>
                              <p className="text-lg font-black text-blue-700 flex items-center gap-2">
                                <Briefcase size={18} className="text-blue-600" /> {row.service.name}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Sub-services */}
                      {(() => {
                        if (actualSubServices.length === 0 && !row.pkg) {
                          return <span className="text-sm text-slate-500 italic">{t.noService}</span>;
                        }

                        if (actualSubServices.length > 0) {
                          return (
                            <div className="mt-4">
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Included Sub-services</p>
                              <div className="grid grid-cols-1 gap-2">
                                {actualSubServices.map((ss: any) => {
                                  const qty = row.sub_service_items?.find((entry: any) => entry.sub_service_id === ss.id)?.quantity || 1;
                                  const price = parseFloat(ss.price) || 0;
                                  const subTotal = price * qty;

                                  return (
                                    <div key={ss.id} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg shadow-sm">
                                      <div className="flex flex-col">
                                        <span className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                                          <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md"><Briefcase size={14} /></span>
                                          {ss.name}
                                        </span>
                                        <span className="text-xs text-emerald-600 font-semibold ml-9 mt-0.5">₹{price} x {qty}</span>
                                      </div>
                                      <span className="text-sm font-black bg-emerald-500 text-white px-3 py-1 rounded-md shadow-xs">
                                        ₹{subTotal}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  );
                })()}
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{t.totalPrice}</p>
                <p className="text-lg font-black text-emerald-700">₹{row.total_price || 0}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {row.notes && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar size={14} /> {t.notes}</h4>
              <p className="text-sm text-amber-900 italic font-medium">{row.notes}</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 flex flex-col gap-6">
          {/* Schedule Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Calendar size={14} /> {t.schedule}</h4>
            <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] text-sky-500 font-bold uppercase mb-1">Date</p>
              <p className="text-sm font-black text-sky-800">
                {row.date ? new Date(row.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : t.na}
              </p>
              
              <div className="mt-3 pt-3 border-t border-sky-200/60">
                <p className="text-[10px] text-sky-500 font-bold uppercase mb-1">Time</p>
                <p className="text-sm font-bold text-sky-700 flex items-center gap-1.5">
                  <Clock size={14} className="text-sky-500" /> {row.time || t.na}
                </p>
              </div>
            </div>
            {row.createdAt && (
              <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center justify-center gap-1">
                <span>Created:</span>
                <span className="font-bold text-slate-500">{new Date(row.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</span>
              </p>
            )}
          </div>

          {/* Update Status Section */}
          {row.status !== "completed" && row.status !== "cancelled" && (
            <div className="bg-slate-800 p-4 rounded-2xl shadow-inner border border-slate-700">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {t.updateStatus}
              </h4>
              <div className="flex flex-col gap-2">
                {row.status === "pending" && (
                  <button
                    onClick={() => setAssignBooking(row)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left border bg-white/10 border-white/20 hover:bg-blue-500 hover:border-blue-400 text-white shadow-sm"
                  >
                    {t.markAssigned}
                  </button>
                )}

                {row.status === "assigned" && (
                  <button
                    onClick={() => handleStatusChange(row.id, "on_the_way")}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left border bg-white/10 border-white/20 hover:bg-purple-500 hover:border-purple-400 text-white shadow-sm"
                  >
                    {t.markOnTheWay}
                  </button>
                )}

                {row.status === "on_the_way" && (
                  <button
                    onClick={() => handleStatusChange(row.id, "completed")}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left border bg-white/10 border-white/20 hover:bg-emerald-500 hover:border-emerald-400 text-white shadow-sm"
                  >
                    {t.markCompleted}
                  </button>
                )}

                {row.status !== "completed" && row.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(row.id, "cancelled")}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left border bg-white/5 border-transparent hover:bg-rose-500 hover:border-rose-400 hover:text-white text-slate-300"
                  >
                    {t.markCancelled}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <CustomTable
        columns={columns}
        data={filteredBookings}
        rowClassName={getRowClassName}
        onRowClick={(row) => router.push(`/dashbord/manage-bookings/${row.id}`)}
        expandableContent={renderExpandedContent}
      />

      <AssignEmployeeModal
        isOpen={!!assignBooking}
        onClose={() => setAssignBooking(null)}
        booking={assignBooking}
        handleStatusChange={handleStatusChange}
        lang={lang}
      />
    </div>
  );
}
