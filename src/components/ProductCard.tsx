"use client";

import { Product } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (compact) {
    return (
      <Link href={`/products/${product.id}`} className="group bg-white border-b border-r border-slate-100 flex flex-col hover:bg-slate-50 transition-colors relative">
        <div className="relative aspect-square bg-slate-50/50 overflow-hidden flex items-center justify-center p-4">
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider z-10">
              -{discountPercentage}%
            </div>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-3 pb-3 pt-2">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug tracking-tight">{product.name}</h3>
          <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
            <span className="text-sm font-bold text-slate-900">₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full border border-slate-200/80 hover:border-slate-300 relative">
      <div className="relative aspect-[4/3] bg-slate-50/80 overflow-hidden p-4 flex items-center justify-center group-hover:bg-slate-100/50 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {discountPercentage > 0 && (
            <div className="bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded shadow-sm flex items-center gap-1">
              <span>Save {discountPercentage}%</span>
            </div>
          )}
          <div className="bg-white/90 backdrop-blur border border-slate-200 text-slate-600 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded shadow-sm">
            In Stock
          </div>
        </div>

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow bg-white z-20">
        <div className="flex justify-between items-center mb-2.5">
          <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">{product.category}</div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            <span className="text-amber-400 text-xs">★</span> 4.9
          </div>
        </div>
        
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors text-[17px] tracking-tight">{product.name}</h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col tabular-nums">
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through decoration-slate-300">₹{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            )}
            <span className="text-xl font-black text-slate-900 tracking-tight">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl transition-all duration-300 border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-blue-600/20 active:scale-95 group/btn"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
}
