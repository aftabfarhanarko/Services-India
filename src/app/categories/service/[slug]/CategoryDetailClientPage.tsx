"use client";

import React, { useState } from "react";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="pb-4 pt-2 text-sm text-slate-500 leading-relaxed whitespace-pre-line">
              {answer}
            </div>
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
import { useGetPublicServiceByIdQuery, useGetPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingCartState } from "@/components/home/booking/hooks/useBookingCartState";
import { DesktopBookingSidebar } from "@/components/home/booking/DesktopBookingSidebar";
import { MobileBookingDrawer } from "@/components/home/booking/MobileBookingDrawer";
import CustomServiceBanner from "@/components/home/CustomServiceBanner";

export default function CategoryDetailClientPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: publicRes, isLoading: isPublicLoading } = useGetPublicServicesQuery();
  const allServices = publicRes?.data || (Array.isArray(publicRes) ? publicRes : []);
  const matchedId = allServices.find((s: any) => s.slug === slug)?.id;

  const { data: serviceRes, isLoading: isServiceLoading, isError } = useGetPublicServiceByIdQuery(
    matchedId || 0,
    { skip: !matchedId }
  );
  const service = serviceRes?.data;

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: bookingsRes } = useGetAllBookingsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 5000,
  });
  const activeBookings = (bookingsRes?.data || []).filter(
    (b: any) => b.status === "pending" || b.status === "assigned" || b.status === "on_the_way"
  );

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

  const isLoading = isPublicLoading || isServiceLoading;

  const state = useBookingCartState({ service, isLoading });

  const cartCount = state.cartItemCount;
  const activeCount = activeBookings.length;
  const displayCount = cartCount > 0 ? cartCount : activeCount;
  const activePriceSum = activeBookings.reduce((acc: number, b: any) => acc + (b.total_price || b.subtotal || 0), 0);
  const displayPrice = cartCount > 0 ? state.payableTotal : activePriceSum;
  const displayLabel = cartCount > 0
    ? `${cartCount} item${cartCount === 1 ? "" : "s"}`
    : `${activeCount} Booking${activeCount === 1 ? "" : "s"}`;

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

  const reviews = service.reviews || [];
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDFD] via-slate-50/70 to-[#FFF8F4] relative pb-16 overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: "auto" }} />
      <div className="relative z-10">
        <CategorizedHero id={service.id} name={service.name} description={service.description} image={service.image} rating={rating} bookingsCount={bookingsCount} reviewsCount={reviewsCount} categoryName={service.category?.name} />

        <div className="sticky top-[72px] z-30 max-w-7xl mx-auto bg-[#FFF8F4]/50 backdrop-blur-lg border-b border-slate-100 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.02)] hidden md:block">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex gap-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => state.scrollToSection(tab.id)} className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${state.activeTab === tab.id ? "text-white bg-[#FF6014] shadow-md shadow-rose-100" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-14 items-start">
            <div className="space-y-6 md:space-y-8 min-w-0">
              <div id="specialized-services">
                <SpecializedServices nestedServices={service.nestedServices} serviceId={service.id} vendorId={service.vendor?.id} serviceImage={service.image} serviceName={service.name} cartQuantities={state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})} onUpdateQuantity={state.handleUpdateQuantity} onAddToCart={state.handleAddToCart} onRemoveFromCart={state.handleRemoveFromCart} onInitiateBooking={state.handleInitiateBooking} />
              </div>
              
              {service.packages && service.packages.length > 0 && (
                <div id="packages">
                  <Packages packages={service.packages} serviceId={service.id} vendorId={service.vendor?.id} serviceName={service.name} serviceImage={service.image} />
                </div>
              )}

              {service.employees && service.employees.length > 0 && (
                <div id="experts">
                  <Experts employees={service.employees} />
                </div>
              )}

              <CustomServiceBanner categoryName={service.category?.name || service.name} />

              <div id="reviews">
                <ServiceReviews reviews={reviews} />
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6 md:space-y-8 sticky top-[136px] z-20">
              <DesktopBookingSidebar
                cartItems={state.cartItems}
                cartItemCount={state.cartItemCount}
                cartTotal={state.cartTotal}
                payableTotal={state.payableTotal}
                appliedCoupon={state.appliedCoupon}
                setAppliedCoupon={state.setAppliedCoupon}
                bookingDetails={state.bookingDetails}
                setBookingDetails={state.setBookingDetails}
                isBooking={state.isBooking}
                onSubmit={state.handleConfirmBooking}
                serviceId={service.id}
                serviceImage={service.image}
                serviceName={service.name}
                onUpdateQuantity={state.handleUpdateQuantity}
                onRemoveFromCart={state.handleRemoveFromCart}
                onClearCart={state.handleClearCart}
              />

              <div id="vendor">
                <VendorProfile vendor={service.vendor} serviceRating={rating} />
              </div>

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

              <Commitments />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Right Edge E-Commerce Cart Badge Widget (Matched to User Screenshot) */}
      <AnimatePresence>
        {displayCount > 0 && (
          <motion.button
            type="button"
            onClick={() => state.setIsModalOpen(true)}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#FF6014] hover:bg-[#E0530A] text-white p-3 rounded-l-2xl shadow-[0_10px_35px_rgba(255,96,20,0.45)] flex flex-col items-center justify-center gap-1 min-w-[76px] cursor-pointer border-l border-y border-white/20 backdrop-blur-md transition-all group"
          >
            <div className="relative p-1">
              <ShoppingCart className="w-6 h-6 stroke-[2.2] group-hover:scale-110 transition-transform text-white" />
              <span className="absolute -top-1.5 -right-2.5 bg-white text-[#FF6014] font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#FF6014]">
                {displayCount}
              </span>
            </div>
            <div className="text-center leading-tight">
              <span className="text-[10px] font-extrabold block text-white/90 whitespace-nowrap">
                {displayLabel}
              </span>
              <span className="text-xs font-black block text-white mt-0.5 whitespace-nowrap">
                ₹{displayPrice.toLocaleString()}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <MobileBookingDrawer isOpen={state.isModalOpen} onClose={() => state.setIsModalOpen(false)} cartItems={state.cartItems} cartItemCount={state.cartItemCount} cartTotal={state.cartTotal} payableTotal={state.payableTotal} appliedCoupon={state.appliedCoupon} setAppliedCoupon={state.setAppliedCoupon} bookingDetails={state.bookingDetails} setBookingDetails={state.setBookingDetails} isBooking={state.isBooking} onSubmit={state.handleConfirmBooking} serviceId={service.id} onUpdateQuantity={state.handleUpdateQuantity} onRemoveFromCart={state.handleRemoveFromCart} onClearCart={state.handleClearCart} />
    </div>
  );
}