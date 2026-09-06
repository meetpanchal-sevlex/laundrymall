import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search, Share2, ShieldCheck, Truck, RotateCcw, Zap, ChevronRight, Info } from "lucide-react";
import { notFound } from "next/navigation";
import ProductBottomBar from "@/components/ProductBottomBar";
import { getCachedFrontendProduct, getCachedFrontendProducts } from "@/lib/medusa-cache";
import ImageSlider from "@/components/ImageSlider";

export const revalidate = 60; // Cache for 60 seconds (ISR)

export async function generateStaticParams() {
  try {
    const products = await getCachedFrontendProducts();
    return products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getCachedFrontendProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const sliderImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-28 md:pb-12 text-gray-900">
      {/* Top Floating Mobile App Bar (Zepto Style) */}
      <div className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/50">
        <Link
          href="/products"
          className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <Link
            href="/products"
            className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Link>
          <button
            className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2">
        {/* Product Image Section with Clean Background */}
        <div className="relative rounded-3xl bg-white border border-gray-200/80 overflow-hidden shadow-xs mb-4">
          <div className="p-4 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
            <ImageSlider images={sliderImages} alt={product.name} />
          </div>

          {/* Floating Select Badge (Zepto Style) */}
          <div className="absolute top-4 right-4">
            <span className="bg-[#5C382A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">
              Select
            </span>
          </div>

          {/* Bottom Indicators */}
          <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-gray-400" /> Commercial Grade
            </span>
            <span className="font-semibold text-gray-600">
              100% Genuine Verified
            </span>
          </div>
        </div>

        {/* 1. Main Title & Price Card (Exact Zepto Layout from Image) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs mb-4">
          {/* Dispatch Speed Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200/80">
              <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
              <span>⚡ 24-48h Dispatch</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              In Stock
            </span>
          </div>

          {/* Category / Brand Breadcrumb */}
          <Link
            href={`/products?category=${encodeURIComponent(product.category || "")}`}
            className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-gray-400 hover:text-blue-600 transition mb-1.5"
          >
            <span>{product.category || "COMMERCIAL SUPPLY"}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>

          {/* Product Title (Clean Editorial Typography) */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-snug">
            {product.name}
          </h1>

          <p className="text-xs font-medium text-gray-500 mt-1">
            Commercial Packaging / Industrial Unit
          </p>

          {/* Price & MRP Row */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              ₹{product.price.toFixed(0)}
            </span>
            {product.originalPrice && (
              <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toFixed(0)} MRP
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium">
              (incl. of all taxes)
            </span>
          </div>
        </div>

        {/* 2. Key Details 2x2 Grid (Exact Match to Reference Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs mb-4">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-gray-900 mb-4">
            Key details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50/90 rounded-2xl p-4 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                BRAND
              </span>
              <span className="text-sm font-bold text-gray-900">
                LaundryMall Commercial
              </span>
            </div>

            <div className="bg-gray-50/90 rounded-2xl p-4 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                COUNTRY OF ORIGIN
              </span>
              <span className="text-sm font-bold text-gray-900">
                India
              </span>
            </div>

            <div className="bg-gray-50/90 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-700">
                <RotateCcw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  7-Day Return or Replacement
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Damaged or defective transit coverage
                </p>
              </div>
            </div>

            <div className="bg-gray-50/90 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-700">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Fast Insured Freight
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Pan-India door-to-door delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Product Description & Commercial Usage */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs mb-6">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-gray-900 mb-3">
            Product Description
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description || "Commercial grade industrial supplies engineered for high-capacity laundry and dry cleaning operations. Verified for chemical stability, fabric protection, and maximum wash cycle longevity."}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action Bar (Zepto Style) */}
      <ProductBottomBar product={product} />
    </div>
  );
}
