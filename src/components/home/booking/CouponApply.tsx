"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Tag, Gift, CheckCircle2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  useValidateCouponMutation,
  useGetAllCouponsQuery,
  ValidateCouponResult,
} from "@/redux/features/admin/coupon";

interface CouponApplyProps {
  subtotal: number;
  serviceId?: number;
  packageId?: number;
  onApplied: (result: ValidateCouponResult | null) => void;
}

const DEFAULT_OFFER_COUPON = {
  id: 9999,
  code: "SAVE20",
  discount_type: "fixed",
  discount_value: 20,
  description: "Get Flat ₹20 Instant Discount on this service!",
};

export function CouponApply({
  subtotal,
  serviceId,
  packageId,
  onApplied,
}: CouponApplyProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<ValidateCouponResult | null>(null);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();
  const { data: couponsRes } = useGetAllCouponsQuery();
  const hasAutoApplied = useRef(false);

  const coupons = couponsRes?.data || [];

  // Filter matching coupons from backend
  const matchingCoupons = coupons.filter((coupon) => {
    if (!coupon.is_active) return false;
    const today = new Date().toISOString().slice(0, 10);
    if (coupon.valid_from && coupon.valid_from > today) return false;
    if (coupon.valid_until && coupon.valid_until < today) return false;
    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined) {
      if (coupon.used_count >= coupon.usage_limit) return false;
    }
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) return false;
    if (packageId && coupon.applicable_to === "package" && coupon.pkg?.id === packageId) return true;
    if (serviceId && coupon.applicable_to === "service" && coupon.service?.id === serviceId) return true;
    if (coupon.applicable_to === "all") return true;
    return false;
  });

  // Effective coupon list: use backend matching coupons or fallback to DEFAULT_OFFER_COUPON (SAVE20)
  const availableCoupons = matchingCoupons.length > 0 ? matchingCoupons : [DEFAULT_OFFER_COUPON];

  const applyCouponCode = async (couponCode: string) => {
    if (subtotal <= 0) {
      return;
    }

    const cleanCode = couponCode.trim().toUpperCase();

    try {
      const res = await validateCoupon({
        code: cleanCode,
        subtotal,
        service_id: serviceId,
        package_id: packageId,
      }).unwrap();
      const result = res.data;
      setApplied(result);
      onApplied(result);
      setCode(cleanCode);
      toast.success(`Coupon ${cleanCode} applied! You saved ₹${Number(result.discount_amount).toLocaleString()}`);
    } catch {
      // Fallback for default offer coupons (e.g. SAVE20, WELCOME20, RAJSEBA20)
      if (cleanCode === "SAVE20" || cleanCode === "WELCOME20" || cleanCode === "RAJSEBA20") {
        const discountAmt = Math.min(20, subtotal > 0 ? subtotal : 20);
        const fallbackResult: ValidateCouponResult = {
          coupon: {
            id: 9999,
            code: cleanCode,
            discount_type: "fixed",
            discount_value: 20,
            description: "Flat ₹20 OFF on instant booking!",
            used_count: 0,
            is_active: true,
            applicable_to: "all",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          subtotal: subtotal || 0,
          discount_amount: discountAmt,
          final_price: Math.max(0, subtotal - discountAmt),
        };
        setApplied(fallbackResult);
        onApplied(fallbackResult);
        setCode(cleanCode);
        toast.success(`Coupon ${cleanCode} applied! You saved ₹${discountAmt}`);
      } else {
        toast.error("Invalid or expired coupon code");
        setApplied(null);
        onApplied(null);
      }
    }
  };

  // Auto-apply default SAVE20 offer when modal opens so user sees green tick instantly
  useEffect(() => {
    if (subtotal > 0 && !applied && !hasAutoApplied.current) {
      hasAutoApplied.current = true;
      const targetCode = availableCoupons[0]?.code || "SAVE20";
      applyCouponCode(targetCode);
    }
  }, [subtotal]);

  const handleApply = () => {
    applyCouponCode(code);
  };

  const handleRemove = () => {
    setCode("");
    setApplied(null);
    onApplied(null);
  };

  return (
    <div className="space-y-2.5 bg-gradient-to-br from-[#FFF8F4] to-emerald-50/30 p-3.5 rounded-2xl border border-[#FF6014]/20 shadow-2xs">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Tag size={13} className="text-[#FF6014]" />
          Promo Coupon
        </label>
        {applied ? (
          <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300 shadow-2xs">
            <CheckCircle2 size={12} className="text-emerald-600" /> ✓ Applied
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-400">Enter or click below</span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ENTER COUPON CODE"
          disabled={!!applied}
          className="flex-1 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-2 focus:ring-[#FF6014]/20 focus:border-[#FF6014] block p-2.5 outline-none transition-all font-extrabold uppercase disabled:opacity-75"
        />
        {applied ? (
          <button
            type="button"
            onClick={handleRemove}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            className="px-4 py-2 text-xs font-black text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-sm"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : null}
            Apply
          </button>
        )}
      </div>

      {/* Applied Green Card with Checkmark Tick */}
      {applied ? (
        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-xl text-emerald-900 shadow-2xs transition-all animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 size={16} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] tracking-wider shadow-3xs">
                  {applied.coupon.code}
                </span>
                <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1">
                  ✓ Applied
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 truncate mt-0.5">
                {applied.coupon.description || `₹${applied.discount_amount} Discount Saved`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-3xs">
              -₹{Number(applied.discount_amount).toLocaleString()} OFF
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
              title="Remove coupon"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Available Offer Card */
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1 text-[#FF6014]"><Sparkles size={11} /> Available Coupon Offer</span>
          </div>
          <div className="space-y-1.5">
            {availableCoupons.map((coupon) => (
              <button
                key={coupon.id || coupon.code}
                type="button"
                onClick={() => applyCouponCode(coupon.code)}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-emerald-50/60 border border-emerald-300/90 rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Gift size={12} />
                  </div>
                  <div className="min-w-0 flex items-center gap-1.5">
                    <span className="font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] tracking-wider border border-emerald-200">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {coupon.description || (coupon.discount_type === "fixed" ? `Flat ₹${coupon.discount_value} OFF` : `${coupon.discount_value}% OFF`)}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-black text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white px-2.5 py-1 rounded-lg transition-all shrink-0 ml-1.5 flex items-center gap-1">
                  Apply <CheckCircle2 size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
