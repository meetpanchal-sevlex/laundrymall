import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles, ShieldCheck, Truck, FileText, BadgePercent } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import FeaturedHeroSlider from "@/components/FeaturedHeroSlider";
import CategoryFlow from "@/components/CategoryFlow";

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

        {/* Option 1: Touch-Driven Featured Hero Banner Slider */}
        <FeaturedHeroSlider />

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

        {/* Category Flow with Slow Motion, Pause on Touch & Exact Sequence */}
        <CategoryFlow />

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
