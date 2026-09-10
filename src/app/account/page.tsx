"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRight, Package, RefreshCw, Heart,
  LogOut, Phone, MapPin, ShieldCheck, Headphones,
  Edit3, X, Check, Loader2, User as UserIcon, Mail
} from "lucide-react";
import Link from "next/link";
import { getCustomer, logoutAction, updateCustomerProfileAction } from "@/app/actions/auth";
import { useWishlistStore } from "@/store/wishlistStore";

/** Parse the display name — strip Medusa's "Customer XXXX" generic name */
function getDisplayName(user: { first_name?: string; last_name?: string; phone?: string }) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  if (!name || /^customer\s*\d*$/i.test(name)) return null;
  return name;
}

/** Clean up Medusa's synthetic phone email: "9574707385@phone.laundrymall.in" → "9574707385" */
function parsePhoneFromEmail(email?: string): string | null {
  if (!email) return null;
  const match = email.match(/^(\d{10,13})@phone\./i);
  return match ? match[1] : null;
}

/** Format phone number for display: "9574707385" → "+91 95747 07385" */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return `+${digits}`;
}

export default function AccountPage() {
  const { user: cachedUser, login, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const wishlistItems = useWishlistStore((state) => state.items);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setMounted(true);
    getCustomer().then(async (customer) => {
      if (customer) {
        login(customer);
        setIsLoading(false);
      } else {
        logout();
        await logoutAction();
        router.push("/login");
      }
    }).catch(async () => {
      logout();
      await logoutAction();
      router.push("/login");
    });
  }, [login, logout, router]);

  // Pre-fill form when opening editor
  const handleOpenEdit = () => {
    const rawName = [cachedUser?.first_name, cachedUser?.last_name].filter(Boolean).join(" ").trim();
    const isGeneric = !rawName || /^customer\s*\d*$/i.test(rawName);

    setFirstName(!isGeneric ? cachedUser?.first_name || "" : "");
    setLastName(!isGeneric ? cachedUser?.last_name || "" : "");
    const isSynthetic = cachedUser?.email?.includes("@phone.");
    setEmailInput(!isSynthetic ? cachedUser?.email || "" : "");
    setSaveError("");
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setSaveError("Please enter your name");
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const res = await updateCustomerProfileAction({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: emailInput.trim() || undefined,
      });

      if (res.error) {
        setSaveError(res.error);
        setIsSaving(false);
        return;
      }

      if (cachedUser) {
        login({
          ...cachedUser,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          ...(emailInput.trim() ? { email: emailInput.trim() } : {}),
        });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
      }, 900);
    } catch (err: any) {
      setSaveError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || (isLoading && !cachedUser)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F4F6FA]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cachedUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F4F6FA] p-4">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-3" />
        <p className="text-xs text-gray-500 font-medium">Redirecting to sign in...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    logout();
    await logoutAction();
    router.push("/login");
  };

  // Resolve identity fields
  const displayName = getDisplayName(cachedUser);
  const phoneFromEmail = parsePhoneFromEmail(cachedUser.email);
  const phoneRaw = cachedUser.phone || phoneFromEmail || "";
  const phoneDisplay = phoneRaw ? formatPhone(phoneRaw) : null;
  // Avatar letter: use first letter of name, or first digit of phone
  const avatarChar = displayName?.[0]?.toUpperCase() ?? phoneRaw?.[0] ?? "U";

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-28 md:pb-8">

      {/* ── Profile Hero ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-7 pb-14 px-5 relative overflow-hidden">
        {/* Decorative blur orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-black text-white shadow-lg flex-shrink-0">
            {avatarChar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-black text-white text-lg leading-tight truncate">
                {displayName || "My Account"}
              </p>
              {/* Edit button */}
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/30 transition cursor-pointer backdrop-blur-sm"
              >
                <Edit3 className="w-3 h-3" />
                {displayName ? "Edit" : "+ Add Name"}
              </button>
            </div>

            {/* Show phone number cleanly */}
            {phoneDisplay && (
              <div className="flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                <p className="text-sm text-blue-100 font-medium">{phoneDisplay}</p>
              </div>
            )}
            {/* Show real email only if it's not the synthetic phone email */}
            {cachedUser.email && !phoneFromEmail && (
              <p className="text-sm text-blue-200 truncate mt-0.5">{cachedUser.email}</p>
            )}
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-3 mt-5 relative z-10">
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center border border-white/20">
            <p className="text-white font-black text-lg leading-none">0</p>
            <p className="text-blue-200 text-[10px] font-semibold mt-0.5">Orders</p>
          </div>
          <Link
            href="/account/wishlist"
            className="flex-1 bg-white/15 hover:bg-white/25 transition backdrop-blur-sm rounded-xl px-3 py-2.5 text-center border border-white/20 block cursor-pointer"
          >
            <p className="text-white font-black text-lg leading-none">{wishlistItems.length}</p>
            <p className="text-blue-200 text-[10px] font-semibold mt-0.5">Wishlist</p>
          </Link>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center border border-white/20">
            <ShieldCheck className="w-5 h-5 text-emerald-300 mx-auto" />
            <p className="text-blue-200 text-[10px] font-semibold mt-0.5">Verified</p>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ────────────────────────────────────── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900">Edit Profile</h2>
                  <p className="text-[11px] text-gray-500">Update your name and contact details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              {saveError && (
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-xl border border-red-100 font-medium">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-xl border border-emerald-100 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Meet"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Panchal"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address <span className="text-gray-400 font-normal">(Optional for Invoices)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="yourname@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {phoneDisplay && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Verified Phone</p>
                    <p className="text-xs font-bold text-gray-800">{phoneDisplay}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Details"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Menu Cards (pulled up to overlap gradient) ────────────── */}
      <div className="px-4 -mt-6 space-y-3 relative z-10">

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <SectionLabel label="My Orders" />
          <MenuItem icon={<Package className="w-4.5 h-4.5 text-blue-600" />} iconBg="bg-blue-50" label="View All Orders" href="/account/orders" />
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <SectionLabel label="Account" />
          <MenuItem icon={<MapPin className="w-4.5 h-4.5 text-violet-600" />} iconBg="bg-violet-50" label="Manage Addresses" href="/account/addresses" />
          <MenuItem icon={<Heart className="w-4.5 h-4.5 text-rose-500" />} iconBg="bg-rose-50" label="My Wishlist" href="/account/wishlist" />
          <MenuItem icon={<RefreshCw className="w-4.5 h-4.5 text-amber-500" />} iconBg="bg-amber-50" label="Refund Status" href="/account/refunds" />
        </div>

        {/* Support */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <SectionLabel label="Support" />
          <MenuItem icon={<Headphones className="w-4.5 h-4.5 text-emerald-600" />} iconBg="bg-emerald-50" label="Help Centre" href="/contact" />
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm flex items-center justify-center gap-2 bg-white hover:bg-red-50 transition shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        <p className="text-center text-xs text-gray-400 font-medium pt-2 pb-4">
          LaundryMall · Version 1.0
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 pt-3.5 pb-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function MenuItem({
  icon, iconBg, label, href,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 border-t border-gray-100/80 hover:bg-gray-50 transition active:bg-gray-100"
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </Link>
  );
}
