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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
      <Link href="/" className={`flex-1 flex flex-col items-center py-2.5 gap-1 ${isActive("/") ? "text-blue-600" : "text-gray-500"}`}>
        <Home className={`w-5 h-5 ${isActive("/") ? "fill-current" : ""}`} />
        <span className={`text-[10px] ${isActive("/") ? "font-bold" : "font-medium"}`}>Home</span>
      </Link>
      
      <Link href="/products" className={`flex-1 flex flex-col items-center py-2.5 gap-1 ${isActive("/products") ? "text-blue-600" : "text-gray-500"}`}>
        <Search className={`w-5 h-5 ${isActive("/products") ? "text-blue-600" : ""}`} />
        <span className={`text-[10px] ${isActive("/products") ? "font-bold" : "font-medium"}`}>Categories</span>
      </Link>
      
      <Link href="/checkout" className={`flex-1 flex flex-col items-center py-2.5 gap-1 relative ${isActive("/checkout") ? "text-blue-600" : "text-gray-500"}`}>
        <div className="relative">
          <ShoppingCart className={`w-5 h-5 ${isActive("/checkout") ? "fill-current" : ""}`} />
          {itemCount() > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount()}
            </span>
          )}
        </div>
        <span className={`text-[10px] ${isActive("/checkout") ? "font-bold" : "font-medium"}`}>Cart</span>
      </Link>
      
      <Link href="/account" className={`flex-1 flex flex-col items-center py-2.5 gap-1 ${isActive("/account") ? "text-blue-600" : "text-gray-500"}`}>
        <User className={`w-5 h-5 ${isActive("/account") ? "fill-current" : ""}`} />
        <span className={`text-[10px] ${isActive("/account") ? "font-bold" : "font-medium"}`}>Account</span>
      </Link>
    </nav>
  );
}
