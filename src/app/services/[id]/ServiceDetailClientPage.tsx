"use client";

import React, { useState } from "react";

// ─── Helper to clean empty tags and <br> from HTML ────────────────────────
const cleanHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "")
    .replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");
};

// ─── Helper to detect if a string is HTML ───────────────────────────────────
const isHtml = (str: string) => /<[a-z]/.test(str);

// ─── Renders either saved rich HTML or plain text with bullet list fallback ──
const RichContent = ({ html, className = "" }: { html: string; className?: string }) => {
  if (!html) return null;
  const cleaned = cleanHtml(html);
  if (isHtml(cleaned)) {
    return (
      <div
        className={`rich-content text-sm text-slate-600 leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }
  // Fallback: plain text with bullet points
  const lines = cleaned.split("\n").filter(l => l.trim());
  return (
    <ul className="space-y-2">
      {lines.map((line, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] mt-2 shrink-0" />
          <span>{line.replace(/^[•\-*]\s*/, "")}</span>
        </li>
      ))}
    </ul>
  );
};


const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cleanedAnswer = cleanHtml(answer);
  const isRichAnswer = /<[a-z]/.test(cleanedAnswer);

  return (
    <div className="border-b border-slate-100 last:border-b-0 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-bold text-slate-800 hover:text-[#FF6014] transition-colors gap-4 py-2 focus:outline-none"
      >
        <span className="text-sm md:text-base">{question}</span>
        <span className={`w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#FF6014]/10 text-[#FF6014]' : 'text-slate-400'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {isRichAnswer ? (
              <div
                className="pb-4 pt-2 text-sm text-slate-500 leading-relaxed rich-content"
                dangerouslySetInnerHTML={{ __html: cleanedAnswer }}
              />
            ) : (
              <div className="pb-4 pt-2 text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                {cleanedAnswer}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';
import { VendorProfile } from '@/components/home/categorizedServices/VendorProfile';
import { ServiceReviews } from '@/components/home/categorizedServices/ServiceReviews';
import { SubServiceDetailCard, SubServiceDetailDrawer } from '@/components/home/categorizedServices/SubServiceDetailComponents';
import { useGetPublicServiceByIdQuery, useGetPublicServicesQuery, useGetPublicReviewsByServiceQuery, useGetPublicNestedServicesByServiceQuery, useGetPublicSubServiceByIdQuery } from "@/redux/features/landing/landingApi";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingCartState } from "@/components/home/booking/hooks/useBookingCartState";
import { ServiceDeliveryDetails } from "@/components/home/categorizedServices/ServiceDeliveryDetails";
import { MobileBookingDrawer } from "@/components/home/booking/MobileBookingDrawer";
import CustomServiceBanner from "@/components/home/CustomServiceBanner";

export default function ServiceDetailClientPage({ id }: { id: string }) {
  const router = useRouter();
  const isNumericId = /^\d+$/.test(id);

  const { data: publicRes, isLoading: isPublicLoading } = useGetPublicServicesQuery(
    undefined,
    { skip: isNumericId }
  );
  const allServices = publicRes?.data || (Array.isArray(publicRes) ? publicRes : []);
  const matchedId = isNumericId
    ? Number(id)
    : allServices.find((s: any) => s.slug === id)?.id;

  const { data: serviceRes, isLoading: isServiceLoading, isError } = useGetPublicServiceByIdQuery(
    matchedId || 0,
    { skip: !matchedId }
  );

  const { data: nestedServicesRes } = useGetPublicNestedServicesByServiceQuery(
    matchedId || 0,
    { skip: !matchedId }
  );

  const { data: reviewsRes } = useGetPublicReviewsByServiceQuery(
    matchedId || 0,
    { skip: !matchedId }
  );

  const service = serviceRes?.data;

  React.useEffect(() => {
    if (service) {
      const catName = service.category?.name?.toLowerCase() || "";
      const catSlug = service.category?.slug?.toLowerCase() || "";
      const name = service.name?.toLowerCase() || "";
      if (
        catName.includes("shifting") ||
        catSlug.includes("shifting") ||
        name.includes("shifting")
      ) {
        router.replace("/home-shifting");
      }
    }
  }, [service, router]);
  const nestedServices = nestedServicesRes?.data || nestedServicesRes || [];
  const isLoading = isNumericId ? isServiceLoading : isPublicLoading || isServiceLoading;

  const state = useBookingCartState({ service, isLoading, nestedServices });

  // ── Sub-service detail panel state ────────────────────────────────────────
  // We only track the ID; full details are fetched from the API
  const [selectedSubServiceId, setSelectedSubServiceId] = useState<number | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Fetch full sub-service details (description, image1, image2, faq) by ID
  const { data: subServiceDetailRes, isFetching: isSubServiceFetching } = useGetPublicSubServiceByIdQuery(
    selectedSubServiceId ?? 0,
    { skip: !selectedSubServiceId }
  );

  // Build the selectedSubService object — merge API detail with parent info from nestedServices
  const selectedSubService = React.useMemo(() => {
    if (!selectedSubServiceId) return null;
    const fullDetail = subServiceDetailRes?.data || subServiceDetailRes;
    if (!fullDetail) return null;
    // Find parent nested service for title context
    const displayNested = nestedServices && nestedServices.length > 0 ? nestedServices : service?.nestedServices;
    const parentNested = displayNested?.find((ns: any) =>
      [...(ns.subServices || []), ...(ns.sub_services || [])].some((s: any) => s.id === selectedSubServiceId)
    );
    return {
      ...fullDetail,
      parentTitle: parentNested?.name || service?.name,
      parentService: parentNested || service,
    };
  }, [selectedSubServiceId, subServiceDetailRes, nestedServices, service]);

  const openSubServicePanel = (subId: number) => {
    setSelectedSubServiceId(subId);
    setMobileDrawerOpen(true);
  };

  const handleAddToCart = (svc: any, subId: number) => {
    state.handleAddToCart(svc, subId);
    openSubServicePanel(subId);
  };

  const handleUpdateQuantity = (subId: number, delta: number) => {
    state.handleUpdateQuantity(subId, delta);
    if (delta > 0) {
      openSubServicePanel(subId);
    }
  };

  const handleSubServiceClick = (sub: any) => {
    if (selectedSubServiceId === sub.id) {
      setSelectedSubServiceId(null);
      setMobileDrawerOpen(false);
    } else {
      openSubServicePanel(sub.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
          <p className="text-sm font-semibold text-slate-500">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Service Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 font-medium">We couldn't retrieve details for the requested service.</p>
          <Link href="/services" className="inline-flex items-center justify-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer">
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const reviews = service.reviews?.length ? service.reviews : (reviewsRes?.data || []);
  const bookingsCount = (service.bookings || []).length;
  const reviewsCount = reviews.length;
  const rating = reviewsCount > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviewsCount).toFixed(1)
    : "0.0";
  const tabs = [
    { id: "specialized-services", label: "Services" },
    ...(service.packages?.length ? [{ id: "packages", label: "Packages" }] : []),
    ...(service.overview ? [{ id: "overview", label: "Overview" }] : []),
    ...(service.details ? [{ id: "details", label: "Details" }] : []),
    ...(service.employees?.length ? [{ id: "experts", label: "Experts" }] : []),
    { id: "vendor", label: "Vendor Profile" },
    ...(service.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDFD] via-slate-50/70 to-[#FFF8F4] relative pb-16">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: "auto" }} />
      <div className="relative z-10">
        <CategorizedHero id={service.id} name={service.name} description={service.description} image={service.image} rating={rating} bookingsCount={bookingsCount} reviewsCount={reviewsCount} categoryName={service.category?.name} />

        <div className="sticky top-[64px]  md:top-[69px] lg:top-[72px] z-30 max-w-7xl mx-auto bg-white/95 rounded-xl backdrop-blur-md border-b border-slate-100 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.02)] transition-all duration-300 w-full">
          <div className="px-4 md:px-6 py-2 flex gap-2 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => state.scrollToSection(tab.id)}
                className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 shrink-0 cursor-pointer ${state.activeTab === tab.id
                  ? "text-white bg-[#FF6014] shadow-md shadow-rose-100"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-14 items-start">
            <div className="space-y-6 md:space-y-8 min-w-0">
              <div id="specialized-services">
                <SpecializedServices
                  nestedServices={nestedServices && nestedServices.length > 0 ? nestedServices : service.nestedServices}
                  serviceId={service.id}
                  vendorId={service.vendor?.id}
                  serviceImage={service.image}
                  serviceName={service.name}
                  cartQuantities={state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})}
                  onUpdateQuantity={handleUpdateQuantity}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={state.handleRemoveFromCart}
                  onInitiateBooking={state.handleInitiateBooking}
                  onSubServiceClick={handleSubServiceClick}
                  selectedSubServiceId={selectedSubService?.id ?? null}
                />
              </div>

              {service.packages && service.packages.length > 0 && (
                <div id="packages">
                  <Packages packages={service.packages} serviceId={service.id} vendorId={service.vendor?.id} serviceName={service.name} serviceImage={service.image} />
                </div>
              )}

              {service.overview && (
                <div id="overview" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#FF6014] rounded-full" />
                    Overview
                  </h3>
                  <RichContent html={service.overview} />
                </div>
              )}

              {service.details && (
                <div id="details" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#FF6014] rounded-full" />
                    Key Features & Details
                  </h3>
                  <RichContent html={service.details} />
                </div>
              )}

              {service.employees && service.employees.length > 0 && (
                <div id="experts">
                  <Experts employees={service.employees} />
                </div>
              )}

              <div id="vendor">
                <VendorProfile vendor={service.vendor} serviceRating={rating} />
              </div>

              <CustomServiceBanner categoryName={service.category?.name || service.name} />

              <div id="reviews">
                <ServiceReviews reviews={reviews} />
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6 md:space-y-8 lg:sticky lg:top-[136px] lg:z-20">

              {/* Sub-service Detail Panel & Service Delivery details info card */}
              {selectedSubService ? (
                <>
                  {/* Desktop detail card */}
                  <div className="hidden lg:block">
                    <SubServiceDetailCard
                      subService={selectedSubService}
                      onClose={() => setSelectedSubServiceId(null)}
                      isAdded={(state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})[selectedSubService?.id] || 0) > 0}
                      quantity={state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})[selectedSubService?.id] || 0}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  </div>
                  {/* Service delivery procedures, hours & hotline */}
                  <ServiceDeliveryDetails />
                </>
              ) : (
                <>
                  {service.faq && service.faq.length > 0 && (
                    <div id="faq" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#FF6014] rounded-full" />
                        FAQ
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 font-medium">Common questions about this service</p>
                      <div className="divide-y divide-slate-100">
                        {service.faq.map((item: any, idx: number) => {
                          const question = item.question || item.q || item.title || "";
                          const answer = item.answer || item.a || item.content || "";
                          if (!question || !answer) return null;
                          return <FAQItem key={idx} question={question} answer={answer} />;
                        })}
                      </div>
                    </div>
                  )}

                  <ServiceDeliveryDetails />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Drawer for sub-service details */}
      <SubServiceDetailDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => { setMobileDrawerOpen(false); setSelectedSubServiceId(null); }}
        subService={selectedSubService}
        isAdded={(state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})[selectedSubService?.id] || 0) > 0}
        quantity={state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})[selectedSubService?.id] || 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Floating Sticky Bottom CTA Bar */}
      <AnimatePresence>
        {state.cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[88px] md:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center"
          >
            <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-[0_12px_40px_rgba(255,96,20,0.15)] rounded-[24px] p-3 flex items-center justify-between gap-6 w-full max-w-md animate-none">
              <div className="flex items-center gap-3 min-w-0 pl-1">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center shrink-0 border border-[#FF6014]/10 animate-none">
                  <ShoppingCart size={18} className="stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 leading-none">{state.cartItemCount} item{state.cartItemCount === 1 ? "" : "s"}</p>
                  <p className="text-base font-black text-slate-900 mt-0.5 leading-none">₹{state.payableTotal.toLocaleString()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => state.setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl text-xs font-black text-white bg-[#FF6014] hover:bg-[#E0530A] transition-all duration-250 shadow-md active:scale-95 shrink-0 cursor-pointer"
              >
                Proceed to Book
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileBookingDrawer isOpen={state.isModalOpen} onClose={() => state.setIsModalOpen(false)} cartItems={state.cartItems} cartItemCount={state.cartItemCount} cartTotal={state.cartTotal} payableTotal={state.payableTotal} appliedCoupon={state.appliedCoupon} setAppliedCoupon={state.setAppliedCoupon} bookingDetails={state.bookingDetails} setBookingDetails={state.setBookingDetails} isBooking={state.isBooking} onSubmit={state.handleConfirmBooking} serviceId={service.id} onUpdateQuantity={state.handleUpdateQuantity} onRemoveFromCart={state.handleRemoveFromCart} onClearCart={state.handleClearCart} />
    </div>
  );
}