"use client";

import React from "react";
import { XCircle } from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
  categoryName?: string;
  companyName?: string;
  location?: string;
  description?: string;
  shop_image1?: string;
  shop_image2?: string;
  nid_number?: string;
  nid_front?: string;
  nid_back?: string;
  devision?: string;
  district?: string;
  area?: string;
}

interface AgentViewModalProps {
  selectedUser: AgentItem | null;
  setSelectedUser: (val: AgentItem | null) => void;
}

export default function AgentViewModal({ selectedUser, setSelectedUser }: AgentViewModalProps) {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 scrollbar-thin">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Agent Application Details</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Review credentials and document attachments</p>
          </div>
          <button
            onClick={() => setSelectedUser(null)}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-all cursor-pointer"
          >
            <XCircle size={22} />
          </button>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Full Name</span>
              <span className="text-sm font-bold text-slate-800">{selectedUser.name}</span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Email Address</span>
              <span className="text-sm font-bold text-slate-800">{selectedUser.email}</span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Phone Number</span>
              <span className="text-sm font-bold text-slate-800">{selectedUser.phone}</span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Company / Brand Name</span>
              <span className="text-sm font-bold text-slate-800">{selectedUser.companyName}</span>
            </div>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 space-y-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Territory Location</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block">Division</span>
                <span className="text-xs font-bold text-slate-800">{selectedUser.devision}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block">District</span>
                <span className="text-xs font-bold text-slate-800">{selectedUser.district}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block">Area</span>
                <span className="text-xs font-bold text-slate-800">{selectedUser.area}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[9px] text-slate-400 font-bold block">Detailed Street Address</span>
              <span className="text-xs font-bold text-slate-800">{selectedUser.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Application Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold capitalize bg-orange-100 text-[#FF6014]">
                {selectedUser.status}
              </span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Submission Date</span>
              <span className="text-sm font-bold text-slate-800">{selectedUser.joined}</span>
            </div>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Service Experience / Description</span>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {selectedUser.description}
            </p>
          </div>

          {/* NID / Govt ID Verification Details */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Government ID (Aadhaar / Voter ID) Details</span>
              <span className="text-xs font-black text-slate-800">No: {selectedUser.nid_number || "N/A"}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-1">Government ID - Front Page</span>
                {selectedUser.nid_front ? (
                  <a href={selectedUser.nid_front} target="_blank" rel="noopener noreferrer" className="block relative aspect-video border rounded-xl overflow-hidden group shadow-xs">
                    <img src={selectedUser.nid_front} alt="NID Front" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-400">No image uploaded</span>
                )}
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-1">Government ID - Back Page</span>
                {selectedUser.nid_back ? (
                  <a href={selectedUser.nid_back} target="_blank" rel="noopener noreferrer" className="block relative aspect-video border rounded-xl overflow-hidden group shadow-xs">
                    <img src={selectedUser.nid_back} alt="Government ID Back" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-400">No image uploaded</span>
                )}
              </div>
            </div>
          </div>

          {/* Shop Images */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 space-y-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Shop / Operations Images</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {selectedUser.shop_image1 ? (
                  <a href={selectedUser.shop_image1} target="_blank" rel="noopener noreferrer" className="block relative aspect-video border rounded-xl overflow-hidden group shadow-xs">
                    <img src={selectedUser.shop_image1} alt="Shop 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-400">No image 1 uploaded</span>
                )}
              </div>
              <div>
                {selectedUser.shop_image2 ? (
                  <a href={selectedUser.shop_image2} target="_blank" rel="noopener noreferrer" className="block relative aspect-video border rounded-xl overflow-hidden group shadow-xs">
                    <img src={selectedUser.shop_image2} alt="Shop 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-400">No image 2 uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setSelectedUser(null)}
            className="px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
