"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, Suspense } from "react";
import { Lock, Mail, Phone, ArrowRight, CheckCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { loginAction, verifyMsg91PhoneLoginAction } from "@/app/actions/auth";

declare global {
  interface Window {
    initSendOTP?: (config: any) => void;
  }
}

const MSG91_WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || "366969696753363133303834";
const MSG91_TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || "566554TBakeVZh6aa12248P1";

function LoginForm() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login } = useAuthStore();

  // --- Phone + MSG91 OTP Flow ---
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNumber = phone.replace(/\D/g, "");
    if (cleanNumber.length !== 10 || !/^[6-9]\d{9}$/.test(cleanNumber)) {
      setError("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).");
      return;
    }

    if (typeof window === "undefined" || !window.initSendOTP) {
      setError("SMS Gateway is still initializing. Please wait a moment and try again.");
      return;
    }

    setIsLoading(true);

    try {
      const configuration = {
        widgetId: MSG91_WIDGET_ID,
        tokenAuth: MSG91_TOKEN_AUTH,
        identifier: "91" + cleanNumber,
        success: async (data: any) => {
          setIsLoading(false);
          setIsVerifying(true);
          setError(null);

          // Extract access-token from MSG91 widget response
          let tokenStr = "";
          if (typeof data === "string") {
            tokenStr = data;
          } else if (data?.["access-token"]) {
            tokenStr = data["access-token"];
          } else if (data?.message && typeof data.message === "string") {
            tokenStr = data.message;
          } else if (data?.token) {
            tokenStr = data.token;
          }

          if (!tokenStr) {
            setError("Unable to retrieve OTP verification token from gateway.");
            setIsVerifying(false);
            return;
          }

          const result = await verifyMsg91PhoneLoginAction(tokenStr, cleanNumber);

          if (result?.error) {
            setError(result.error);
            setIsVerifying(false);
          } else if (result?.success) {
            login({
              id: "phone-user",
              first_name: "Customer",
              last_name: cleanNumber.slice(-4),
              email: result.email || `${cleanNumber}@phone.laundrymall.in`,
            });
            router.push(redirectUrl);
          }
        },
        failure: (err: any) => {
          setIsLoading(false);
          setIsVerifying(false);
          console.warn("MSG91 OTP flow dismissed or failed:", err);
        },
      };

      window.initSendOTP(configuration);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || "Failed to initialize OTP verification.");
    }
  };

  // --- Traditional Email & Password Flow ---
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      login({
        id: "loading",
        first_name: "Customer",
        last_name: "",
        email: formData.get("email") as string,
      });
      setIsLoading(false);
      router.push(redirectUrl);
    }
  };

  return (
    <>
      <Script
        src="https://control.msg91.com/app/assets/otp-provider/otp-provider.js"
        strategy="afterInteractive"
      />

      {justRegistered && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-200">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">Account created successfully! Please sign in.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {isVerifying && (
        <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div className="text-sm font-medium">
            Verifying OTP and securing session...
          </div>
        </div>
      )}

      {authMode === "phone" ? (
        <div>
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Fast 10-Second Login • No Password Required
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
              <div className="flex rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all overflow-hidden bg-white">
                <div className="bg-gray-50 border-r border-gray-200 px-4 py-4 flex items-center gap-2 text-sm font-bold text-gray-700 select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    required
                    placeholder="Enter 10-digit number"
                    className="w-full px-4 py-4 text-base font-semibold tracking-wide text-gray-900 placeholder:text-gray-400 placeholder:font-normal outline-none bg-transparent"
                  />
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600 inline" />
                We&apos;ll send an OTP via SMS / WhatsApp for instant verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || isVerifying || phone.length !== 10}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading || isVerifying ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue with OTP
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAuthMode("email");
              }}
              className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              Corporate or Hotel Account? Sign in with Email &amp; Password
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Login</span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAuthMode("phone");
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              ← Use Mobile OTP instead
            </button>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="procurement@hotel.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In with Password
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome to LaundryMall</h1>
          <p className="text-gray-500 font-medium">India&apos;s B2B Commercial Laundry Marketplace</p>
        </div>

        <Suspense
          fallback={
            <div className="h-40 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 font-medium text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
