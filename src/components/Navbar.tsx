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
      <nav className="bg-white/85 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden text-slate-500 hover:text-blue-600 transition"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-[28px] font-black tracking-[-0.03em] text-blue-600 group-hover:text-blue-700 transition-colors">
                  Laundry<span className="text-slate-900">Mall</span>
                </span>
              </Link>
              <span className="hidden lg:flex items-center px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                Wholesale
              </span>
            </div>
          </div>
          
          {/* Desktop Search */}
          <div className="hidden sm:flex flex-1 max-w-2xl px-8 lg:px-12">
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
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search supplies, chemicals, machinery..."
                className="w-full bg-slate-100/50 border border-slate-200 text-sm rounded-full py-2.5 pl-11 pr-16 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden lg:inline-flex items-center justify-center rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-300/50">
                  <span className="text-xs mr-0.5">⌘</span>K
                </kbd>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href={mounted && user ? "/account" : "/login"} className="text-slate-600 hover:text-blue-600 flex items-center gap-2 transition group">
              <div className="p-2 bg-slate-50 rounded-full border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-tight hidden lg:block">{mounted && user ? "Account" : "Sign In"}</span>
            </Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="text-slate-600 hover:text-blue-600 flex items-center gap-2 transition relative group"
            >
              <div className="p-2 bg-slate-50 rounded-full border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {mounted && itemCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center font-bold border-2 border-white tabular-nums shadow-sm">
                    {itemCount()}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-tight hidden lg:block">Cart</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Categories Bar */}
      <div className="hidden sm:block border-t border-slate-200/60 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-6 py-2.5 text-[13px] font-semibold text-slate-600 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <li><Link href="/" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">Home</Link></li>
            <li><Link href="/products" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">All Products</Link></li>
            <li><Link href="/products?category=Machinery" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">Machinery</Link></li>
            <li><Link href="/products?category=Detergent%20Chemicals" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">Chemicals</Link></li>
            <li><Link href="/products?category=Packaging%20Materials" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">Packaging</Link></li>
            <li><Link href="/products?category=Accessories" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">Accessories</Link></li>
            <li><Link href="/products?category=Technology" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-100">Technology</Link></li>
          </ul>
        </div>
      </div>
    </nav>
    </>
  );
}
