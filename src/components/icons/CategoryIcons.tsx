"use client";

import React from "react";

const s = "w-full h-full"; // fill container

/** All Products — a sleek 2x2 grid with gradient fills */
export function IconAllProducts() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="allProd" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="16" height="16" rx="4" fill="url(#allProd)" opacity="0.9" />
      <rect x="27" y="5" width="16" height="16" rx="4" fill="url(#allProd)" opacity="0.55" />
      <rect x="5" y="27" width="16" height="16" rx="4" fill="url(#allProd)" opacity="0.55" />
      <rect x="27" y="27" width="16" height="16" rx="4" fill="url(#allProd)" opacity="0.35" />
    </svg>
  );
}

/** Chemicals — laboratory flask with liquid & bubbles */
export function IconChemicals() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chemFlask" x1="14" y1="6" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="chemLiquid" x1="10" y1="28" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Flask neck */}
      <path d="M19 4H29V16L38 36C39.5 39.5 37 44 33 44H15C11 44 8.5 39.5 10 36L19 16V4Z" stroke="url(#chemFlask)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Liquid fill */}
      <path d="M13 32L19 20V16H29V20L35 32C36.8 36 34.5 40 31 40H17C13.5 40 11.2 36 13 32Z" fill="url(#chemLiquid)" opacity="0.3" />
      {/* Bubbles */}
      <circle cx="20" cy="33" r="2" fill="url(#chemLiquid)" opacity="0.6" />
      <circle cx="27" cy="36" r="1.5" fill="url(#chemLiquid)" opacity="0.5" />
      <circle cx="24" cy="30" r="1" fill="url(#chemLiquid)" opacity="0.7" />
      {/* Flask top rim */}
      <line x1="16" y1="4" x2="32" y2="4" stroke="url(#chemFlask)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Packaging — open box with a subtle inner shadow */
export function IconPackaging() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boxGrad" x1="4" y1="10" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="boxFace" x1="4" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Box body — front face */}
      <path d="M6 18L24 10L42 18V38L24 46L6 38V18Z" fill="url(#boxFace)" opacity="0.25" />
      {/* Box edges */}
      <path d="M6 18L24 10L42 18V38L24 46L6 38V18Z" stroke="url(#boxGrad)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Center divider */}
      <path d="M24 10V46" stroke="url(#boxGrad)" strokeWidth="2" opacity="0.5" />
      {/* Horizontal line */}
      <path d="M6 18L24 26L42 18" stroke="url(#boxGrad)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Tape on top */}
      <path d="M20 14L24 10L28 14" stroke="url(#boxGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

/** Accessories — a price tag with string */
export function IconAccessories() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tagGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Tag body */}
      <path d="M26 4L44 4L44 22L24 42L6 24L26 4Z" fill="url(#tagGrad)" opacity="0.2" />
      <path d="M26 4L44 4L44 22L24 42L6 24L26 4Z" stroke="url(#tagGrad)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Tag hole */}
      <circle cx="36" cy="12" r="3" stroke="url(#tagGrad)" strokeWidth="2" fill="none" />
      {/* String */}
      <path d="M39 9L44 4" stroke="url(#tagGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Inner details — lines on tag */}
      <line x1="16" y1="28" x2="28" y2="16" stroke="url(#tagGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <line x1="14" y1="26" x2="22" y2="18" stroke="url(#tagGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}

/** Machinery — industrial washing machine with a circular drum */
export function IconMachinery() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="machGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="drumGrad" x1="14" y1="18" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      {/* Machine body */}
      <rect x="7" y="4" width="34" height="40" rx="4" stroke="url(#machGrad)" strokeWidth="2.5" fill="none" />
      {/* Control panel area */}
      <line x1="7" y1="14" x2="41" y2="14" stroke="url(#machGrad)" strokeWidth="2" opacity="0.5" />
      {/* Control dots */}
      <circle cx="14" cy="9" r="2" fill="url(#machGrad)" opacity="0.6" />
      <circle cx="22" cy="9" r="2" fill="url(#machGrad)" opacity="0.4" />
      {/* Drum — main circle */}
      <circle cx="24" cy="30" r="10" stroke="url(#drumGrad)" strokeWidth="2.5" fill="url(#drumGrad)" fillOpacity="0.15" />
      {/* Inner drum detail */}
      <circle cx="24" cy="30" r="5" stroke="url(#drumGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Water ripple */}
      <path d="M18 32Q21 28 24 32Q27 36 30 32" stroke="url(#drumGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

/** Technology — a monitor with code brackets */
export function IconTechnology() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="techGrad" x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="8" y1="8" x2="40" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C7D2FE" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      {/* Monitor body */}
      <rect x="5" y="6" width="38" height="26" rx="3" stroke="url(#techGrad)" strokeWidth="2.5" fill="url(#screenGrad)" fillOpacity="0.12" />
      {/* Screen bezel highlight */}
      <rect x="9" y="10" width="30" height="18" rx="1.5" fill="url(#screenGrad)" opacity="0.08" />
      {/* Code brackets on screen */}
      <path d="M18 16L14 21L18 26" stroke="url(#techGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M30 16L34 21L30 26" stroke="url(#techGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* Slash */}
      <line x1="26" y1="15" x2="22" y2="27" stroke="url(#techGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Stand */}
      <path d="M20 36H28" stroke="url(#techGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 32V36" stroke="url(#techGrad)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Base */}
      <path d="M16 40H32" stroke="url(#techGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 36L16 40" stroke="url(#techGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M28 36L32 40" stroke="url(#techGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** Laundry Setup — a full building/factory with chimney smoke */
export function IconLaundrySetup() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="setupGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="setupFill" x1="4" y1="16" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FECDD3" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      {/* Main building */}
      <rect x="6" y="16" width="24" height="28" rx="2" stroke="url(#setupGrad)" strokeWidth="2.5" fill="url(#setupFill)" fillOpacity="0.15" />
      {/* Roof/triangle */}
      <path d="M4 18L18 6L32 18" stroke="url(#setupGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#setupFill)" fillOpacity="0.1" />
      {/* Windows */}
      <rect x="11" y="22" width="5" height="5" rx="1" fill="url(#setupGrad)" opacity="0.4" />
      <rect x="20" y="22" width="5" height="5" rx="1" fill="url(#setupGrad)" opacity="0.3" />
      {/* Door */}
      <rect x="14" y="33" width="8" height="11" rx="1.5" stroke="url(#setupGrad)" strokeWidth="2" fill="url(#setupFill)" fillOpacity="0.1" />
      {/* Chimney */}
      <rect x="35" y="10" width="6" height="16" rx="1" stroke="url(#setupGrad)" strokeWidth="2" fill="none" />
      {/* Smoke puffs */}
      <circle cx="38" cy="7" r="2.5" fill="url(#setupGrad)" opacity="0.2" />
      <circle cx="41" cy="4" r="2" fill="url(#setupGrad)" opacity="0.12" />
      {/* Side extension */}
      <rect x="30" y="26" width="12" height="18" rx="1.5" stroke="url(#setupGrad)" strokeWidth="2" fill="url(#setupFill)" fillOpacity="0.08" />
      <rect x="33" y="32" width="6" height="4" rx="1" fill="url(#setupGrad)" opacity="0.25" />
    </svg>
  );
}
