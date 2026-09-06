"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/token";
import { getRoleName } from "@/redux/features/auth/authSlice";

import { useGetPublicStatsQuery } from "@/redux/features/landing/landingApi";

const TEAM_MEMBERS_FALLBACK = [
  {
    name: "Mahbubur Rahman",
    role: "Founder & CEO",
    bio: "Pioneering digital logistics for urban home maintenance, driven to establish job security and dignity for service professionals.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    experience: "10+ Yrs Exp",
  },
  {
    name: "Farhana Yasmin",
    role: "Head of Customer Experience",
    bio: "Setting strict SLA protocols and service compliance measures to ensure every customer is delighted on every visit.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    experience: "8+ Yrs Exp",
  },
  {
    name: "Asif Adnan",
    role: "Director of Operations",
    bio: "Leading verification audits and continuous skill training labs to verify only the top 5% of technicians join Rajseba.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    experience: "7+ Yrs Exp",
  },
];

export function useAboutState() {
  const { data: statsRes } = useGetPublicStatsQuery();
  const statsData = statsRes?.data || {};
  const [teamMembers, setTeamMembers] = useState<any[]>(TEAM_MEMBERS_FALLBACK);

  useEffect(() => {
    const token = getAccessToken();
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";
    fetch(`${apiBase}/users`, { headers })
      .then((res) => res.json())
      .then((json) => {
        const users = json.data || (Array.isArray(json) ? json : []);
        if (Array.isArray(users) && users.length > 0) {
          const admins = users.filter((u: any) => {
            const uRole = (typeof u.role === "string" ? u.role : u.role?.name || "").toLowerCase();
            return uRole === "superadmin" || uRole === "super admin";
          });
          if (admins.length > 0) {
            const mappedTeam = admins.map((u: any) => {
              const uRole = (typeof u.role === "string" ? u.role : u.role?.name || "").toLowerCase();
              const roleName = getRoleName(uRole as any) || "Super Admin";
              const profileImg = u?.profile?.avatar || u?.profile?.images?.[0] || u?.profile?.picture || u?.avatar;
              return {
                name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Super Admin",
                role: roleName,
                bio: u.profile?.description || u.description || "Leading operations, technology, and service standards.",
                avatar: profileImg || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
                linkedin: u.linkedin || "https://linkedin.com",
                facebook: u.facebook || "https://facebook.com",
                experience: "Verified Lead",
              };
            });
            setTeamMembers(mappedTeam);
          }
        }
      })
      .catch((err) => console.error("Error fetching users for team:", err));
  }, []);

  const displayStats = [
    { value: statsData?.servicesCompleted ? `${Number(statsData.servicesCompleted).toLocaleString()}+` : "120,000+", label: "Bookings Done", desc: "Across Rajshahi City" },
    { value: statsData?.verifiedExperts ? `${Number(statsData.verifiedExperts).toLocaleString()}+` : "2,500+", label: "Verified Experts", desc: "Background screened" },
    { value: typeof statsData?.averageRating === "number" ? `${statsData.averageRating.toFixed(1)}/5.0` : "4.8/5.0", label: "Average Rating", desc: "From real clients" },
    { value: statsData?.happyCustomers ? `${Number(statsData.happyCustomers).toLocaleString()}+` : "50,000+", label: "Happy Customers", desc: "Rajseba Guarantee" },
  ];

  return { displayStats, teamMembers };
}
