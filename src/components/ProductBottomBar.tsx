"use client";

import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductBottomBar({ product }: { product: Product }) {
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product, 1);
    setIsOpen(true);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] flex shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <button 
        onClick={handleAddToCart}
        className="flex-1 py-3.5 bg-white text-blue-700 font-bold text-sm flex items-center justify-center gap-2 border-r border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
      <button 
        onClick={handleBuyNow}
        className="flex-1 py-3.5 bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors"
      >
        <ChevronsRight className="w-4 h-4" />
        Buy Now
      </button>
    </div>
  );
}
