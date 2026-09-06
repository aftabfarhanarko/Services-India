"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetAllNestedServicesQuery } from "@/redux/features/admin/service";
import { useAppSelector } from "@/redux/hooks";
import { ArrowLeft, Layers, Image as ImageIcon, Wrench, DollarSign, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ViewNestedServicePage() {
  const router = useRouter();
  const params = useParams();
  const nestedServiceId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";

  const { data: apiNestedRes, isLoading } = useGetAllNestedServicesQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const nested = apiNestedRes?.data?.find((ns: any) => String(ns.id) === String(nestedServiceId));

  if (!nested) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500 text-lg font-medium">Nested service not found!</p>
        <button
          onClick={() => router.back()}
          className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subServices = nested.subServices || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 font-bold rounded-xl flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {nested.name}
            </h1>
            <p className="text-sm font-medium text-slate-500">
              নেস্টেড সার্ভিস বিস্তারিত
            </p>
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">নেস্টেড সার্ভিসের নাম</label>
              <p className="text-slate-900 font-medium">{nested.name}</p>
            </div>
            
            {nested.service && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">প্যারেন্ট সার্ভিস</label>
                <div className="inline-flex items-center gap-1.5 bg-[#FFF8F4]/70 text-[#E0530A] font-bold text-xs px-2.5 py-1 rounded-xl border border-[#FFF0EB]/50">
                  <Wrench size={12} />
                  {nested.service.name}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">শুরুর মূল্য</label>
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
                <DollarSign size={12} />
                {nested.starting_price != null ? `₹${nested.starting_price.toLocaleString()}` : "Variable"}
              </div>
            </div>

            {nested.description && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">ডেসক্রিপশন</label>
                <div 
                  className="prose prose-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100"
                  dangerouslySetInnerHTML={{ __html: nested.description }}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">প্রচ্ছদ ছবি</label>
            {nested.image ? (
              <img src={nested.image} alt={nested.name} className="w-full h-48 object-cover rounded-xl border border-slate-200" />
            ) : (
              <div className="w-full h-48 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="text-sm font-medium">কোনো ছবি নেই</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Services */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers size={18} className="text-indigo-500" />
          সাব-সার্ভিসেস / অপশনসমূহ ({subServices.length})
        </h3>
        
        {subServices.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-center">
            এই সার্ভিসের অধীনে কোনো সাব-সার্ভিস নেই।
          </p>
        ) : (
          <div className="space-y-4">
            {subServices.map((sub: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-800">
                    <span className="text-slate-400 font-medium mr-2">#{idx + 1}</span> 
                    {sub.name}
                  </h4>
                  <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-sm px-3 py-1.5 rounded-xl border border-emerald-100/50">
                    <DollarSign size={14} />
                    ₹{Number(sub.price || 0).toLocaleString()}
                  </div>
                </div>

                {role === "superadmin" && (
                  <div className="flex gap-4">
                    <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block">Agent Commission</span>
                      <span className="font-bold text-slate-800">{sub.agent_commission_percentage || 0}%</span>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block">Vendor Commission</span>
                      <span className="font-bold text-slate-800">{sub.vendor_commission_percentage || 0}%</span>
                    </div>
                  </div>
                )}

                {sub.description && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                    <div 
                      className="prose prose-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100"
                      dangerouslySetInnerHTML={{ __html: sub.description }}
                    />
                  </div>
                )}

                {(sub.image1 || sub.image2) && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Images</label>
                    <div className="flex gap-4">
                      {sub.image1 && <img src={sub.image1} alt="Image 1" className="h-24 w-32 object-cover rounded-xl border border-slate-200" />}
                      {sub.image2 && <img src={sub.image2} alt="Image 2" className="h-24 w-32 object-cover rounded-xl border border-slate-200" />}
                    </div>
                  </div>
                )}

                {sub.faq && sub.faq.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                      <HelpCircle size={14} /> FAQs ({sub.faq.length})
                    </label>
                    <div className="space-y-2">
                      {sub.faq.map((f: any, fIdx: number) => (
                        <div key={fIdx} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <p className="font-semibold text-slate-800 text-sm mb-1">Q: {f.question}</p>
                          <p className="text-slate-600 text-sm">A: {f.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
