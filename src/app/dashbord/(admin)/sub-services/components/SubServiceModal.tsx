"use client";

import React from "react";
import { X, Sparkles, PlusCircle, Trash2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { SubService } from "@/redux/features/admin/service";

interface SubServiceModalProps {
  editingItem: SubService | null;
  setIsModalOpen: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  nestedServiceOptions: any[];
  nestedServiceId: string;
  setNestedServiceId: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  isCreating: boolean;
  isUpdating: boolean;

  description: string;
  setDescription: (val: string) => void;
  image1: string;
  setImage1: (val: string) => void;
  image2: string;
  setImage2: (val: string) => void;
  faq: { question: string; answer: string }[];
  setFaq: (val: { question: string; answer: string }[]) => void;
  isUploadingImage1: boolean;
  isUploadingImage2: boolean;
  handleImage1Upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImage2Upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SubServiceModal({
  editingItem,
  setIsModalOpen,
  handleSubmit,
  nestedServiceOptions,
  nestedServiceId,
  setNestedServiceId,
  name,
  setName,
  price,
  setPrice,
  isCreating,
  isUpdating,
  description,
  setDescription,
  image1,
  setImage1,
  image2,
  setImage2,
  faq,
  setFaq,
  isUploadingImage1,
  isUploadingImage2,
  handleImage1Upload,
  handleImage2Upload,
}: SubServiceModalProps) {

  const handleAddFaq = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const updated = faq.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFaq(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="text-[#FF6014]" size={20} />
            {editingItem ? "Edit Sub-Service" : "Add New Sub-Service"}
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
          {/* Parent Nested Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Parent Nested Service *
            </label>
            <CustomSelect options={nestedServiceOptions} value={nestedServiceId} onChange={setNestedServiceId} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sub-Service Name *
            </label>
            <Input
              placeholder="e.g. 1.5 TON AC Servicing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Price (₹) *
            </label>
            <Input
              type="number"
              placeholder="e.g. 1200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description / Inclusions
            </label>
            <Textarea
              placeholder="Enter detailed description of what is included in this sub-service..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6014]/10 focus-visible:border-[#FF6014]/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all w-full"
            />
          </div>

          {/* Image 1 Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Showcase Image 1
            </label>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                {image1 ? (
                  <>
                    <img src={image1} alt="Preview 1" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage1("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-slate-400" size={20} />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <label className="cursor-pointer bg-[#FF6014] hover:bg-[#E0530A] text-white text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/10">
                  {isUploadingImage1 ? "Uploading..." : "Browse Photo 1"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage1Upload}
                    disabled={isUploadingImage1}
                    className="hidden"
                  />
                </label>
                <p className="text-[9px] text-slate-400">Square size recommended (Max 6MB).</p>
              </div>
            </div>
          </div>

          {/* Image 2 Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Showcase Image 2
            </label>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                {image2 ? (
                  <>
                    <img src={image2} alt="Preview 2" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage2("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-slate-400" size={20} />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <label className="cursor-pointer bg-[#FF6014] hover:bg-[#E0530A] text-white text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/10">
                  {isUploadingImage2 ? "Uploading..." : "Browse Photo 2"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage2Upload}
                    disabled={isUploadingImage2}
                    className="hidden"
                  />
                </label>
                <p className="text-[9px] text-slate-400">Square size recommended (Max 6MB).</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                FAQs / Q&A Section
              </label>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs font-bold text-[#FF6014] flex items-center gap-1 hover:underline"
              >
                <PlusCircle size={14} /> Add FAQ
              </button>
            </div>
            {faq.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No FAQs added yet. Click 'Add FAQ' above.</p>
            ) : (
              <div className="space-y-4">
                {faq.map((item, idx) => (
                  <div key={idx} className="space-y-2 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`Question #${idx + 1}`}
                        value={item.question}
                        onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                        className="flex-1 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="p-2 text-[#FF6014] hover:bg-[#FFF0EB] rounded-lg transition-all shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <Textarea
                      placeholder={`Answer #${idx + 1}`}
                      value={item.answer}
                      onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                      rows={2}
                      className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6014] w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating || isUploadingImage1 || isUploadingImage2}
              className="bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/10"
            >
              {editingItem ? "Update Sub-Service" : "Create Sub-Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
