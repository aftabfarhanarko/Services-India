"use client";

import React from "react";
import { Zap, Loader2 } from "lucide-react";
import { CustomSelect } from "@/components/ui/select";

import { useQuickBooking } from "./hooks/useQuickBooking";
import { DesktopBookingSidebar } from "@/components/home/booking/DesktopBookingSidebar";
import AccessDenied from "../(client)/components/AccessDenied";

export default function AgentQuickBookingPage() {
  const state = useQuickBooking();

  if (state.role !== "agent" && state.role !== "superadmin" && state.role !== "admin") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Quick Booking Console</h1>
            <p className="text-xs text-slate-400 mt-0.5">Book services instantly based on category.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Left Column: Selection */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">1. Select Service</h3>

          {(state.role === "agent" || state.role === "admin" || state.role === "superadmin") && state.clientOptions.length > 0 && (
            <div className="mb-4">
              <CustomSelect
                label="Select Client (Optional)"
                options={state.clientOptions}
                value={state.selectedClientId}
                onChange={(val) => state.setSelectedClientId(val)}
                placeholder="-- Choose a Client --"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label="Category"
              options={state.loadingCategories ? [{ value: "", label: "Loading..." }] : state.categoryOptions}
              value={state.selectedCategoryId}
              onChange={(val) => {
                state.setSelectedCategoryId(val);
                state.setSelectedServiceId("");
              }}
              placeholder="Select a category"
            />

            {state.selectedCategoryId && (
              <CustomSelect
                label="Service"
                options={state.loadingServices ? [{ value: "", label: "Loading..." }] : state.serviceOptions}
                value={state.selectedServiceId}
                onChange={(val) => state.setSelectedServiceId(val)}
                placeholder="Select service"
              />
            )}
          </div>

          {state.selectedServiceId && state.displayServices.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Available Sub-services</h4>
              <div className="space-y-4">
                {state.displayServices.map((serviceGroup: any) => (
                  <div key={serviceGroup.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                    <h5 className="font-bold text-slate-700 text-sm mb-3">{serviceGroup.title}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(serviceGroup.subServices || []).map((sub: any) => {
                        const quantity = state.cartQuantities[sub.id] || 0;
                        return (
                          <div key={sub.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-xs text-slate-800">{sub.name}</p>
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                              <span className="font-bold text-[#FF6014] text-sm">₹{sub.price}</span>
                              {quantity > 0 ? (
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                                  <button onClick={() => state.handleUpdateQuantity(sub.id, -1)} type="button" className="w-6 h-6 rounded text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer">-</button>
                                  <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                                  <button onClick={() => state.handleUpdateQuantity(sub.id, 1)} type="button" className="w-6 h-6 rounded text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer">+</button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => state.handleUpdateQuantity(sub.id, 1)}
                                  className="text-[10px] font-bold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Booking Sidebar (Cart) */}
        <div className="sticky top-[100px]">
          <DesktopBookingSidebar
            cartItems={state.cartItems}
            cartItemCount={state.cartItemCount}
            cartTotal={state.cartTotal}
            payableTotal={state.payableTotal}
            appliedCoupon={state.appliedCoupon}
            setAppliedCoupon={state.setAppliedCoupon}
            bookingDetails={state.bookingDetails}
            setBookingDetails={state.setBookingDetails}
            isBooking={state.submitting}
            onSubmit={state.handleBookingSubmit}
            serviceId={Number(state.selectedServiceId)}
            onUpdateQuantity={state.handleUpdateQuantity}
            onRemoveFromCart={state.handleRemoveFromCart}
            onClearCart={state.handleClearCart}
          />
        </div>
      </div>
    </div>
  );
}
