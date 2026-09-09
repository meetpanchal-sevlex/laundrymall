import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck, Star, Share2, Heart, ChevronRight, Store } from "lucide-react";
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
    
  const sliderImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  return (
    <div className="bg-gray-100 min-h-screen pb-20 md:pb-8">
      <div className="md:max-w-7xl md:mx-auto md:px-4 md:py-8">
        
        {/* Desktop Container */}
        <div className="md:flex md:gap-8 md:bg-white md:rounded-2xl md:shadow-sm md:p-8 md:overflow-hidden">
          
          {/* Left Column - Images */}
          <div className="md:w-1/2 flex-shrink-0">
            {/* Product Image Section */}
            <div className="bg-white pb-2 relative md:sticky md:top-24 md:pb-0 md:rounded-xl md:border md:border-gray-100 md:overflow-hidden">
              <ImageSlider images={sliderImages} alt={product.name} />

              {/* Meesho-style Trust Badges Banner */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-y border-blue-100 text-[10px] md:text-xs font-bold text-gray-700">
                <div className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> Mall
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" /> Original Brands
                </div>
                <div className="flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500" /> Direct From Company
                </div>
              </div>
            </div>

            {/* Similar Products Placeholder - Meesho Style (Mobile Only or Under Image) */}
            <div className="bg-white mt-2 p-4 md:mt-6 md:p-0 md:border-none md:bg-transparent">
              <h3 className="text-gray-500 font-bold text-sm mb-3">Similar Products</h3>
              <div className="flex gap-3">
                <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-blue-600 rounded-lg overflow-hidden p-1 bg-white relative hover:scale-105 transition-transform cursor-pointer shadow-sm">
                  <Image src={product.image} alt="Similar" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:w-1/2 md:pt-2">
            {/* Title & Price Section */}
            <div className="bg-white mt-2 p-4 pt-5 md:mt-0 md:p-0">
              <div className="flex justify-between items-start gap-4 mb-3 md:mb-5">
                <h1 className="text-gray-500 md:text-gray-900 font-medium md:font-black text-[15px] md:text-2xl leading-snug flex-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 md:gap-5 text-gray-400">
                  <div className="flex flex-col items-center gap-1 hover:text-red-500 transition cursor-pointer group">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 group-hover:fill-red-50" />
                    <span className="text-[10px] md:text-xs font-medium">Wishlist</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer group">
                    <Share2 className="w-5 h-5 md:w-6 md:h-6 group-hover:fill-blue-50" />
                    <span className="text-[10px] md:text-xs font-medium">Share</span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2 md:mb-4">
                <span className="text-2xl md:text-4xl font-black text-gray-900">₹{product.price.toFixed(0)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm md:text-lg text-gray-400 line-through font-medium">
                      ₹{product.originalPrice.toFixed(0)}
                    </span>
                    <span className="text-sm md:text-base font-bold text-green-600">{discount}% off</span>
                  </>
                )}
              </div>

              {discount > 0 && (
                <div className="inline-flex items-center gap-1 text-green-600 font-bold text-xs md:text-sm bg-green-50 px-2 py-1 md:px-3 md:py-1.5 rounded md:rounded-lg mb-3 md:mb-5 border border-green-100">
                  <span className="text-green-500">💰</span> ₹{product.originalPrice ? (product.originalPrice - product.price).toFixed(0) : 0} with 1 Special Offer <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="bg-green-50 px-2 py-0.5 md:px-3 md:py-1 rounded md:rounded-full text-[10px] md:text-xs text-green-700 font-bold flex items-center gap-1 border border-green-100">
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  ₹40 off | Exclusive Offers
                </div>
              </div>

              <div className="flex items-center gap-2 pb-4 md:pb-6 border-b border-gray-100">
                <div className="bg-green-600 text-white flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm">
                  4.3 <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                </div>
                <span className="text-xs md:text-sm text-gray-500 font-medium hover:text-blue-600 cursor-pointer transition">513 Ratings, 168 Reviews</span>
              </div>
            </div>

            {/* Select Size Section */}
            <div className="bg-white mt-2 p-4 md:mt-0 md:px-0 md:py-6 border-b border-gray-100 hidden md:block">
              <h2 className="text-gray-900 font-bold text-sm md:text-base mb-4">Select Size</h2>
              <button className="inline-block border-2 border-blue-600 text-blue-700 font-bold text-sm px-5 py-2.5 rounded-full bg-blue-50/50 hover:bg-blue-100 transition shadow-sm">
                Free Size
              </button>
            </div>
            {/* Mobile Only version */}
            <div className="bg-white mt-2 p-4 md:hidden">
              <h2 className="text-gray-900 font-bold text-sm mb-4">Select Size</h2>
              <div className="inline-block border-2 border-blue-600 text-blue-700 font-bold text-sm px-4 py-2 rounded-full bg-blue-50/50">
                Free Size
              </div>
            </div>



            {/* Product Highlights Section */}
            <div className="bg-white mt-2 p-4 md:mt-0 md:px-0 md:py-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-gray-900 font-bold text-sm md:text-base">Product Highlights</h2>
                <button className="text-blue-700 hover:text-blue-800 font-black text-xs md:text-sm tracking-widest transition">COPY</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 md:gap-y-8">
                <div>
                  <p className="text-xs md:text-sm text-gray-400 font-medium mb-1">Net Quantity (N)</p>
                  <p className="text-sm md:text-base font-semibold text-gray-800">1</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-400 font-medium mb-1">Brand</p>
                  <p className="text-sm md:text-base font-semibold text-gray-800">LaundryMall</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-400 font-medium mb-1">Category</p>
                  <p className="text-sm md:text-base font-semibold text-gray-800">{product.category}</p>
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="bg-white mt-2 p-4 md:mt-0 md:px-0 md:py-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-gray-900 font-bold text-sm md:text-base">Additional Details</h2>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 -rotate-90 md:hidden" />
              </div>
              <div className="space-y-4 md:space-y-5">
                <div className="flex">
                  <p className="w-1/2 text-sm md:text-base text-gray-500 font-medium">Item Type</p>
                  <p className="w-1/2 text-sm md:text-base text-gray-800 font-medium">{product.category}</p>
                </div>
                <div className="flex">
                  <p className="w-1/2 text-sm md:text-base text-gray-500 font-medium">Ideal For</p>
                  <p className="w-1/2 text-sm md:text-base text-gray-800 font-medium">Commercial Use</p>
                </div>
                <div className="flex">
                  <p className="w-1/2 text-sm md:text-base text-gray-500 font-medium">Country of Origin</p>
                  <p className="w-1/2 text-sm md:text-base text-gray-800 font-medium">India</p>
                </div>
              </div>
              <div className="mt-4 md:mt-6 border-t border-gray-100 pt-4 md:pt-6 text-sm md:text-base text-gray-600 leading-relaxed max-w-prose">
                {product.description}
              </div>
              <button className="mt-3 md:mt-4 text-blue-600 font-medium text-xs md:text-sm underline hover:text-blue-800 transition">More Information</button>
            </div>
            
            {/* Desktop Add to Cart Bar (Replaces Mobile Bottom Bar) */}
            <div className="hidden md:block mt-8 sticky bottom-8">
              <ProductBottomBar product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Add to Cart Bar */}
      <div className="md:hidden">
        <ProductBottomBar product={product} />
      </div>
    </div>
  );
}

