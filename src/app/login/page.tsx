"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useRef, useEffect, Suspense } from "react";
import { Lock, Mail, Phone, ArrowRight, CheckCircle, ShieldCheck, Sparkles, RotateCcw, Edit2, MessageSquare } from "lucide-react";
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
  const [resendTimer, setResendTimer] = useState(15);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login } = useAuthStore();

  // Initialize MSG91 Widget in headless mode (exposeMethods: true, NO POPUP)
  const initMsg91Widget = () => {
    if (typeof window !== "undefined" && window.initSendOTP && !window._msg91Initialized) {
      window._msg91Initialized = true;
      try {
        window.initSendOTP({
          widgetId: MSG91_WIDGET_ID,
          tokenAuth: MSG91_TOKEN_AUTH,
          exposeMethods: true, // Disables MSG91 popup completely
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

  // Focus first OTP box on entering OTP step
  useEffect(() => {
    if (phoneStep === "enter_otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [phoneStep]);

  // Helper to ensure window.sendOtp is ready
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

  // Helper to ensure window.verifyOtp is ready
  const getVerifyOtp = async (): Promise<typeof window.verifyOtp> => {
    if (typeof window === "undefined") return undefined;
    if (window.verifyOtp) return window.verifyOtp;

    for (let i = 0; i < 25; i++) {
      if (window.verifyOtp) return window.verifyOtp;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return window.verifyOtp;
  };

  // 1. Send OTP (100% on-page)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);

    const cleanNumber = phone.replace(/\D/g, "");
    if (cleanNumber.length !== 10 || !/^[6-9]\d{9}$/.test(cleanNumber)) {
      setError("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).");
      return;
    }

    setIsLoading(true);

    try {
      const sendOtpFn = await getSendOtp();
      if (!sendOtpFn) {
        setError("SMS Gateway service is connecting. Please retry in a moment.");
        setIsLoading(false);
        return;
      }

      sendOtpFn(
        "91" + cleanNumber,
        (res: any) => {
          setIsLoading(false);
          setPhoneStep("enter_otp");
          setResendTimer(15);
          setOtp(["", "", "", ""]);
          setInfoMsg(`OTP sent successfully to +91 ${cleanNumber}`);
        },
        (err: any) => {
          setIsLoading(false);
          setError(err?.message || "Failed to send OTP. Please check your number and try again.");
        }
      );
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || "An unexpected error occurred while sending OTP.");
    }
  };

  // 2. Verify OTP (100% on-page)
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
          // Extract access token from response
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
            setError("Unable to process verification token from gateway. Please retry.");
            setIsVerifying(false);
            return;
          }

          // Complete login on server with Medusa 2.0 customer linking & cart transfer
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
          setError(err?.message || "Invalid OTP entered. Please check the code and retry.");
          setOtp(["", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        }
      );
    } catch (err: any) {
      setIsVerifying(false);
      setError(err?.message || "Verification failed. Please try again.");
    }
  };

  // Handle OTP digit box input
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If 4th digit entered and all 4 filled, trigger verification automatically
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

  // Resend OTP via SMS (11) or WhatsApp (12)
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
          setResendTimer(15);
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
          setResendTimer(15);
          setInfoMsg("OTP resent successfully!");
        },
        (err: any) => {
          setIsResending(false);
          setError(err?.message || "Failed to resend OTP.");
        }
      );
    } else {
      setIsResending(false);
      setError("Gateway unavailable. Please wait a moment.");
    }
  };

  // Traditional Email & Password Login
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

      {infoMsg && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {infoMsg}
        </div>
      )}

      {authMode === "phone" ? (
        <div>
          {phoneStep === "enter_phone" ? (
            <div>
              <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Fast 10-Second Login • No Password Required
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
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
                        autoFocus
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
                  disabled={isLoading || phone.length !== 10}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verification Code</span>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneStep("enter_phone");
                    setError(null);
                    setInfoMsg(null);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>

              {/* 4-Digit Native OTP Input Boxes */}
              <div className="my-6">
                <div className="flex justify-between gap-3 max-w-[280px] mx-auto">
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
                      className="w-14 h-16 text-2xl font-black text-center text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isVerifying || otp.some((d) => !d)}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  <>
                    Verify &amp; Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Resend Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                {resendTimer > 0 ? (
                  <p className="text-xs text-gray-500 font-medium">
                    Resend OTP in <span className="font-bold text-gray-800">{resendTimer}s</span>
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={() => handleResendOtp(11)}
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Resend via SMS
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={() => handleResendOtp(12)}
                      className="text-green-600 hover:text-green-700 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Resend via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setInfoMsg(null);
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
                setInfoMsg(null);
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

