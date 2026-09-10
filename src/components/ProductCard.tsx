"use client";

import { Product } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  if (compact) {
    return (
      <Link
        href={`/products/${product.id}`}
        className="group flex flex-col bg-white hover:bg-blue-50/30 transition-colors duration-200 relative overflow-hidden"
      >
        {/* Image area */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.originalPrice && (
            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full z-10">
              SALE
            </div>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2.5 group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width: 768px) 33vw, 20vw"
          />
          {/* Quick add button on hover */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-1.5 right-1.5 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>

        {/* Text area */}
        <div className="px-2 pb-2.5 pt-1.5">
          <h3 className="text-[11px] sm:text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xs font-black text-gray-900">₹{product.price.toFixed(0)}</span>
            {product.originalPrice && (
              <span className="text-[9px] text-gray-400 line-through">₹{product.originalPrice.toFixed(0)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full border border-gray-100 hover:border-blue-100 relative">
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden p-4 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {product.originalPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full z-20 shadow-sm">
            Sale
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow bg-white z-20">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[10px] text-blue-600 font-bold tracking-widest uppercase bg-blue-50 px-2 py-1 rounded-md">{product.category}</div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors text-lg">{product.name}</h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-xl font-black text-gray-900">₹{product.price.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-900 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-blue-600/30 group-hover:rotate-12"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
