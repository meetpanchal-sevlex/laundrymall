"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  IconAllProducts,
  IconChemicals,
  IconPackaging,
  IconAccessories,
  IconMachinery,
  IconTechnology,
  IconLaundrySetup,
} from "./icons/CategoryIcons";

const CATEGORIES = [
  {
    name: "All Products",
    subtitle: "Complete B2B Catalog",
    href: "/products",
    icon: <IconAllProducts />,
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/60",
    ring: "ring-blue-200/60 hover:ring-blue-400",
  },
  {
    name: "Chemicals",
    subtitle: "Detergents & Softeners",
    href: "/products?category=Detergent+Chemicals",
    icon: <IconChemicals />,
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60",
    ring: "ring-emerald-200/60 hover:ring-emerald-400",
  },
  {
    name: "Packaging",
    subtitle: "Rolls & Garment Covers",
    href: "/products?category=Packaging+Materials",
    icon: <IconPackaging />,
    bg: "bg-gradient-to-br from-purple-50 to-purple-100/60",
    ring: "ring-purple-200/60 hover:ring-purple-400",
  },
  {
    name: "Accessories",
    subtitle: "Tags, Pins & Hangers",
    href: "/products?category=Accessories",
    icon: <IconAccessories />,
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/60",
    ring: "ring-amber-200/60 hover:ring-amber-400",
  },
  {
    name: "Machinery",
    subtitle: "Commercial Washers & Dryers",
    href: "/products?category=Machinery",
    icon: <IconMachinery />,
    bg: "bg-gradient-to-br from-sky-50 to-sky-100/60",
    ring: "ring-sky-200/60 hover:ring-sky-400",
  },
  {
    name: "Technology",
    subtitle: "POS Billing & RFID",
    href: "/products?category=Technology",
    icon: <IconTechnology />,
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/60",
    ring: "ring-indigo-200/60 hover:ring-indigo-400",
  },
  {
    name: "Laundry Setup",
    subtitle: "Turnkey Plants & Consulting",
    href: "/products?category=Laundry+Setup",
    icon: <IconLaundrySetup />,
    bg: "bg-gradient-to-br from-rose-50 to-rose-100/60",
    ring: "ring-rose-200/60 hover:ring-rose-400",
    isNew: true,
  },
];

export default function CategoryFlow() {
  return (
    <section className="bg-white pt-3 pb-2 border-b border-gray-100">
      <div className="px-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
              Explore Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            All Products →
          </Link>
        </div>

        {/* Static scrollable row */}
        <div
          className="flex gap-4 overflow-x-auto hide-scrollbar pt-1 pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex-shrink-0 flex flex-col items-center w-[72px] sm:w-20 md:w-24 group"
            >
              <div className="relative mt-1">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl ${cat.bg} flex items-center justify-center p-3 sm:p-3.5 md:p-4 ring-2 ${cat.ring} transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-gray-200/60`}
                >
                  {cat.icon}
                </div>

                {cat.isNew && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <Sparkles className="w-2 h-2" /> NEW
                  </span>
                )}
              </div>

              <span className="mt-2 text-[11px] sm:text-xs font-bold text-gray-800 text-center leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[9px] text-gray-400 text-center hidden md:block mt-0.5 line-clamp-1">
                {cat.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
