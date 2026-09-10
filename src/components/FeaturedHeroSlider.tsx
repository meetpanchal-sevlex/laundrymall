"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import TurnkeyQuoteModal from "@/components/TurnkeyQuoteModal";

export interface HeroBanner {
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  emoji: string;
  href: string;
  isQuoteModal?: boolean;
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
    isQuoteModal: true,
  },
];

const AUTO_PLAY_INTERVAL = 3800; // ms between auto-advances

export default function FeaturedHeroSlider({
  banners = DEFAULT_HERO_BANNERS,
}: {
  banners?: HeroBanner[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  // Pause auto-play when slider is scrolled out of view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll to a specific slide by index — ONLY inside the horizontal container, NEVER scrolls the page!
  const scrollToSlide = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.children;
    const targetCard = cards[idx] as HTMLElement;
    if (targetCard) {
      el.scrollTo({
        left: targetCard.offsetLeft,
        behavior: "smooth",
      });
    }
  }, []);

  // Track active slide from scroll position
  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth } = el;
    const idx = Math.round(scrollLeft / clientWidth);
    setActiveIndex(Math.min(Math.max(0, idx), banners.length - 1));
  }, [banners.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  // Auto-play: advance slide every interval ONLY when in viewport and not paused
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isPaused && isInViewport) {
        setActiveIndex((prev) => {
          const next = prev >= banners.length - 1 ? 0 : prev + 1;
          scrollToSlide(next);
          return next;
        });
      }
    }, AUTO_PLAY_INTERVAL);
  }, [isPaused, isInViewport, banners.length, scrollToSlide]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  // Pause auto-play on hover or touch
  const handlePause = () => {
    setIsPaused(true);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  // Resume auto-play when interaction ends
  const handleResume = () => {
    setIsPaused(false);
  };

  const scrollPrev = () => {
    const prev = activeIndex <= 0 ? banners.length - 1 : activeIndex - 1;
    setActiveIndex(prev);
    scrollToSlide(prev);
  };

  const scrollNext = () => {
    const next = activeIndex >= banners.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(next);
    scrollToSlide(next);
  };

  return (
    <>
      <TurnkeyQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultPackage="Turnkey Commercial Plant Setup"
      />

      <section
        ref={sectionRef}
        className="relative pt-3 md:pt-6 pb-2"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        {/* 
          Slider container:
          - Mobile: no padding, no gap → each card is exactly full-width → perfect snap alignment
          - Desktop (sm+): side padding + gap to show partial next card (peek effect)
        */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar select-none
                     sm:px-4 sm:gap-3 md:gap-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {banners.map((b, i) => (
            <div
              key={i}
              className="
                flex-shrink-0 snap-start rounded-none sm:rounded-2xl
                w-full sm:w-[380px] md:w-[460px]
                text-white p-5 sm:p-6
                flex items-center justify-between
                shadow-md relative overflow-hidden
                min-h-[160px] sm:min-h-0
              "
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${b.color}`} />

              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-black/10 rounded-full blur-xl pointer-events-none" />

              {/* On mobile, add inner padding since card has no container padding */}
              <div className="relative z-10 pr-2 flex-1 px-4 sm:px-0">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2">
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

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Link
                    href={b.href}
                    className="bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95"
                  >
                    Explore <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                  </Link>

                  {b.isQuoteModal && (
                    <button
                      type="button"
                      onClick={() => setIsQuoteOpen(true)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1 border border-white/40 transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Quote
                    </button>
                  )}
                </div>
              </div>

              <span className="text-5xl sm:text-6xl drop-shadow-md select-none ml-2 mr-4 sm:mr-0 flex-shrink-0">
                {b.emoji}
              </span>
            </div>
          ))}
        </div>

        {/* Left Chevron */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Chevron */}
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Dots — hover/touch on these pauses the slider */}
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                scrollToSlide(idx);
              }}
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
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
    </>
  );
}
