import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";

const CATEGORIES = [
  { name: "All", href: "/products", icon: "🏪", color: "bg-blue-50" },
  { name: "Machinery", href: "/products?category=Machinery", icon: "⚙️", color: "bg-orange-50" },
  { name: "Chemicals", href: "/products?category=Detergent+Chemicals", icon: "🧪", color: "bg-green-50" },
  { name: "Packaging", href: "/products?category=Packaging+Materials", icon: "📦", color: "bg-yellow-50" },
  { name: "Accessories", href: "/products?category=Accessories", icon: "🔧", color: "bg-purple-50" },
  { name: "Technology", href: "/products?category=Technology", icon: "💻", color: "bg-red-50" },
];

const BANNERS = [
  { title: "Wholesale Machinery", subtitle: "Up to 30% off on bulk orders", color: "from-blue-600 to-blue-800", emoji: "⚙️" },
  { title: "Eco Chemicals", subtitle: "ISO certified, trusted quality", color: "from-green-600 to-green-800", emoji: "🧪" },
  { title: "Smart Packaging", subtitle: "Branded packaging solutions", color: "from-purple-600 to-purple-800", emoji: "📦" },
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
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-4">
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

        {/* Hero Banners — horizontal scroll */}
        <section className="bg-white md:bg-transparent pt-3 md:pt-6 pb-4">
          <div className="flex gap-4 px-4 overflow-x-auto hide-scrollbar pb-1 md:grid md:grid-cols-3">
            {BANNERS.map((b, i) => (
              <Link
                key={i}
                href="/products"
                className={`flex-shrink-0 w-72 md:w-full rounded-2xl bg-gradient-to-r ${b.color} text-white p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}
              >
                <div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">Featured</p>
                  <h3 className="text-lg md:text-xl font-black leading-tight">{b.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{b.subtitle}</p>
                  <div className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1 transition-colors">
                    Shop Now <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
                <span className="text-6xl drop-shadow-md">{b.emoji}</span>
              </Link>
            ))}
          </div>
        </section>

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

        {/* Why LaundryMall */}
        <section className="mt-2 md:mt-8 md:mb-12 bg-white md:bg-transparent px-4 py-6 md:py-0">
          <h2 className="text-base md:text-xl font-black text-gray-900 mb-4 md:mb-6 text-center md:text-left">Why LaundryMall?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-gray-50 md:bg-white rounded-xl md:rounded-2xl p-4 flex md:flex-col md:items-center md:text-center gap-3 md:gap-4 md:shadow-sm md:hover:shadow-md transition-shadow">
                <span className="text-2xl md:text-4xl">{item.icon}</span>
                <div>
                  <p className="text-sm md:text-base font-bold text-gray-800">{item.title}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
