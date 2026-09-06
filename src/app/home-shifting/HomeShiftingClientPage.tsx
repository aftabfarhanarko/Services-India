"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home, Building2, MapPin, Phone, Mail, User, Upload,
  X, CheckCircle, ArrowRight, Truck, Package, Shield,
  Star, Clock, Users, ChevronRight, Quote, Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useCreateCustomShiftingMutation } from "@/redux/features/admin/customShiftingApi";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

/* ────────────────────────────────────────────────────────────
   Small scroll-reveal helper — fades + lifts content in once it
   enters the viewport. Pure IntersectionObserver, no deps.
──────────────────────────────────────────────────────────── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* City-block coordinates for the faux map basemap — hand-placed so the
   route reads like it's actually threading between buildings/blocks. */
const CITY_BLOCKS = [
  { x: 18, y: 18, w: 34, h: 26 }, { x: 60, y: 14, w: 22, h: 20 }, { x: 18, y: 52, w: 26, h: 22 },
  { x: 96, y: 20, w: 28, h: 18 }, { x: 96, y: 46, w: 20, h: 24 }, { x: 130, y: 16, w: 20, h: 22 },
  { x: 20, y: 92, w: 30, h: 20 }, { x: 60, y: 84, w: 24, h: 18 }, { x: 60, y: 110, w: 22, h: 20 },
  { x: 130, y: 46, w: 26, h: 16 }, { x: 164, y: 20, w: 22, h: 24 }, { x: 164, y: 52, w: 18, h: 18 },
  { x: 96, y: 78, w: 22, h: 18 }, { x: 200, y: 18, w: 26, h: 18 }, { x: 200, y: 44, w: 20, h: 22 },
  { x: 130, y: 78, w: 24, h: 20 }, { x: 164, y: 78, w: 20, h: 18 }, { x: 236, y: 26, w: 24, h: 20 },
  { x: 96, y: 108, w: 24, h: 18 }, { x: 20, y: 122, w: 24, h: 16 }, { x: 60, y: 140, w: 22, h: 18 },
  { x: 200, y: 74, w: 22, h: 20 }, { x: 236, y: 54, w: 20, h: 18 }, { x: 270, y: 32, w: 24, h: 18 },
  { x: 130, y: 106, w: 22, h: 18 }, { x: 164, y: 104, w: 20, h: 20 }, { x: 96, y: 136, w: 20, h: 16 },
  { x: 236, y: 82, w: 22, h: 18 }, { x: 270, y: 60, w: 22, h: 20 }, { x: 20, y: 150, w: 22, h: 16 },
  { x: 130, y: 132, w: 20, h: 16 }, { x: 200, y: 104, w: 22, h: 18 }, { x: 270, y: 90, w: 20, h: 18 },
];

function RouteMap({ type }: { type: string }) {
  const [dash, setDash] = useState(0);
  const total = 300;
  useEffect(() => {
    setDash(0);
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1800, 1);
      setDash(Math.round((1 - Math.pow(1 - p, 3)) * total));
      if (p >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [type]);
  const t = Math.min(dash / total, 1);
  const tx = 50 + (330 - 50) * t;
  const ty = 220 - (220 - 60) * t;
  const arrived = t >= 1;
  const etaMin = Math.max(1, Math.round(18 * (1 - t)));

  return (
    <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-[0_8px_28px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
      {/* Basemap: dark navigation surface */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#151b2c 0%,#1c2438 45%,#141a29 100%)" }} />

      <svg viewBox="0 0 380 260" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="rg" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6014" />
            <stop offset="100%" stopColor="#22d3a8" />
          </linearGradient>
          <linearGradient id="blockFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a3350" />
            <stop offset="100%" stopColor="#232b45" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6014" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6014" stopOpacity="0" />
          </radialGradient>
          <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* City blocks (faux buildings) */}
        <g opacity="0.9">
          {CITY_BLOCKS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2.5" fill="url(#blockFill)" stroke="#3a4569" strokeWidth="0.6" />
          ))}
        </g>

        {/* Street grid */}
        <g stroke="#3d4870" strokeWidth="1" opacity="0.6">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`h${i}`} x1="0" y1={10 + i * 40} x2="380" y2={10 + i * 40} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line key={`v${i}`} x1={10 + i * 44} y1="0" x2={10 + i * 44} y2="260" />
          ))}
        </g>

        {/* Route glow underlay */}
        <path d="M 50,220 C 50,160 130,150 190,130 C 250,110 310,100 330,60" fill="none" stroke="#FF6014" strokeWidth="8" strokeLinecap="round" opacity="0.15" />
        {/* Route base track */}
        <path d="M 50,220 C 50,160 130,150 190,130 C 250,110 310,100 330,60" fill="none" stroke="#455079" strokeWidth="3.5" strokeLinecap="round" />
        {/* Route progress */}
        <path d="M 50,220 C 50,160 130,150 190,130 C 250,110 310,100 330,60" fill="none" stroke="url(#rg)" strokeWidth="3.5" strokeDasharray={total} strokeDashoffset={total - dash} strokeLinecap="round" filter="url(#softShadow)" />

        {/* Pickup marker */}
        <g transform="translate(50,220)">
          <circle r="16" fill="#FF6014" opacity="0.18">
            <animate attributeName="r" values="14;18;14" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.22;0.05;0.22" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="8.5" fill="#0f1424" stroke="#FF6014" strokeWidth="2" />
          <circle r="3" fill="#FF6014" />
          <text x="0" y="-16" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="800" style={{ paintOrder: "stroke", stroke: "#0f1424", strokeWidth: 3 }}>Pickup</text>
        </g>

        {/* Drop-off marker */}
        <g transform="translate(330,60)">
          <circle r="16" fill="#22d3a8" opacity="0.18">
            {arrived && <animate attributeName="r" values="14;20;14" dur="1.6s" repeatCount="indefinite" />}
          </circle>
          <circle r="8.5" fill="#0f1424" stroke="#22d3a8" strokeWidth="2" />
          <circle r="3" fill="#22d3a8" />
          <text x="0" y="-16" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="800" style={{ paintOrder: "stroke", stroke: "#0f1424", strokeWidth: 3 }}>Drop-off</text>
        </g>

        {/* Waypoint dots */}
        {[0.33, 0.66].map((p, i) => (
          <circle key={i} cx={50 + 280 * p} cy={220 - 160 * p} r="3.5" fill={dash / total >= p ? "#FF6014" : "#4b5680"} stroke="#151b2c" strokeWidth="1.5" />
        ))}

        {/* Moving vehicle */}
        {dash > 15 && (
          <g transform={`translate(${tx},${ty})`}>
            <circle r="17" fill="url(#glow)" />
            <circle r="10.5" fill="#0f1424" stroke="#FF6014" strokeWidth="1.5" filter="url(#softShadow)" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="12">🚚</text>
          </g>
        )}
      </svg>

      {/* Top-left: shifting type chip */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-xl px-2.5 py-1 border border-white/10">
        {type === "office" ? <Building2 size={11} className="text-sky-400" /> : <Home size={11} className="text-[#FF6014]" />}
        <span className="text-[11px] font-bold text-white">{type === "office" ? "Office" : "Home"} Shifting</span>
      </div>

      {/* Top-right: live badge */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-xl px-2.5 py-1 border border-white/10">
        <span className="relative flex h-1.5 w-1.5">
          <span className={`absolute inline-flex h-full w-full rounded-full ${arrived ? "bg-emerald-400" : "bg-[#FF6014]"} opacity-75 animate-ping`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${arrived ? "bg-emerald-400" : "bg-[#FF6014]"}`} />
        </span>
        <span className="text-[10px] font-black text-white uppercase tracking-wider">{arrived ? "Arrived" : "Live"}</span>
      </div>

      {/* Bottom: ETA / distance glass strip */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 bg-black/45 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
        <div className="flex items-center gap-1.5">
          <Truck size={12} className="text-[#FF6014]" />
          <span className="text-[11px] font-bold text-white/90">{arrived ? "Vendor on site" : "En route to drop-off"}</span>
        </div>
        <span className="text-[11px] font-black text-white">{arrived ? "0 min" : `~${etaMin} min`}</span>
      </div>
    </div>
  );
}

const WHY = [
  { icon: Shield, title: "Fully Insured", desc: "All goods covered end-to-end" },
  { icon: Truck, title: "On-Time", desc: "Delivery guaranteed on schedule" },
  { icon: Star, title: "5★ Rated", desc: "10,000+ satisfied clients" },
  { icon: Users, title: "Expert Team", desc: "Verified, trained professionals" },
  { icon: Clock, title: "24/7 Support", desc: "Always here when you need us" },
  { icon: CheckCircle, title: "Safe Packing", desc: "Premium materials & care" },
];

const STEPS = [
  "Submit your shifting request with details",
  "Our team reviews and assigns a verified vendor",
  "Vendor contacts you to confirm schedule",
  "Professional shifting carried out safely",
];

const TESTIMONIALS = [
  {
    name: "Nusrat Jahan",
    area: "Dhanmondi → Bashundhara",
    quote: "The crew wrapped every piece of furniture before touching it. Nothing so much as scratched during the move.",
  },
  {
    name: "Imran Hossain",
    area: "Office move, Gulshan",
    quote: "We shifted 40 workstations over a weekend and were back online Monday morning. Genuinely stress-free.",
  },
  {
    name: "Farzana Akter",
    area: "Uttara → Mirpur",
    quote: "Booked in the evening, movers arrived next morning right on time. Communication was clear throughout.",
  },
];

const STATS = [
  { n: "10K+", l: "Successful Moves" },
  { n: "4.9★", l: "Average Rating" },
  { n: "120+", l: "Verified Vendors" },
  { n: "24/7", l: "Live Support" },
];

export default function HomeShiftingClientPage() {
  const user = useAppSelector((s) => s.auth.user);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const [create, { isLoading }] = useCreateCustomShiftingMutation();

  const [form, setForm] = useState({ name: "", email: "", phone: "", shiftingType: "home", sourceAddress: "", destinationAddress: "" });
  const [houseSize, setHouseSize] = useState("2 Room Flat");
  const [officeSize, setOfficeSize] = useState("Small (1-10 Desks)");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuth && user) {
      setForm((p) => ({ ...p, name: (user as any).name || p.name, email: (user as any).email || p.email, phone: (user as any).phone || (user as any).phoneNumber || p.phone }));
    }
  }, [isAuth, user]);

  const inp = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const merged = [...files, ...Array.from(e.target.files || [])].slice(0, 6);
    setFiles(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const rmFile = (i: number) => {
    const nf = files.filter((_, j) => j !== i);
    setFiles(nf);
    setPreviews(nf.map((f) => URL.createObjectURL(f)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const loadingToast = toast.loading("Submitting shifting request...");
    try {
      const urls = files.length
        ? (await Promise.allSettled(files.map((file) => uploadImage(file))))
          .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
          .map((r) => r.value)
          .filter(Boolean)
        : [];
      
      const additionalDetails = form.shiftingType === "home"
        ? `[Home Size: ${houseSize}]`
        : `[Office Size: ${officeSize}]`;

      const payload = {
        ...form,
        sourceAddress: `${form.sourceAddress} ${additionalDetails}`,
        images: urls,
        userId: isAuth && user ? Number((user as any).id) : undefined
      };

      await create(payload).unwrap();
      setDone(true);
      toast.success("Shifting request submitted successfully!", { id: loadingToast });
      setForm({ name: "", email: "", phone: "", shiftingType: "home", sourceAddress: "", destinationAddress: "" });
      setFiles([]);
      setPreviews([]);
    } catch (error: any) {
      setErr("Something went wrong. Please try again.");
      toast.error(error?.data?.message || error.message || "Failed to submit request", { id: loadingToast });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        {/* Background Pattern - Visible till bottom */}
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

        {/* ── Hero Banner ── */}
        <section className="relative z-10 w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">

            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] text-xs font-bold px-3 py-1.5 rounded-full mb-4 animate-[fadeInUp_0.6s_ease-out]">
                  <Truck size={12} /> Premium Shifting Service
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight animate-[fadeInUp_0.7s_ease-out]">
                  Move Smarter with<br />
                  <span className="text-[#FF6014]">Rajseba Shifting</span>
                </h1>
                <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto lg:mx-0 leading-relaxed font-semibold animate-[fadeInUp_0.8s_ease-out]">
                  From a single-bedroom flat to a full office floor, our verified crews handle packing,
                  loading, and delivery across Dhaka — so moving day feels like any other day.
                </p>
                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start animate-[fadeInUp_0.9s_ease-out]">
                  {["Fully Insured", "On-Time Delivery", "Verified Vendors"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:border-[#FF6014]/40 hover:-translate-y-0.5 transition-all">
                      <CheckCircle size={11} className="text-[#FF6014]" /> {t}
                    </span>
                  ))}
                </div>

                {/* Stat strip */}
                <div className="grid grid-cols-4 gap-3 mt-8 max-w-md mx-auto lg:mx-0">
                  {STATS.map((s, i) => (
                    <div key={s.l} className="text-center animate-[fadeInUp_1s_ease-out]" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}>
                      <p className="text-lg font-black text-[#FF6014]">{s.n}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-slate-100 group">
                  <Image src="/rajseba_about_banner.png" alt="Rajseba movers carrying boxes during a home shifting job in Dhaka" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    {[{ n: "10K+", l: "Moves Done" }, { n: "4.9★", l: "Avg Rating" }, { n: "24/7", l: "Support" }].map((s) => (
                      <div key={s.l} className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center">
                        <p className="text-sm font-black text-[#FF6014]">{s.n}</p>
                        <p className="text-[9px] font-bold text-slate-600">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Content ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-6 items-start">

            {/* Booking Form — untouched logic, fields, and structure */}
            <div className="bg-white/90 backdrop-blur-xl border border-[#FF6014]/10 rounded-3xl shadow-[0_4px_32px_rgba(255,96,20,0.06)] overflow-hidden order-2 lg:order-1">
              <div className="bg-gradient-to-r from-[#FF6014] to-[#FF7A37] px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Package size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Book Your Shift</h2>
                  <p className="text-xs text-white/75 font-semibold mt-0.5">Fill in details below to get started</p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {done ? (
                  <div className="text-center py-10 px-4 animate-[fadeInUp_0.5s_ease-out]">
                    <div className="w-16 h-16 bg-green-50 border border-green-150 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Request Submitted!</h3>
                    <p className="text-xs text-slate-500 mb-6 font-semibold max-w-sm mx-auto leading-relaxed">
                      Your shifting request has been successfully received. A verified shifting partner will contact you shortly with a price quotation.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDone(false)}
                      className="px-6 py-3 rounded-2xl bg-[#FF6014] text-white text-xs font-black hover:bg-[#E0530A] transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                      Book Another Shift
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    {/* Shifting Type */}
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Shifting Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ v: "home", l: "Home Shifting", I: Home }, { v: "office", l: "Office Shifting", I: Building2 }].map(({ v, l, I }) => (
                          <button key={v} type="button" onClick={() => setForm((p) => ({ ...p, shiftingType: v }))}
                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${form.shiftingType === v ? "bg-[#FF6014] border-[#FF6014] text-white shadow-lg shadow-[#FF6014]/20" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-[#FF6014]/40"}`}>
                            <I size={14} />{l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Options */}
                    {form.shiftingType === "home" ? (
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Home Size Selection</label>
                        <div className="flex flex-wrap gap-2">
                          {["1 Room (Bachelor)", "2 Room Flat", "3 Room Flat", "4+ Room Flat"].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setHouseSize(size)}
                              className={`px-3 py-2 rounded-xl text-xs font-extrabold border-2 transition-all ${
                                houseSize === size
                                  ? "bg-[#FF6014]/15 border-[#FF6014] text-[#FF6014]"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Office Size Selection</label>
                        <div className="flex flex-wrap gap-2">
                          {["Small (1-10 Desks)", "Medium (11-30 Desks)", "Large (30+ Desks)"].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setOfficeSize(size)}
                              className={`px-3 py-2 rounded-xl text-xs font-extrabold border-2 transition-all ${
                                officeSize === size
                                  ? "bg-[#FF6014]/15 border-[#FF6014] text-[#FF6014]"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Name + Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[{ n: "name", l: "Full Name *", pl: "Your full name", I: User, t: "text" }, { n: "phone", l: "Phone *", pl: "+880 1XXXXXXXXX", I: Phone, t: "tel" }].map(({ n, l, pl, I, t }) => (
                        <div key={n}>
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">{l}</label>
                          <div className="relative">
                            <I size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type={t} name={n} required value={(form as any)[n]} onChange={inp} placeholder={pl}
                              className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Email <span className="text-slate-300 normal-case font-semibold">(Optional)</span></label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" name="email" value={form.email} onChange={inp} placeholder="you@email.com"
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all" />
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[{ n: "sourceAddress", l: "Pickup Address *", pl: "Full pickup address...", color: "text-[#FF6014]" }, { n: "destinationAddress", l: "Destination *", pl: "Full destination address...", color: "text-green-500" }].map(({ n, l, pl, color }) => (
                        <div key={n}>
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">
                            <span className={color}>●</span> {l}
                          </label>
                          <div className="relative">
                            <MapPin size={14} className={`absolute left-3.5 top-3.5 ${color}`} />
                            <textarea name={n} required value={(form as any)[n]} onChange={inp} rows={2} placeholder={pl}
                              className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all resize-none" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Image upload */}
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Inventory Photos <span className="text-slate-300 normal-case font-semibold">(Optional · max 6)</span></label>
                      <div onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-[#FF6014]/50 rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-[#FFF8F4]/50 group">
                        <Upload size={18} className="text-slate-400 group-hover:text-[#FF6014] mx-auto mb-1 transition-colors" />
                        <p className="text-xs font-bold text-slate-500">Click to upload photos</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG — up to 6MB each</p>
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
                      {previews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {previews.map((src, i) => (
                            <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => rmFile(i)} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                                <X size={9} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {isAuth && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl px-4 py-2.5">
                        <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                        <p className="text-xs font-bold text-green-700">Details auto-filled from your profile</p>
                      </div>
                    )}

                    {err && <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-100 rounded-2xl px-4 py-3">⚠️ {err}</p>}

                    <button type="submit" disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF6014]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                      {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting...</> : <>Book My Shift <ArrowRight size={16} /></>}
                    </button>

                    {!isAuth && (
                      <p className="text-center text-xs text-slate-400 font-semibold">
                        <Link href="/login" className="text-[#FF6014] font-black hover:underline">Login</Link> to auto-fill your details
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5 order-1 lg:order-2">
              <Reveal>
                <div className="backdrop-blur-xl border border-[#FF6014]/10 rounded-3xl shadow-[0_4px_32px_rgba(255,96,20,0.06)] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={14} className="text-[#FF6014]" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Live Route Preview</span>
                  </div>
                  <RouteMap type={form.shiftingType} />
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-[#FF6014]/10 group">
                  <Image src="/cleaner-hero.png" alt="Rajseba crew wrapping and loading furniture for a move" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-black text-base leading-tight">Professional & Safe Shifting</p>
                    <p className="text-white/75 text-xs font-semibold mt-1">Trained teams, premium packing materials</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="border border-slate-100 rounded-3xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-slate-800 mb-3">How It Works</h3>
                  <div className="space-y-3">
                    {STEPS.map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#FF6014] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-[#FF6014]/20">{i + 1}</div>
                        <span className="text-xs text-slate-600 font-semibold leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {!isAuth && (
                <Reveal delay={300}>
                  <div className="bg-gradient-to-br from-[#FF6014] to-[#FF7A37] rounded-3xl p-5 text-center shadow-lg">
                    <p className="text-sm font-black text-white mb-1">Already a member?</p>
                    <p className="text-xs text-white/75 font-semibold mb-4">Login to auto-fill your info and track bookings</p>
                    <Link href="/login" className="inline-flex items-center gap-2 bg-white text-[#FF6014] font-black text-xs px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
                      Login Now <ChevronRight size={13} />
                    </Link>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Reveal className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">Why Choose Rajseba Shifting?</h2>
            <p className="text-sm text-slate-500 font-semibold mt-2">Everything you need for a stress-free move</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {WHY.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full">
                  <div className="w-10 h-10 bg-[#FFF8F4] border border-[#FF6014]/15 rounded-xl flex items-center justify-center">
                    <Icon size={17} className="text-[#FF6014]" />
                  </div>
                  <p className="text-xs font-black text-slate-800 leading-tight">{title}</p>
                  <p className="text-[11px] text-slate-400 font-semibold leading-tight">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Reveal className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 text-[#FF6014] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} /> Real Moves, Real Feedback
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">What Our Customers Say</h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-white/90 border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col">
                  <Quote size={20} className="text-[#FF6014]/30 mb-2" />
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-[#FF6014]/10 flex items-center justify-center text-[#FF6014] font-black text-xs">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{t.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{t.area}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-20 md:h-0" />
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}