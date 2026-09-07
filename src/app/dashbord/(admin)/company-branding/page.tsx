"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Save,
  Upload,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Share2,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useGetCompanyBrandingQuery, useSaveCompanyBrandingMutation } from "@/redux/features/admin/companyBranding";
import { useAppSelector } from "@/redux/hooks";
import { uploadImage } from "@/lib/upload";
import { formatImageUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function CompanyBrandingPage() {
  const lang = useAppSelector((state) => state.lang.value);
  const { data: res, isLoading, refetch } = useGetCompanyBrandingQuery();
  const [saveBranding, { isLoading: isSaving }] = useSaveCompanyBrandingMutation();

  const [formData, setFormData] = useState({
    companyName: "",
    logoUrl: "",
    footerLogoUrl: "",
    email: "",
    phone: "",
    address: "",
    cityLocation: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    whatsappNumber: "",
    metaTitle: "",
    metaDescription: "",
    footerDescription: "",
  });

  useEffect(() => {
    if (res?.data) {
      setFormData({
        companyName: res.data.companyName || "",
        logoUrl: res.data.logoUrl ? formatImageUrl(res.data.logoUrl) : "",
        footerLogoUrl: res.data.footerLogoUrl ? formatImageUrl(res.data.footerLogoUrl) : "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        cityLocation: res.data.cityLocation || "",
        facebookUrl: res.data.facebookUrl || "",
        instagramUrl: res.data.instagramUrl || "",
        twitterUrl: res.data.twitterUrl || "",
        linkedinUrl: res.data.linkedinUrl || "",
        youtubeUrl: res.data.youtubeUrl || "",
        whatsappNumber: res.data.whatsappNumber || "",
        metaTitle: res.data.metaTitle || "",
        metaDescription: res.data.metaDescription || "",
        footerDescription: res.data.footerDescription || "",
      });
    }
  }, [res]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "logoUrl" | "footerLogoUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading(lang === "bn" ? "ছবি আপলোড হচ্ছে..." : "Uploading image...", { id: "image-upload" });
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        const formattedUrl = formatImageUrl(uploadedUrl);
        setFormData((prev) => ({ ...prev, [fieldName]: formattedUrl }));
        toast.success(lang === "bn" ? "ছবি সফলভাবে আপলোড হয়েছে!" : "Image uploaded successfully!", { id: "image-upload" });
      }
    } catch {
      toast.error(lang === "bn" ? "ছবি আপলোড ব্যর্থ হয়েছে" : "Failed to upload image", { id: "image-upload" });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        ...formData,
        logoUrl: formatImageUrl(formData.logoUrl),
        footerLogoUrl: formatImageUrl(formData.footerLogoUrl),
      };
      await saveBranding(payload).unwrap();
      toast.success(lang === "bn" ? "কোম্পানি ব্র্যান্ডিং সেভ করা হয়েছে!" : "Company branding saved successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || (lang === "bn" ? "সেভ করতে ব্যর্থ হয়েছে" : "Failed to save company branding"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center border border-[#FF6014]/20 shadow-xs shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {lang === "bn" ? "কোম্পানি ব্র্যান্ডিং ও সেটিংস" : "Company Branding & Settings"}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === "bn"
                ? "নেভবার লোগো, ফুটার লোগো, ইমেইল, ফোন নম্বর, ঠিকানা ও সোশ্যাল মিডিয়া লিঙ্ক ম্যানেজ করুন।"
                : "Manage navbar logo, footer logo, email, phone number, address, and social media links."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            className="w-10 h-10 rounded-2xl border border-slate-200/80 bg-white text-slate-600 hover:text-[#FF6014] hover:border-[#FF6014]/30 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95"
            title={lang === "bn" ? "রিফ্রেশ করুন" : "Refresh"}
          >
            <RotateCw size={16} />
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="bg-[#FF6014] hover:bg-[#E0530A] text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/20 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            {lang === "bn" ? "পরিবর্তনসমূহ সেভ করুন" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Form Content - 2 Column Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Logos (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Navbar Logo Box */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6014]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === "bn" ? "নেভবার লোগো" : "Navbar Logo"}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="bg-[#FFF8F4] text-[#FF6014] px-2 py-0.5 rounded-md border border-[#FF6014]/20">Width: 70px / Auto</span>
                <span className="bg-[#FFF8F4] text-[#FF6014] px-2 py-0.5 rounded-md border border-[#FF6014]/20">Height: 40px (h-10)</span>
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/60">Max: 6MB</span>
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative w-full h-44 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-center p-4 overflow-hidden group">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Navbar Logo Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-slate-400 space-y-1">
                  <Building2 className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-xs font-semibold">
                    {lang === "bn" ? "কোন নেভবার লোগো সিলেক্ট করা নেই" : "No Navbar Logo Selected"}
                  </p>
                </div>
              )}
              <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                Navbar Preview
              </span>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                NAVBAR LOGO URL
              </label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://i.ibb.co/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-700 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
              />
            </div>

            {/* Upload Button */}
            <label className="w-full bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#FF6014] font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition border border-[#FF6014]/20 active:scale-[0.99]">
              <Upload size={14} /> {lang === "bn" ? "আপলোড নেভবার লোগো" : "UPLOAD NAVBAR LOGO"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logoUrl")} />
            </label>
          </div>

          {/* Footer Logo Box */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6014]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === "bn" ? "ফুটার লোগো" : "Footer Logo"}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="bg-[#FFF8F4] text-[#FF6014] px-2 py-0.5 rounded-md border border-[#FF6014]/20">Width: 100px / Auto</span>
                <span className="bg-[#FFF8F4] text-[#FF6014] px-2 py-0.5 rounded-md border border-[#FF6014]/20">Height: 44px (h-11)</span>
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/60">Max: 6MB</span>
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative w-full h-44 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-center p-4 overflow-hidden group">
              {formData.footerLogoUrl ? (
                <img src={formData.footerLogoUrl} alt="Footer Logo Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-slate-400 space-y-1">
                  <Building2 className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-xs font-semibold">
                    {lang === "bn" ? "কোন ফুটার লোগো সিলেক্ট করা নেই" : "No Footer Logo Selected"}
                  </p>
                </div>
              )}
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                FOOTER LOGO URL
              </label>
              <input
                type="text"
                name="footerLogoUrl"
                value={formData.footerLogoUrl}
                onChange={handleChange}
                placeholder="https://i.ibb.co/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-700 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
              />
            </div>

            {/* Upload Button */}
            <label className="w-full bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#FF6014] font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition border border-[#FF6014]/20 active:scale-[0.99]">
              <Upload size={14} /> {lang === "bn" ? "আপলোড ফুটার লোগো" : "UPLOAD FOOTER LOGO"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "footerLogoUrl")} />
            </label>
          </div>

        </div>

        {/* Right Column: Company Info & Social (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: কোম্পানি পরিচিতি */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-[#FF6014]" />
              <h3 className="text-sm font-bold text-slate-900">
                {lang === "bn" ? "কোম্পানি পরিচিতি" : "Company Overview"}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  OFFICIAL COMPANY NAME
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Rajseba Services"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-xs sm:text-sm font-bold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  FOOTER DESCRIPTION / BIO
                </label>
                <textarea
                  rows={3}
                  name="footerDescription"
                  value={formData.footerDescription}
                  onChange={handleChange}
                  placeholder="Your trusted partner for all home services..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-700 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: যোগাযোগ ও কন্টাক্ট ইনফরমেশন */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-4 h-4 text-[#FF6014]" />
              <h3 className="text-sm font-bold text-slate-900">
                {lang === "bn" ? "যোগাযোগ ও কন্টাক্ট ইনফরমেশন" : "Contact Information"}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  OFFICIAL EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@rajseba.in"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    PRIMARY PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01813333373"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    WHATSAPP SUPPORT NUMBER
                  </label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="01813333373"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: ঠিকানা ও হেড অফিস লোকেশন */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-[#FF6014]" />
              <h3 className="text-sm font-bold text-slate-900">
                {lang === "bn" ? "ঠিকানা ও হেড অফিস লোকেশন" : "Address & Office Location"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  HEAD OFFICE ADDRESS
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Salt Lake, Kolkata, West Bengal"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  CITY / REGION
                </label>
                <input
                  type="text"
                  name="cityLocation"
                  value={formData.cityLocation}
                  onChange={handleChange}
                  placeholder="Kolkata"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: সোশ্যাল মিডিয়া লিঙ্কসমূহ */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Share2 className="w-4 h-4 text-[#FF6014]" />
              <h3 className="text-sm font-bold text-slate-900">
                {lang === "bn" ? "সোশ্যাল মিডিয়া লিঙ্কসমূহ" : "Social Media Links"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  FACEBOOK PAGE URL
                </label>
                <input
                  type="text"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-700 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  INSTAGRAM PROFILE URL
                </label>
                <input
                  type="text"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-[#112347] text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  LINKEDIN PROFILE URL
                </label>
                <input
                  type="text"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-700 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  YOUTUBE CHANNEL URL
                </label>
                <input
                  type="text"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-slate-700 text-xs font-semibold outline-none focus:border-[#FF6014] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
