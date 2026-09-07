"use client";

import React, { useState } from "react";
import { XCircle, Eye, EyeOff } from "lucide-react";

interface AgentModalProps {
  step: 1 | 2;
  closeModal: () => void;
  handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => void;
  isCreatingUser: boolean;
  handleCreateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
  isCreatingProfile: boolean;
  pictureFile: File | null;
  setPictureFile: (val: File | null) => void;
  shopImage1File: File | null;
  setShopImage1File: (val: File | null) => void;
  shopImage2File: File | null;
  setShopImage2File: (val: File | null) => void;
  nidFrontFile: File | null;
  setNidFrontFile: (val: File | null) => void;
  nidBackFile: File | null;
  setNidBackFile: (val: File | null) => void;
}

export default function AgentModal({
  step,
  closeModal,
  handleCreateUser,
  isCreatingUser,
  handleCreateProfile,
  isCreatingProfile,
  pictureFile,
  setPictureFile,
  shopImage1File,
  setShopImage1File,
  shopImage2File,
  setShopImage2File,
  nidFrontFile,
  setNidFrontFile,
  nidBackFile,
  setNidBackFile,
}: AgentModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 scrollbar-thin">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1 ? "Step 1: Agent Account" : "Step 2: Agent Profile"}
          </h2>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all"
          >
            <XCircle size={24} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingUser}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50"
              >
                {isCreatingUser ? "Saving..." : "Next Step"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Company / Brand Name</label>
              <input
                name="company_name"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="Kolkata Maintenance Services"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Government ID (Aadhaar / Voter ID)</label>
              <input
                name="nid_number"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="XXXX XXXX XXXX"
              />
            </div>

            {/* Profile / Logo picture */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Profile / Logo Picture (Max 6MB)</label>
              <div className="relative border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer group transition-all">
                <span className="text-xs font-bold text-slate-600 truncate max-w-[280px]">
                  {pictureFile ? pictureFile.name : "Choose profile photo..."}
                </span>
                <span className="text-[10px] font-black uppercase text-[#FF6014] group-hover:underline">Browse</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files && e.target.files.length > 0) setPictureFile(e.target.files[0]); }}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {pictureFile && (
                <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img src={URL.createObjectURL(pictureFile)} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Shop Images */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Shop Image 1 (Max 6MB)</label>
                <div className="relative border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer group transition-all">
                  <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                    {shopImage1File ? shopImage1File.name : "Image 1"}
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#FF6014] group-hover:underline">File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files && e.target.files.length > 0) setShopImage1File(e.target.files[0]); }}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {shopImage1File && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={URL.createObjectURL(shopImage1File)} alt="Shop 1 Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Shop Image 2 (Max 6MB)</label>
                <div className="relative border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer group transition-all">
                  <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                    {shopImage2File ? shopImage2File.name : "Image 2"}
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#FF6014] group-hover:underline">File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files && e.target.files.length > 0) setShopImage2File(e.target.files[0]); }}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {shopImage2File && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={URL.createObjectURL(shopImage2File)} alt="Shop 2 Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Government ID Images */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Govt ID Front (Max 6MB)</label>
                <div className="relative border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer group transition-all">
                  <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                    {nidFrontFile ? nidFrontFile.name : "Govt ID Front"}
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#FF6014] group-hover:underline">File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNidFrontFile(e.target.files[0]); }}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {nidFrontFile && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={URL.createObjectURL(nidFrontFile)} alt="Govt ID Front Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Govt ID Back (Max 6MB)</label>
                <div className="relative border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer group transition-all">
                  <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                    {nidBackFile ? nidBackFile.name : "Govt ID Back"}
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#FF6014] group-hover:underline">File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNidBackFile(e.target.files[0]); }}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {nidBackFile && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={URL.createObjectURL(nidBackFile)} alt="Govt ID Back Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                placeholder="Briefly describe the agent's services..."
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isCreatingProfile}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50"
              >
                {isCreatingProfile ? "Saving..." : "Complete Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
