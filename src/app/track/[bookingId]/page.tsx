"use client";

import React, { useEffect, useRef } from 'react';
import { useGetBookingTrackingQuery } from '@/redux/features/admin/booking';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TrackingPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const { data: response, isLoading, isError } = useGetBookingTrackingQuery(bookingId, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 3000, // Poll backend every 3 seconds for real-time status updates
  });

  const booking = response?.data;
  const prevStatusRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (booking?.status && prevStatusRef.current && prevStatusRef.current !== booking.status) {
      const formattedStatus = booking.status.replace(/_/g, ' ').toUpperCase();
      toast.success(`Booking Status Updated: ${formattedStatus}`, {
        description: `Your booking #${booking.id} is now ${formattedStatus}`,
      });
    }
    if (booking?.status) {
      prevStatusRef.current = booking.status;
    }
  }, [booking?.status, booking?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
           <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#FF6014] mx-auto mb-4"></div>
           <p className="text-gray-500 font-medium text-sm">Loading live tracking information...</p>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-500 text-sm">The booking you are trying to track does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const rawStatus = (booking.status || '').toLowerCase().trim();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_the_way':
      case 'on the way': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed': return 'Your booking has been received and is waiting to be assigned to a professional.';
      case 'assigned': return 'A professional service provider has been assigned to your booking!';
      case 'on_the_way':
      case 'on the way': return 'The assigned professional is currently on their way to your location.';
      case 'completed': return 'The service has been completed successfully. Thank you for choosing Rajseba!';
      case 'cancelled': return 'This booking has been cancelled. If you have any questions, please contact support.';
      default: return 'Your booking status is currently being updated in real-time.';
    }
  };

  const serviceLabel = booking.service?.name || booking.pkg?.name || booking.subServices?.map((s: any) => s.name).join(', ') || 'Service';

  const steps = [
    { id: 'pending', label: 'Pending', time: booking.createdAt },
    { id: 'assigned', label: 'Assigned', time: booking.assignedAt },
    { id: 'on_the_way', label: 'On The Way', time: booking.onTheWayAt },
    { id: 'completed', label: 'Completed', time: booking.completedAt }
  ];

  const statusMap: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    assigned: 1,
    on_the_way: 2,
    "on the way": 2,
    completed: 3
  };

  const currentStepIndex = statusMap[rawStatus] ?? 0;

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#FFF8F4] border-b border-[#FF6014]/15 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Track Booking</h1>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Sync
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400">Booking #{booking.id}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={booking.status}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border shadow-2xs ${getStatusColor(rawStatus)}`}
            >
              {booking.status.replace(/_/g, ' ')}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status Message with Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={booking.status}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`p-4 px-6 sm:px-8 border-b ${
              rawStatus === 'completed' ? 'bg-emerald-50/70 border-emerald-100' :
              rawStatus === 'cancelled' ? 'bg-rose-50/70 border-rose-100' :
              rawStatus === 'pending' || rawStatus === 'confirmed' ? 'bg-amber-50/70 border-amber-100' :
              rawStatus === 'on_the_way' || rawStatus === 'on the way' ? 'bg-purple-50/70 border-purple-100' :
              'bg-blue-50/70 border-blue-100'
            }`}
          >
            <p className={`text-xs font-extrabold ${
              rawStatus === 'completed' ? 'text-emerald-800' :
              rawStatus === 'cancelled' ? 'text-rose-800' :
              rawStatus === 'pending' || rawStatus === 'confirmed' ? 'text-amber-800' :
              rawStatus === 'on_the_way' || rawStatus === 'on the way' ? 'text-purple-800' :
              'text-blue-800'
            }`}>
              {getStatusMessage(rawStatus)}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tracking Flow */}
        {rawStatus !== 'cancelled' && (
          <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 overflow-x-auto">
            <div className="flex items-center min-w-[480px] justify-between">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index <= currentStepIndex;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={{
                          scale: isActive ? [1, 1.15, 1] : 1,
                        }}
                        transition={{
                          repeat: isActive ? Infinity : 0,
                          repeatDelay: 2,
                          duration: 0.8,
                        }}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                          isActive ? 'bg-[#FF6014] text-white ring-4 ring-[#FF6014]/20 shadow-md shadow-[#FF6014]/30' :
                          isCompleted ? 'bg-[#FF6014] text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </motion.div>
                      <div className="text-center mt-1">
                        <span className={`block text-xs font-extrabold ${isActive ? 'text-[#FF6014]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        {step.time && (
                          <span className={`block text-[10px] mt-0.5 font-bold ${isActive ? 'text-[#FF6014]/80' : isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                            {formatTime(step.time)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`flex-1 flex items-center justify-center -mt-8 transition-colors ${isCompleted && index < currentStepIndex ? 'text-[#FF6014]' : 'text-slate-200'}`}>
                        <svg className="w-6 h-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Service Details */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Service Details</h3>
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <p className="font-extrabold text-slate-900 text-base">{serviceLabel}</p>
              
              {booking.subServices && booking.subServices.length > 0 && (
                <div className="mt-3 mb-1 space-y-2">
                  {booking.subServices.map((sub: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100 shadow-2xs font-semibold text-slate-800">
                      <span>{sub.name}</span>
                      <span className="text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-bold">Qty: {sub.quantity || 1}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs font-bold text-slate-600 flex flex-col sm:flex-row sm:gap-6 gap-2">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#FF6014]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {booking.date}
                </div>
                {booking.time && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#FF6014]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {booking.time}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location</h3>
              <p className="text-slate-800 text-xs font-bold leading-relaxed">{booking.location}</p>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount</h3>
              <p className="text-[#FF6014] font-black text-2xl">₹{Number(booking.total_price || 0).toLocaleString()}</p>
              {booking.payment_status && (
                 <p className="text-xs font-bold text-slate-500 capitalize mt-0.5">Payment: {booking.payment_status}</p>
              )}
            </div>
          </div>

          {/* Assigned Agent/Employee Info (Optional) */}
          {(booking.agent || (booking.employees && booking.employees.length > 0)) && (
            <div className="pt-6 border-t border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Personnel</h3>
               
               <div className="space-y-3">
                  {booking.agent && (
                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] font-black text-sm">
                        {booking.agent.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{booking.agent.name}</p>
                        <p className="text-[11px] font-bold text-slate-400">Agent</p>
                      </div>
                    </div>
                  )}

                  {booking.employees && booking.employees.length > 0 && booking.employees.map((emp: any) => (
                    <div key={emp.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm">
                        {emp.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{emp.name}</p>
                        <p className="text-[11px] font-bold text-slate-400">Service Provider</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50/60 p-6 text-center border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Need help with your booking?</p>
          <a href="/contact" className="text-[#FF6014] text-xs font-extrabold hover:underline mt-1 inline-block">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
