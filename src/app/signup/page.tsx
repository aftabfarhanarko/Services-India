"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  Mail,
  User,
  Check,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useSignupState } from "@/app/signup/hooks/useSignupState";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
);

export default function RegisterPage() {
  const {
    formData,
    handleChange,
    agreeTerms,
    setAgreeTerms,
    isLoading,
    handleSubmit,
  } = useSignupState();

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#FF6014]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />
            Kolkata & India's #1 Home Service Platform
          </div>
          <div className="w-full max-w-[420px] xl:max-w-[480px]">
            <Player
              autoplay
              loop
              src="/signup.json"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <h2 className="text-2xl xl:text-3xl font-black text-slate-800 leading-tight mt-4">
            Start your journey with <span className="text-[#FF6014]">Rajseba</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3 max-w-sm leading-relaxed">
            Join 50,000+ happy customers who trust Rajseba for professional home
            services every day.
          </p>
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-slate-200/60 w-full justify-center">
            {[
              { v: "50K+", l: "Happy Clients" },
              { v: "4.9★", l: "Avg Rating" },
              { v: "120+", l: "Services" },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-10 bg-slate-200" />}
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">{s.v}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {s.l}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "url('/bg-icons-design.png')",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-10 px-6 sm:px-10 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#FF6014] transition-colors group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-6 relative z-10">
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <Link href="/" className="flex flex-col items-center gap-2.5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6014] to-[#FF8142] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FF6014]/25">
                <Sparkles size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#FF6014] text-xl tracking-tight">
                Rajseba
              </span>
            </Link>
          </div>

          <div className="w-full max-w-[440px] bg-transparent border border-slate-200/80 sm:border-0 rounded-3xl shadow-lg sm:shadow-none px-6 py-8 sm:px-2 sm:py-0">
            <div className="flex flex-col items-center text-center mb-8">
              <Link
                href="/"
                className="flex flex-col items-center gap-2.5 group mb-5 lg:flex hidden"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6014] to-[#FF8142] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#FF6014]/25 group-hover:scale-105 transition-transform">
                  <Sparkles size={24} className="stroke-[2]" />
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">
                  Rajseba
                </span>
              </Link>
              <div className="inline-flex items-center gap-2 bg-[#FFF4EE] text-[#FF6014] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 border border-[#FF6014]/20">
                <ShieldCheck size={13} className="stroke-[2.5]" /> New User Registration
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2.5">
                <UserPlus size={28} className="text-[#FF6014]" />
                Create Account
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-2 leading-relaxed max-w-xs">
                Sign up to access premium home services.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={17} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        agreeTerms
                          ? "bg-[#FF6014] border-[#FF6014]"
                          : "bg-white border-slate-300 group-hover:border-[#FF6014]/50"
                      }`}
                    >
                      {agreeTerms && (
                        <Check size={12} className="text-white stroke-[3]" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium select-none leading-relaxed">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#FF6014] hover:underline font-semibold"
                    >
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#FF6014] hover:underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#FF6014] hover:bg-[#FF6014]/90 disabled:opacity-70 text-white text-[15px] font-bold py-3.5 rounded-xl shadow-lg shadow-[#FF6014]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer border-none"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 font-medium mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#FF6014] hover:underline font-bold"
              >
                Login
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <ShieldCheck size={12} className="text-emerald-500" />
                SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Check size={12} className="text-emerald-500" />
                Privacy Protected
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-5 text-[11px] text-slate-400 font-medium relative z-10 border-t border-slate-100 mx-6 space-y-1">
          <div>
            © {new Date().getFullYear()} Rajseba Services Ltd. · All rights
            reserved.{" "}
            <Link
              href="/privacy"
              className="ml-3 text-slate-400 hover:text-[#FF6014] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="ml-3 text-slate-400 hover:text-[#FF6014] transition-colors"
            >
              Terms
            </Link>
          </div>
          <div>
            Developed by{" "}
            <span className="text-[#FF6014] font-semibold">
              Aftabfarhan Arko
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}