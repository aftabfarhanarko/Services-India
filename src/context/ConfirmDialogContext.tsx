"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const confirm = (opts?: ConfirmOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef.current?.(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef.current?.(true);
  };

  const {
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "danger",
  } = options;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <AnimatePresence>
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-[24px] w-full max-w-md shadow-2xl border border-slate-100/80 overflow-hidden relative z-10 p-6 flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      variant === "danger"
                        ? "bg-red-50 text-red-500 border border-red-100"
                        : variant === "warning"
                          ? "bg-amber-50 text-amber-500 border border-amber-100"
                          : "bg-blue-50 text-blue-500 border border-blue-100"
                    }`}
                  >
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {message}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all active:scale-[0.97] shadow-lg cursor-pointer ${
                    variant === "danger"
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/10"
                      : variant === "warning"
                        ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/10"
                        : "bg-[#FF6014] hover:bg-[#E0530A] shadow-orange-500/10"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
}
