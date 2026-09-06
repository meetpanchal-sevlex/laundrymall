"use client";

import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductBottomBar({ product }: { product: Product }) {
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const { cart, addItem, isSyncing } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const totalItems = mounted
    ? cart.items.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
    : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-[100] px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="max-w-xl mx-auto flex items-center gap-3">
        {/* Cart Icon with Counter Badge (Zepto style) */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-12 h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 transition shadow-2xs shrink-0 cursor-pointer"
          aria-label="View Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#E80071] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {totalItems}
            </span>
          )}
        </button>

        {/* Big Vibrant Add to Cart Button (Zepto style) */}
        <button
          onClick={handleAddToCart}
          disabled={isSyncing}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#E80071] to-[#FF1493] text-white font-black text-base flex items-center justify-center gap-2 hover:opacity-95 transition shadow-md shadow-[#E80071]/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {isSyncing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Adding to Cart...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
