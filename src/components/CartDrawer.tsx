"use client";

import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, Heart, X, ShoppingBag, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, cartTotal } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalSavings = items.reduce((acc, item) => {
    if (item.originalPrice) {
      return acc + (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const productTotal = items.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer — full screen on mobile, 480px on desktop */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-gray-50 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-700"
            aria-label="Close cart"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Cart</span>
          <span className="text-xs font-bold text-blue-600 border border-blue-600 px-2 py-0.5 rounded-full">
            STEP 1/3
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <h3 className="font-black text-gray-800 text-xl">Your cart is empty</h3>
              <p className="text-gray-500 text-sm">Add products from the catalog to get started.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              {items.map((item) => {
                const discount = item.originalPrice
                  ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                  : 0;
                const savings = item.originalPrice
                  ? (item.originalPrice - item.price) * item.quantity
                  : 0;

                return (
                  <div key={item.id} className="bg-white">
                    {/* Wishlist / Remove row */}
                    <div className="flex items-center border-b border-gray-100 px-4 py-2">
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 flex-1">
                        <Heart className="w-3.5 h-3.5" /> Move to Wishlist
                      </button>
                      <div className="w-px h-4 bg-gray-200" />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 flex-1 justify-end"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    {/* Savings banner */}
                    {savings > 0 && (
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold border-b border-green-100">
                        <span className="text-green-500">▼</span>
                        ₹{savings.toFixed(0)} Less today
                      </div>
                    )}

                    {/* Product row */}
                    <div className="flex gap-3 px-4 py-3">
                      {/* Image */}
                      <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                          {item.name}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-gray-900">₹{item.price.toFixed(0)}</span>
                          {item.originalPrice && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{item.originalPrice.toFixed(0)}
                              </span>
                              <span className="text-xs font-bold text-green-600">{discount}% Off</span>
                            </>
                          )}
                        </div>

                        {/* Qty selector */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold"
                          >
                            +
                          </button>
                          <span className="text-xs text-gray-400 ml-1">Qty</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Price Details */}
              <div className="bg-white mt-2 px-4 py-4">
                <h3 className="font-black text-gray-900 mb-3">
                  Price Details ({items.reduce((a, i) => a + i.quantity, 0)} items)
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Price</span>
                    <span className="font-semibold">+ ₹{productTotal.toFixed(0)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600 font-semibold">Total Discounts</span>
                      <span className="text-green-600 font-bold">− ₹{totalSavings.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between">
                    <span className="font-black text-gray-900">Order Total</span>
                    <span className="font-black text-gray-900">₹{cartTotal().toFixed(0)}</span>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <span className="text-green-600 text-base">✅</span>
                    <p className="text-green-700 text-xs font-bold">
                      Yay! Your total savings is ₹{totalSavings.toFixed(0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {items.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Order Total</p>
              <p className="text-lg font-black text-gray-900">₹{cartTotal().toFixed(0)}</p>
              {totalSavings > 0 && (
                <p className="text-xs text-green-600 font-bold">You save ₹{totalSavings.toFixed(0)}</p>
              )}
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-blue-600 text-white font-black py-3.5 px-6 rounded-xl text-center text-sm flex items-center justify-center gap-2 max-w-[180px]"
            >
              Proceed <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
