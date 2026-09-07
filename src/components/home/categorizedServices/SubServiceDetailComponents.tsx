"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Minus, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { formatImageUrl } from "@/lib/utils";

interface SubServiceDetailProps {
  subService: any;
  onClose: () => void;
  isAdded: boolean;
  quantity: number;
  onAddToCart: (service: any, subId: number) => void;
  onUpdateQuantity: (subId: number, delta: number) => void;
}

export function SubServiceDetailCard({
  subService,
  onClose,
  isAdded,
  quantity,
  onAddToCart,
  onUpdateQuantity,
}: SubServiceDetailProps) {
  if (!subService) return null;
  const hasImages = subService.image1 || subService.image2;
  const faqs = subService.faq || [];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header Banner */}
      <div className="bg-[#FFF8F4] px-6 py-5 border-b border-[#FF6014]/10 flex items-center justify-between">
        <div className="min-w-0">
          <span className="text-[10px] text-[#FF6014] font-black uppercase tracking-widest block mb-1">
            {subService.parentTitle || "Sub Service"} Details
          </span>
          <h3 className="text-base font-bold text-slate-800 truncate">
            {subService.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 p-1.5 rounded-full transition cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Price & Action Section */}
        <div className="flex items-center justify-between bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
            <div className="text-[#FF6014] text-2xl font-black">
              ₹{Number(subService.price).toLocaleString()}
            </div>
          </div>
          <div className="w-32">
            {isAdded ? (
              <div className="flex items-center gap-1 bg-white border border-[#FF6014]/20 rounded-xl p-0.5 w-full justify-between shadow-xs">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(subService.id, -1)}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-[#FF6014] flex items-center justify-center hover:bg-rose-50/50 transition cursor-pointer"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span className="text-sm font-black text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(subService.id, 1)}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-[#FF6014] flex items-center justify-center hover:bg-rose-50/50 transition cursor-pointer"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(subService.parentService, subService.id)}
                className="w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 bg-[#FF6014] text-white hover:bg-[#E0530A] shadow-md shadow-rose-100"
              >
                <Plus size={13} strokeWidth={3} />
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {subService.description && (() => {
          const cleanedDesc = subService.description.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "").replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");
          return (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Service Inclusions</h4>
              {/<[a-z]/.test(cleanedDesc) ? (
                <div
                  className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 rich-content"
                  dangerouslySetInnerHTML={{ __html: cleanedDesc }}
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  {cleanedDesc}
                </p>
              )}
            </div>
          );
        })()}

        {/* Showcase Images */}
        {hasImages && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Showcase Images</h4>
            <div className="grid grid-cols-2 gap-3">
              {subService.image1 && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-2xs group/img">
                  <img
                    src={formatImageUrl(subService.image1)}
                    alt={`${subService.name} Gallery 1`}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {subService.image2 && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-2xs group/img">
                  <img
                    src={formatImageUrl(subService.image2)}
                    alt={`${subService.name} Gallery 2`}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[#FF6014]" />
              Service FAQs
            </h4>
            <div className="space-y-2.5">
              {faqs.map((faq: any, fIdx: number) => {
                const answer = (faq.answer || faq.a || "").replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "").replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");
                const isRich = /<[a-z]/.test(answer);
                return (
                  <div key={fIdx} className="bg-slate-50/50 border border-slate-100/80 p-3.5 rounded-2xl space-y-1">
                    <p className="text-xs font-bold text-slate-800">Q: {faq.question || faq.q}</p>
                    {isRich ? (
                      <div
                        className="text-xs text-slate-600 leading-relaxed font-semibold rich-content"
                        dangerouslySetInnerHTML={{ __html: answer }}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">A: {answer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SubServiceDetailDrawer({
  isOpen,
  onClose,
  subService,
  isAdded,
  quantity,
  onAddToCart,
  onUpdateQuantity,
}: SubServiceDetailProps & { isOpen: boolean }) {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!subService) return null;
  const hasImages = subService.image1 || subService.image2;
  const faqs = subService.faq || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center p-0 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            className="relative bg-white w-full rounded-t-[32px] shadow-2xl max-h-[85dvh] flex flex-col overflow-hidden z-10 border-t border-slate-100"
          >
            {/* Drag Handle indicator */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0" />

            {/* Header */}
            <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="min-w-0 flex-1 pr-4">
                <span className="text-[10px] text-[#FF6014] font-black uppercase tracking-widest block mb-0.5">
                  {subService.parentTitle || "Sub Service"} Details
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {subService.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6 [&::-webkit-scrollbar]:w-0.5">
              {/* Price & Action Section */}
              <div className="flex items-center justify-between bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                  <div className="text-[#FF6014] text-xl font-black">
                    ₹{Number(subService.price).toLocaleString()}
                  </div>
                </div>
                <div className="w-32">
                  {isAdded ? (
                    <div className="flex items-center gap-1 bg-white border border-[#FF6014]/20 rounded-xl p-0.5 w-full justify-between shadow-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(subService.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-50 text-[#FF6014] flex items-center justify-center hover:bg-rose-50/50 transition cursor-pointer"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="text-sm font-black text-slate-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(subService.id, 1)}
                        className="w-8 h-8 rounded-lg bg-slate-50 text-[#FF6014] flex items-center justify-center hover:bg-rose-50/50 transition cursor-pointer"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(subService.parentService, subService.id)}
                      className="w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 bg-[#FF6014] text-white hover:bg-[#E0530A] shadow-md shadow-rose-100"
                    >
                      <Plus size={13} strokeWidth={3} />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {subService.description && (() => {
                const cleanedDesc = subService.description.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "").replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");
                return (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Service Inclusions</h4>
                    {/<[a-z]/.test(cleanedDesc) ? (
                      <div
                        className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 rich-content"
                        dangerouslySetInnerHTML={{ __html: cleanedDesc }}
                      />
                    ) : (
                      <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                        {cleanedDesc}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Showcase Images */}
              {hasImages && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Showcase Images</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {subService.image1 && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-2xs">
                        <img
                          src={formatImageUrl(subService.image1)}
                          alt={`${subService.name} Gallery 1`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {subService.image2 && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-2xs">
                        <img
                          src={formatImageUrl(subService.image2)}
                          alt={`${subService.name} Gallery 2`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-[#FF6014]" />
                    Service FAQs
                  </h4>
                  <div className="space-y-2.5">
                    {faqs.map((faq: any, fIdx: number) => {
                      const answer = (faq.answer || faq.a || "").replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "").replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");
                      const isRich = /<[a-z]/.test(answer);
                      return (
                        <div key={fIdx} className="bg-slate-50/50 border border-slate-100/80 p-3.5 rounded-2xl space-y-1">
                          <p className="text-xs font-bold text-slate-800">Q: {faq.question || faq.q}</p>
                          {isRich ? (
                            <div
                              className="text-xs text-slate-600 leading-relaxed font-semibold rich-content"
                              dangerouslySetInnerHTML={{ __html: answer }}
                            />
                          ) : (
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">A: {answer}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom padding for iPhone Home bar */}
            <div className="h-6 bg-white shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
