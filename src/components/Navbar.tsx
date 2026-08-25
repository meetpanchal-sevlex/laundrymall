"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, Menu, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import MobileDrawer from "@/components/MobileDrawer";

export default function Navbar() {
  const { setIsOpen, itemCount } = useCartStore();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    logout();
    await logoutAction();
  };

  return (
    <>
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm transition-all">
      {/* Top bar */}
      <div className="bg-blue-600 text-white text-sm py-2 px-4 flex justify-between items-center">
        <div className="font-medium tracking-wide">
          {mounted && user ? `Welcome back, ${user.first_name || 'Customer'}!` : "Welcome to LaundryMall"}
        </div>
        <div className="flex gap-4 font-medium">
          {mounted && user ? (
            <button onClick={handleLogout} className="hover:text-blue-100 transition flex items-center gap-1">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-100 transition">Login</Link>
              <Link href="/signup" className="hover:text-blue-100 transition">Signup</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden text-gray-500 hover:text-blue-600 transition"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
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
          
          {/* Desktop Search */}
          <div className="hidden sm:flex flex-1 max-w-xl px-12">
            <form 
              className="relative w-full group"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const search = formData.get("search") as string;
                if (search.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(search.trim())}`;
                }
              }}
            >
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full border-2 border-gray-200 rounded-full py-2.5 px-6 focus:outline-none focus:border-blue-500 transition shadow-sm"
              />
              <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href={mounted && user ? "/account" : "/login"} className="text-gray-600 hover:text-blue-600 flex flex-col items-center gap-1 transition">
              <User className="w-6 h-6" />
              <span className="text-xs font-medium hidden sm:block">{mounted && user ? "Account" : "Sign In"}</span>
            </Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="text-gray-600 hover:text-blue-600 flex flex-col items-center gap-1 transition relative group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium hidden sm:block">Cart</span>
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  {itemCount()}
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
            <li><Link href="/products?category=Machinery" className="hover:text-blue-600 transition">Machinery</Link></li>
            <li><Link href="/products?category=Detergent%20Chemicals" className="hover:text-blue-600 transition">Chemicals</Link></li>
            <li><Link href="/products?category=Packaging%20Materials" className="hover:text-blue-600 transition">Packaging</Link></li>
            <li><Link href="/products?category=Accessories" className="hover:text-blue-600 transition">Accessories</Link></li>
            <li><Link href="/products?category=Technology" className="hover:text-blue-600 transition">Technology</Link></li>
          </ul>
        </div>
      </div>
    </nav>
    </>
  );
}
