"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, LogOut, Package, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useCart } from "@/hooks/useCart";
import { logoutAction } from "@/app/actions/auth";
import MobileDrawer from "@/components/MobileDrawer";
import SearchAutocomplete from "@/components/SearchAutocomplete";

export default function Navbar() {
  const { cart } = useCart();
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const { user, logout } = useAuthStore();
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    logout();
    await logoutAction();
  };

  const displayName = mounted && user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || "B2B Partner"
    : "Guest";

  return (
    <>
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <nav className="bg-white/85 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-xs transition-all">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                className="sm:hidden text-gray-500 hover:text-blue-600 transition p-1 cursor-pointer"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <span className="text-3xl font-black tracking-tighter text-blue-600 group-hover:text-blue-700 transition-colors">
                    Laundry<span className="text-gray-900">Mall</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Desktop Predictive Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-xl px-12">
              <SearchAutocomplete />
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Account Dropdown (Eliminates Profile Glitch) */}
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="text-gray-600 hover:text-blue-600 flex flex-col items-center gap-1 transition relative py-1 cursor-pointer group"
                  aria-expanded={isAccountMenuOpen}
                  aria-label="Account Menu"
                >
                  <div className="relative">
                    <User className="w-6 h-6 group-hover:scale-105 transition-transform" />
                    {mounted && user && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:flex items-center gap-0.5">
                    {mounted && user ? (user.first_name || "Account") : "Sign In"}
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition" />
                  </span>
                </button>

                {/* Account Popover Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {mounted && user ? (
                      <div>
                        <div className="px-3 py-2.5 bg-blue-50/70 rounded-xl mb-2">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            Verified B2B Buyer
                          </p>
                          <p className="text-sm font-black text-gray-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        <div className="space-y-1 text-sm font-semibold text-gray-700">
                          <Link
                            href="/account/orders"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition"
                          >
                            <Package className="w-4 h-4 text-gray-400" />
                            My Orders & GST Invoices
                          </Link>
                          <Link
                            href="/account/addresses"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition"
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            Saved Outlets & Addresses
                          </Link>
                          <Link
                            href="/account"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            Full Account Dashboard
                          </Link>
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={async () => {
                              setIsAccountMenuOpen(false);
                              await handleLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 space-y-3">
                        <div>
                          <p className="text-xs font-black text-gray-900">Welcome to LaundryMall</p>
                          <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                            India&apos;s B2B Commercial Laundry Superstore
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <Link
                            href="/login"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center transition shadow-xs"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center transition"
                          >
                            Register B2B Account
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                          <Link
                            href="/account/orders"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-2 py-1.5 hover:text-blue-600 rounded-md hover:bg-gray-50 transition"
                          >
                            Track an Existing Order
                          </Link>
                          <Link
                            href="/contact"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-2 py-1.5 hover:text-blue-600 rounded-md hover:bg-gray-50 transition"
                          >
                            GST Helpdesk & Support
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-gray-600 hover:text-blue-600 flex flex-col items-center gap-1 transition relative group cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium hidden sm:block">Cart</span>
                {mounted && cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {cart.items.reduce((t: number, i: any) => t + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden sm:block border-t border-gray-100 bg-gray-50/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex space-x-8 py-3 text-sm font-semibold text-gray-600 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-600 transition">All Products</Link></li>
              <li><Link href="/products?category=Detergent%20Chemicals" className="hover:text-blue-600 transition">Chemicals</Link></li>
              <li><Link href="/products?category=Packaging%20Materials" className="hover:text-blue-600 transition">Packaging</Link></li>
              <li><Link href="/products?category=Accessories" className="hover:text-blue-600 transition">Accessories</Link></li>
              <li><Link href="/products?category=Machinery" className="hover:text-blue-600 transition">Machinery</Link></li>
              <li><Link href="/products?category=Technology" className="hover:text-blue-600 transition">Technology</Link></li>
              <li>
                <Link href="/products?category=Laundry%20Setup" className="hover:text-blue-600 transition inline-flex items-center gap-1 font-bold text-rose-600">
                  Laundry Setup
                  <span className="text-[10px] bg-rose-100 text-rose-600 font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> New
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
