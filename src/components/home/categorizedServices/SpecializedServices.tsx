"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Phone,
  ChevronDown,
  ChevronUp,
  Calendar,
  Plus,
  Minus,
  Sparkles,
  User,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  Loader2,
  X,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useCreateCustomRequestMutation } from "@/redux/features/admin/customRequestApi";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { formatImageUrl } from "@/lib/utils";

interface SubService {
  id: number;
  name: string;
  price: string;
  is_contact_for_price?: boolean;
  description?: string;
  image1?: string;
  image2?: string;
  faq?: { question: string; answer: string }[];
}

interface SpecializedService {
  id: string;
  title: string;
  description: string;
  price?: string;
  is_contact_for_price?: boolean;
  image?: string;
  subServices?: SubService[];
  type: "normal" | "emergency";
}

const fallbackServices: SpecializedService[] = [
  {
    id: "leak-repair",
    title: "Leak Repair & Detection",
    description:
      "Non-invasive ultrasonic leak detection for hidden pipes. We fix everything from dripping faucets to underground line bursts.",
    price: "800",
    type: "normal",
  },
  {
    id: "plumbing-emergency",
    title: "Plumbing Emergency?",
    description:
      "Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages.",
    type: "emergency",
  },
];

export function SpecializedServices({
  nestedServices,
  serviceId,
  vendorId,
  serviceImage,
  serviceName,
  cartQuantities,
  onUpdateQuantity,
  onAddToCart,
  onRemoveFromCart,
  onInitiateBooking,
  onSubServiceClick,
  selectedSubServiceId,
}: {
  nestedServices?: any[];
  serviceId?: number;
  vendorId?: number;
  serviceImage?: string;
  serviceName?: string;
  cartQuantities: Record<number, number>;
  onUpdateQuantity: (subId: number, delta: number) => void;
  onAddToCart: (service: any, subId: number) => void;
  onRemoveFromCart: (subId: number) => void;
  onInitiateBooking: (service: any) => void;
  onSubServiceClick?: (subService: any) => void;
  selectedSubServiceId?: number | null;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const authUser = useAppSelector((state) => state.auth.user);
  const [createBooking] = useCreateBookingMutation();
  const [createCustomRequest] = useCreateCustomRequestMutation();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // User Info Modal for Contact / Manual Price Service
  const [contactModalData, setContactModalData] = useState<{
    isOpen: boolean;
    serviceTitle: string;
    subTitle?: string;
    subId?: number;
  }>({ isOpen: false, serviceTitle: "" });

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  // Auto-fill logged in user details when modal opens
  useEffect(() => {
    if (contactModalData.isOpen) {
      const uName = authUser?.name || authUser?.fullName || authUser?.profile?.name || "";
      const uPhone = authUser?.phone || authUser?.phoneNumber || authUser?.mobile || authUser?.profile?.phone || "";
      const uLocation = authUser?.location || authUser?.address || authUser?.profile?.address || authUser?.profile?.location || "";

      setContactForm({
        name: uName,
        phone: uPhone,
        location: uLocation,
        notes: "",
      });
    }
  }, [contactModalData.isOpen, authUser]);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name.trim()) {
      toast.error("আপনার নাম দেওয়া আবশ্যক");
      return;
    }
    if (!contactForm.phone.trim()) {
      toast.error("আপনার ফোন নম্বর দেওয়া আবশ্যক");
      return;
    }
    if (!contactForm.location.trim()) {
      toast.error("আপনার ঠিকানা / এলাকা দেওয়া আবশ্যক");
      return;
    }

    setSubmittingContact(true);
    try {
      const serviceTitle = contactModalData.serviceTitle;
      const subTitle = contactModalData.subTitle;
      const fullTitle = subTitle ? `${serviceTitle} (${subTitle})` : serviceTitle;
      const uEmail = authUser?.email || authUser?.profile?.email || "";
      const todayDate = new Date().toISOString().split("T")[0];

      const subServiceItems = contactModalData.subId
        ? [{ sub_service_id: Number(contactModalData.subId), quantity: 1 }]
        : [];

      // Build complete booking payload with service details, sub-services, client name & phone number
      const bookingPayload: any = {
        vendor_id: Number(vendorId || 1),
        service_id: serviceId ? Number(serviceId) : undefined,
        sub_service_items: subServiceItems.length > 0 ? subServiceItems : undefined,
        sub_service_ids: contactModalData.subId ? [Number(contactModalData.subId)] : undefined,
        date: todayDate,
        location: contactForm.location.trim(),
        notes: `Service Details: ${fullTitle} | Client Name: ${contactForm.name.trim()} | Phone: ${contactForm.phone.trim()}${
          contactForm.notes.trim() ? ` | Notes: ${contactForm.notes.trim()}` : ""
        }`,
        user_id: authUser?.id ? Number(authUser.id) : undefined,
      };

      // Create Booking so it shows up in Operations -> Manage Bookings
      await createBooking(bookingPayload).unwrap();

      // Also record in custom requests for redundancy
      try {
        await createCustomRequest({
          name: contactForm.name.trim(),
          phone: contactForm.phone.trim(),
          email: uEmail || undefined,
          title: `Nested Service Inquiry: ${fullTitle}`,
          description: `Service: ${fullTitle}\nLocation: ${contactForm.location.trim()}${
            contactForm.notes.trim() ? `\nDetails: ${contactForm.notes.trim()}` : ""
          }`,
          user_id: authUser?.id ? Number(authUser.id) : undefined,
        }).unwrap();
      } catch (e) {
        // ignore secondary logging error
      }

      toast.success("আপনার বুকিং অনুরোধটি সফলভাবে জমা হয়েছে! আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।");
      setContactModalData({ isOpen: false, serviceTitle: "" });
      setContactForm({ name: "", phone: "", location: "", notes: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "বুকিং জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmittingContact(false);
    }
  };

  const displayServices: SpecializedService[] =
    nestedServices && nestedServices.length > 0
      ? nestedServices.map((ns) => {
        // Filter sub-services so we only show the ones belonging to this nested service (ns.id)
        const filteredSubs = (ns.subServices || ns.sub_services || []).filter((sub: any) => {
          const parentId = sub.nested_service_id || sub.nestedServiceId || sub.nestedService?.id;
          return !parentId || Number(parentId) === Number(ns.id);
        });

        return {
          id: String(ns.id),
          title: ns.name,
          description:
            ns.description || "Expert service technician ready to assist you.",
          price: ns.starting_price || ns.price,
          is_contact_for_price: !!ns.is_contact_for_price,
          image: ns.image,
          subServices: filteredSubs,
          type: "normal" as const,
        };
      })
      : fallbackServices;

  const isInCart = (subId: number) => (cartQuantities[subId] || 0) > 0;
  const getQuantity = (subId: number) => cartQuantities[subId] || 0;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInitiateBooking = (service: SpecializedService) => {
    if (service.is_contact_for_price) {
      setContactModalData({ isOpen: true, serviceTitle: service.title });
      return;
    }
    const serviceSubs = service.subServices || [];
    if (serviceSubs.length > 0) {
      const hasSelection = serviceSubs.some((ss) => isInCart(ss.id));
      if (!hasSelection) {
        onAddToCart(service, serviceSubs[0].id);
      }
    }
    onInitiateBooking(service);
  };

  return (
    <section className="py-4 md:py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Available Services
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Our Specialized Services
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Transparent pricing and expert craftsmanship.
          </p>
        </div>
        <Link
          href="/services"
          className="text-[#FF6014] hover:text-[#E0530A] font-bold text-sm flex items-center gap-1 group self-start sm:self-auto"
        >
          View All Services{" "}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Main Single Column Layout */}
      <div className="flex flex-col gap-5">
        {displayServices.map((service, index) => {
          const isExpanded = expandedId === service.id;
          const hasSubServices =
            service.subServices && service.subServices.length > 1;

          /* Emergency card */
          if (service.type === "emergency") {
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#261817] text-white rounded-[32px] p-6 sm:p-8
                  flex flex-col relative overflow-hidden border border-slate-900 min-h-[180px]"
              >
                {/* Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-10 w-48 h-48 bg-[#FF6014]/20 rounded-full blur-[60px]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-2 z-10">
                  {service.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-xl z-10 font-medium">
                  {service.description} Arrival in under 60 minutes.
                </p>

                <div className="flex flex-wrap gap-3 mt-auto z-10">
                  <a
                    href="tel:01813333373"
                    className="inline-flex items-center gap-2 bg-[#FF6014] hover:bg-[#E0530A]
                      px-6 py-3 rounded-full font-bold text-xs text-white
                      transition shadow-lg shadow-rose-900/20 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Call Hotline
                  </a>
                </div>

                <div className="absolute bottom-6 right-8 text-right hidden sm:block z-10">
                  <div className="text-5xl font-black text-[#FF6014] leading-none">60</div>
                  <div className="text-[9px] uppercase tracking-[2px] font-bold text-slate-400 mt-1">
                    Minute Arrival
                  </div>
                </div>
              </motion.div>
            );
          }

          /* Normal service card */
          return (
            <div key={service.id} className="flex flex-col gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => hasSubServices && toggleExpand(service.id)}
                className={`rounded-[32px] p-6 md:p-8 border transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-6
                  ${isExpanded
                    ? "bg-gradient-to-br from-white via-white to-[#FFF8F4]/30 border-[#FF6014]/45 shadow-md shadow-[#FF6014]/5 -translate-y-0.5"
                    : "bg-white border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5"
                  }
                  ${hasSubServices ? "cursor-pointer hover:border-[#FF6014]/30" : ""}`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 min-w-0 flex-1">
                  {service.image ? (
                    <img
                      src={formatImageUrl(service.image)}
                      alt={service.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[24px] object-cover shadow-xs border border-slate-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-rose-50 rounded-[24px] flex items-center justify-center flex-shrink-0 border border-rose-100/50">
                      <Droplet className="w-8 h-8 text-[#FF6014]" />
                    </div>
                  )}
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-slate-800 group-hover:text-[#FF6014] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    {(() => {
                      const cleanedDesc = (service.description || "").replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "").replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");
                      return /<[a-z]/.test(cleanedDesc) ? (
                        <div
                          className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl rich-content"
                          dangerouslySetInnerHTML={{ __html: cleanedDesc }}
                        />
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl">
                          {cleanedDesc}
                        </p>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0 gap-5 shrink-0">
                  {service.is_contact_for_price ? (
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] text-[#FF6014] font-extrabold uppercase tracking-wider block">
                        Manual Price
                      </span>
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-amber-200">
                        <Phone className="w-3 h-3 text-[#FF6014]" /> Contact for Price
                      </span>
                    </div>
                  ) : service.price ? (
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                        Starting Price
                      </span>
                      <div className="text-[#FF6014] font-black text-lg sm:text-xl">
                        ₹{Number(service.price).toLocaleString()}
                      </div>
                    </div>
                  ) : null}

                  {!hasSubServices ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInitiateBooking(service);
                      }}
                      className={`inline-flex items-center gap-1.5 text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-md cursor-pointer active:scale-95 ${
                        service.is_contact_for_price
                          ? "bg-amber-600 hover:bg-amber-700 shadow-amber-100"
                          : "bg-[#FF6014] hover:bg-[#E0530A] shadow-rose-100"
                      }`}
                    >
                      {service.is_contact_for_price ? <Phone className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                      {service.is_contact_for_price ? "Contact Now" : "Book Now"}
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95
                      ${isExpanded
                        ? "bg-[#FFF8F4] text-[#FF6014] border-[#FF6014]/40 hover:bg-[#FF6014]/10"
                        : "bg-slate-50/65 text-slate-500 border-slate-100 hover:bg-rose-50 hover:text-[#FF6014] hover:border-[#FF6014]/20"
                      }`}
                    >
                      {isExpanded ? "Hide Options" : "View Options"}
                      {isExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </div>
                  )}

                </div>
              </motion.div>

              {/* SubServices Expandable Panel */}
              <AnimatePresence>
                {isExpanded && hasSubServices && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#FFF8F4]/30 border border-slate-100 p-3 sm:p-5 rounded-[24px] sm:rounded-[28px] shadow-xs mt-3">
                      <div className="flex flex-col gap-2.5">
                        {service.subServices?.map((sub) => {
                          const isAdded = isInCart(sub.id);
                          const quantity = getQuantity(sub.id);
                          const isSelected = selectedSubServiceId === sub.id;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => onSubServiceClick?.({ ...sub, parentTitle: service.title, parentService: service })}
                              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border bg-white transition-all gap-3 sm:gap-4 cursor-pointer group
                                ${isSelected
                                  ? "border-[#FF6014]/50 shadow-md ring-2 ring-[#FF6014]/10 bg-gradient-to-br from-white to-[#FFF8F4]/50"
                                  : isAdded
                                    ? "border-[#FF6014]/30 shadow-xs bg-gradient-to-br from-white to-[#FFF8F4]/20 hover:border-[#FF6014]/50"
                                    : "border-slate-100 hover:border-[#FF6014]/30 hover:shadow-sm"
                                }`}
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className={`text-xs sm:text-sm font-bold leading-snug transition-colors ${isSelected ? "text-[#FF6014]" : "text-slate-800 group-hover:text-[#FF6014]"}`}>
                                  {sub.name}
                                </h4>
                                {sub.is_contact_for_price ? (
                                  <div className="inline-flex items-center gap-1 text-[#FF6014] text-xs font-extrabold mt-0.5 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                                    <Phone className="w-3 h-3" /> Contact for Price
                                  </div>
                                ) : (
                                  <div className="text-[#FF6014] text-xs sm:text-sm font-black mt-0.5">
                                    ₹{Number(sub.price).toLocaleString()}
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 w-[96px] sm:w-28" onClick={(e) => e.stopPropagation()}>
                                {sub.is_contact_for_price ? (
                                  <button
                                    onClick={() => setContactModalData({ isOpen: true, serviceTitle: service.title, subTitle: sub.name, subId: sub.id })}
                                    className="w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 bg-amber-600 text-white hover:bg-amber-700 shadow-xs"
                                  >
                                    <Phone size={12} strokeWidth={3} />
                                    Contact
                                  </button>
                                ) : isAdded ? (
                                  <div className="flex items-center gap-1 bg-[#FFF8F4] border border-[#FF6014]/20 rounded-lg sm:rounded-xl p-0.5 w-full justify-between">
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQuantity(sub.id, -1)}
                                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-white text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition shadow-xs cursor-pointer"
                                    >
                                      <Minus size={10} strokeWidth={3} />
                                    </button>
                                    <span className="text-xs font-black text-slate-800">{quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQuantity(sub.id, 1)}
                                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-white text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition shadow-xs cursor-pointer"
                                    >
                                      <Plus size={10} strokeWidth={3} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      onAddToCart(service, sub.id);
                                      onSubServiceClick?.({ ...sub, parentTitle: service.title, parentService: service });
                                    }}
                                    className="w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 bg-[#FF6014] text-white hover:bg-[#E0530A] shadow-xs"
                                  >
                                    <Plus size={12} strokeWidth={3} />
                                    Add
                                  </button>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* User Information Request Modal for Contact for Price / Manual Price */}
      {contactModalData.isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/40 backdrop-blur-[3px] animate-in fade-in duration-150 font-sans"
          onClick={() => setContactModalData({ isOpen: false, serviceTitle: "" })}
        >
          <div
            className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-white/60 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200 max-h-[85dvh] sm:max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF6014]/90 via-[#FF7A3D]/90 to-[#E0530A]/90 backdrop-blur-md p-4 sm:p-5 text-white relative shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Sparkles size={14} />
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/95">
                  Service Information Request
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug pr-8">
                {contactModalData.serviceTitle}
              </h3>
              {contactModalData.subTitle && (
                <div className="mt-1 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                  <span>অপশন: {contactModalData.subTitle}</span>
                </div>
              )}
              <p className="text-[11px] sm:text-xs text-white/90 mt-1 font-medium leading-relaxed">
                অনুগ্রহ করে আপনার যোগাযোগের তথ্য প্রদান করুন। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
              </p>

              <button
                type="button"
                onClick={() => setContactModalData({ isOpen: false, serviceTitle: "" })}
                className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitContact} className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              
              {/* Logged in auto-fill alert */}
              {authUser && (
                <div className="flex items-center gap-2 bg-orange-500/10 backdrop-blur-sm border border-[#FF6014]/20 rounded-xl p-2.5 sm:p-3 text-xs font-semibold text-[#FF6014]">
                  <CheckCircle2 size={16} className="shrink-0 text-[#FF6014]" />
                  <div className="leading-tight text-[11px] sm:text-xs">
                    <span>লগইন অ্যাকাউন্ট থেকে তথ্য পূরণ করা হয়েছে!</span>
                    <span className="block text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">প্রয়োজনে এডিট (Edit) করতে পারবেন।</span>
                  </div>
                </div>
              )}

              {/* Form Input Fields */}
              <div className="space-y-3">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} className="text-[#FF6014]" /> আপনার নাম <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ রহিম হোসেন"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white/70 backdrop-blur-xs border border-slate-200/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={13} className="text-[#FF6014]" /> ফোন নম্বর <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01712345678"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-white/70 backdrop-blur-xs border border-slate-200/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Location / Address */}
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#FF6014]" /> ঠিকানা / এলাকা <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: হাউজিং এস্টেট, রাজশাহী"
                    value={contactForm.location}
                    onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full bg-white/70 backdrop-blur-xs border border-slate-200/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Notes / Special Instructions */}
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={13} className="text-[#FF6014]" /> বিশেষ বার্তা / নোট <span className="text-slate-400 font-normal text-[10px]">(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="আপনার কাজের বিবরণ বা প্রয়োজনীয় বিষয়গুলো লিখুন..."
                    value={contactForm.notes}
                    onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                    className="w-full bg-white/70 backdrop-blur-xs border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/20 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setContactModalData({ isOpen: false, serviceTitle: "" })}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={submittingContact}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#FF6014]/20 hover:shadow-none transition-all disabled:opacity-60 active:scale-[0.98] cursor-pointer"
                >
                  {submittingContact ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      জমা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      অনুরোধ পাঠান (Submit)
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}