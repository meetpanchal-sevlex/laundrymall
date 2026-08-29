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
  { title: "Wholesale Machinery", subtitle: "Industrial-grade finishing & washing tech.", color: "from-blue-600 to-indigo-800", emoji: "⚙️" },
  { title: "Premium Chemicals", subtitle: "ISO certified, deep-cleaning formulations.", color: "from-emerald-600 to-teal-800", emoji: "🧪" },
  { title: "Smart Packaging", subtitle: "Heavy-duty poly rolls & hangers.", color: "from-purple-600 to-fuchsia-800", emoji: "📦" },
];

const WHY_US = [
  { icon: "🚚", title: "Pan India Delivery", sub: "Fast logistics to all your commercial outlets" },
  { icon: "✅", title: "ISO Certified", sub: "Tested & verified industrial products" },
  { icon: "💰", title: "Wholesale Pricing", sub: "Direct from manufacturer to your factory" },
  { icon: "📄", title: "GST Invoicing", sub: "Instant B2B tax-compliant billing" },
];

export default async function Home() {
  const products = await getCachedFrontendProducts();
  const bestSellers = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 md:pb-8">
      
      {/* Sleek Hero Banner Section */}
      <div className="bg-white border-b border-slate-200/60 pb-8 pt-8">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              India's Premier B2B Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] text-slate-900 mb-6 leading-[1.1]">
              Commercial Laundry Supplies, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Direct at Wholesale.</span>
            </h1>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Premium detergents, industrial packaging, and machinery. Pan-India dispatch with verified manufacturer pricing for commercial dry-cleaners.
            </p>
          </div>

          {/* Hero Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BANNERS.map((b, i) => (
              <Link
                key={i}
                href="/products"
                className={`group rounded-2xl bg-gradient-to-br ${b.color} p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-${b.color.split('-')[1]}-900/20 transition-all duration-300 min-h-[160px] overflow-hidden relative`}
              >
                <div className="absolute -right-4 -bottom-4 text-[100px] opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 rotate-[-10deg]">
                  {b.emoji}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 tracking-tight">{b.title}</h3>
                  <p className="text-sm text-white/80 font-medium">{b.subtitle}</p>
                </div>
                <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 text-white text-xs font-bold uppercase tracking-widest bg-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                  Shop Category <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Search Bar */}
        <div className="md:hidden pt-4 pb-2">
          <form action="/products" method="GET">
            <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 gap-3 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                name="search"
                type="text"
                placeholder="Search supplies, machinery..."
                className="bg-transparent flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </form>
        </div>

        {/* Category Icons */}
        <section className="mt-6 md:mt-10 mb-8">
          <div className="flex justify-start md:justify-center gap-4 overflow-x-auto hide-scrollbar pb-4 md:pb-0">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className="flex-shrink-0 flex flex-col items-center gap-3 w-[72px] md:w-28 group">
                <div className={`w-14 h-14 md:w-[72px] md:h-[72px] rounded-2xl ${cat.color} flex items-center justify-center text-2xl md:text-3xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-blue-100 transition-all duration-300`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] md:text-xs font-bold text-slate-600 text-center uppercase tracking-wider group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mb-8 bg-white md:rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Best Sellers</h2>
            </div>
            <Link href="/products" className="text-blue-600 text-sm font-bold flex items-center gap-0.5 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
              View Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-slate-100">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div key={product.id} className="border-r border-b border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 lg:col-span-6 py-16 text-center text-slate-400">
                <p className="text-4xl mb-3 opacity-50">🛍️</p>
                <p className="font-medium">Add products from your Medusa admin!</p>
                <Link href="/products" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2 rounded-full transition-colors">
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mb-12 bg-white md:rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">New Arrivals</h2>
            </div>
            <Link href="/products" className="text-blue-600 text-sm font-bold flex items-center gap-0.5 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
              Explore All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-slate-100">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product.id} className="border-r border-b border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 lg:col-span-6 py-12 text-center text-slate-400">
                <p className="font-medium text-sm">More products coming soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Why LaundryMall - Bento Grid */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">Enterprise Grade Infrastructure</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Why 500+ commercial laundries trust us for their daily supplies.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
