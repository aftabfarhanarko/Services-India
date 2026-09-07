"use client";

import React from "react";
import { Shield, Clock } from "lucide-react";

export const REGISTER_CONTENT = {
  badge: "JOIN RAJSEBA",
  heroTitle: "Expert care for your",
  heroAccent: "premium home.",
  heroDesc: "Experience the pinnacle of hospitality and safety with our curated selection of professional home services in Kolkata, West Bengal, India.",
  benefits: [
    {
      title: "Verified Professionals",
      description: "Every provider is strictly vetted for your safety.",
      icon: Shield,
    },
    {
      title: "Effortless Booking",
      description: "Schedule and track services in just a few taps.",
      icon: Clock,
    }
  ],
  formTitle: "Create Account",
  formSubtitle: "Welcome! Let's get your profile set up.",
  fields: {
    nameLabel: "Full Name",
    namePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "john@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+91 98765 43210",
    passLabel: "Password",
    passPlaceholder: "••••••••",
  },
  submitText: "Create Account",
  termsText: "By signing up, you agree to our ",
  termsLink: "Terms of Service",
  privacyLink: "Privacy Policy",
  alreadyHaveText: "Already have an account? ",
  loginLink: "Login"
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    }
  }
} as const;

export const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14,
    }
  }
} as const;
