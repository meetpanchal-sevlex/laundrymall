import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck, Star, Share2, Heart, ChevronRight, Store } from "lucide-react";
import { notFound } from "next/navigation";
import ProductBottomBar from "@/components/ProductBottomBar";
import { getCachedFrontendProduct } from "@/lib/medusa-cache";

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

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      
      {/* Product Image Section */}
      <div className="bg-white pb-2 relative">
        <div className="w-full aspect-square relative bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Meesho-style Trust Badges Banner */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-y border-blue-100 text-[10px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5" /> Mall
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Original Brands
          </div>
          <div className="flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-orange-500" /> Direct From Company
          </div>
        </div>
      </div>

      {/* Similar Products Placeholder - Meesho Style */}
      <div className="bg-white mt-2 p-4">
        <h3 className="text-gray-500 font-bold text-sm mb-3">1 Similar Products</h3>
        <div className="w-16 h-16 border-2 border-blue-600 rounded-lg overflow-hidden p-1 bg-white relative">
          <Image src={product.image} alt="Similar" fill className="object-contain" />
        </div>
      </div>

      {/* Title & Price Section */}
      <div className="bg-white mt-2 p-4 pt-5">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h1 className="text-gray-500 font-medium text-[15px] leading-snug flex-1">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex flex-col items-center gap-1 hover:text-red-500 transition cursor-pointer">
              <Heart className="w-5 h-5" />
              <span className="text-[10px] font-medium">Wishlist</span>
            </div>
            <div className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer">
              <Share2 className="w-5 h-5" />
              <span className="text-[10px] font-medium">Share</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-gray-900">₹{product.price.toFixed(0)}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toFixed(0)}
              </span>
              <span className="text-sm font-bold text-green-600">{discount}% off</span>
            </>
          )}
        </div>

        {discount > 0 && (
          <div className="inline-flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded mb-3">
            <span className="text-green-500">▼</span> ₹{product.originalPrice ? (product.originalPrice - product.price).toFixed(0) : 0} with 1 Special Offer <ChevronRight className="w-3 h-3" />
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className="bg-green-50 px-2 py-0.5 rounded text-[10px] text-green-700 font-bold flex items-center gap-1 border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            ₹40 off | Exclusive Offers
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
            4.3 <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-xs text-gray-500 font-medium">513 Ratings, 168 Reviews</span>
        </div>
      </div>

      {/* Select Size Section */}
      <div className="bg-white mt-2 p-4">
        <h2 className="text-gray-900 font-bold text-sm mb-4">Select Size</h2>
        <div className="inline-block border-2 border-blue-600 text-blue-700 font-bold text-sm px-4 py-2 rounded-full bg-blue-50/50">
          Free Size
        </div>
      </div>

      {/* Sold By Section */}
      <div className="bg-white mt-2 p-4">
        <h2 className="text-gray-900 font-bold text-sm mb-4">Sold By</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px]">LaundryMall Wholesale</h3>
          </div>
          <button className="border border-blue-600 text-blue-600 font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-blue-50 transition">
            View Shop
          </button>
        </div>
        <div className="flex items-center gap-8 pl-14">
          <div>
            <div className="flex items-center gap-1 text-blue-600 font-bold text-sm mb-0.5">
              4.2 <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <p className="text-xs text-gray-400 font-medium">15,270 Ratings</p>
          </div>
          <div>
            <p className="text-gray-900 font-bold text-sm mb-0.5">409</p>
            <p className="text-xs text-gray-400 font-medium">Products</p>
          </div>
        </div>
      </div>

      {/* Product Highlights Section */}
      <div className="bg-white mt-2 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-900 font-bold text-sm">Product Highlights</h2>
          <button className="text-blue-700 font-black text-xs tracking-widest">COPY</button>
        </div>
        <div className="grid grid-cols-2 gap-y-6">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Net Quantity (N)</p>
            <p className="text-sm font-semibold text-gray-800">1</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Brand</p>
            <p className="text-sm font-semibold text-gray-800">LaundryMall</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Category</p>
            <p className="text-sm font-semibold text-gray-800">{product.category}</p>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white mt-2 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-900 font-bold text-sm">Additional Details</h2>
          <ChevronRight className="w-5 h-5 text-gray-400 -rotate-90" />
        </div>
        <div className="space-y-4">
          <div className="flex">
            <p className="w-1/2 text-sm text-gray-500 font-medium">Item Type</p>
            <p className="w-1/2 text-sm text-gray-800 font-medium">{product.category}</p>
          </div>
          <div className="flex">
            <p className="w-1/2 text-sm text-gray-500 font-medium">Ideal For</p>
            <p className="w-1/2 text-sm text-gray-800 font-medium">Commercial Use</p>
          </div>
          <div className="flex">
            <p className="w-1/2 text-sm text-gray-500 font-medium">Country of Origin</p>
            <p className="w-1/2 text-sm text-gray-800 font-medium">India</p>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600 leading-relaxed">
          {product.description}
        </div>
        <button className="mt-3 text-blue-600 font-medium text-xs underline">More Information</button>
      </div>

      <ProductBottomBar product={product} />
    </div>
  );
}
