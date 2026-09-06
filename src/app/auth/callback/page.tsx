"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setTokens } from "@/lib/token";
import { useLazyGetUserProfileQuery } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [triggerGetUserProfile] = useLazyGetUserProfileQuery();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const role = searchParams.get("role") || "client";
      const error = searchParams.get("error");

      if (error) {
        toast.error(decodeURIComponent(error));
        router.push("/login");
        return;
      }

      if (token) {
        setTokens(token, refreshToken || "");
        
        // Save role cookie
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `rajseba_user_role=${role}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

        try {
          // Fetch logged in user details to populate Redux
          const userRes = await triggerGetUserProfile().unwrap();
          const userData = (userRes as any)?.data?.user || (userRes as any)?.data || (userRes as any)?.user || userRes;
          let actualRole = role;

          if (userData) {
            dispatch(setUser(userData));
            const fetchedRole = typeof userData.role === "object" && userData.role ? userData.role.name : userData.role;
            if (fetchedRole && typeof fetchedRole === "string") {
              actualRole = fetchedRole.toLowerCase().replace(/\s+/g, "");
            }
          }

          // Save role cookie
          const date = new Date();
          date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
          document.cookie = `rajseba_user_role=${actualRole}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

          toast.success("Google-এর মাধ্যমে সফলভাবে লগইন করা হয়েছে!");

          if (
            actualRole === "vendor" ||
            actualRole === "agent" ||
            actualRole === "superadmin" ||
            actualRole === "super_admin"
          ) {
            router.push("/dashbord");
          } else {
            router.push("/dashbord/overview");
          }
        } catch (err) {
          console.error("Failed to fetch user profile after Google login", err);
          toast.success("Google-এর মাধ্যমে সফলভাবে লগইন করা হয়েছে!");
          if (
            role === "vendor" ||
            role === "agent" ||
            role === "superadmin" ||
            role === "super_admin"
          ) {
            router.push("/dashbord");
          } else {
            router.push("/dashbord/overview");
          }
        }
      } else {
        toast.error("লগইন টোকেন পাওয়া যায়নি");
        router.push("/login");
      }
    };

    handleAuth();
  }, [searchParams, router, dispatch, triggerGetUserProfile]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center max-w-md w-full border border-slate-100">
        <Loader2 className="w-12 h-12 text-[#FF6014] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Google Authentication</h2>
        <p className="text-sm text-slate-500 mt-2">
          অনুগ্রহ করে অপেক্ষা করুন, আপনার অ্যাকাউন্ট যাচাই করা হচ্ছে...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-[#FF6014] animate-spin" />
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
