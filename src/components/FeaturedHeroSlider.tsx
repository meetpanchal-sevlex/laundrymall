"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroBanner {
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  emoji: string;
  href: string;
}

export const DEFAULT_HERO_BANNERS: HeroBanner[] = [
  {
    title: "Eco & Commercial Chemicals",
    subtitle: "ISO certified bulk detergents, softeners & stain removers",
    tag: "Chemicals",
    color: "from-emerald-600 via-teal-700 to-emerald-900",
    emoji: "🧪",
    href: "/products?category=Detergent+Chemicals",
  },
  {
    title: "Smart Packaging Solutions",
    subtitle: "Rolls, custom polybags, garment covers & hanger wraps",
    tag: "Packaging",
    color: "from-purple-600 via-indigo-700 to-purple-900",
    emoji: "📦",
    href: "/products?category=Packaging+Materials",
  },
  {
    title: "Industrial Supplies & Accessories",
    subtitle: "Tagging guns, pins, spotting brushes, clips & baskets",
    tag: "Accessories",
    color: "from-amber-600 via-orange-600 to-rose-700",
    emoji: "🔧",
    href: "/products?category=Accessories",
  },
  {
    title: "Wholesale Commercial Machinery",
    subtitle: "Heavy-duty commercial washers, extractors & steam boilers",
    tag: "Machinery",
    color: "from-blue-600 via-blue-700 to-indigo-800",
    emoji: "⚙️",
    href: "/products?category=Machinery",
  },
  {
    title: "POS & Laundry Automation",
    subtitle: "Smart cloud billing, RFID garment tracking & customer apps",
    tag: "Technology",
    color: "from-indigo-600 via-violet-700 to-blue-900",
    emoji: "💻",
    href: "/products?category=Technology",
  },
  {
    title: "Turnkey Commercial Laundry Setup",
    subtitle: "Complete plant design, machine layout & franchise consulting",
    tag: "Laundry Setup",
    color: "from-rose-600 via-pink-700 to-red-900",
    emoji: "🏗️",
    href: "/products?category=Laundry+Setup",
  },
];

export default function FeaturedHeroSlider({
  banners = DEFAULT_HERO_BANNERS,
}: {
  banners?: HeroBanner[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Calculate active slide based on scroll offset
    const cardWidth = clientWidth * 0.85; // approximate width of card + gap
    const index = Math.round(scrollLeft / (cardWidth > 0 ? cardWidth : 320));
    setActiveIndex(Math.min(Math.max(0, index), banners.length - 1));

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [banners.length]);

  const scrollToSlide = (idx: number) => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.children;
    if (cards[idx]) {
      (cards[idx] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const scrollPrev = () => {
    scrollToSlide(Math.max(0, activeIndex - 1));
  };

  const scrollNext = () => {
    scrollToSlide(Math.min(banners.length - 1, activeIndex + 1));
  };

  return (
    <section className="relative pt-3 md:pt-6 pb-2 group">
      {/* Scrollable Container with Native Touch Snap (Option 1: moves only on touch/swipe) */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar select-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {banners.map((b, i) => (
          <Link
            key={i}
            href={b.href}
            className="flex-shrink-0 w-[84vw] sm:w-[380px] md:w-[410px] snap-center rounded-2xl bg-gradient-to-r text-white p-5 sm:p-6 flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          >
            {/* Background decorative blur circles */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />

            <div className={`absolute inset-0 bg-gradient-to-r ${b.color} -z-10`} />

            <div className="relative z-10 pr-2">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {b.tag}
                </p>
              </div>
              <h3 className="text-lg md:text-xl font-black leading-tight tracking-tight text-white">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/85 mt-1 leading-snug line-clamp-2">
                {b.subtitle}
              </p>
              <div className="mt-4 bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95">
                Explore <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>

            <span className="text-5xl sm:text-6xl drop-shadow-md select-none transform transition-transform group-hover:scale-110 ml-2 flex-shrink-0">
              {b.emoji}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop Chevron Navigation Buttons */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Touch Indicator Dots (Option 1) */}
      <div className="flex justify-center items-center gap-1.5 mt-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? "w-6 bg-blue-600"
                : "w-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
