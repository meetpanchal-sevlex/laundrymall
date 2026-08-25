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
      <section className="bg-white pt-3 pb-4">
        <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar pb-1">
          {BANNERS.map((b, i) => (
            <Link
              key={i}
              href="/products"
              className={`flex-shrink-0 w-72 md:flex-1 rounded-2xl bg-gradient-to-r ${b.color} text-white p-5 flex items-center justify-between`}
            >
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">Featured</p>
                <h3 className="text-lg font-black leading-tight">{b.title}</h3>
                <p className="text-sm text-white/80 mt-1">{b.subtitle}</p>
                <div className="mt-3 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  Shop Now <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              <span className="text-5xl">{b.emoji}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Icons — Meesho style */}
      <section className="bg-white mt-2 py-4 border-t border-gray-100">
        <div className="flex gap-5 px-4 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={cat.href} className="flex-shrink-0 flex flex-col items-center gap-2 w-16">
              <div className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center text-2xl shadow-sm border border-white`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-black text-gray-900">Best Sellers</h2>
          </div>
          <Link href="/products" className="text-blue-600 text-sm font-bold flex items-center gap-0.5">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-t border-gray-100">
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))
          ) : (
            <div className="col-span-2 md:col-span-4 py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🛒</p>
              <p className="font-medium">Add products from your Medusa admin!</p>
              <Link href="/products" className="mt-4 inline-block text-blue-600 font-bold text-sm">
                Browse Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-black text-gray-900">New Arrivals</h2>
          </div>
          <Link href="/products" className="text-blue-600 text-sm font-bold flex items-center gap-0.5">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-t border-gray-100">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-gray-400">
              <p className="font-medium text-sm">More products coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why LaundryMall */}
      <section className="mt-2 bg-white px-4 py-6">
        <h2 className="text-base font-black text-gray-900 mb-4">Why LaundryMall?</h2>
        <div className="grid grid-cols-2 gap-3">
          {WHY_US.map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-3 flex gap-3 items-start">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex-1 flex flex-col items-center py-2 gap-0.5 text-blue-600">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/products" className="flex-1 flex flex-col items-center py-2 gap-0.5 text-gray-500">
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-medium">Categories</span>
        </Link>
        <Link href="/checkout" className="flex-1 flex flex-col items-center py-2 gap-0.5 text-gray-500">
          <span className="text-xl">🛒</span>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
        <Link href="/account" className="flex-1 flex flex-col items-center py-2 gap-0.5 text-gray-500">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>

    </div>
  );
}
