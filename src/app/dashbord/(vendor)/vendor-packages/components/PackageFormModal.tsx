"use client";

import React from "react";
import { Sparkles, X, Layers, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { Package } from "@/redux/features/vendor/packageApi";

interface PackageFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingItem: Package | null;
  serviceId: string;
  setServiceId: (id: string) => void;
  serviceOptions: any[];
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  featuresList: string[];
  setFeaturesList: (val: string[]) => void;
  selectedNestedIds: number[];
  availableNestedServices: any[];
  toggleNestedService: (id: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
  isUpdating: boolean;
  packageType: string;
  setPackageType: (val: "one_time" | "weekly" | "monthly") => void;
}

export default function PackageFormModal({
  isModalOpen,
  setIsModalOpen,
  editingItem,
  serviceId,
  setServiceId,
  serviceOptions,
  name,
  setName,
  price,
  setPrice,
  description,
  setDescription,
  featuresList,
  setFeaturesList,
  selectedNestedIds,
  availableNestedServices,
  toggleNestedService,
  handleSubmit,
  isCreating,
  isUpdating,
  packageType,
  setPackageType,
}: PackageFormModalProps) {
  if (!isModalOpen) return null;

  const [featureInput, setFeatureInput] = React.useState("");

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="text-violet-500" size={20} />
            {editingItem ? "প্যাকেজ এডিট করুন" : "নতুন প্যাকেজ তৈরি করুন"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Parent Service (create only) */}
          {!editingItem && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                প্যারেন্ট সার্ভিস *
              </label>
              <CustomSelect
                options={serviceOptions}
                value={serviceId}
                onChange={(val) => {
                  setServiceId(val);
                }}
              />
            </div>
          )}

          {/* Package Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              প্যাকেজের ধরন *
            </label>
            <CustomSelect
              options={[
                { value: "one_time", label: "এককালীন (One Time)" },
                { value: "weekly", label: "সাপ্তাহিক (Weekly)" },
                { value: "monthly", label: "মাসিক (Monthly)" },
              ]}
              value={packageType}
              onChange={(val) => setPackageType(val as any)}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              প্যাকেজের নাম *
            </label>
            <Input
              placeholder="যেমন: স্ট্যান্ডার্ড এসি সার্ভিসিং প্যাকেজ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              মূল্য (₹)
            </label>
            <Input
              type="number"
              placeholder="যেমন: ৮০০"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              বিবরণ
            </label>
            <Textarea
              placeholder="এই প্যাকেজে কী কী অন্তর্ভুক্ত আছে তার বিবরণ দিন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/10 focus-visible:border-violet-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all w-full"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              বৈশিষ্ট্যসমূহ
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="যেমন: ফ্রি চেকআপ, ২৪/৭ সাপোর্ট"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0"
              >
                + যোগ করুন
              </button>
            </div>
            {featuresList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {featuresList.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg text-sm border border-violet-100">
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="text-violet-400 hover:text-violet-700 hover:bg-violet-200 p-0.5 rounded-md transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nested Service Multi-Select */}
          {(serviceId !== "NONE" || editingItem) && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                সাব-সার্ভিসসমূহ অন্তর্ভুক্ত করুন ({selectedNestedIds.length}টি নির্বাচিত)
              </label>
              {availableNestedServices.length === 0 && !editingItem ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-center">
                  <Layers className="text-slate-300 mx-auto mb-1" size={24} />
                  <p className="text-xs text-slate-400 font-medium">এই সার্ভিসের জন্য কোনো সাব-সার্ভিস পাওয়া যায়নি।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
                  {(editingItem && availableNestedServices.length === 0
                    ? editingItem.items?.map((i) => i.nestedService) || []
                    : availableNestedServices
                  ).map((ns) => {
                    if (!ns) return null;
                    const isSelected = selectedNestedIds.includes(ns.id);
                    return (
                      <button
                        key={ns.id}
                        type="button"
                        onClick={() => toggleNestedService(ns.id)}
                        className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-left transition-all text-sm ${
                          isSelected
                            ? "bg-violet-50 border border-violet-200/80 text-violet-700 font-bold"
                            : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? "bg-violet-500 text-white" : "border-2 border-slate-200 bg-white"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="truncate">{ns.name}</span>
                        {ns.starting_price != null && (
                          <span className="ml-auto text-xs text-slate-400 font-medium shrink-0">
                            ₹{ns.starting_price.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
            >
              {editingItem ? "প্যাকেজ আপডেট করুন" : "প্যাকেজ তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
