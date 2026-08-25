"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  {
    name: "Popular",
    icon: "⭐",
    href: "/products",
    subcategories: [
      { name: "Best Sellers", icon: "🏆", href: "/products?sort=popular" },
      { name: "New Arrivals", icon: "✨", href: "/products?sort=new" },
      { name: "On Sale", icon: "🏷️", href: "/products?sale=true" },
      { name: "Top Rated", icon: "⭐", href: "/products?sort=rating" },
    ],
  },
  {
    name: "Machinery",
    icon: "⚙️",
    href: "/products?category=Machinery",
    subcategories: [
      { name: "Washing Machines", icon: "🫧", href: "/products?category=Machinery&q=washing" },
      { name: "Dryers", icon: "🌀", href: "/products?category=Machinery&q=dryer" },
      { name: "Ironing", icon: "♨️", href: "/products?category=Machinery&q=iron" },
      { name: "Folders", icon: "📐", href: "/products?category=Machinery&q=folder" },
    ],
  },
  {
    name: "Chemicals",
    icon: "🧪",
    href: "/products?category=Detergent+Chemicals",
    subcategories: [
      { name: "Detergents", icon: "🧴", href: "/products?category=Chemicals&q=detergent" },
      { name: "Softeners", icon: "🌸", href: "/products?category=Chemicals&q=softener" },
      { name: "Stain Removers", icon: "🫧", href: "/products?category=Chemicals&q=stain" },
      { name: "Eco Range", icon: "🌱", href: "/products?category=Chemicals&q=eco" },
    ],
  },
  {
    name: "Packaging",
    icon: "📦",
    href: "/products?category=Packaging+Materials",
    subcategories: [
      { name: "Poly Bags", icon: "🛍️", href: "/products?category=Packaging&q=poly" },
      { name: "Hangers", icon: "🪝", href: "/products?category=Packaging&q=hanger" },
      { name: "Tags & Labels", icon: "🏷️", href: "/products?category=Packaging&q=tag" },
      { name: "Boxes", icon: "📫", href: "/products?category=Packaging&q=box" },
    ],
  },
  {
    name: "Accessories",
    icon: "🔧",
    href: "/products?category=Accessories",
    subcategories: [
      { name: "Hangers", icon: "🪝", href: "/products?category=Accessories&q=hanger" },
      { name: "Trolleys", icon: "🛒", href: "/products?category=Accessories&q=trolley" },
      { name: "Covers", icon: "🫙", href: "/products?category=Accessories&q=cover" },
      { name: "Steamers", icon: "♨️", href: "/products?category=Accessories&q=steamer" },
    ],
  },
  {
    name: "Technology",
    icon: "💻",
    href: "/products?category=Technology",
    subcategories: [
      { name: "POS Systems", icon: "🖥️", href: "/products?category=Technology&q=pos" },
      { name: "Barcode", icon: "📊", href: "/products?category=Technology&q=barcode" },
      { name: "Software", icon: "💾", href: "/products?category=Technology&q=software" },
      { name: "Cameras", icon: "📷", href: "/products?category=Technology&q=camera" },
    ],
  },
];

export default function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-[90vw] max-w-sm bg-white flex flex-col md:hidden animate-in slide-in-from-left duration-200">

        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-500">
            <X className="w-5 h-5" />
          </button>
          <Link href="/" onClick={onClose} className="text-2xl font-black text-blue-600">
            Laundry<span className="text-gray-900">Mall</span>
          </Link>
        </div>

        {/* Two-column layout — exactly like Meesho */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left sidebar — category list */}
          <div className="w-[90px] bg-gray-50 border-r border-gray-100 overflow-y-auto flex-shrink-0">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={`w-full flex flex-col items-center gap-1.5 py-4 px-2 text-center transition-colors ${
                  activeCategory === i
                    ? "bg-white border-l-4 border-blue-600 text-blue-600"
                    : "text-gray-600 border-l-4 border-transparent"
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-semibold leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Right panel — sub-categories */}
          <div className="flex-1 overflow-y-auto bg-white px-3 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              {CATEGORIES[activeCategory].name}
            </p>

            {/* View All link */}
            <Link
              href={CATEGORIES[activeCategory].href}
              onClick={onClose}
              className="flex items-center gap-3 p-2.5 mb-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm"
            >
              <span className="text-xl">{CATEGORIES[activeCategory].icon}</span>
              All {CATEGORIES[activeCategory].name}
            </Link>

            {/* Sub-categories grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {CATEGORIES[activeCategory].subcategories.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors text-center"
                >
                  <span className="text-3xl">{sub.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 leading-tight">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="border-t border-gray-100 px-4 py-3 flex gap-4">
          <Link href="/login" onClick={onClose} className="flex-1 text-center text-sm font-bold text-blue-600 py-2 border border-blue-600 rounded-lg">
            Login
          </Link>
          <Link href="/signup" onClick={onClose} className="flex-1 text-center text-sm font-bold text-white bg-blue-600 py-2 rounded-lg">
            Sign Up
          </Link>
        </div>

      </div>
    </>
  );
}
