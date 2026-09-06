import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles, MapPin, Zap, ArrowRight, Tag, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";
import ZeptoFloatingCart from "@/components/ZeptoFloatingCart";

const CATEGORIES = [
  { name: "Machinery", href: "/products?category=Machinery", icon: "⚙️", bg: "bg-[#FFF2E8]", border: "border-[#FFD8BF]" },
  { name: "Chemicals", href: "/products?category=Detergent+Chemicals", icon: "🧪", bg: "bg-[#E6F7FF]", border: "border-[#BAE7FF]" },
  { name: "Packaging", href: "/products?category=Packaging+Materials", icon: "📦", bg: "bg-[#FFFBE6]", border: "border-[#FFE58F]" },
  { name: "Accessories", href: "/products?category=Accessories", icon: "🔧", bg: "bg-[#F9F0FF]", border: "border-[#EFDBFF]" },
  { name: "Technology", href: "/products?category=Technology", icon: "💻", bg: "bg-[#FFF0F6]", border: "border-[#FFD6E7]" },
  { name: "B2B Deals", href: "/products", icon: "🏷️", bg: "bg-[#F6FFED]", border: "border-[#D9F7BE]" },
];

const RIGHT_FIT_DEALS = [
  {
    title: "Industrial Spotters",
    tag: "UPTO 40% OFF",
    desc: "Rust, ink, blood & oil removers",
    href: "/products?category=Detergent+Chemicals",
    bg: "bg-[#F0F5FF]",
    border: "border-[#ADC6FF]",
    emoji: "🧪",
  },
  {
    title: "Commercial Machinery",
    tag: "FACTORY DIRECT",
    desc: "Hydro-extractors & boilers",
    href: "/products?category=Machinery",
    bg: "bg-[#FFF7E6]",
    border: "border-[#FFD591]",
    emoji: "⚙️",
  },
  {
    title: "Garment Packaging",
    tag: "BULK DISCOUNTS",
    desc: "Poly rolls, hangers & tags",
    href: "/products?category=Packaging+Materials",
    bg: "bg-[#FCFFE6]",
    border: "border-[#EAFF8F]",
    emoji: "📦",
  },
  {
    title: "Eco Formulations",
    tag: "ISO CERTIFIED",
    desc: "Safe fabric dry clean solvents",
    href: "/products?category=Detergent+Chemicals",
    bg: "bg-[#F6FFED]",
    border: "border-[#B7EB8F]",
    emoji: "🌿",
  },
];

export default async function Home() {
  const products = await getCachedFrontendProducts();
  const bestSellers = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] pb-24 text-gray-900">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        
        {/* 1. Zepto Top Header Bar (Location + Dispatch Speed) */}
        <div className="pt-4 pb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 tracking-tight">
              <Zap className="w-4 h-4 fill-[#E80071] text-[#E80071]" />
              <span className="text-sm font-black">24-48 Hours Dispatch</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 cursor-pointer hover:text-gray-800 transition">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>Delivering across All India</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs">
              ⚡ B2B Verified
            </span>
          </div>
        </div>

        {/* 2. Zepto Search Bar */}
        <div className="mt-3">
          <form action="/products" method="GET">
            <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-4 py-3.5 gap-3 shadow-xs focus-within:border-[#E80071] transition">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                name="search"
                type="text"
                placeholder='Search "Perc Alternative", "Dry Cleaning Spotters", "Machinery"...'
                className="bg-transparent flex-1 text-sm outline-none text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
          </form>
        </div>

        {/* 3. Zepto Promotional Bento Banner (As seen in reference video) */}
        <section className="mt-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#FFF0F6] via-[#FFF7E6] to-[#E6F7FF] p-5 sm:p-7 border border-pink-100/80 shadow-xs relative overflow-hidden">
            {/* Header tag */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-gray-900">
                  Power Commercial Deals
                </h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E80071] bg-white px-2.5 py-1 rounded-full border border-pink-200">
                Verified B2B
              </span>
            </div>

            {/* 2x2 Deal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RIGHT_FIT_DEALS.map((deal, idx) => (
                <Link
                  key={idx}
                  href={deal.href}
                  className={`rounded-2xl ${deal.bg} ${deal.border} border p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <div>
                    <span className="text-3xl block mb-2">{deal.emoji}</span>
                    <span className="text-[10px] font-black text-[#E80071] bg-white px-2 py-0.5 rounded-md shadow-2xs inline-block mb-1">
                      {deal.tag}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {deal.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 font-medium line-clamp-1">
                    {deal.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. "Explore Categories" Tiles (Exact Zepto Mobile Style) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base sm:text-lg font-black tracking-tight text-gray-900">
              Explore Categories
            </h3>
            <Link href="/products" className="text-xs font-bold text-[#E80071] hover:underline flex items-center gap-0.5">
              See All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-[#E80071] hover:shadow-sm transition-all duration-200 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.border} border flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#E80071] transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Best Sellers Section (Zepto Clean Product Cards) */}
        <section className="mt-8 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-50 text-orange-500">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[#E80071] text-xs font-bold flex items-center gap-0.5 hover:underline"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-100">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div key={product.id} className="hover:bg-pink-50/20 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 text-xs">
                Products loading from Medusa backend...
              </div>
            )}
          </div>
        </section>

        {/* 6. Value Picks & New Arrivals */}
        <section className="mt-8 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                Value Picks &amp; Machinery
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[#E80071] text-xs font-bold flex items-center gap-0.5 hover:underline"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-100">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product.id} className="hover:bg-pink-50/20 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 text-xs">
                More products coming soon!
              </div>
            )}
          </div>
        </section>

        {/* 7. Bottom Trust Strip (Zepto Clean Guarantee) */}
        <section className="mt-8 mb-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">24-48h Dispatch</h4>
                <p className="text-[10px] text-gray-500">Pan-India air &amp; surface logistics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧾</span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">100% GST Invoicing</h4>
                <p className="text-[10px] text-gray-500">Full Input Tax Credit claimable</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">7-Day Guarantee</h4>
                <p className="text-[10px] text-gray-500">Transit damage replacement</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 8. Floating Bottom Cart Bar (Exact Zepto video behavior) */}
      <ZeptoFloatingCart />
    </div>
  );
}
