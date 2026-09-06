"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, ArrowRight, Zap } from "lucide-react";

export default function ZeptoFloatingCart() {
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !cart?.items || cart.items.length === 0) {
    return null;
  }

  const totalItems = cart.items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
  const totalPrice = cart.items.reduce(
    (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-950 text-white rounded-2xl p-2.5 pl-4 shadow-2xl flex items-center justify-between border border-white/15 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E80071] flex items-center justify-center text-white shrink-0">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#E80071] uppercase tracking-wider">
                Fast Dispatch
              </span>
              <span className="text-[10px] text-gray-400">• Ready to ship</span>
            </div>
            <p className="text-xs font-medium text-gray-300">
              Total: <span className="font-bold text-white">₹{totalPrice.toFixed(0)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#E80071] to-[#FF1493] text-white px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 hover:opacity-95 transition shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart • {totalItems} items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
