"use client";

import React, { useState, useEffect } from "react";
import { Heart, Share2, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlistStore } from "@/store/wishlistStore";

export default function ProductActions({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isInWishlist, toggleItem } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorited = mounted && isInWishlist(product.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleToggleWishlist = () => {
    const added = toggleItem(product);
    showToast(added ? "Added to Wishlist ❤️" : "Removed from Wishlist");
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on LaundryMall:`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share && typeof window !== "undefined" && window.innerWidth < 768) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or error
      }
    }

    // Fallback: Copy link
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard! 📋");
      } catch {
        showToast("Link copied!");
      }
    }
  };

  return (
    <div className="relative flex items-center gap-3 md:gap-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute right-0 -top-10 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 z-30 pointer-events-none whitespace-nowrap">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        className={`flex flex-col items-center gap-1 transition-all cursor-pointer group select-none ${
          isFavorited ? "text-rose-500 scale-105" : "text-gray-400 hover:text-rose-500"
        }`}
      >
        <div className={`p-1.5 rounded-full transition-colors ${isFavorited ? "bg-rose-50" : "group-hover:bg-gray-100"}`}>
          <Heart
            className={`w-5 h-5 md:w-6 md:h-6 transition-transform group-active:scale-125 ${
              isFavorited ? "fill-rose-500 text-rose-500 animate-pulse" : "group-hover:fill-rose-100"
            }`}
          />
        </div>
        <span className="text-[10px] md:text-xs font-bold">
          {isFavorited ? "Wishlisted" : "Wishlist"}
        </span>
      </button>

      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share product"
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-all cursor-pointer group select-none"
      >
        <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
          <Share2 className="w-5 h-5 md:w-6 md:h-6 transition-transform group-active:scale-125 group-hover:text-blue-600" />
        </div>
        <span className="text-[10px] md:text-xs font-bold group-hover:text-blue-600">
          Share
        </span>
      </button>
    </div>
  );
}
