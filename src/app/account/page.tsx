"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Package, CreditCard, RefreshCw, Heart, Settings, LogOut, Bell, Phone, Gift } from "lucide-react";
import Link from "next/link";
import { getCustomer, logoutAction } from "@/app/actions/auth";

export default function AccountPage() {
  const { user: cachedUser, login, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    getCustomer().then((customer) => {
      if (customer) {
        login(customer);
      } else {
        logout();
        router.push("/login");
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [login, logout, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cachedUser) return null;

  const handleLogout = async () => {
    logout();
    await logoutAction();
    router.push("/login");
  };

  const displayName = [cachedUser.first_name, cachedUser.last_name].filter(Boolean).join(" ") || "Customer";

  return (
    <div className="min-h-screen bg-gray-100 pb-24 md:pb-8">

      {/* Top Header — centered title like Meesho */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <div className="w-10" /> {/* Spacer */}
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">Account</h1>
        <div className="flex items-center gap-3 text-gray-600">
          <Link href="/products"><span className="text-xl">🔍</span></Link>
          <Link href="/checkout"><span className="text-xl">🛒</span></Link>
        </div>
      </div>

      {/* Profile Row */}
      <div className="bg-white mt-2 px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-3xl flex-shrink-0">
          🧺
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base truncate">{displayName}</p>
          {cachedUser.email && (
            <p className="text-sm text-gray-500 truncate">{cachedUser.email}</p>
          )}
          {cachedUser.phone && (
            <p className="text-sm text-gray-500">{cachedUser.phone}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>

      {/* Enable Notifications */}
      <div className="bg-white mt-2 px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <div className="w-9 h-9 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
          <Bell className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-800">Enable Notifications</p>
          <p className="text-xs text-gray-500 mt-0.5">Get alerts for new products and offers.</p>
        </div>
        {/* Toggle switch — visual only */}
        <div className="w-10 h-6 bg-gray-200 rounded-full flex items-center px-0.5 flex-shrink-0">
          <div className="w-5 h-5 bg-white rounded-full shadow" />
        </div>
      </div>

      {/* Action Cards */}
      <div className="bg-white mt-2 px-4 py-4 grid grid-cols-2 gap-3">
        <button className="flex flex-col items-center gap-1.5 border border-gray-200 rounded-xl py-4 px-2 hover:bg-gray-50 transition">
          <Phone className="w-6 h-6 text-blue-600" />
          <span className="text-xs font-bold text-gray-700">Help Centre</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 border border-gray-200 rounded-xl py-4 px-2 hover:bg-gray-50 transition">
          <Gift className="w-6 h-6 text-blue-600" />
          <span className="text-xs font-bold text-gray-700">Refer & Earn</span>
        </button>
      </div>

      {/* My Orders */}
      <div className="bg-white mt-2">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">My Orders</p>
        </div>
        <MenuItem icon={<Package className="w-5 h-5 text-blue-600" />} label="View All Orders" href="#" />
      </div>

      {/* My Payments */}
      <div className="bg-white mt-2">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">My Payments</p>
        </div>
        <MenuItem icon={<CreditCard className="w-5 h-5 text-blue-600" />} label="Manage Addresses" href="#" />
        <MenuItem icon={<RefreshCw className="w-5 h-5 text-blue-600" />} label="Refund Status" href="#" />
      </div>

      {/* My Activity */}
      <div className="bg-white mt-2">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">My Activity</p>
        </div>
        <MenuItem icon={<Heart className="w-5 h-5 text-red-500" />} label="Wishlist" href="#" />
        <MenuItem icon={<Package className="w-5 h-5 text-purple-500" />} label="Order History" href="#" />
        <MenuItem icon={<Settings className="w-5 h-5 text-gray-500" />} label="Settings" href="#" />
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm flex items-center justify-center gap-2 bg-white hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, href, badge }: { icon: React.ReactNode; label: string; href: string; badge?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 border-t border-gray-100 hover:bg-gray-50 transition"
    >
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold text-blue-600 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}
