"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetBookingByIdQuery, useUpdateBookingStatusMutation, useDeleteBookingMutation, useAssignEmployeeToBookingMutation } from "@/redux/features/admin/booking";
import { useGetEmployeesByVendorQuery } from "@/redux/features/admin/user";
import { Calendar, User, Phone, Package as PkgIcon, MapPin, Briefcase, ShieldCheck, Trash2, ArrowLeft, Clock, CheckCircle, XCircle, Mail, FileText, ChevronRight, AlertCircle } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useConfirm } from "@/context/ConfirmDialogContext";
import { printBookingInvoice } from "@/utils/invoicePrint";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'assigned': return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'on_the_way': return 'bg-purple-50 text-purple-600 border border-purple-200';
    case 'completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'cancelled': return 'bg-[#FFF8F4] text-[#E0530A] border border-[#FF6014]/30';
    default: return 'bg-slate-50 text-slate-600 border border-slate-200';
  }
};

export default function BookingDetailsPage() {
  const confirm = useConfirm();
  const { id } = useParams();
  const router = useRouter();
  const bookingId = Array.isArray(id) ? id[0] : id;

  const { data: response, isLoading, isError } = useGetBookingByIdQuery(bookingId as string, {
    skip: !bookingId
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [assignEmployee, { isLoading: isAssigning }] = useAssignEmployeeToBookingMutation();

  const booking = response?.data;

  const { data: vendorEmployeesRes, isLoading: isLoadingEmployees } = useGetEmployeesByVendorQuery(
    booking?.vendor?.id,
    { skip: !booking?.vendor?.id }
  );

  const vendorEmployees = vendorEmployeesRes?.data || [];

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const rawRole = useAppSelector((state: any) => state.auth?.role);

  // Helper to extract clean information from booking notes
  const notesText = booking?.notes || "";
  const nameInNotes = notesText.match(/(?:Client Name|Customer Name|Client|Name):\s*([^|\n]+)/i)?.[1]?.trim();
  const displayClientName = nameInNotes || booking?.user?.name || booking?.user?.fullName || "Client";

  const phoneInNotes = notesText.match(/(?:Client Phone|Phone Number|Phone|Tel|Mobile):\s*([^|\n]+)/i)?.[1]?.trim();
  const displayClientPhone = phoneInNotes || booking?.user?.phone || booking?.user?.phoneNumber || booking?.user?.mobile || "No phone provided";

  const serviceInNotes = notesText.match(/(?:Service Details|Requested Service|Service Inquiry|Service):\s*([^|\n]+)/i)?.[1]?.trim();
  const instructionsInNotes = notesText.match(/(?:Instructions|Details|Notes|Requirements):\s*([^|\n]+)/i)?.[1]?.trim();
  const cleanRawNotes = notesText.replace(/^["']|["']$/g, '').trim();

  useEffect(() => {
    if (booking?.employees) {
      setSelectedEmployees(booking.employees.map((e: any) => e.id));
    }
  }, [booking?.employees]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <p className="text-lg font-medium">Booking not found or an error occurred.</p>
        <Link href="/dashbord/manage-bookings" className="mt-4 text-brand-primary hover:underline">
          Return to Bookings
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: booking.id, status: newStatus }).unwrap();
      toast.success("Booking status updated successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update status");
    }
  };

  const handleToggleEmployee = (id: number) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSaveAssignments = async () => {
    try {
      await assignEmployee({ id: booking.id, employee_ids: selectedEmployees }).unwrap();
      toast.success("Employees assigned successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to assign employees");
    }
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Booking?",
      message: "Are you sure you want to delete this booking? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteBooking(booking.id).unwrap();
      toast.success("Booking deleted successfully");
      router.push("/dashbord/manage-bookings");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete booking");
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 bg-white p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashbord/manage-bookings"
            className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Details</h1>
              <span className="bg-[#FF6014]/10 text-[#FF6014] border border-[#FF6014]/30 text-xs font-black px-3 py-1 rounded-full">
                ID: #{booking.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">Manage client request details, workforce assignment, and service workflow status.</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => printBookingInvoice(booking)}
            className="flex items-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold px-5 py-3 rounded-2xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <FileText size={16} />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Columns: Details */}
        <div className="lg:col-span-2 space-y-8">

          {/* Status & Control Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Current Booking Status</p>
                <span className={`px-4 py-2 rounded-full text-xs font-black capitalize shadow-xs inline-flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                  {booking.status === 'pending' && <Clock size={14} />}
                  {booking.status === 'assigned' && <ShieldCheck size={14} />}
                  {booking.status === 'on_the_way' && <MapPin size={14} />}
                  {booking.status === 'completed' && <CheckCircle size={14} />}
                  {booking.status === 'cancelled' && <XCircle size={14} />}
                  {booking.status}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 sm:text-right">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Update Status</label>
                <div className="w-56">
                  <Select
                    value={booking.status}
                    onValueChange={(val) => handleStatusChange(val)}
                    disabled={isUpdating || booking.status === 'completed'}
                  >
                    <SelectTrigger className="w-full h-11 bg-white border border-slate-300 rounded-2xl text-xs font-black text-slate-800 shadow-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-100 shadow-xl bg-white p-1.5">
                      <SelectItem value="pending" className="font-extrabold text-xs">Pending Approval</SelectItem>
                      <SelectItem value="assigned" className="font-extrabold text-xs">Vendor Assigned</SelectItem>
                      <SelectItem value="on_the_way" className="font-extrabold text-xs">Professional On The Way</SelectItem>
                      <SelectItem value="completed" className="font-extrabold text-xs">Service Completed</SelectItem>
                      <SelectItem value="cancelled" className="font-extrabold text-xs">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="p-2 bg-[#FFF8F4] text-[#FF6014] rounded-xl border border-[#FF6014]/20"><User size={16} /></span>
              Client Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Name */}
              <div className="flex items-center gap-3.5 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Client Name</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{displayClientName}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-3.5 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-2.5 bg-white text-[#FF6014] rounded-xl border border-orange-200/80 shadow-2xs shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{displayClientPhone}</p>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-3.5 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 break-all">{booking.user?.email || "No email provided"}</p>
                </div>
              </div>

              {/* Service Location */}
              <div className="flex items-center gap-3.5 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Service Location</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5 leading-relaxed">{booking.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes / Special Instructions Card */}
          {booking.notes && (
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-amber-900 tracking-tight flex items-center gap-2 border-b border-amber-100 pb-3">
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200"><FileText size={16} /></span>
                Special Instructions / Client Notes
              </h3>
              
              <div className="space-y-3">
                {serviceInNotes && (
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 rounded-2xl p-3 text-xs font-black text-[#FF6014]">
                    <Briefcase size={15} className="shrink-0 text-[#FF6014]" />
                    <span>Requested Service Option: {serviceInNotes}</span>
                  </div>
                )}

                {instructionsInNotes ? (
                  <p className="text-sm text-slate-800 leading-relaxed font-bold pl-3 border-l-4 border-amber-400 bg-amber-50/50 py-3 pr-3 rounded-r-xl">
                    {instructionsInNotes}
                  </p>
                ) : !serviceInNotes && cleanRawNotes ? (
                  <p className="text-sm text-slate-800 leading-relaxed font-bold pl-3 border-l-4 border-amber-400 bg-amber-50/50 py-3 pr-3 rounded-r-xl">
                    {cleanRawNotes}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Schedule, Service, Workforce */}
        <div className="space-y-8">

          {/* Schedule Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200"><Calendar size={16} /></span>
              Schedule Detail
            </h3>
            
            <div className="flex items-center gap-4">
              {booking.date ? (
                <>
                  {/* Calendar Widget Graphic */}
                  <div className="flex flex-col items-center w-20 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs shrink-0">
                    <div className="w-full bg-[#FF6014] text-white text-[10px] font-black text-center py-1 uppercase tracking-wider">
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-2xl font-black text-slate-900 py-2">
                      {new Date(booking.date).toLocaleDateString('en-US', { day: '2-digit' })}
                    </div>
                    <div className="w-full border-t border-slate-200 bg-slate-50 text-[9px] font-black text-slate-600 text-center py-1 truncate">
                      {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </div>
                  </div>

                  {/* Date & Time Text Details */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Scheduled Date</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Service Window</p>
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-xl text-xs font-black mt-1 shadow-xs">
                        <Clock size={13} className="text-blue-600" />
                        {booking.time || "Time not specified"}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl w-full text-center">
                  <Calendar className="text-slate-400 mb-2 animate-bounce" size={24} />
                  <p className="text-xs font-black text-slate-800">Not Scheduled Yet</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">No schedule has been set for this booking request.</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>Request Created</span>
              <span className="text-slate-800 font-extrabold">{new Date(booking.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
            </div>
          </div>

          {/* Service Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200"><Briefcase size={16} /></span>
              Service Details
            </h3>

            {booking.subServices && booking.subServices.length > 0 ? (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Sub-Services
                </span>
                <div className="space-y-2.5">
                  {booking.subServices.map((sub: any) => {
                    const qty = booking.sub_service_items?.find(
                      (entry: any) => entry.sub_service_id === sub.id
                    )?.quantity || 1;
                    return (
                      <div key={sub.id} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                        <p className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <Briefcase size={14} className="text-purple-600" /> {sub.name}
                          {qty > 1 ? <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md font-black">×{qty}</span> : null}
                        </p>
                        <p className="text-xs font-black text-[#FF6014]">₹{Number(sub.price) * qty}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : booking.pkg ? (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Selected Package
                </span>
                <div className="p-4 bg-white border border-purple-200 rounded-2xl shadow-xs">
                  <p className="text-sm font-black text-slate-900">
                    {booking.pkg.name}
                    {booking.quantity && booking.quantity > 1 ? ` ×${booking.quantity}` : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-rose-50/50 border border-rose-200 rounded-2xl text-center space-y-2">
                <AlertCircle size={24} className="text-rose-500 mx-auto" />
                <p className="text-xs font-black text-rose-800">No Service Details</p>
                <p className="text-[10px] text-rose-600 font-medium">No service or package is currently attached to this booking.</p>
              </div>
            )}
          </div>

          {/* Assigned Workforce Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200"><ShieldCheck size={16} /></span>
              Workforce Assignment
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">Assigned Vendor</p>
                {booking.vendor ? (
                  <div className="flex items-center gap-3 p-3.5 bg-white border border-emerald-200 rounded-2xl shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                      {booking.vendor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{booking.vendor.name}</p>
                      <p className="text-[10px] text-emerald-700 font-extrabold mt-0.5">Active Agency Partner</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2.5 rounded-2xl">
                    Pending Vendor Assignment
                  </p>
                )}
              </div>

              {booking.vendor && !(typeof rawRole === 'string' && rawRole.toLowerCase() === 'agent') && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Assign Professionals</p>

                  {isLoadingEmployees ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold py-2">
                      <div className="w-4 h-4 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
                      Loading staff...
                    </div>
                  ) : vendorEmployees.length > 0 ? (
                    <div className="space-y-3">
                      <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {vendorEmployees.map((emp: any) => {
                          const isChecked = selectedEmployees.includes(emp.id);
                          return (
                            <label
                              key={emp.id}
                              className={`flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer border transition-all ${isChecked
                                  ? "bg-[#FFF8F4] border-[#FF6014] shadow-xs"
                                  : "bg-white border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleEmployee(emp.id)}
                                className="mt-1 w-4 h-4 text-[#FF6014] border-slate-300 rounded focus:ring-[#FF6014]/20 accent-[#FF6014]"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">{emp.name}</p>
                                {emp.profile?.category && (
                                  <p className="text-[10px] text-slate-500 font-bold mt-0.5 truncate">{emp.profile.category.name}</p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <button
                        onClick={handleSaveAssignments}
                        disabled={isAssigning}
                        className="w-full py-3 bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-black rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isAssigning ? "Saving assignments..." : "Save Assignments"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-3 rounded-2xl border border-amber-200">
                      No employees registered under this vendor agency.
                    </p>
                  )}

                  {booking.employees && booking.employees.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">Currently Assigned Staff:</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.employees.map((emp: any) => (
                          <span key={emp.id} className="text-[10px] text-emerald-800 font-black flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
                            <CheckCircle size={12} className="text-emerald-600" /> {emp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete / Dangerous Area */}
      {!(typeof rawRole === 'string' && rawRole.toLowerCase() === 'agent') && (
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">Dangerous Area</h4>
            <p className="text-xs text-rose-700 mt-1 font-extrabold">Deleting this booking will permanently erase it from the platform logs.</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-3 text-xs font-black text-[#E0530A] bg-white border border-[#FF6014]/40 hover:bg-[#FFF8F4] hover:border-[#FF6014] rounded-2xl transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={15} />
            {isDeleting ? "Deleting..." : "Delete Booking Record"}
          </button>
        </div>
      )}
    </div>
  );
}
