import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles, Truck, ReceiptText, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";

const CATEGORIES = [
  { name: "All Products", href: "/products", icon: "🏪", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "Machinery", href: "/products?category=Machinery", icon: "⚙️", color: "bg-orange-50 text-orange-600 border-orange-100" },
  { name: "Chemicals", href: "/products?category=Detergent+Chemicals", icon: "🧪", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "Packaging", href: "/products?category=Packaging+Materials", icon: "📦", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Accessories", href: "/products?category=Accessories", icon: "🔧", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { name: "Technology", href: "/products?category=Technology", icon: "💻", color: "bg-rose-50 text-rose-600 border-rose-100" },
];

const PROMO_BANNERS = [
  {
    tag: "FACTORY DIRECT",
    title: "Commercial Machinery",
    subtitle: "Hydro-extractors, spotting tables & commercial steam boilers",
    cta: "Explore Machinery",
    href: "/products?category=Machinery",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    emoji: "⚙️",
  },
  {
    tag: "10,000+ CYCLES TESTED",
    title: "Industrial Formulations",
    subtitle: "Concentrated dry cleaning spotters, emulsifiers & perc alternatives",
    cta: "View Chemicals",
    href: "/products?category=Detergent+Chemicals",
    gradient: "from-emerald-600 via-emerald-700 to-teal-800",
    emoji: "🧪",
  },
  {
    tag: "BULK WHOLESALE",
    title: "Packaging & Supplies",
    subtitle: "Custom garment poly rolls, wire hangers & dry cleaning tags",
    cta: "Shop Packaging",
    href: "/products?category=Packaging+Materials",
    gradient: "from-amber-600 via-amber-700 to-orange-800",
    emoji: "📦",
  },
];

const TRUST_PILLARS = [
  {
    icon: <Truck className="w-6 h-6 text-blue-600" />,
    title: "Pan-India Freight",
    desc: "Fast air & surface cargo transit to all industrial hubs",
  },
  {
    icon: <ReceiptText className="w-6 h-6 text-emerald-600" />,
    title: "100% GST Invoicing",
    desc: "Full Input Tax Credit (ITC) compliant tax invoices",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    title: "OEM Manufacturer Warranty",
    desc: "Genuine commercial equipment & spare parts assurance",
  },
  {
    icon: <Headphones className="w-6 h-6 text-purple-600" />,
    title: "B2B Technical Support",
    desc: "Guidance on machinery setup & chemical dosing",
  },
];

export default async function Home() {
  const products = await getCachedFrontendProducts();
  const bestSellers = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] pb-20 md:pb-12 text-gray-900">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Mobile Search Bar */}
        <div className="md:hidden pt-3 pb-2">
          <form action="/products" method="GET">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 gap-3 shadow-xs">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                name="search"
                type="text"
                placeholder="Search Machinery, Spotters, Detergents..."
                className="bg-transparent flex-1 text-sm outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>

        {/* 1. Hero Promo Grid — High-End Clean Marketplace (Shopify Plus / Apple Store Style) */}
        <section className="pt-4 md:pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {PROMO_BANNERS.map((banner, idx) => (
              <Link
                key={idx}
                href={banner.href}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${banner.gradient} text-white p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-white/10`}
              >
                {/* Subtle light glow overlay */}
                <div className="absolute -right-8 -bottom-8 text-7xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none">
                  {banner.emoji}
                </div>

                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md mb-3">
                    {banner.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-[240px] leading-relaxed">
                    {banner.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>{banner.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Category Quick Navigation */}
        <section className="mt-8">
          <div className="flex md:justify-center gap-3.5 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-xl ${cat.color} flex items-center justify-center text-lg border group-hover:scale-110 transition-transform duration-200`}>
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Best Sellers Section */}
        <section className="mt-8 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Best Sellers</h2>
                <p className="text-xs text-gray-500 mt-0.5">High-demand commercial supplies and detergents</p>
              </div>
            </div>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1 transition"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-100">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div key={product.id} className="hover:bg-blue-50/20 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400">
                <p className="text-4xl mb-3">🛍️</p>
                <p className="font-medium text-sm">Add products from your Medusa admin to showcase here.</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. New Arrivals & Commercial Machinery */}
        <section className="mt-8 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">New Arrivals &amp; Machinery</h2>
                <p className="text-xs text-gray-500 mt-0.5">Specialized spotting agents, machinery, and accessories</p>
              </div>
            </div>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1 transition"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-100">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product.id} className="hover:bg-blue-50/20 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400">
                <p className="font-medium text-sm">More commercial items arriving weekly.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5. Minimalist B2B Trust Pillars (Clean, Professional, Non-distracting) */}
        <section className="mt-10 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 tracking-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
