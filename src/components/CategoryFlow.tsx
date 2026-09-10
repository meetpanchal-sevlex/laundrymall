"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface CategoryItem {
  name: string;
  subtitle: string;
  href: string;
  icon: string;
  color: string;
  ringColor: string;
  badge?: string;
}

export const CATEGORIES_FLOW: CategoryItem[] = [
  {
    name: "All Products",
    subtitle: "Complete B2B Catalog",
    href: "/products",
    icon: "🏪",
    color: "bg-blue-50 text-blue-700",
    ringColor: "ring-blue-100 group-hover:ring-blue-300",
  },
  {
    name: "Chemicals",
    subtitle: "Detergents & Softeners",
    href: "/products?category=Detergent+Chemicals",
    icon: "🧪",
    color: "bg-emerald-50 text-emerald-700",
    ringColor: "ring-emerald-100 group-hover:ring-emerald-300",
  },
  {
    name: "Packaging",
    subtitle: "Rolls & Garment Covers",
    href: "/products?category=Packaging+Materials",
    icon: "📦",
    color: "bg-purple-50 text-purple-700",
    ringColor: "ring-purple-100 group-hover:ring-purple-300",
  },
  {
    name: "Accessories",
    subtitle: "Tags, Pins & Hangers",
    href: "/products?category=Accessories",
    icon: "🔧",
    color: "bg-amber-50 text-amber-700",
    ringColor: "ring-amber-100 group-hover:ring-amber-300",
  },
  {
    name: "Machinery",
    subtitle: "Commercial Washers & Dryers",
    href: "/products?category=Machinery",
    icon: "⚙️",
    color: "bg-blue-50 text-blue-700",
    ringColor: "ring-blue-100 group-hover:ring-blue-300",
  },
  {
    name: "Technology",
    subtitle: "POS Billing & RFID Tracking",
    href: "/products?category=Technology",
    icon: "💻",
    color: "bg-indigo-50 text-indigo-700",
    ringColor: "ring-indigo-100 group-hover:ring-indigo-300",
  },
  {
    name: "Laundry Setup",
    subtitle: "Turnkey Plants & Consulting",
    href: "/products?category=Laundry+Setup",
    icon: "🏗️",
    color: "bg-rose-50 text-rose-700",
    ringColor: "ring-rose-200 group-hover:ring-rose-400",
    badge: "NEW",
  },
];

export default function CategoryFlow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gentle Slow Auto-Scroll Engine
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isPaused && scrollRef.current) {
        const el = scrollRef.current;
        // Slow gentle drift: 0.45px per frame (~27px/s)
        el.scrollLeft += 0.45;

        // If we reach the end of the first duplicate set, loop back seamlessly
        const maxScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft -= maxScroll;
        }

        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Pause on touch or hover, resume after user stops interacting
  const handleInteractionStart = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  };

  const handleInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    // Pause for 2.5s after user interaction ends before resuming slow flow
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500);
  };

  const scrollByAmount = (amount: number) => {
    if (!scrollRef.current) return;
    handleInteractionStart();
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    handleInteractionEnd();
  };

  // We duplicate the list so the slow flow loops indefinitely
  const displayCategories = [...CATEGORIES_FLOW, ...CATEGORIES_FLOW];

  return (
    <section className="relative bg-white md:bg-transparent py-4 md:py-6 border-y md:border-y-0 border-gray-100 group select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-wider">
              Explore Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 transition inline-flex items-center gap-0.5"
          >
            All Products <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scrollable Flow Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            className="flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-1"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {displayCategories.map((cat, index) => (
              <Link
                key={`${cat.name}-${index}`}
                href={cat.href}
                className="flex-shrink-0 flex flex-col items-center group cursor-pointer w-[86px] sm:w-[100px] md:w-[115px] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  {/* Icon Circle */}
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl ${cat.color} flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-xs border border-white/80 ring-2 ${cat.ringColor} transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}
                  >
                    {cat.icon}
                  </div>

                  {/* Optional Badge (e.g. NEW on Laundry Setup) */}
                  {cat.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 animate-bounce">
                      <Sparkles className="w-2 h-2" />
                      {cat.badge}
                    </span>
                  )}
                </div>

                <span className="mt-2.5 text-xs sm:text-sm font-bold text-gray-800 text-center leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 text-center hidden md:block mt-0.5 leading-tight line-clamp-1">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Left / Right Scroll Buttons */}
          <button
            type="button"
            onClick={() => scrollByAmount(-240)}
            aria-label="Scroll Categories Left"
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollByAmount(240)}
            aria-label="Scroll Categories Right"
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
