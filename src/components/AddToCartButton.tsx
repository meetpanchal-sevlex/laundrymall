"use client";

import { Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-2">
      <div className="flex border border-gray-200 rounded-xl bg-gray-50 p-1">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors font-medium shadow-sm"
        >-</button>
        <div className="w-16 flex items-center justify-center font-bold text-gray-900 text-lg">
          {quantity}
        </div>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors font-medium shadow-sm"
        >+</button>
      </div>
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 text-lg group"
      >
        <ShoppingBag className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
        Add to Cart
      </button>
    </div>
  );
}
