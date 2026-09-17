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
      <path d="M19 4H29V16L38 36C39.5 39.5 37 44 33 44H15C11 44 8.5 39.5 10 36L19 16V4Z" stroke="url(#chemFlask)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M13 32L19 20V16H29V20L35 32C36.8 36 34.5 40 31 40H17C13.5 40 11.2 36 13 32Z" fill="url(#chemLiquid)" opacity="0.3" />
      <circle cx="20" cy="33" r="2" fill="url(#chemLiquid)" opacity="0.6" />
      <circle cx="27" cy="36" r="1.5" fill="url(#chemLiquid)" opacity="0.5" />
      <circle cx="24" cy="30" r="1" fill="url(#chemLiquid)" opacity="0.7" />
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
      <path d="M6 18L24 10L42 18V38L24 46L6 38V18Z" fill="url(#boxFace)" opacity="0.25" />
      <path d="M6 18L24 10L42 18V38L24 46L6 38V18Z" stroke="url(#boxGrad)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M24 10V46" stroke="url(#boxGrad)" strokeWidth="2" opacity="0.5" />
      <path d="M6 18L24 26L42 18" stroke="url(#boxGrad)" strokeWidth="2.5" strokeLinejoin="round" />
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
      <path d="M26 4L44 4L44 22L24 42L6 24L26 4Z" fill="url(#tagGrad)" opacity="0.2" />
      <path d="M26 4L44 4L44 22L24 42L6 24L26 4Z" stroke="url(#tagGrad)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <circle cx="36" cy="12" r="3" stroke="url(#tagGrad)" strokeWidth="2" fill="none" />
      <path d="M39 9L44 4" stroke="url(#tagGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
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
      <rect x="7" y="4" width="34" height="40" rx="4" stroke="url(#machGrad)" strokeWidth="2.5" fill="none" />
      <line x1="7" y1="14" x2="41" y2="14" stroke="url(#machGrad)" strokeWidth="2" opacity="0.5" />
      <circle cx="14" cy="9" r="2" fill="url(#machGrad)" opacity="0.6" />
      <circle cx="22" cy="9" r="2" fill="url(#machGrad)" opacity="0.4" />
      <circle cx="24" cy="30" r="10" stroke="url(#drumGrad)" strokeWidth="2.5" fill="url(#drumGrad)" fillOpacity="0.15" />
      <circle cx="24" cy="30" r="5" stroke="url(#drumGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />
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
      <rect x="5" y="6" width="38" height="26" rx="3" stroke="url(#techGrad)" strokeWidth="2.5" fill="url(#screenGrad)" fillOpacity="0.12" />
      <rect x="9" y="10" width="30" height="18" rx="1.5" fill="url(#screenGrad)" opacity="0.08" />
      <path d="M18 16L14 21L18 26" stroke="url(#techGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M30 16L34 21L30 26" stroke="url(#techGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <line x1="26" y1="15" x2="22" y2="27" stroke="url(#techGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M20 36H28" stroke="url(#techGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 32V36" stroke="url(#techGrad)" strokeWidth="2.5" strokeLinecap="round" />
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
      <rect x="6" y="16" width="24" height="28" rx="2" stroke="url(#setupGrad)" strokeWidth="2.5" fill="url(#setupFill)" fillOpacity="0.15" />
      <path d="M4 18L18 6L32 18" stroke="url(#setupGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#setupFill)" fillOpacity="0.1" />
      <rect x="11" y="22" width="5" height="5" rx="1" fill="url(#setupGrad)" opacity="0.4" />
      <rect x="20" y="22" width="5" height="5" rx="1" fill="url(#setupGrad)" opacity="0.3" />
      <rect x="14" y="33" width="8" height="11" rx="1.5" stroke="url(#setupGrad)" strokeWidth="2" fill="url(#setupFill)" fillOpacity="0.1" />
      <rect x="35" y="10" width="6" height="16" rx="1" stroke="url(#setupGrad)" strokeWidth="2" fill="none" />
      <circle cx="38" cy="7" r="2.5" fill="url(#setupGrad)" opacity="0.2" />
      <circle cx="41" cy="4" r="2" fill="url(#setupGrad)" opacity="0.12" />
      <rect x="30" y="26" width="12" height="18" rx="1.5" stroke="url(#setupGrad)" strokeWidth="2" fill="url(#setupFill)" fillOpacity="0.08" />
      <rect x="33" y="32" width="6" height="4" rx="1" fill="url(#setupGrad)" opacity="0.25" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   POPULAR / TRENDING — star with rays
   ═══════════════════════════════════════════════════════════════ */
export function IconPopular() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="popGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FACC15" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      <path d="M24 4L29.5 17H43L32 26L36 40L24 31L12 40L16 26L5 17H18.5L24 4Z" fill="url(#popGrad)" opacity="0.25" />
      <path d="M24 4L29.5 17H43L32 26L36 40L24 31L12 40L16 26L5 17H18.5L24 4Z" stroke="url(#popGrad)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-CATEGORY ICONS
   ═══════════════════════════════════════════════════════════════ */

/** Trophy — Best Sellers */
export function IconTrophy() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="trG" x1="8" y1="4" x2="40" y2="40"><stop stopColor="#FBBF24"/><stop offset="1" stopColor="#B45309"/></linearGradient></defs>
      <path d="M14 6H34V22C34 28.6 29.5 34 24 34C18.5 34 14 28.6 14 22V6Z" stroke="url(#trG)" strokeWidth="2.5" fill="url(#trG)" fillOpacity="0.15"/>
      <path d="M14 12H8C8 12 6 20 14 20" stroke="url(#trG)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M34 12H40C40 12 42 20 34 20" stroke="url(#trG)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="20" y1="40" x2="28" y2="40" stroke="url(#trG)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="34" x2="24" y2="40" stroke="url(#trG)" strokeWidth="2.5"/>
    </svg>
  );
}

/** Sparkle — New Arrivals */
export function IconSparkle() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="spG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#A78BFA"/><stop offset="1" stopColor="#6D28D9"/></linearGradient></defs>
      <path d="M24 4L28 18L42 22L28 26L24 44L20 26L6 22L20 18L24 4Z" fill="url(#spG)" opacity="0.2"/>
      <path d="M24 4L28 18L42 22L28 26L24 44L20 26L6 22L20 18L24 4Z" stroke="url(#spG)" strokeWidth="2.5" strokeLinejoin="round"/>
    </svg>
  );
}

/** Sale Tag — On Sale */
export function IconSaleTag() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="slG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#F87171"/><stop offset="1" stopColor="#B91C1C"/></linearGradient></defs>
      <path d="M8 8H24L42 26L26 42L8 24V8Z" fill="url(#slG)" opacity="0.15"/>
      <path d="M8 8H24L42 26L26 42L8 24V8Z" stroke="url(#slG)" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="18" cy="18" r="3" fill="url(#slG)" opacity="0.4"/>
      <line x1="22" y1="30" x2="30" y2="22" stroke="url(#slG)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

/** Star Rating — Top Rated */
export function IconStarRating() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="srG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#FCD34D"/><stop offset="1" stopColor="#D97706"/></linearGradient></defs>
      <path d="M24 6L29 18H42L31 26L35 38L24 30L13 38L17 26L6 18H19L24 6Z" fill="url(#srG)" opacity="0.35"/>
      <path d="M24 6L29 18H42L31 26L35 38L24 30L13 38L17 26L6 18H19L24 6Z" stroke="url(#srG)" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

/** Bottle — Detergents */
export function IconBottle() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="btG" x1="14" y1="4" x2="34" y2="44"><stop stopColor="#34D399"/><stop offset="1" stopColor="#047857"/></linearGradient></defs>
      <rect x="18" y="4" width="12" height="6" rx="2" stroke="url(#btG)" strokeWidth="2"/>
      <path d="M16 14H32V40C32 42 30 44 28 44H20C18 44 16 42 16 40V14Z" stroke="url(#btG)" strokeWidth="2.5" fill="url(#btG)" fillOpacity="0.12"/>
      <path d="M18 10H30V14H18V10Z" fill="url(#btG)" opacity="0.3"/>
      <rect x="20" y="24" width="8" height="10" rx="1" fill="url(#btG)" opacity="0.15"/>
    </svg>
  );
}

/** Flower — Softeners */
export function IconFlower() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="flG" x1="8" y1="4" x2="40" y2="44"><stop stopColor="#F9A8D4"/><stop offset="1" stopColor="#BE185D"/></linearGradient></defs>
      <circle cx="24" cy="14" r="6" fill="url(#flG)" opacity="0.25"/>
      <circle cx="16" cy="22" r="6" fill="url(#flG)" opacity="0.2"/>
      <circle cx="32" cy="22" r="6" fill="url(#flG)" opacity="0.2"/>
      <circle cx="18" cy="30" r="6" fill="url(#flG)" opacity="0.2"/>
      <circle cx="30" cy="30" r="6" fill="url(#flG)" opacity="0.2"/>
      <circle cx="24" cy="24" r="5" fill="url(#flG)" opacity="0.6"/>
      <line x1="24" y1="34" x2="24" y2="44" stroke="url(#flG)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 40Q24 36 28 40" stroke="url(#flG)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

/** Bubbles — Stain Removers */
export function IconBubbles() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="buG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#67E8F9"/><stop offset="1" stopColor="#0891B2"/></linearGradient></defs>
      <circle cx="20" cy="20" r="10" stroke="url(#buG)" strokeWidth="2.5" fill="url(#buG)" fillOpacity="0.12"/>
      <circle cx="34" cy="14" r="6" stroke="url(#buG)" strokeWidth="2" fill="url(#buG)" fillOpacity="0.1"/>
      <circle cx="32" cy="34" r="8" stroke="url(#buG)" strokeWidth="2" fill="url(#buG)" fillOpacity="0.1"/>
      <circle cx="14" cy="36" r="5" stroke="url(#buG)" strokeWidth="1.5" fill="url(#buG)" fillOpacity="0.08"/>
      <path d="M16 16Q18 12 22 16" stroke="url(#buG)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

/** Leaf — Eco Range */
export function IconLeaf() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="lfG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#4ADE80"/><stop offset="1" stopColor="#166534"/></linearGradient></defs>
      <path d="M10 40C10 40 8 16 24 8C40 16 38 40 38 40" stroke="url(#lfG)" strokeWidth="2.5" strokeLinecap="round" fill="url(#lfG)" fillOpacity="0.15"/>
      <path d="M24 8V40" stroke="url(#lfG)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M24 20Q30 18 34 22" stroke="url(#lfG)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <path d="M24 28Q18 26 14 30" stroke="url(#lfG)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    </svg>
  );
}

/** Shopping Bag — Poly Bags */
export function IconShoppingBag() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="sbG" x1="8" y1="8" x2="40" y2="44"><stop stopColor="#C084FC"/><stop offset="1" stopColor="#7E22CE"/></linearGradient></defs>
      <path d="M10 16H38L36 42H12L10 16Z" stroke="url(#sbG)" strokeWidth="2.5" fill="url(#sbG)" fillOpacity="0.12"/>
      <path d="M18 16V12C18 8.7 20.7 6 24 6C27.3 6 30 8.7 30 12V16" stroke="url(#sbG)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/** Hanger */
export function IconHanger() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="hgG" x1="4" y1="8" x2="44" y2="40"><stop stopColor="#A78BFA"/><stop offset="1" stopColor="#5B21B6"/></linearGradient></defs>
      <path d="M24 8V14" stroke="url(#hgG)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="6" r="3" stroke="url(#hgG)" strokeWidth="2"/>
      <path d="M24 14L42 30H6L24 14Z" stroke="url(#hgG)" strokeWidth="2.5" strokeLinejoin="round" fill="url(#hgG)" fillOpacity="0.1"/>
      <line x1="6" y1="30" x2="42" y2="30" stroke="url(#hgG)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/** Label Tag — Tags & Labels */
export function IconLabel() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="lbG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#A78BFA"/><stop offset="1" stopColor="#6D28D9"/></linearGradient></defs>
      <rect x="6" y="12" width="36" height="24" rx="3" stroke="url(#lbG)" strokeWidth="2.5" fill="url(#lbG)" fillOpacity="0.1"/>
      <line x1="14" y1="20" x2="34" y2="20" stroke="url(#lbG)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="14" y1="26" x2="28" y2="26" stroke="url(#lbG)" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <line x1="14" y1="32" x2="22" y2="32" stroke="url(#lbG)" strokeWidth="2" strokeLinecap="round" opacity="0.2"/>
    </svg>
  );
}

/** Cube Box — Boxes */
export function IconCubeBox() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="cbG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#C084FC"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
      <rect x="8" y="8" width="32" height="32" rx="3" stroke="url(#cbG)" strokeWidth="2.5" fill="url(#cbG)" fillOpacity="0.1"/>
      <line x1="8" y1="20" x2="40" y2="20" stroke="url(#cbG)" strokeWidth="2" opacity="0.4"/>
      <line x1="20" y1="20" x2="20" y2="40" stroke="url(#cbG)" strokeWidth="2" opacity="0.3"/>
      <rect x="14" y="10" width="20" height="8" rx="1" fill="url(#cbG)" opacity="0.1"/>
    </svg>
  );
}

/** Cart — Trolleys */
export function IconCart() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="ctG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#FBBF24"/><stop offset="1" stopColor="#B45309"/></linearGradient></defs>
      <path d="M6 8H12L18 32H36L40 14H16" stroke="url(#ctG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="38" r="3" fill="url(#ctG)" opacity="0.5"/>
      <circle cx="34" cy="38" r="3" fill="url(#ctG)" opacity="0.5"/>
    </svg>
  );
}

/** Shield Cover — Covers */
export function IconShieldCover() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="scG" x1="8" y1="4" x2="40" y2="44"><stop stopColor="#FBBF24"/><stop offset="1" stopColor="#D97706"/></linearGradient></defs>
      <path d="M24 4L40 12V24C40 34 32 42 24 44C16 42 8 34 8 24V12L24 4Z" stroke="url(#scG)" strokeWidth="2.5" fill="url(#scG)" fillOpacity="0.12"/>
      <path d="M18 24L22 28L30 18" stroke="url(#scG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  );
}

/** Steam — Steamers */
export function IconSteam() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="stG" x1="8" y1="4" x2="40" y2="44"><stop stopColor="#FBBF24"/><stop offset="1" stopColor="#92400E"/></linearGradient></defs>
      <rect x="10" y="26" width="28" height="18" rx="3" stroke="url(#stG)" strokeWidth="2.5" fill="url(#stG)" fillOpacity="0.1"/>
      <path d="M16 26V22C16 18 20 16 24 16C28 16 32 18 32 22V26" stroke="url(#stG)" strokeWidth="2" opacity="0.4"/>
      <path d="M18 12Q20 6 22 12" stroke="url(#stG)" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <path d="M24 10Q26 4 28 10" stroke="url(#stG)" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <path d="M30 12Q32 6 34 12" stroke="url(#stG)" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

/** Washing drum — Washing Machines */
export function IconWashingDrum() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="wdG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#38BDF8"/><stop offset="1" stopColor="#0369A1"/></linearGradient></defs>
      <circle cx="24" cy="24" r="18" stroke="url(#wdG)" strokeWidth="2.5" fill="url(#wdG)" fillOpacity="0.08"/>
      <circle cx="24" cy="24" r="11" stroke="url(#wdG)" strokeWidth="2" fill="url(#wdG)" fillOpacity="0.12"/>
      <path d="M18 24Q21 18 24 24Q27 30 30 24" stroke="url(#wdG)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

/** Spiral — Dryers */
export function IconDryer() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="drG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#7DD3FC"/><stop offset="1" stopColor="#0284C7"/></linearGradient></defs>
      <circle cx="24" cy="24" r="18" stroke="url(#drG)" strokeWidth="2.5" fill="none"/>
      <path d="M24 10A14 14 0 0 1 38 24A10 10 0 0 1 28 34A6 6 0 0 1 18 28A4 4 0 0 1 22 24" stroke="url(#drG)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}

/** Iron — Ironing */
export function IconIron() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="irG" x1="4" y1="8" x2="44" y2="40"><stop stopColor="#38BDF8"/><stop offset="1" stopColor="#075985"/></linearGradient></defs>
      <path d="M10 34H42L38 20H22L10 34Z" stroke="url(#irG)" strokeWidth="2.5" strokeLinejoin="round" fill="url(#irG)" fillOpacity="0.12"/>
      <path d="M22 20V12H34V20" stroke="url(#irG)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="10" y1="34" x2="42" y2="34" stroke="url(#irG)" strokeWidth="2.5"/>
      <path d="M14 28Q16 24 20 28" stroke="url(#irG)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

/** Ruler — Folders / Layout Design */
export function IconRuler() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="ruG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#38BDF8"/><stop offset="1" stopColor="#0369A1"/></linearGradient></defs>
      <rect x="4" y="16" width="40" height="16" rx="2" stroke="url(#ruG)" strokeWidth="2.5" fill="url(#ruG)" fillOpacity="0.1"/>
      <line x1="12" y1="16" x2="12" y2="22" stroke="url(#ruG)" strokeWidth="1.5" opacity="0.4"/>
      <line x1="20" y1="16" x2="20" y2="24" stroke="url(#ruG)" strokeWidth="1.5" opacity="0.5"/>
      <line x1="28" y1="16" x2="28" y2="22" stroke="url(#ruG)" strokeWidth="1.5" opacity="0.4"/>
      <line x1="36" y1="16" x2="36" y2="24" stroke="url(#ruG)" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

/** Monitor Screen — POS Systems */
export function IconMonitor() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="mnG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#4338CA"/></linearGradient></defs>
      <rect x="6" y="6" width="36" height="24" rx="3" stroke="url(#mnG)" strokeWidth="2.5" fill="url(#mnG)" fillOpacity="0.1"/>
      <line x1="20" y1="34" x2="28" y2="34" stroke="url(#mnG)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="30" x2="24" y2="34" stroke="url(#mnG)" strokeWidth="2.5"/>
      <rect x="12" y="12" width="10" height="6" rx="1" fill="url(#mnG)" opacity="0.2"/>
      <line x1="12" y1="22" x2="36" y2="22" stroke="url(#mnG)" strokeWidth="1.5" opacity="0.25"/>
    </svg>
  );
}

/** Barcode */
export function IconBarcode() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="bcG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#3730A3"/></linearGradient></defs>
      <rect x="8" y="8" width="32" height="32" rx="3" stroke="url(#bcG)" strokeWidth="2" fill="url(#bcG)" fillOpacity="0.06"/>
      <line x1="14" y1="14" x2="14" y2="34" stroke="url(#bcG)" strokeWidth="3" opacity="0.6"/>
      <line x1="20" y1="14" x2="20" y2="34" stroke="url(#bcG)" strokeWidth="2" opacity="0.4"/>
      <line x1="24" y1="14" x2="24" y2="34" stroke="url(#bcG)" strokeWidth="3" opacity="0.6"/>
      <line x1="28" y1="14" x2="28" y2="34" stroke="url(#bcG)" strokeWidth="1.5" opacity="0.35"/>
      <line x1="32" y1="14" x2="32" y2="34" stroke="url(#bcG)" strokeWidth="3" opacity="0.5"/>
    </svg>
  );
}

/** Disk — Software */
export function IconDisk() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="dkG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#4F46E5"/></linearGradient></defs>
      <rect x="6" y="4" width="36" height="40" rx="3" stroke="url(#dkG)" strokeWidth="2.5" fill="url(#dkG)" fillOpacity="0.1"/>
      <rect x="14" y="4" width="20" height="14" rx="1" fill="url(#dkG)" opacity="0.15"/>
      <rect x="26" y="8" width="6" height="6" rx="1" fill="url(#dkG)" opacity="0.25"/>
      <circle cx="24" cy="32" r="5" stroke="url(#dkG)" strokeWidth="2" fill="none" opacity="0.35"/>
    </svg>
  );
}

/** Camera — Cameras */
export function IconCamera() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="cmG" x1="4" y1="8" x2="44" y2="40"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#4338CA"/></linearGradient></defs>
      <path d="M6 16H42V38C42 40 40 42 38 42H10C8 42 6 40 6 38V16Z" stroke="url(#cmG)" strokeWidth="2.5" fill="url(#cmG)" fillOpacity="0.1"/>
      <path d="M16 16L20 8H28L32 16" stroke="url(#cmG)" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="24" cy="28" r="7" stroke="url(#cmG)" strokeWidth="2.5" fill="url(#cmG)" fillOpacity="0.1"/>
      <circle cx="24" cy="28" r="3" fill="url(#cmG)" opacity="0.3"/>
    </svg>
  );
}

/** Briefcase — Franchise Consulting */
export function IconBriefcase() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="bfG" x1="4" y1="8" x2="44" y2="44"><stop stopColor="#FB7185"/><stop offset="1" stopColor="#9F1239"/></linearGradient></defs>
      <rect x="6" y="16" width="36" height="24" rx="3" stroke="url(#bfG)" strokeWidth="2.5" fill="url(#bfG)" fillOpacity="0.1"/>
      <path d="M18 16V12C18 10 19 8 22 8H26C29 8 30 10 30 12V16" stroke="url(#bfG)" strokeWidth="2.5"/>
      <line x1="6" y1="26" x2="42" y2="26" stroke="url(#bfG)" strokeWidth="2" opacity="0.3"/>
      <rect x="20" y="22" width="8" height="8" rx="1.5" fill="url(#bfG)" opacity="0.2"/>
    </svg>
  );
}

/** Blueprint — Turnkey Plant Setup */
export function IconBlueprint() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="bpG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#FB7185"/><stop offset="1" stopColor="#BE123C"/></linearGradient></defs>
      <rect x="6" y="6" width="36" height="36" rx="3" stroke="url(#bpG)" strokeWidth="2.5" fill="url(#bpG)" fillOpacity="0.08"/>
      <line x1="6" y1="18" x2="42" y2="18" stroke="url(#bpG)" strokeWidth="1.5" opacity="0.3"/>
      <line x1="6" y1="30" x2="42" y2="30" stroke="url(#bpG)" strokeWidth="1.5" opacity="0.3"/>
      <line x1="18" y1="6" x2="18" y2="42" stroke="url(#bpG)" strokeWidth="1.5" opacity="0.3"/>
      <line x1="30" y1="6" x2="30" y2="42" stroke="url(#bpG)" strokeWidth="1.5" opacity="0.3"/>
      <rect x="20" y="20" width="8" height="8" fill="url(#bpG)" opacity="0.2"/>
    </svg>
  );
}

/** Package Stack — Commercial Packages */
export function IconPackageStack() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={s}>
      <defs><linearGradient id="psG" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#FB7185"/><stop offset="1" stopColor="#BE123C"/></linearGradient></defs>
      <rect x="8" y="24" width="32" height="18" rx="2" stroke="url(#psG)" strokeWidth="2.5" fill="url(#psG)" fillOpacity="0.12"/>
      <line x1="24" y1="24" x2="24" y2="42" stroke="url(#psG)" strokeWidth="1.5" opacity="0.3"/>
      <line x1="8" y1="33" x2="40" y2="33" stroke="url(#psG)" strokeWidth="1.5" opacity="0.25"/>
      <rect x="12" y="12" width="24" height="12" rx="2" stroke="url(#psG)" strokeWidth="2" fill="url(#psG)" fillOpacity="0.08"/>
      <line x1="24" y1="12" x2="24" y2="24" stroke="url(#psG)" strokeWidth="1.5" opacity="0.2"/>
    </svg>
  );
}
