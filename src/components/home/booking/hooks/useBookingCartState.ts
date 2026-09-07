"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
import { useGetPublicProfilesQuery } from "@/redux/features/landing/landingApi";
import { getFallbackVendorId } from "@/utils/vendorResolution";
import { toast } from "sonner";

const fallbackServices = [
  {
    id: "leak-repair",
    title: "Leak Repair & Detection",
    description: "Non-invasive ultrasonic leak detection for hidden pipes.",
    price: "800",
    type: "normal",
  },
  {
    id: "plumbing-emergency",
    title: "Plumbing Emergency?",
    description: "Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages.",
    type: "emergency",
  },
];

interface UseBookingCartStateProps {
  service: any;
  isLoading: boolean;
  nestedServices?: any[];
}

export function useBookingCartState({ service, isLoading, nestedServices }: UseBookingCartStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authUser = useAppSelector((state) => state.auth.user);

  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [activeTab, setActiveTab] = useState("specialized-services");
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const { data: profilesRes } = useGetPublicProfilesQuery();
  const hasAutoBooked = useRef(false);
  // Guard: prevent saving an empty cart to localStorage before we've loaded the persisted one
  const hasLoadedFromStorage = useRef(false);

  // Load initial cart quantities from localStorage once service.id is available
  useEffect(() => {
    if (typeof window !== "undefined" && service?.id) {
      const saved = window.localStorage.getItem(`rajseba_cart_${service.id}`);
      if (saved) {
        try {
          setCartQuantities(JSON.parse(saved));
        } catch (e) {
          // ignore malformed JSON
        }
      }
      // Mark load as complete so the save effect can safely write
      hasLoadedFromStorage.current = true;
    }
  }, [service?.id]);

  // Save cart quantities to localStorage whenever they change (only after initial load)
  useEffect(() => {
    if (typeof window !== "undefined" && service?.id && hasLoadedFromStorage.current) {
      window.localStorage.setItem(`rajseba_cart_${service.id}`, JSON.stringify(cartQuantities));
    }
  }, [cartQuantities, service?.id]);

  const displayServices = useMemo(() => {
    const nested = nestedServices && nestedServices.length > 0 ? nestedServices : service?.nestedServices;
    if (nested && nested.length > 0) {
      return nested.map((ns: any) => {
        // Filter sub-services so we only show the ones belonging to this nested service (ns.id)
        const filteredSubs = (ns.subServices || ns.sub_services || []).filter((sub: any) => {
          const parentId = sub.nested_service_id || sub.nestedServiceId || sub.nestedService?.id;
          return !parentId || Number(parentId) === Number(ns.id);
        });
        return {
          id: String(ns.id),
          title: ns.name,
          description: ns.description || "Expert service technician ready to assist you.",
          price: ns.starting_price || ns.price,
          image: ns.image,
          subServices: filteredSubs,
          type: "normal",
        };
      });
    }
    return fallbackServices;
  }, [service, nestedServices]);

  const cartItems = useMemo(
    () =>
      displayServices
        .flatMap((s: any) =>
          (s.subServices || []).map((sub: any) => ({
            ...sub,
            parentTitle: s.title,
            quantity: cartQuantities[sub.id] || 0,
          }))
        )
        .filter((sub: any) => sub.quantity > 0),
    [displayServices, cartQuantities]
  );

  const cartItemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum: number, item: any) => sum + Number(item.price || 0) * item.quantity,
    0
  );
  const payableTotal = appliedCoupon ? appliedCoupon.final_price : cartTotal;

  const handleUpdateQuantity = (subId: number, delta: number) => {
    setCartQuantities((prev) => {
      const nextQty = (prev[subId] || 0) + delta;
      if (nextQty <= 0) {
        const { [subId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [subId]: nextQty };
    });
  };

  const handleRemoveFromCart = (subId: number) => {
    setCartQuantities((prev) => {
      const { [subId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
    setAppliedCoupon(null);
    if (typeof window !== "undefined" && service?.id) {
      window.localStorage.removeItem(`rajseba_cart_${service.id}`);
    }
  };

  const handleAddToCart = (item: any, subId: number) => {
    if (!authUser) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setCartQuantities((prev) => ({ ...prev, [subId]: (prev[subId] || 0) + 1 }));
    toast.success("Added to booking cart", { duration: 1500 });
  };

  const handleInitiateBooking = () => {
    if (!authUser) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Automatically select the first available sub-service if the cart is empty
    if (cartItems.length === 0) {
      const firstSubService = displayServices.find(
        (s: any) => s.subServices && s.subServices.length > 0
      )?.subServices[0];
      if (firstSubService) {
        setCartQuantities({ [firstSubService.id]: 1 });
      }
    }

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Please login to place a booking.");
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!bookingDetails.date || !bookingDetails.location) {
      toast.error("Booking Date and Service Location are required!");
      return;
    }
    const subServiceItems = cartItems.map((item: any) => ({
      sub_service_id: Number(item.id),
      quantity: Number(item.quantity),
    }));
    const rawVendorId = service?.vendor?.id || service?.vendor_id || getFallbackVendorId(profilesRes);
    const vendorIdNum = Number(rawVendorId);
    const serviceIdNum = Number(service?.id);

    const payload = {
      user_id: Number(authUser?.id),
      vendor_id: !isNaN(vendorIdNum) && vendorIdNum > 0 ? vendorIdNum : undefined,
      service_id: !isNaN(serviceIdNum) && serviceIdNum > 0 ? serviceIdNum : undefined,
      date: bookingDetails.date,
      time: bookingDetails.time || undefined,
      location: bookingDetails.location,
      notes: bookingDetails.notes || undefined,
      sub_service_items: subServiceItems,
      coupon_code: appliedCoupon?.coupon.code,
    };

    console.log("Submitting Booking Payload:", payload);

    try {
      await createBooking(payload).unwrap();
      toast.success(
        cartItemCount > 1
          ? `${cartItemCount} services booked successfully! ✅`
          : "Booking placed successfully! ✅",
        {
          description: "View and track your booking from your dashboard.",
          action: {
            label: "Track Booking →",
            onClick: () => router.push("/dashbord/bookings"),
          },
          duration: 6000,
        }
      );
      setIsModalOpen(false);
      setCartQuantities({});
      setAppliedCoupon(null);
      setBookingDetails({ date: "", time: "", location: "", notes: "" });
      if (typeof window !== "undefined" && service?.id) {
        window.localStorage.removeItem(`rajseba_cart_${service.id}`);
      }
    } catch (err: any) {
      console.error("Booking submission error details:", err);
      const errorMsg = err?.data?.message || err?.message || JSON.stringify(err) || "Unknown error";
      toast.error(`Failed to place booking: ${errorMsg}`);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setActiveTab(id);
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Keep active tab updated on scroll
  useEffect(() => {
    const sections = ["specialized-services", "packages", "overview", "details", "experts", "vendor", "faq", "reviews"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160; // Offset of 160px accommodates header/tabs
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatically open booking modal if ?book=true is passed
  useEffect(() => {
    if (isLoading || !service || hasAutoBooked.current) return;
    const shouldBook = searchParams.get("book") === "true";
    if (shouldBook) {
      hasAutoBooked.current = true;
      const firstSubService = displayServices.find(
        (s: any) => s.subServices && s.subServices.length > 0
      )?.subServices[0];
      if (firstSubService) {
        setCartQuantities({ [firstSubService.id]: 1 });
      }
      if (!authUser) {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }
      setIsModalOpen(true);
    }
  }, [isLoading, service, searchParams, displayServices, authUser, router]);

  return {
    authUser,
    cartItems,
    cartItemCount,
    cartTotal,
    payableTotal,
    displayServices,
    isModalOpen,
    setIsModalOpen,
    bookingDetails,
    setBookingDetails,
    appliedCoupon,
    setAppliedCoupon,
    activeTab,
    setActiveTab,
    isBooking,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
    handleAddToCart,
    handleInitiateBooking,
    handleConfirmBooking,
    scrollToSection,
  };
}
