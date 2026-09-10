import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles, Truck, FileText, ShieldCheck, BadgePercent } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import FeaturedHeroSlider from "@/components/FeaturedHeroSlider";
import CategoryFlow from "@/components/CategoryFlow";
import SearchAutocomplete from "@/components/SearchAutocomplete";

const WHY_US = [
  { icon: "🚚", title: "Pan India Delivery", sub: "Fast shipping to all outlets" },
  { icon: "✅", title: "ISO Certified", sub: "Guaranteed quality products" },
  { icon: "💰", title: "Wholesale Pricing", sub: "Best rates for bulk orders" },
  { icon: "🛡️", title: "Easy Returns", sub: "7-day hassle-free policy" },
];

export default async function Home() {
  const products = await getCachedFrontendProducts();
  const bestSellers = products.slice(0, 9);
  const newArrivals = products.slice(6, 15);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6FA] pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto w-full">

        {/* Mobile Search Bar */}
        <div className="md:hidden bg-white px-4 py-2.5 border-b border-gray-100 shadow-sm">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <SearchAutocomplete
              isMobile
              placeholder="Search Machinery, Chemicals, Setup..."
            />
          </div>
        </div>

        {/* Featured Hero Slider */}
        <FeaturedHeroSlider />

        {/* Trust Marquee */}
        <div className="my-3 mx-3 rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
          <Marquee pauseOnHover className="[--duration:26s] py-2.5 text-xs sm:text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2 mx-5 text-gray-700"><Truck className="w-4 h-4 text-blue-600" /> Pan-India Commercial Freight</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-5 text-gray-700"><FileText className="w-4 h-4 text-blue-600" /> GST Input Tax Credit Invoices</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-5 text-gray-700"><ShieldCheck className="w-4 h-4 text-blue-600" /> Heavy-Duty Industrial Machinery</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-5 text-gray-700"><BadgePercent className="w-4 h-4 text-blue-600" /> Wholesale B2B Tier Pricing</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2 mx-5 text-gray-700"><Truck className="w-4 h-4 text-blue-600" /> Direct Manufacturer Dispatch</span>
            <span className="text-gray-300">•</span>
          </Marquee>
        </div>

        {/* Category Flow */}
        <CategoryFlow />

        {/* ─── BEST SELLERS ───────────────────────────────────────────── */}
        <section className="mt-3 md:mt-8 bg-white md:mx-0 md:rounded-2xl md:shadow-sm overflow-hidden">
          {/* Section Header — eye-catching gradient accent */}
          <div className="flex items-center justify-between px-4 md:px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-sm shadow-orange-200">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight leading-none">
                  Best Sellers
                </h2>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">Top-ordered B2B products</p>
              </div>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3-col on mobile, 4 on md, 6 on lg */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-gray-100">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-3 md:col-span-4 lg:col-span-6 py-16 text-center text-gray-400">
                <p className="text-4xl mb-3">🛍️</p>
                <p className="font-medium">Add products from your Medusa admin!</p>
                <Link href="/products" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2 rounded-full transition-colors">
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── NEW ARRIVALS ────────────────────────────────────────────── */}
        <section className="mt-3 md:mt-6 bg-white md:mx-0 md:rounded-2xl md:shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shadow-purple-200">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight leading-none">
                  New Arrivals
                </h2>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">Freshly added to the catalog</p>
              </div>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-gray-100">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-3 md:col-span-4 lg:col-span-6 py-12 text-center text-gray-400">
                <p className="font-medium text-sm">More products coming soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── WHY LAUNDRYMALL ─────────────────────────────────────────── */}
        <section className="mt-4 md:mt-8 md:mb-12 bg-white md:bg-transparent px-4 py-6 md:py-0">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
            <h2 className="text-base md:text-2xl font-black text-gray-900 tracking-tight">
              Why LaundryMall?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {WHY_US.map((item) => (
              <SpotlightCard
                key={item.title}
                className="p-4 md:p-6 flex md:flex-col md:items-center md:text-center gap-3 md:gap-4 border border-gray-200/80 bg-white rounded-2xl shadow-sm"
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
