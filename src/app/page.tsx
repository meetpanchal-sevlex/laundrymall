import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles, ShieldCheck, Truck, FileText, BadgePercent } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const CATEGORIES = [
  { name: "All", href: "/products", icon: "🏪", color: "bg-blue-50" },
  { name: "Machinery", href: "/products?category=Machinery", icon: "⚙️", color: "bg-orange-50" },
  { name: "Chemicals", href: "/products?category=Detergent+Chemicals", icon: "🧪", color: "bg-green-50" },
  { name: "Packaging", href: "/products?category=Packaging+Materials", icon: "📦", color: "bg-yellow-50" },
  { name: "Accessories", href: "/products?category=Accessories", icon: "🔧", color: "bg-purple-50" },
  { name: "Technology", href: "/products?category=Technology", icon: "💻", color: "bg-red-50" },
];

const BANNERS = [
  { title: "Wholesale Machinery", subtitle: "Heavy-duty commercial washers & dryers", color: "from-blue-600 via-blue-700 to-indigo-800", emoji: "⚙️", href: "/products?category=Machinery" },
  { title: "Eco Chemicals", subtitle: "ISO certified bulk detergents & softeners", color: "from-emerald-600 via-teal-700 to-emerald-900", emoji: "🧪", href: "/products?category=Detergent+Chemicals" },
  { title: "Smart Packaging", subtitle: "Rolls, polybags & branded garment covers", color: "from-purple-600 via-indigo-700 to-purple-900", emoji: "📦", href: "/products?category=Packaging+Materials" },
  { title: "Industrial Supplies", subtitle: "Tagging guns, pins, hangers & accessories", color: "from-amber-600 via-orange-600 to-rose-700", emoji: "🔧", href: "/products?category=Accessories" },
];

const WHY_US = [
  { icon: "🚚", title: "Pan India Delivery", sub: "Fast shipping to all outlets" },
  { icon: "✅", title: "ISO Certified", sub: "Guaranteed quality products" },
  { icon: "💰", title: "Wholesale Pricing", sub: "Best rates for bulk orders" },
  { icon: "🛡️", title: "Easy Returns", sub: "7-day hassle-free policy" },
];

export default async function Home() {
  const products = await getCachedFrontendProducts();
  const bestSellers = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Mobile Search Bar */}
        <div className="md:hidden bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
          <form action="/products" method="GET">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-3">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                name="search"
                type="text"
                placeholder="Search for Machinery, Chemicals..."
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>

        {/* Moving Featured Hero Banners (Animate UI / Inspire UI Marquee) */}
        <section className="pt-3 md:pt-6 pb-2 overflow-hidden select-none">
          <Marquee pauseOnHover className="[--duration:34s] [--gap:1.25rem] py-1">
            {BANNERS.map((b, i) => (
              <Link
                key={i}
                href={b.href}
                className={`flex-shrink-0 w-[290px] sm:w-[350px] md:w-[390px] rounded-2xl bg-gradient-to-r ${b.color} text-white p-5 sm:p-6 flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">Featured</p>
                  </div>
                  <h3 className="text-lg md:text-xl font-black leading-tight tracking-tight">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-white/85 mt-1 leading-snug line-clamp-1">{b.subtitle}</p>
                  <div className="mt-4 bg-white text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-sm transition-transform hover:scale-105">
                    Shop Now <ChevronRight className="w-3 h-3 text-blue-600" />
                  </div>
                </div>
                <span className="text-5xl sm:text-6xl drop-shadow-md select-none transform transition-transform group-hover:scale-110 ml-2">{b.emoji}</span>
              </Link>
            ))}
          </Marquee>
        </section>

        {/* Infinite Trust Marquee (Inspire UI / Magic UI) */}
        <div className="my-3 mx-4 rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur-md shadow-xs overflow-hidden">
          <Marquee pauseOnHover className="[--duration:26s] py-2 text-xs sm:text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2 mx-4 text-gray-800"><Truck className="w-4 h-4 text-blue-600" /> Pan-India Commercial Freight</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-4 text-gray-800"><FileText className="w-4 h-4 text-blue-600" /> GST Input Tax Credit Invoices</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-4 text-gray-800"><ShieldCheck className="w-4 h-4 text-blue-600" /> Heavy-Duty Industrial Machinery</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-4 text-gray-800"><BadgePercent className="w-4 h-4 text-blue-600" /> Wholesale B2B Tier Pricing</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-4 text-gray-800"><Truck className="w-4 h-4 text-blue-600" /> Direct Manufacturer Dispatch</span>
            <span className="text-gray-300">•</span>
          </Marquee>
        </div>

        {/* Category Icons — Meesho style */}
        <section className="bg-white md:bg-transparent mt-2 md:mt-6 py-4 md:py-0 border-t border-gray-100 md:border-none">
          <div className="flex md:justify-center gap-6 px-4 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className="flex-shrink-0 flex flex-col items-center gap-3 w-16 md:w-24 group">
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full ${cat.color} flex items-center justify-center text-2xl md:text-4xl shadow-sm border border-white group-hover:shadow-md group-hover:scale-105 transition-all`}>
                  {cat.icon}
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mt-2 md:mt-10 bg-white md:rounded-2xl md:shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-base md:text-xl font-black text-gray-900">Best Sellers</h2>
            </div>
            <Link href="/products" className="text-blue-600 text-sm font-bold flex items-center gap-0.5 hover:text-blue-700">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-gray-100">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div key={product.id} className="border-r border-b border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 lg:col-span-6 py-16 text-center text-gray-400">
                <p className="text-4xl mb-3">🛍️</p>
                <p className="font-medium">Add products from your Medusa admin!</p>
                <Link href="/products" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2 rounded-full transition-colors">
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mt-2 md:mt-8 bg-white md:rounded-2xl md:shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-base md:text-xl font-black text-gray-900">New Arrivals</h2>
            </div>
            <Link href="/products" className="text-blue-600 text-sm font-bold flex items-center gap-0.5 hover:text-blue-700">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-gray-100">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product.id} className="border-r border-b border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 lg:col-span-6 py-12 text-center text-gray-400">
                <p className="font-medium text-sm">More products coming soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Why LaundryMall (Spotlight Cards from Aceternity / Animate UI) */}
        <section className="mt-4 md:mt-8 md:mb-12 bg-white md:bg-transparent px-4 py-6 md:py-0">
          <h2 className="text-base md:text-2xl font-black text-gray-900 mb-4 md:mb-6 text-center md:text-left tracking-tight">Why LaundryMall?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {WHY_US.map((item) => (
              <SpotlightCard
                key={item.title}
                className="p-4 md:p-6 flex md:flex-col md:items-center md:text-center gap-3 md:gap-4 border border-gray-200/80 bg-white"
              >
                <span className="text-2xl md:text-4xl">{item.icon}</span>
                <div>
                  <p className="text-sm md:text-base font-bold text-gray-900 tracking-tight">{item.title}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 leading-relaxed">{item.sub}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
