import React from 'react';
import { X, Download } from 'lucide-react';
import dayjs from 'dayjs';
import { printBookingInvoice } from '@/utils/invoicePrint';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function InvoiceModal({ isOpen, onClose, booking }: InvoiceModalProps) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    printBookingInvoice(booking);
  };

  const invoiceNo = `INV-RS-${dayjs(booking.createdAt).format('YYYY')}-${booking.id}`;
  const invoiceDate = dayjs(booking.createdAt).format('MMMM D, YYYY');
  
  const isPaid = booking.payment_status?.toLowerCase() === 'paid' || booking.status === 'completed';
  const badgeText = isPaid ? 'PAID' : 'DUE';

  const totalPayable = parseFloat(booking.total_price || booking.subtotal || 0);
  const paidAmount = isPaid ? totalPayable : 0;
  const dueAmount = totalPayable - paidAmount;

  const actualSubServices = booking.subServices?.filter((ss: any) => {
    if (booking.sub_service_items && booking.sub_service_items.length > 0) {
      const qty = booking.sub_service_items.find((entry: any) => entry.sub_service_id === ss.id)?.quantity;
      return qty && qty > 0;
    }
    return true;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl flex flex-col max-h-[95vh] shadow-2xl overflow-hidden relative">
        {/* Header Actions */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg">Invoice Preview</h2>
            <p className="text-xs text-slate-400 font-medium">Verify details before printing or saving.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shadow-[#FF6014]/20 cursor-pointer active:scale-95"
            >
              <Download size={16} /> Download PDF
            </button>
            <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-50/30 flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden flex flex-col justify-between min-h-[750px]">
            <div className="p-8 space-y-8">
              {/* Header: Logo & Contact Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6">
                <div>
                  <img src="/rajshiblogo.png" alt="Rajseba Logo" className="h-14 w-auto object-contain" />
                </div>
                
                <div className="bg-gradient-to-br from-[#ff6014] to-[#e0530a] text-white p-5 rounded-2xl text-[11px] max-w-[280px] shadow-md shadow-[#ff6014]/20 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.11-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                    </svg>
                    <span className="font-semibold">+8801813333373</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                    </svg>
                    <span className="font-semibold">info@rajseba.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-white/80 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                    </svg>
                    <span className="font-semibold leading-normal">5th floor, incubation center, Hi-tech park, Rajshahi</span>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="text-center relative">
                <h2 className="text-2xl font-black text-slate-900 tracking-wider uppercase">INVOICE</h2>
                <div className="flex justify-center gap-8 mt-2 text-xs font-semibold text-slate-500">
                  <div>Date: <span className="text-slate-800 font-bold">{invoiceDate}</span></div>
                  <div>Invoice #: <span className="text-slate-800 font-bold">{invoiceNo}</span></div>
                  <div>Booking ID: <span className="text-slate-800 font-bold">#{booking.id}</span></div>
                </div>
                {/* Stamp */}
                <div className={`absolute top-0 right-0 sm:right-4 border-2 rounded-lg px-3 py-1 text-xs font-black tracking-wider uppercase transform rotate-6 shadow-xs ${
                  isPaid ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-[#FF6014] text-[#FF6014] bg-[#FFF8F4]'
                }`}>
                  {badgeText}
                </div>
              </div>

              {/* Bill To & Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Bill To</p>
                  <h3 className="text-sm font-bold text-slate-950">{booking.user?.name || booking.name || 'Guest Client'}</h3>
                  <p className="text-xs text-slate-500 mt-1">{booking.user?.phone || booking.phone || '—'}</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[280px] leading-relaxed">{booking.location || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Service Details</p>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Service Category:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {booking.service?.name || booking.pkg?.name || 'Service Booking'}
                      </span>
                    </div>
                    {booking.vendor && (
                      <div className="flex justify-between border-t border-slate-200/50 pt-1.5 mt-1.5">
                        <span className="font-medium">Assigned Expert:</span>
                        <span className="font-bold text-emerald-600 text-right">{booking.vendor.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                      <th className="py-2.5 pb-3">Description of Service</th>
                      <th className="py-2.5 pb-3 text-center">Qty</th>
                      <th className="py-2.5 pb-3 text-right">Rate</th>
                      <th className="py-2.5 pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {actualSubServices.length > 0 ? (
                      actualSubServices.map((ss: any, idx: number) => {
                        const qty = booking.sub_service_items?.find((entry: any) => entry.sub_service_id === ss.id)?.quantity || 1;
                        const price = parseFloat(ss.price) || 0;
                        const amount = price * qty;
                        return (
                          <tr key={idx} className="text-slate-700 font-medium">
                            <td className="py-3">
                              <span className="font-bold text-slate-800">{ss.name}</span>
                              {ss.description && <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{ss.description}</p>}
                            </td>
                            <td className="py-3 text-center">{qty}</td>
                            <td className="py-3 text-right">₹{price.toLocaleString()}</td>
                            <td className="py-3 text-right font-bold text-slate-900">₹{amount.toLocaleString()}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="text-slate-700 font-medium">
                        <td className="py-3 font-bold text-slate-850">
                          {booking.pkg ? booking.pkg.name : (booking.service?.name || 'Service Booking')}
                        </td>
                        <td className="py-3 text-center">{booking.quantity || 1}</td>
                        <td className="py-3 text-right">₹{totalPayable.toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-slate-900">₹{totalPayable.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-100 pt-6">
                <div className="space-y-1.5 text-xs text-slate-500 max-w-sm">
                  <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Payment Summary</p>
                  <p>● Total Payable Amount: <span className="font-bold text-slate-800">₹{totalPayable.toLocaleString()}.00 BDT</span></p>
                  <p>● Paid Amount: <span className="font-bold text-slate-800">₹{paidAmount.toLocaleString()}.00 BDT</span></p>
                  <p className={`font-bold ${dueAmount > 0 ? 'text-[#FF6014]' : 'text-slate-500'}`}>● Due Amount: ₹{dueAmount.toLocaleString()}.00 BDT</p>
                </div>
                
                <div className="w-full sm:w-80 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Subtotal:</span>
                    <span className="font-bold text-slate-800">₹{totalPayable.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Discount:</span>
                    <span className="font-bold text-emerald-600">- ₹0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Tax / VAT:</span>
                    <span className="font-bold text-slate-800">₹0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                    <span className="text-slate-800">Total Amount:</span>
                    <span className="text-[#FF6014]">₹{totalPayable.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature & Footer Pattern */}
            <div className="mt-auto">
              <div className="flex justify-between items-end p-8 pt-0 text-xs">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider mb-1">Terms & Conditions</p>
                  <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                    Please make payments to Rajseba. For queries or help, please contact info@rajseba.com.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-medium">Sincerely,</p>
                  <p className="font-serif italic text-lg text-slate-800 mt-1">Arif</p>
                  <p className="font-bold text-slate-900">Ariful Islam Arif</p>
                  <p className="text-[10px] text-slate-400">CEO, Rajseba</p>
                </div>
              </div>

              {/* Premium brand footer pattern */}
              <div className="w-full overflow-hidden rounded-b-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-8 block">
                  <polygon points="0,100 120,60 240,100 360,50 480,100 600,55 720,100 840,40 960,100 1080,60 1200,100 1320,50 1440,100" fill="#FF6222" opacity="0.4" />
                  <polygon points="80,100 180,75 300,100 420,65 540,100 660,70 780,100 900,60 1020,100 1140,70 1260,100 1380,65 1440,100" fill="#FF6222" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
