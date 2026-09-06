import Link from "next/link";
import { Search, ChevronRight, Flame, Sparkles, ShieldCheck, Truck, ReceiptText, Wrench, Award, CheckCircle2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";
import { Marquee } from "@/components/ui/Marquee";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const CATEGORIES = [
  { name: "All Products", href: "/products", icon: "🏪", color: "bg-blue-50 text-blue-600" },
  { name: "Machinery", href: "/products?category=Machinery", icon: "⚙️", color: "bg-orange-50 text-orange-600" },
  { name: "Chemicals", href: "/products?category=Detergent+Chemicals", icon: "🧪", color: "bg-emerald-50 text-emerald-600" },
  { name: "Packaging", href: "/products?category=Packaging+Materials", icon: "📦", color: "bg-amber-50 text-amber-600" },
  { name: "Accessories", href: "/products?category=Accessories", icon: "🔧", color: "bg-purple-50 text-purple-600" },
  { name: "Technology", href: "/products?category=Technology", icon: "💻", color: "bg-rose-50 text-rose-600" },
];

const LOGISTICS_PARTNERS = [
  { icon: "🚚", label: "Delhivery Commercial Logistics" },
  { icon: "✈️", label: "Blue Dart Express Air Cargo" },
  { icon: "🚛", label: "V-Trans Pan-India Surface Freight" },
  { icon: "🧾", label: "100% Verified GST Tax Invoices" },
  { icon: "📦", label: "Hazardous Chemical Certified Packing" },
  { icon: "🛡️", label: "Original OEM Manufacturer Warranty" },
  { icon: "⚡", label: "24-48h Guaranteed Dispatch" },
  { icon: "🔒", label: "PCI-DSS Level 1 Razorpay Security" },
];

export default async function Home() {
  const products = await getCachedFrontendProducts();
  const bestSellers = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Mobile Search Bar */}
        <div className="md:hidden pt-3 pb-2">
          <form action="/products" method="GET">
            <div className="flex items-center bg-white border border-gray-200/80 rounded-2xl px-4 py-3 gap-3 shadow-xs">
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

        {/* Hero Section — Ultra Premium B2B Banner */}
        <section className="pt-4 md:pt-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
            {/* Ambient Radial Gradient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-radial from-cyan-500/15 to-transparent blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/15 backdrop-blur-md mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>India&apos;s Dedicated B2B Dry Cleaning &amp; Laundry Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Commercial Machinery &amp; Industrial Formulations.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Direct wholesale supply for commercial laundries, dry cleaning chains, hospitals, and institutional facilities with pan-India insured freight.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products?category=Machinery"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
                >
                  Explore Machinery <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=Detergent+Chemicals"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition inline-flex items-center gap-2"
                >
                  Chemical Solutions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Logistics Marquee */}
        <section className="mt-8 py-3 rounded-2xl bg-white border border-gray-200/70 shadow-2xs overflow-hidden">
          <Marquee pauseOnHover className="[--duration:32s]">
            {LOGISTICS_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-gray-50 border border-gray-200/60 shrink-0"
              >
                <span className="text-base">{partner.icon}</span>
                <span className="text-xs font-semibold tracking-tight text-gray-700">
                  {partner.label}
                </span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* Category Navigation */}
        <section className="mt-8">
          <div className="flex md:justify-center gap-4 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-blue-400 hover:shadow-sm transition-all duration-200 w-24 sm:w-28 text-center"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="mt-10 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Best Sellers</h2>
                <p className="text-xs text-gray-500 mt-0.5">High-demand equipment and detergents across commercial chains</p>
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
                <div key={product.id} className="hover:bg-gray-50/50 transition-colors">
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

        {/* New Arrivals Section */}
        <section className="mt-8 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">New Arrivals &amp; Machinery</h2>
                <p className="text-xs text-gray-500 mt-0.5">Latest industrial releases and specialized spotting agents</p>
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
                <div key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <ProductCard product={product} compact />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400">
                <p className="font-medium text-sm">More specialized commercial items arriving weekly.</p>
              </div>
            )}
          </div>
        </section>

        {/* Enterprise Value Pillars — The Bento Grid */}
        <section className="mt-14 mb-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Industrial Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mt-3">
              Why Commercial Laundries Choose LaundryMall
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Engineered specifically for high-capacity industrial dry cleaning and wet cleaning operations.
            </p>
          </div>

          <BentoGrid>
            <BentoCard
              className="md:col-span-2"
              header={
                <SpotlightCard className="h-44 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100/80">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Certified Formulations</span>
                  <h4 className="text-xl font-bold text-gray-900 mt-1">Industrial Chemical Stability</h4>
                  <p className="text-xs text-gray-600 mt-1 max-w-md">
                    Professional stain removal spotters, perc alternatives, and concentrated emulsifiers engineered to preserve fabric tensile strength.
                  </p>
                </SpotlightCard>
              }
              icon={<Award className="w-6 h-6" />}
              title="Tested Over 10,000+ Wash Cycles"
              description="Our chemicals undergo strict laboratory testing to ensure zero color bleeding and maximum soil release."
            />

            <BentoCard
              header={
                <div className="h-44 rounded-xl bg-gray-50 border border-gray-100 p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Dispatch
                  </div>
                  <div>
                    <span className="text-2xl font-black text-gray-900">24-48h</span>
                    <p className="text-xs text-gray-500 mt-0.5">Average dispatch turnaround</p>
                  </div>
                </div>
              }
              icon={<Truck className="w-6 h-6" />}
              title="Pan-India Logistics Freight"
              description="Dedicated surface and air transport partners for commercial delivery across all industrial corridors."
            />

            <BentoCard
              header={
                <div className="h-44 rounded-xl bg-gray-50 border border-gray-100 p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
                    <ReceiptText className="w-4 h-4" /> ITC Eligible
                  </div>
                  <div>
                    <span className="text-2xl font-black text-gray-900">100%</span>
                    <p className="text-xs text-gray-500 mt-0.5">Input Tax Credit Invoices</p>
                  </div>
                </div>
              }
              icon={<ReceiptText className="w-6 h-6" />}
              title="Direct GST Tax Invoicing"
              description="Every commercial purchase includes a verified GSTIN tax invoice so your business claims full tax credits."
            />

            <BentoCard
              className="md:col-span-2"
              header={
                <SpotlightCard className="h-44 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-white border border-slate-800">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Heavy Equipment Freight</span>
                  <h4 className="text-xl font-bold text-white mt-1">Full Factory OEM Warranties</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    Hydro-extractors, commercial dryers, spotting tables, and steam boilers with insured door-to-door transit.
                  </p>
                </SpotlightCard>
              }
              icon={<Wrench className="w-6 h-6" />}
              title="Dedicated Machinery Technical Support"
              description="Access to manufacturer maintenance manuals, electrical spare parts, and layout planning assistance."
            />
          </BentoGrid>
        </section>
      </div>
    </div>
  );
}
