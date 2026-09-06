"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Briefcase, UserCheck, ChevronLeft, ArrowRight,
  Loader2, Building, Sparkles,
  Phone, Mail, User, Image as ImageIcon, DollarSign,
  Globe, ShieldCheck, CheckCircle2
} from "lucide-react";
import { useOpportunityState, vendorBenefits, agentBenefits } from "@/app/opportunity/hooks/useOpportunityState";
import ServiceAreas from "@/components/home/sections/home/ServiceAreas";

function OpportunityPageContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const selectedRole = (roleParam === "Vendor" || roleParam === "Agent") ? roleParam : null;

  const {
    step, formData, setFormData, handleChange,
    pictureFile, setPictureFile, shopImage1File, setShopImage1File, shopImage2File, setShopImage2File,
    nidFrontFile, setNidFrontFile, nidBackFile, setNidBackFile, isRegistering, isCreatingProfile, isUploading,
    handleSelectRole, handleBack, handleRegister, handleProfileSubmit,
  } = useOpportunityState();

  const inputBase = "w-full text-xs px-4 py-3 rounded-xl border bg-[#FAFAF9] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-355 font-semibold focus:bg-white focus:ring-2";
  const inputNormal = `${inputBase} border-[#E7E5E4] focus:border-[#FF6014] focus:ring-[#FF6014]/10`;

  if (!selectedRole) {
    return (
      <div className="flex-1 bg-transparent flex flex-col justify-center py-20 px-4 md:px-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />
        <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-[#FF6014]/5 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-orange-300/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20">
              <Sparkles className="w-3.5 h-3.5" />Partnership Opportunities
            </div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-medium text-slate-900 tracking-tight leading-tight">Join <span className="text-[#FF6014]">Rajseba</span> Platform</h1>
            <p className="text-slate-400 text-sm md:text-base font-semibold max-w-xl mx-auto leading-relaxed">Partner with Kolkata & India's leading home service marketplace and grow your business or operations network.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { role: "Vendor" as const, icon: Briefcase, title: "Become a Vendor", desc: "List your professional services, manage custom bookings, and reach thousands of daily active customers across Kolkata (North Kolkata, New Town & Rajarhat).", label: "Apply as Vendor" },
              { role: "Agent" as const, icon: UserCheck, title: "Become an Agent", desc: "Manage vendor networks, oversee service dispatch in your designated territory, and earn competitive commissions.", label: "Apply as Agent" },
            ].map(({ role, icon: Icon, title, desc, label }) => (
              <button key={role} onClick={() => handleSelectRole(role)} className="bg-white border border-slate-100/90 rounded-3xl p-8 hover:border-[#FF6014]/20 hover:shadow-[0_12px_40px_rgba(255,96,20,0.06)] hover:-translate-y-1 transition-all duration-300 text-left group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6014]/[0.01] to-transparent pointer-events-none" />
                <div className="w-14 h-14 bg-[#FFF4EE] border border-[#FF6014]/15 rounded-2xl flex items-center justify-center text-[#FF6014] mb-6 group-hover:scale-110 transition-transform"><Icon size={26} /></div>
                <div className="text-lg font-medium text-slate-900 mb-2.5">{title}</div>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">{desc}</p>
                <div className="flex items-center text-[#FF6014] font-extrabold text-xs uppercase tracking-wider">{label} <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" /></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const benefits = selectedRole === "Vendor" ? vendorBenefits : agentBenefits;

  return (
    <div className="bg-transparent flex-1 flex flex-col justify-center py-10 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
        <button onClick={() => handleBack(selectedRole)} className="mb-8 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#FF6014] flex items-center transition-colors cursor-pointer">
          <ChevronLeft size={14} className="mr-1" />{step === 2 ? "Back to Step 1" : "Back to Role Selection"}
        </button>
        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center mt-4">
          <div className="md:col-span-5 flex flex-col justify-between shrink-0 min-h-[420px] md:min-h-[520px] py-4">
            <div>
              <span className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
                <span className="w-7 h-7 bg-[#FF6014] rounded-lg flex items-center justify-center text-xs text-white">R</span>Rajseba
              </span>
              <div>
                <div className="inline-flex items-center gap-2 text-[9px] font-extrabold text-[#FF6014] uppercase tracking-wider bg-[#FF6014]/10 border border-[#FF6014]/20 px-3 py-1 rounded-full mb-4">
                  <Sparkles className="w-3 h-3" />Onboarding Step {step} of 2
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 leading-tight mb-3">Join as {selectedRole === "Vendor" ? "a Vendor" : "an Agent"}</h2>
                <p className="text-slate-500 text-sm font-semibold max-w-md leading-relaxed">Complete your registration information to launch your service profile on Kolkata & India's leading marketplace.</p>
              </div>
            </div>
            <div className="space-y-5 my-6">
              <h4 className="text-sm font-medium uppercase tracking-widest text-[#FF6014] border-b border-slate-100 pb-2.5 mb-2">{selectedRole === "Vendor" ? "Vendor Benefits & Revenue" : "Agent Opportunities & Commissions"}</h4>
              {benefits.map((b: any, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0 font-black text-sm">
                    {b.val ? b.val : <b.icon size={18} />}
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm md:text-base font-medium">{b.title}</p>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold"><ShieldCheck size={14} className="text-emerald-500" /><span>Rajseba Partner Onboarding Portal</span></div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-center py-4">
            <div className="max-w-md w-full mx-auto space-y-6 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/40 bg-white">
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-medium text-slate-900 tracking-tight">{step === 1 ? "Basic Credentials" : "Business Details"}</h3>
                <p className="text-xs text-slate-400 font-semibold">{step === 1 ? "Provide your login contact information" : "Add service offerings and location details"}</p>
              </div>
              <div className="flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#FF6014]" : "bg-slate-100"}`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#FF6014]" : "bg-slate-100"}`} />
              </div>

              {step === 1 ? (
                <form onSubmit={(e) => handleRegister(e, selectedRole)} className="space-y-4">
                  {[
                    { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Mahbubur Rahman", icon: User },
                    { name: "phone", label: "Phone Number", type: "tel", placeholder: "e.g. 017XXXXXXXX", icon: Phone },
                    { name: "email", label: "Email Address", type: "email", placeholder: "e.g. mahbub@example.com", icon: Mail },
                  ].map(({ name, label, type, placeholder, icon: Icon }) => (
                    <div key={name} className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5"><Icon size={13} className="text-[#FF6014]" />{label}</label>
                      <input type={type} name={name} value={(formData as any)[name]} onChange={handleChange} required className={inputNormal} placeholder={placeholder} />
                    </div>
                  ))}
                  <button type="submit" disabled={isRegistering} className="w-full mt-6 bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-60 text-white text-[11px] font-extrabold tracking-wide py-3.5 h-auto rounded-xl border-none transition-all duration-200 shadow-[0_4px_16px_rgba(255,96,20,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                    {isRegistering ? <><Loader2 size={14} className="animate-spin" />Creating Account...</> : <>Continue<ArrowRight size={14} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => handleProfileSubmit(e, selectedRole)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5"><Building size={13} className="text-[#FF6014]" />Company / Brand Name</label>
                    <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required className={inputNormal} placeholder="e.g. Rahman Maintenance Services" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5"><ImageIcon size={13} className="text-[#FF6014]" />Profile / Logo Picture</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-200 hover:border-[#FF6014]/40 rounded-xl bg-slate-50/50 hover:bg-white transition-all cursor-pointer relative group">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-slate-400 group-hover:text-[#FF6014] transition-colors" />
                        <div className="flex text-xs text-slate-600 justify-center"><span className="relative font-bold text-[#FF6014]">{pictureFile ? pictureFile.name : "Upload photo"}</span></div>
                        <p className="text-[10px] text-slate-400 font-medium">PNG, JPG, JPEG up to 6MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setPictureFile(e.target.files[0]); }} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  {selectedRole === "Agent" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                        <ImageIcon size={13} className="text-[#FF6014]" /> Your Shop Images (Max 2)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#FF6014]/40 rounded-xl p-3 bg-slate-50/50 hover:bg-white transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                          <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-[#FF6014] mb-1" />
                          <span className="text-[10px] font-bold text-[#FF6014] truncate max-w-full px-1">{shopImage1File ? shopImage1File.name : "Shop Image 1 (Max 6MB)"}</span>
                          <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setShopImage1File(e.target.files[0]); }} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#FF6014]/40 rounded-xl p-3 bg-slate-50/50 hover:bg-white transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                          <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-[#FF6014] mb-1" />
                          <span className="text-[10px] font-bold text-[#FF6014] truncate max-w-full px-1">{shopImage2File ? shopImage2File.name : "Shop Image 2 (Max 6MB)"}</span>
                          <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setShopImage2File(e.target.files[0]); }} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">Service Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className={`${inputNormal} resize-none`} placeholder="Briefly explain your services or experience..." />
                  </div>

                  {selectedRole === "Agent" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                          <User size={13} className="text-[#FF6014]" /> NID Number
                        </label>
                        <input type="text" name="nid_number" value={formData.nid_number} onChange={handleChange} required className={inputNormal} placeholder="e.g. 199XXXXXXXXXX" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                          <ImageIcon size={13} className="text-[#FF6014]" /> NID Page Images (Front & Back)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#FF6014]/40 rounded-xl p-3 bg-slate-50/50 hover:bg-white transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                            <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-[#FF6014] mb-1" />
                            <span className="text-[10px] font-bold text-[#FF6014] truncate max-w-full px-1">{nidFrontFile ? nidFrontFile.name : "NID Front Page (Max 6MB)"}</span>
                            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNidFrontFile(e.target.files[0]); }} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          </div>
                          <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#FF6014]/40 rounded-xl p-3 bg-slate-50/50 hover:bg-white transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                            <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-[#FF6014] mb-1" />
                            <span className="text-[10px] font-bold text-[#FF6014] truncate max-w-full px-1">{nidBackFile ? nidBackFile.name : "NID Back Page (Max 6MB)"}</span>
                            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNidBackFile(e.target.files[0]); }} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === "Vendor" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5"><DollarSign size={13} className="text-[#FF6014]" />Min Starting Price</label>
                        <input type="number" name="min_starting_price" value={formData.min_starting_price} onChange={handleChange} required className={inputNormal} placeholder="e.g. 500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5"><Globe size={13} className="text-[#FF6014]" />Google Map Link</label>
                        <input type="url" name="google_map_link" value={formData.google_map_link} onChange={handleChange} required className={inputNormal} placeholder="https://maps.google.com/..." />
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={isCreatingProfile || isUploading} className="w-full mt-6 bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-60 text-white text-[11px] font-extrabold tracking-wide py-3.5 h-auto rounded-xl border-none transition-all duration-200 shadow-[0_4px_16px_rgba(255,96,20,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                    {(isCreatingProfile || isUploading) ? <><Loader2 size={14} className="animate-spin" />Submitting Application...</> : <>Submit Application<CheckCircle2 size={14} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpportunityClientPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" /></div>}>
      <OpportunityPageContent />
    </Suspense>
  );
}
