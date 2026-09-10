"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useRef, useEffect, Suspense } from "react";
import { Lock, Mail, ArrowRight, CheckCircle, WashingMachine, Sparkles, Package, Tag, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { loginAction, verifyMsg91PhoneLoginAction } from "@/app/actions/auth";

declare global {
  interface Window {
    initSendOTP?: (config: any) => void;
    sendOtp?: (
      identifier: string,
      successCallback: (response: any) => void,
      errorCallback: (error: any) => void
    ) => void;
    retryOtp?: (
      channel: number | string | null,
      successCallback: (response: any) => void,
      errorCallback: (error: any) => void
    ) => void;
    verifyOtp?: (
      otp: string | number,
      successCallback: (response: any) => void,
      errorCallback: (error: any) => void
    ) => void;
    _msg91Initialized?: boolean;
  }
}

const MSG91_WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || "366969696753363133303834";
const MSG91_TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || "566554TBakeVZh6aa12248P1";

function LoginForm() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [phoneStep, setPhoneStep] = useState<"enter_phone" | "enter_otp">("enter_phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login } = useAuthStore();

  // Initialize MSG91 Widget headless
  const initMsg91Widget = () => {
    if (typeof window !== "undefined" && window.initSendOTP && !window._msg91Initialized) {
      window._msg91Initialized = true;
      try {
        window.initSendOTP({
          widgetId: MSG91_WIDGET_ID,
          tokenAuth: MSG91_TOKEN_AUTH,
          exposeMethods: true,
          success: (data: any) => {
            console.log("MSG91 widget initialized headless:", data);
          },
          failure: (err: any) => {
            console.warn("MSG91 widget init warning:", err);
          },
        });
      } catch (err) {
        console.error("Failed to initialize MSG91 SDK:", err);
      }
    }
  };

  useEffect(() => {
    initMsg91Widget();
    const timer = setInterval(() => {
      if (typeof window !== "undefined" && window.initSendOTP && !window._msg91Initialized) {
        initMsg91Widget();
      }
      if (typeof window !== "undefined" && window.sendOtp) {
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (phoneStep !== "enter_otp" || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phoneStep, resendTimer]);

  // Auto focus first OTP input
  useEffect(() => {
    if (phoneStep === "enter_otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [phoneStep]);

  const getSendOtp = async (): Promise<typeof window.sendOtp> => {
    if (typeof window === "undefined") return undefined;
    if (window.sendOtp) return window.sendOtp;

    initMsg91Widget();
    for (let i = 0; i < 25; i++) {
      if (window.sendOtp) return window.sendOtp;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return window.sendOtp;
  };

  const getVerifyOtp = async (): Promise<typeof window.verifyOtp> => {
    if (typeof window === "undefined") return undefined;
    if (window.verifyOtp) return window.verifyOtp;

    for (let i = 0; i < 25; i++) {
      if (window.verifyOtp) return window.verifyOtp;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return window.verifyOtp;
  };

  // 1. Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);

    const cleanNumber = phone.replace(/\D/g, "");
    if (cleanNumber.length !== 10 || !/^[6-9]\d{9}$/.test(cleanNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const sendOtpFn = await getSendOtp();
      if (!sendOtpFn) {
        setError("Connecting to SMS gateway. Please try again.");
        setIsLoading(false);
        return;
      }

      sendOtpFn(
        "91" + cleanNumber,
        (res: any) => {
          setIsLoading(false);
          setPhoneStep("enter_otp");
          setResendTimer(45);
          setOtp(["", "", "", ""]);
          setInfoMsg(`OTP sent to ${cleanNumber}`);
        },
        (err: any) => {
          setIsLoading(false);
          setError(err?.message || "Failed to send OTP. Please try again.");
        }
      );
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || "An error occurred while sending OTP.");
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (otpCode?: string) => {
    setError(null);
    setInfoMsg(null);

    const codeToVerify = otpCode || otp.join("");
    if (codeToVerify.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }

    const cleanNumber = phone.replace(/\D/g, "");
    setIsVerifying(true);

    try {
      const verifyOtpFn = await getVerifyOtp();
      if (!verifyOtpFn) {
        setError("Verification service connecting. Please try again.");
        setIsVerifying(false);
        return;
      }

      verifyOtpFn(
        codeToVerify,
        async (res: any) => {
          let tokenStr = "";
          if (typeof res === "string") {
            tokenStr = res;
          } else if (res?.["access-token"]) {
            tokenStr = res["access-token"];
          } else if (res?.message && typeof res.message === "string") {
            tokenStr = res.message;
          } else if (res?.token) {
            tokenStr = res.token;
          } else if (res?.data?.["access-token"]) {
            tokenStr = res.data["access-token"];
          }

          if (!tokenStr) {
            setError("Unable to process verification token. Please retry.");
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
        (err: any) => {
          setIsVerifying(false);
          setError(err?.message || "Invalid OTP entered. Please try again.");
          setOtp(["", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        }
      );
    } catch (err: any) {
      setIsVerifying(false);
      setError(err?.message || "Verification failed. Please try again.");
    }
  };

  // OTP box input navigation
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (digit && index === 3 && newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);

    if (pasted.length === 4) {
      otpInputRefs.current[3]?.focus();
      handleVerifyOtp(newOtp.join(""));
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = (channel: 11 | 12) => {
    setError(null);
    setInfoMsg(null);
    setIsResending(true);

    const cleanNumber = phone.replace(/\D/g, "");
    const retryFn = window.retryOtp;

    if (typeof retryFn === "function") {
      retryFn(
        channel,
        (res: any) => {
          setIsResending(false);
          setResendTimer(45);
          setInfoMsg(channel === 12 ? "OTP resent via WhatsApp!" : "OTP resent via SMS!");
        },
        (err: any) => {
          setIsResending(false);
          setError(err?.message || "Failed to resend OTP. Please try again.");
        }
      );
    } else if (window.sendOtp) {
      window.sendOtp(
        "91" + cleanNumber,
        (res: any) => {
          setIsResending(false);
          setResendTimer(45);
          setInfoMsg("OTP resent successfully!");
        },
        (err: any) => {
          setIsResending(false);
          setError(err?.message || "Failed to resend OTP.");
        }
      );
    } else {
      setIsResending(false);
      setError("Gateway service temporarily unavailable.");
    }
  };

  // Email login
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfoMsg(null);

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
        onLoad={initMsg91Widget}
      />

      {/* Outer Meesho Style Card */}
      <div className="w-full max-w-[430px] bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        
        {/* LaundryMall Top Promotional Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-6 py-6 text-white overflow-hidden select-none">
          {/* Background pattern accents */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-black/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3">
            {/* Left: 4 Floating Visual Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/95 text-gray-800 rounded-lg p-1.5 shadow-sm flex flex-col items-center justify-center w-14 h-14 border border-white/50">
                <WashingMachine className="w-5 h-5 text-blue-600" />
                <span className="text-[9px] font-bold text-gray-700 leading-none mt-0.5">Washer</span>
              </div>
              <div className="bg-white/95 text-gray-800 rounded-lg p-1.5 shadow-sm flex flex-col items-center justify-center w-14 h-14 border border-white/50">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-[9px] font-bold text-gray-700 leading-none mt-0.5">Liquid</span>
              </div>
              <div className="bg-white/95 text-gray-800 rounded-lg p-1.5 shadow-sm flex flex-col items-center justify-center w-14 h-14 border border-white/50">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-[9px] font-bold text-gray-700 leading-none mt-0.5">Packaging</span>
              </div>
              <div className="bg-white/95 text-gray-800 rounded-lg p-1.5 shadow-sm flex flex-col items-center justify-center w-14 h-14 border border-white/50">
                <Tag className="w-5 h-5 text-blue-600" />
                <span className="text-[9px] font-bold text-gray-700 leading-none mt-0.5">Tag Pins</span>
              </div>
            </div>

            {/* Right: Clean Tagline Typography */}
            <div className="text-right pr-1">
              <h2 className="text-2xl font-black tracking-tight leading-tight drop-shadow-sm">
                Great Quality
              </h2>
              <p className="text-xl font-medium opacity-95 leading-tight mt-0.5">
                Lowest prices
              </p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 sm:p-9">
          {justRegistered && (
            <div className="mb-5 bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 border border-green-200 text-xs font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <p>Account created successfully! Please sign in.</p>
            </div>
          )}

          {error && (
            <div className="mb-5 bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 text-xs font-medium">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="mb-5 bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {infoMsg}
            </div>
          )}

          {authMode === "phone" ? (
            <div>
              {phoneStep === "enter_phone" ? (
                /* Step 1: Sign Up / Sign In phone screen (Clean Minimalist Layout) */
                <div>
                  <h1 className="text-lg font-bold text-[#333333] mb-6">
                    Sign In or Sign Up to view your profile
                  </h1>

                  <form onSubmit={handleSendOtp}>
                    <div className="flex gap-4 mb-7">
                      {/* Country Box */}
                      <div className="w-24">
                        <label className="block text-[11px] text-gray-400 font-medium mb-1">
                          Country
                        </label>
                        <div className="border-b border-gray-300 pb-2 text-sm font-semibold text-gray-800">
                          IN +91
                        </div>
                      </div>

                      {/* Phone Number Input */}
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-blue-600 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          required
                          autoFocus
                          placeholder="9574707385"
                          className="w-full border-b border-gray-300 focus:border-blue-600 focus:border-b-2 pb-2 text-sm font-semibold text-gray-900 outline-none transition-colors bg-transparent tracking-wide placeholder:text-gray-300 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || phone.length !== 10}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      {isLoading ? "Sending..." : "Continue"}
                    </button>
                  </form>
                </div>
              ) : (
                /* Step 2: OTP Verification screen (Clean Minimalist Layout) */
                <div>
                  <h1 className="text-lg font-bold text-[#333333] mb-1">
                    Enter OTP sent to {phone}
                  </h1>

                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStep("enter_phone");
                      setError(null);
                      setInfoMsg(null);
                    }}
                    className="text-xs font-bold text-blue-600 tracking-wider mb-6 hover:underline uppercase inline-block cursor-pointer"
                  >
                    CHANGE NUMBER
                  </button>

                  {/* Underline Dash OTP Inputs */}
                  <div className="flex justify-center gap-3 sm:gap-4 my-7">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 sm:w-14 text-2xl font-bold text-center text-gray-900 border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 bg-transparent transition-colors"
                      />
                    ))}
                  </div>

                  {/* Resend OTP Timer */}
                  <div className="mb-7 text-left">
                    {resendTimer > 0 ? (
                      <p className="text-xs text-gray-400 font-medium">
                        Resend OTP in {resendTimer} s
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <button
                          type="button"
                          disabled={isResending}
                          onClick={() => handleResendOtp(11)}
                          className="text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
                        >
                          Resend via SMS
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                          type="button"
                          disabled={isResending}
                          onClick={() => handleResendOtp(12)}
                          className="text-green-600 hover:underline cursor-pointer disabled:opacity-50"
                        >
                          Resend via WhatsApp
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Verify Action Button */}
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp()}
                    disabled={isVerifying || otp.some((d) => !d)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}

              {/* Terms and Privacy Policy */}
              <div className="mt-9 text-center text-[11px] text-gray-500 leading-relaxed">
                By continuing, you agree to LaundryMall&apos;s{" "}
                <br />
                <Link href="/terms" className="font-bold text-blue-600 hover:underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-bold text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>

              {/* Corporate Fallback Toggle */}
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setInfoMsg(null);
                    setAuthMode("email");
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3 h-3" />
                  Sign in with Corporate Email &amp; Password
                </button>
              </div>
            </div>
          ) : (
            /* Corporate Email & Password Form */
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Corporate Login</span>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setInfoMsg(null);
                    setAuthMode("phone");
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  ← Back to Mobile OTP
                </button>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border-b border-gray-300 focus:border-blue-600 focus:border-b-2 pb-2 text-sm font-semibold text-gray-900 outline-none transition-colors bg-transparent"
                    placeholder="procurement@hotel.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full border-b border-gray-300 focus:border-blue-600 focus:border-b-2 pb-2 text-sm font-semibold text-gray-900 outline-none transition-colors bg-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-500">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600" />
                    <span>Remember me</span>
                  </label>
                  <Link href="#" className="font-semibold text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg text-sm tracking-wide transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50">
      <Suspense
        fallback={
          <div className="h-60 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}


