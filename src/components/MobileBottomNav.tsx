"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartStore();

  // Hide the bottom nav on specific pages like product details and checkout
  // where we have dedicated bottom action bars.
  const isProductDetailPage = pathname.startsWith("/products/") && pathname.length > "/products/".length;
  const isCheckoutPage = pathname.startsWith("/checkout");

  if (isProductDetailPage || isCheckoutPage) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 flex shadow-[0_-4px_30px_rgba(0,0,0,0.06)] pb-safe">
      <Link href="/" className={`flex-1 flex flex-col items-center py-3 gap-1 ${isActive("/") ? "text-blue-600" : "text-slate-500 hover:text-slate-900"} transition-colors`}>
        <Home className={`w-5 h-5 ${isActive("/") ? "fill-current" : ""}`} />
        <span className={`text-[10px] tracking-tight ${isActive("/") ? "font-bold" : "font-medium"}`}>Home</span>
      </Link>
      
      <Link href="/products" className={`flex-1 flex flex-col items-center py-3 gap-1 ${isActive("/products") ? "text-blue-600" : "text-slate-500 hover:text-slate-900"} transition-colors`}>
        <Search className={`w-5 h-5 ${isActive("/products") ? "text-blue-600" : ""}`} />
        <span className={`text-[10px] tracking-tight ${isActive("/products") ? "font-bold" : "font-medium"}`}>Search</span>
      </Link>
      
      <Link href="/checkout" className={`flex-1 flex flex-col items-center py-3 gap-1 relative ${isActive("/checkout") ? "text-blue-600" : "text-slate-500 hover:text-slate-900"} transition-colors`}>
        <div className="relative">
          <ShoppingCart className={`w-5 h-5 ${isActive("/checkout") ? "fill-current" : ""}`} />
          {itemCount() > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm tabular-nums">
              {itemCount()}
            </span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight ${isActive("/checkout") ? "font-bold" : "font-medium"}`}>Cart</span>
      </Link>
      
      <Link href="/account" className={`flex-1 flex flex-col items-center py-3 gap-1 ${isActive("/account") ? "text-blue-600" : "text-slate-500 hover:text-slate-900"} transition-colors`}>
        <User className={`w-5 h-5 ${isActive("/account") ? "fill-current" : ""}`} />
        <span className={`text-[10px] tracking-tight ${isActive("/account") ? "font-bold" : "font-medium"}`}>Account</span>
      </Link>
    </nav>
  );
}
