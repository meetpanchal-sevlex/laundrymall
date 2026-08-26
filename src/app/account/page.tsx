"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Package, RefreshCw, Heart, LogOut, Phone, MapPin } from "lucide-react";
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

      {/* Top Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <div className="w-10" />
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">My Account</h1>
        <div className="flex items-center gap-3 text-gray-600">
          <Link href="/products"><span className="text-xl">🛍️</span></Link>
        </div>
      </div>

      {/* Profile Row */}
      <div className="bg-white mt-2 px-4 py-5 flex items-center gap-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-black text-blue-600 flex-shrink-0">
          {displayName.charAt(0).toUpperCase()}
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

      {/* My Orders */}
      <div className="bg-white mt-2">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">My Orders</p>
        </div>
        <MenuItem icon={<Package className="w-5 h-5 text-blue-600" />} label="View All Orders" href="/account/orders" />
      </div>

      {/* My Account */}
      <div className="bg-white mt-2">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">My Account</p>
        </div>
        <MenuItem icon={<MapPin className="w-5 h-5 text-blue-600" />} label="Manage Addresses" href="/account/addresses" />
        <MenuItem icon={<Heart className="w-5 h-5 text-red-500" />} label="My Wishlist" href="/account/wishlist" />
        <MenuItem icon={<RefreshCw className="w-5 h-5 text-orange-500" />} label="Refund Status" href="/account/refunds" />
      </div>

      {/* Support */}
      <div className="bg-white mt-2">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Support</p>
        </div>
        <MenuItem icon={<Phone className="w-5 h-5 text-green-600" />} label="Help Centre" href="/contact" />
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm flex items-center justify-center gap-2 bg-white hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 font-medium mt-6 pb-4">
        LaundryMall · Version 1.0
      </p>
    </div>
  );
}

function MenuItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 border-t border-gray-100 hover:bg-gray-50 transition"
    >
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}/Link>
  );
}
