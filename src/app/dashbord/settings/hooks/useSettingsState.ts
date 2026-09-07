"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSettingsState() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const roleName = getRoleName(role);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");

  // Form Fields State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765-43210",
    location: "Salt Lake, Kolkata",
  });

  // Toggles State
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailNotif: true,
    smsAlert: false,
    promotions: true,
  });

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Tab click handler
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "personal" || tabId === "security" || tabId === "notifications") {
      // These are on the main scrollable stack
      setTimeout(() => scrollToSection(tabId), 50);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Changes saved successfully!");
  };

  return {
    role,
    roleName,
    router,
    activeTab,
    setActiveTab,
    personalInfo,
    setPersonalInfo,
    toggles,
    setToggles,
    handleTabClick,
    handleSave,
  };
}
