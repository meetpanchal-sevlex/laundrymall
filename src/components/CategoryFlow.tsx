"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, LayoutGrid, FlaskConical, Package, Tags, Factory, Laptop, Building2 } from "lucide-react";

const CATEGORIES = [
  {
    name: "All Products",
    subtitle: "Complete B2B Catalog",
    href: "/products",
    icon: <LayoutGrid className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" strokeWidth={1.5} />,
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    ring: "ring-blue-100 hover:ring-blue-300",
  },
  {
    name: "Chemicals",
    subtitle: "Detergents & Softeners",
    href: "/products?category=Detergent+Chemicals",
    icon: <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-emerald-600" strokeWidth={1.5} />,
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    ring: "ring-emerald-100 hover:ring-emerald-300",
  },
  {
    name: "Packaging",
    subtitle: "Rolls & Garment Covers",
    href: "/products?category=Packaging+Materials",
    icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-600" strokeWidth={1.5} />,
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    ring: "ring-purple-100 hover:ring-purple-300",
  },
  {
    name: "Accessories",
    subtitle: "Tags, Pins & Hangers",
    href: "/products?category=Accessories",
    icon: <Tags className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-600" strokeWidth={1.5} />,
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    ring: "ring-amber-100 hover:ring-amber-300",
  },
  {
    name: "Machinery",
    subtitle: "Commercial Washers & Dryers",
    href: "/products?category=Machinery",
    icon: <Factory className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-sky-600" strokeWidth={1.5} />,
    bg: "bg-sky-50/80",
    text: "text-sky-700",
    ring: "ring-sky-100 hover:ring-sky-300",
  },
  {
    name: "Technology",
    subtitle: "POS Billing & RFID",
    href: "/products?category=Technology",
    icon: <Laptop className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-indigo-600" strokeWidth={1.5} />,
    bg: "bg-indigo-50/80",
    text: "text-indigo-700",
    ring: "ring-indigo-100 hover:ring-indigo-300",
  },
  {
    name: "Laundry Setup",
    subtitle: "Turnkey Plants & Consulting",
    href: "/products?category=Laundry+Setup",
    icon: <Building2 className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-600" strokeWidth={1.5} />,
    bg: "bg-rose-50/80",
    text: "text-rose-700",
    ring: "ring-rose-100 hover:ring-rose-400",
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

        {/* Static scrollable row — no auto-movement */}
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
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl sm:text-3xl md:text-4xl ring-2 ${cat.ring} transition-all duration-200 group-hover:scale-105 group-hover:shadow-md`}
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
