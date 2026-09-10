"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Trash2, ShoppingCart, Check } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCart } from "@/hooks/useCart";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10">
          <Link href="/account"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
          <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">My Wishlist</h1>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-12">
      {/* Top Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/account" className="p-1 -ml-1 text-gray-600 hover:text-gray-900 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              My Wishlist
            </h1>
            <p className="text-[11px] text-gray-400 font-semibold">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear all items from your wishlist?")) {
                clearWishlist();
              }
            }}
            className="text-xs text-gray-400 hover:text-red-500 font-semibold px-2 py-1 transition cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-xs mt-4">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500 shadow-inner">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">Your Wishlist is Empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
              Explore our B2B commercial catalog and tap the heart icon on any product to save it here for later.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((product) => {
              const isAdded = addedIds[product.id];
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-200/80 hover:border-blue-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col relative"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 backdrop-blur-xs text-gray-400 hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm transition hover:scale-110 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Product Image Link */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative aspect-square bg-gray-50 flex items-center justify-center p-3 overflow-hidden"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5 line-clamp-1">
                        {product.category}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition leading-snug"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                      <div>
                        <span className="text-sm font-black text-gray-900">
                          ₹{product.price.toFixed(0)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through block -mt-0.5">
                            ₹{product.originalPrice.toFixed(0)}
                          </span>
                        )}
                      </div>

                      {/* Quick Add to Cart */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}