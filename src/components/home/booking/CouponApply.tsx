"use client";

import { useState } from "react";
import { Loader2, Tag, Gift } from "lucide-react";
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

export function CouponApply({
  subtotal,
  serviceId,
  packageId,
  onApplied,
}: CouponApplyProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<ValidateCouponResult | null>(null);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();
  const { data: couponsRes, isLoading: isLoadingCoupons } = useGetAllCouponsQuery();

  const coupons = couponsRes?.data || [];

  // Filter matching coupons
  const matchingCoupons = coupons.filter((coupon) => {
    if (!coupon.is_active) return false;

    // Check validity date using string comparison to avoid timezone mismatches (matching backend logic)
    const today = new Date().toISOString().slice(0, 10);
    if (coupon.valid_from && coupon.valid_from > today) return false;
    if (coupon.valid_until && coupon.valid_until < today) return false;

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined) {
      if (coupon.used_count >= coupon.usage_limit) {
        return false;
      }
    }

    // Check minimum order amount if subtotal is available
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return false;
    }

    // Match based on packageId or serviceId
    if (packageId) {
      if (coupon.applicable_to === "package" && coupon.pkg?.id === packageId) {
        return true;
      }
    }

    if (serviceId) {
      if (coupon.applicable_to === "service" && coupon.service?.id === serviceId) {
        return true;
      }
    }

    // Global coupons
    if (coupon.applicable_to === "all") {
      return true;
    }

    return false;
  });

  const applyCouponCode = async (couponCode: string) => {
    if (subtotal <= 0) {
      toast.error("Add services before applying a coupon");
      return;
    }

    try {
      const res = await validateCoupon({
        code: couponCode.trim(),
        subtotal,
        service_id: serviceId,
        package_id: packageId,
      }).unwrap();
      const result = res.data;
      setApplied(result);
      onApplied(result);
      setCode(couponCode.toUpperCase());
      toast.success(`Coupon applied! You save ₹${Number(result.discount_amount).toLocaleString()}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired coupon");
      setApplied(null);
      onApplied(null);
    }
  };

  const handleApply = () => {
    applyCouponCode(code);
  };

  const handleRemove = () => {
    setCode("");
    setApplied(null);
    onApplied(null);
  };

  if (isLoadingCoupons) {
    return null;
  }

  if (matchingCoupons.length === 0 && !applied) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Tag size={12} className="text-[#FF6014]" />
        Coupon Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          disabled={!!applied}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none transition-all font-semibold uppercase disabled:opacity-70"
        />
        {applied ? (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Apply
          </button>
        )}
      </div>

      {applied && (
        <p className="text-xs font-semibold text-emerald-600">
          {applied.coupon.code} applied — ₹{Number(applied.discount_amount).toLocaleString()} off
        </p>
      )}

      {/* Available Coupon Suggestion */}
      {!applied && !isLoadingCoupons && matchingCoupons.length > 0 && (
        <div className="pt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Gift size={11} className="text-emerald-500 animate-bounce" />
            Available Offers (Click to Apply)
          </p>
          <div className="flex flex-col gap-2">
            {matchingCoupons.map((coupon) => (
              <button
                key={coupon.id}
                type="button"
                onClick={() => applyCouponCode(coupon.code)}
                disabled={isLoading}
                className="flex items-center justify-between p-3 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/50 hover:border-emerald-300 rounded-xl text-emerald-800 transition-all duration-200 cursor-pointer shadow-3xs group w-full text-left disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
                    <Gift size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] tracking-wider border border-emerald-200/30 mr-1.5">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {coupon.description || (coupon.discount_type === "fixed"
                        ? `Get ₹${coupon.discount_value} discount`
                        : `Get ${coupon.discount_value}% discount`
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-emerald-600 bg-emerald-100/50 group-hover:bg-emerald-600 group-hover:text-white px-2.5 py-1 rounded-lg transition-all shrink-0 ml-2">
                  Get Coupon
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
