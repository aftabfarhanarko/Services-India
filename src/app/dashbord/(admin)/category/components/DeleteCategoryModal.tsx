"use client";

import React from "react";
import { X, Folder } from "lucide-react";
import { Category } from "@/redux/features/admin/category";
import { formatImageUrl } from "@/lib/utils";

interface DeleteCategoryModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (val: boolean) => void;
  categoryToDelete: Category | null;
  setCategoryToDelete: (val: Category | null) => void;
  handleDelete: () => void;
}

export default function DeleteCategoryModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  categoryToDelete,
  setCategoryToDelete,
  handleDelete,
}: DeleteCategoryModalProps) {
  if (!isDeleteModalOpen || !categoryToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Delete Category</h2>
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              setCategoryToDelete(null);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-center">
          <div className="flex flex-col items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            {/* Category Image */}
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
              {categoryToDelete.icon ? (
                categoryToDelete.icon.startsWith("http") || categoryToDelete.icon.startsWith("/") ? (
                  <img src={formatImageUrl(categoryToDelete.icon)} alt={categoryToDelete.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{categoryToDelete.icon}</span>
                )
              ) : (
                <Folder className="text-slate-400" size={28} />
              )}
            </div>

            <div>
              <span className="font-mono text-slate-400 font-bold text-xs">ID: {categoryToDelete.id}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{categoryToDelete.name}</h3>
            </div>
          </div>

          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Are you sure you want to delete this category? This action cannot be undone and will remove the category from
            the system.
          </p>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
              }}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#FF6014] hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
