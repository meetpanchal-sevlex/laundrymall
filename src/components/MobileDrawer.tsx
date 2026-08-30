"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // Close the drawer if the route changes (e.g. clicking a link)
  const pathname = usePathname();
  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  // Handle scrolling the right panel when a left category is clicked
  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
    setIsManualScrolling(true);
    
    const rightPanel = rightPanelRef.current;
    if (rightPanel) {
      const section = rightPanel.querySelector(`#category-section-${index}`) as HTMLElement;
      if (section) {
        rightPanel.scrollTo({
          top: section.offsetTop - rightPanel.offsetTop,
          behavior: "smooth"
        });
      }
    }

    // Reset manual scrolling flag after scroll animation completes
    setTimeout(() => {
      setIsManualScrolling(false);
    }, 500);
  };

  // Scroll spy to update active category based on right panel scroll position
  const handleRightScroll = () => {
    if (isManualScrolling) return;

    const rightPanel = rightPanelRef.current;
    if (!rightPanel) return;

    let currentSectionIndex = 0;
    const sections = rightPanel.querySelectorAll(".category-section");

    sections.forEach((section, index) => {
      const htmlSection = section as HTMLElement;
      // If the top of the section is near the top of the scroll container
      if (htmlSection.offsetTop - rightPanel.offsetTop <= rightPanel.scrollTop + 50) {
        currentSectionIndex = index;
      }
    });

    if (currentSectionIndex !== activeCategory) {
      setActiveCategory(currentSectionIndex);
    }
  };

  return (
    <>
      {/* Backdrop (z-[100] to cover everything, including z-50 Navbar) */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-[100dvh] z-[100] w-full bg-white flex flex-col md:hidden animate-in slide-in-from-left duration-200 shadow-2xl">

        {/* Header - Meesho Style (X then Logo) */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 bg-white shadow-sm z-10">
          <button onClick={onClose} className="text-gray-600 p-1">
            <X className="w-6 h-6" />
          </button>
          <Link href="/" onClick={onClose} className="text-2xl font-black text-blue-600 tracking-tight">
            Laundry<span className="text-gray-900">Mall</span>
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left sidebar — category list */}
          <div className="w-[90px] bg-gray-50 border-r border-gray-100 overflow-y-auto flex-shrink-0 hide-scrollbar pb-10">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(i)}
                className={`w-full flex flex-col items-center gap-1.5 py-4 px-2 text-center transition-colors relative ${
                  activeCategory === i
                    ? "bg-white text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {/* Active left border indicator (Meesho uses purple, we use blue) */}
                {activeCategory === i && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                )}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  activeCategory === i ? "bg-blue-50" : "bg-white border border-gray-200"
                }`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Right panel — ALL sub-categories scrollable */}
          <div 
            ref={rightPanelRef}
            onScroll={handleRightScroll}
            className="flex-1 overflow-y-auto bg-white px-3 py-4 hide-scrollbar pb-20"
          >
            {CATEGORIES.map((cat, index) => (
              <div 
                key={cat.name} 
                id={`category-section-${index}`} 
                className="category-section mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex-1">
                    {cat.name}
                  </p>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                {/* View All link */}
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 mb-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition border border-blue-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-blue-700 font-bold text-sm">All {cat.name}</span>
                  </div>
                </Link>

                {/* Sub-categories grid */}
                <div className="grid grid-cols-2 gap-2">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={onClose}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all text-center"
                    >
                      <span className="text-3xl">{sub.icon}</span>
                      <span className="text-xs font-semibold text-gray-700 leading-tight">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
