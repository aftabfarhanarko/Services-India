"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Trash2,
  User,
  BadgeCheck,
  CreditCard,
  ImageIcon,
  Compass,
  Briefcase
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useAgentState } from "../hooks/useAgentState";
import { useParams, useRouter } from "next/navigation";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const lang = useAppSelector((state) => state.lang.value);

  const {
    agents,
    isUsersLoading,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
  } = useAgentState();

  const agent = agents.find((a) => String(a.id) === String(agentId));

  if (isUsersLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center my-8">
        <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "এজেন্ট তথ্য লোড হচ্ছে..." : "Loading agent details..."}</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center my-8 space-y-4">
        <p className="text-base text-slate-700 font-bold">{lang === "bn" ? "কোনো এজেন্ট তথ্য পাওয়া যায়নি।" : "Agent Application Details Not Found."}</p>
        <Link
          href="/dashbord/agents"
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] px-5 py-2.5 rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
          {lang === "bn" ? "এজেন্ট তালিকায় ফিরে যান" : "Back to Agent List"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashbord/agents"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                {lang === "bn" ? "এজেন্ট আবেদন বিস্তারিত" : "Agent Application Details"}
              </h1>
              <BadgeCheck className="w-5 h-5 text-[#FF6014]" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-2">
              <span>{lang === "bn" ? "এজেন্টের সব তথ্য ও ডকুমেন্ট যাচাই করুন।" : "Review full application details and Government ID credentials."}</span>
              <span className="bg-slate-100 text-slate-700 font-extrabold px-2 py-0.5 rounded-md text-[11px] border border-slate-200">ID: {agent.id}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {agent.status !== "active" && (
            <button
              onClick={() => handleActivate(agent.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
            >
              <ShieldCheck size={16} />
              {lang === "bn" ? "সক্রিয় করুন" : "Activate Agent"}
            </button>
          )}
          {agent.status !== "inactive" && (
            <button
              onClick={() => handleDeactivate(agent.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
            >
              <XCircle size={16} />
              {lang === "bn" ? "নিষ্ক্রিয় করুন" : "Deactivate"}
            </button>
          )}
          {agent.status !== "blocked" && (
            <button
              onClick={() => handleBlock(agent.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-orange-50 text-[#E0530A] hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
            >
              <Ban size={16} />
              {lang === "bn" ? "ব্লক করুন" : "Block"}
            </button>
          )}
          <button
            onClick={() => {
              handleDelete(agent.id);
              router.push("/dashbord/agents");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
          >
            <Trash2 size={16} />
            {lang === "bn" ? "ডিলিট করুন" : "Delete"}
          </button>
        </div>
      </div>

      {/* Main Agent Details Card Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header Hero Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-br from-[#FFF8F4] to-white rounded-3xl border border-[#FF6014]/15 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FF6014] text-white font-black text-2xl rounded-2xl flex items-center justify-center shadow-md shadow-[#FF6014]/20">
              {agent.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900">{agent.name}</h2>
                <span className="text-xs px-2.5 py-0.5 bg-[#FF6014]/10 text-[#FF6014] font-black rounded-lg uppercase border border-[#FF6014]/20">
                  Agent ID: #{agent.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1.5">
                <Building size={14} className="text-[#FF6014]" />
                {agent.companyName || "No Company Specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-xs font-bold text-slate-400">Account Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
                agent.status === "active"
                  ? "bg-emerald-100 text-emerald-800"
                  : agent.status === "blocked"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {agent.status}
            </span>
          </div>
        </div>

        {/* 1. Basic Credentials Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User size={15} className="text-[#FF6014]" /> Profile & Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={13} className="text-sky-500" /> Email Address
              </span>
              <p className="text-xs font-bold text-slate-800 break-all">{agent.email}</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={13} className="text-emerald-500" /> Phone Number
              </span>
              <p className="text-xs font-bold text-slate-800">{agent.phone || "N/A"}</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={13} className="text-indigo-500" /> Business / Brand
              </span>
              <p className="text-xs font-bold text-slate-800">{agent.companyName || "N/A"}</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-amber-500" /> Registered Date
              </span>
              <p className="text-xs font-bold text-slate-800">{agent.joined}</p>
            </div>
          </div>
        </div>

        {/* 2. Location Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Compass size={15} className="text-[#FF6014]" /> Operating Territory & Location
          </h3>
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">Division</span>
                <span className="text-xs font-extrabold text-slate-800">{agent.devision || "N/A"}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">District</span>
                <span className="text-xs font-extrabold text-slate-800">{agent.district || "N/A"}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">Area</span>
                <span className="text-xs font-extrabold text-slate-800">{agent.area || "N/A"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2">
              <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Full Detailed Address</span>
                <span className="text-xs font-bold text-slate-800">{agent.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Description / Experience */}
        {agent.description && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText size={15} className="text-[#FF6014]" /> Service Experience & Description
            </h3>
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{agent.description}</p>
            </div>
          </div>
        )}

        {/* 4. Government ID Verification Documents */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CreditCard size={15} className="text-[#FF6014]" /> Government ID (Aadhaar / Voter ID) Credentials
          </h3>
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
              <span className="text-[11px] text-slate-500 font-bold">Government ID Number</span>
              <span className="text-xs font-black text-[#FF6014] bg-orange-50 border border-orange-100 px-3 py-1 rounded-xl">
                {agent.nid_number || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block mb-1.5">Government ID - Front Side</span>
                {agent.nid_front ? (
                  <a href={agent.nid_front} target="_blank" rel="noopener noreferrer" className="block aspect-video border border-slate-200 rounded-2xl overflow-hidden group shadow-sm bg-white hover:border-[#FF6014] transition-all">
                    <img src={agent.nid_front} alt="Govt ID Front" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">No front image uploaded</div>
                )}
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block mb-1.5">Government ID - Back Side</span>
                {agent.nid_back ? (
                  <a href={agent.nid_back} target="_blank" rel="noopener noreferrer" className="block aspect-video border border-slate-200 rounded-2xl overflow-hidden group shadow-sm bg-white hover:border-[#FF6014] transition-all">
                    <img src={agent.nid_back} alt="Govt ID Back" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">No back image uploaded</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Shop / Operation Pictures */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ImageIcon size={15} className="text-[#FF6014]" /> Business Operations & Shop Photos
          </h3>
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {agent.shop_image1 ? (
                  <a href={agent.shop_image1} target="_blank" rel="noopener noreferrer" className="block aspect-video border border-slate-200 rounded-2xl overflow-hidden group shadow-sm bg-white hover:border-[#FF6014] transition-all">
                    <img src={agent.shop_image1} alt="Shop 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">No shop photo 1 uploaded</div>
                )}
              </div>
              <div>
                {agent.shop_image2 ? (
                  <a href={agent.shop_image2} target="_blank" rel="noopener noreferrer" className="block aspect-video border border-slate-200 rounded-2xl overflow-hidden group shadow-sm bg-white hover:border-[#FF6014] transition-all">
                    <img src={agent.shop_image2} alt="Shop 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </a>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">No shop photo 2 uploaded</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
