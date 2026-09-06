"use client";

import React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { Coupon, CouponDiscountType, CouponApplicableTo } from "@/redux/features/admin/coupon";

interface CouponModalProps {
  editingCoupon: Coupon | null;
  setIsModalOpen: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  form: any;
  setForm: (val: any) => void;
  services: any[];
  packageOptions: any[];
  isCreating: boolean;
  isUpdating: boolean;
}

export default function CouponModal({
  editingCoupon,
  setIsModalOpen,
  handleSubmit,
  form,
  setForm,
  services,
  packageOptions,
  isCreating,
  isUpdating,
}: CouponModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {editingCoupon ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Coupon Code *
              </label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20"
                required
              />
            </div>
            <CustomSelect
              label="Discount Type *"
              options={[
                { value: "percentage", label: "Percentage (%)" },
                { value: "fixed", label: "Fixed Amount (₹)" },
              ]}
              value={form.discount_type}
              onChange={(val) =>
                setForm({ ...form, discount_type: val as CouponDiscountType })
              }
            />
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Discount Value *
              </label>
              <Input
                type="number"
                min={0}
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                required
              />
            </div>
            {form.discount_type === "percentage" && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Max Discount (₹)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.max_discount}
                  onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Min Order Amount (₹)
              </label>
              <Input
                type="number"
                min={0}
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Usage Limit
              </label>
              <Input
                type="number"
                min={1}
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Valid From
              </label>
              <Input
                type="date"
                value={form.valid_from}
                onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Valid Until
              </label>
              <Input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description for internal reference"
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm"
            />
          </div>

          <CustomSelect
            label="Applicable To"
            options={[
              { value: "all", label: "All Bookings" },
              { value: "service", label: "Specific Service" },
              { value: "package", label: "Specific Package" },
            ]}
            value={form.applicable_to}
            onChange={(val) =>
              setForm({
                ...form,
                applicable_to: val as CouponApplicableTo,
                service_id: "",
                package_id: "",
              })
            }
          />

          {form.applicable_to === "service" && (
            <CustomSelect
              label="Select Service"
              options={services.map((s: any) => ({
                value: String(s.id),
                label: s.name,
              }))}
              value={form.service_id}
              onChange={(val) => setForm({ ...form, service_id: val })}
              placeholder="Choose service"
            />
          )}

          {form.applicable_to === "package" && (
            <>
              <CustomSelect
                label="Select Service (for packages)"
                options={services.map((s: any) => ({
                  value: String(s.id),
                  label: s.name,
                }))}
                value={form.service_id}
                onChange={(val) =>
                  setForm({ ...form, service_id: val, package_id: "" })
                }
                placeholder="Choose service"
              />
              <CustomSelect
                label="Select Package"
                options={packageOptions}
                value={form.package_id}
                onChange={(val) => setForm({ ...form, package_id: val })}
                placeholder="Choose package"
                disabled={!form.service_id}
              />
            </>
          )}

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-slate-300 text-[#FF6014] focus:ring-[#FF6014]"
            />
            Active coupon
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl disabled:opacity-70"
            >
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
