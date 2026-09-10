import type { Metadata } from "next";
import { getCachedCollections, getCachedFrontendProducts } from "@/lib/medusa-cache";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowDownUp, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Commercial Laundry Products & Equipment Catalog",
  description: "Browse India's largest B2B collection of commercial laundry machinery, dry cleaning chemicals, packaging supplies, and industrial accessories at wholesale prices.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Commercial Laundry & Dry Cleaning Supplies Catalog | LaundryMall",
    description: "Browse India's largest B2B collection of commercial laundry machinery, dry cleaning chemicals, and packaging supplies.",
    url: "https://laundrymall.in/products",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.search;
  
  // Fetch live products from Data Access Layer
  const frontendProducts = await getCachedFrontendProducts();
  const collections = await getCachedCollections();
  
  let filteredProducts = frontendProducts;
  
  if (selectedCategory) {
    const sel = selectedCategory.trim().toLowerCase();
    filteredProducts = filteredProducts.filter((p) => {
      const cat = (p.category || "").trim().toLowerCase();
      if (cat === sel) return true;
      if (sel === "chemicals" || sel.includes("chemical") || sel.includes("detergent")) {
        return cat.includes("chemical") || cat.includes("detergent") || cat.includes("softener") || cat.includes("stain");
      }
      if (sel === "packaging" || sel.includes("packaging")) {
        return cat.includes("packag") || cat.includes("poly") || cat.includes("cover");
      }
      if (sel === "accessories" || sel.includes("accessor")) {
        return cat.includes("accessor") || cat.includes("hanger") || cat.includes("tag") || cat.includes("pin");
      }
      if (sel === "machinery" || sel.includes("machin")) {
        return cat.includes("machin") || cat.includes("washer") || cat.includes("dryer") || cat.includes("iron");
      }
      if (sel === "technology" || sel.includes("tech")) {
        return cat.includes("tech") || cat.includes("pos") || cat.includes("software");
      }
      if (sel.includes("setup") || sel.includes("laundry setup")) {
        return cat.includes("setup") || cat.includes("plant") || cat.includes("franchise");
      }
      return cat.includes(sel) || sel.includes(cat);
    });
  }
  
  if (searchQuery) {
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(filteredProducts, {
      keys: ['name', 'category', 'description'],
      threshold: 0.4, // 0.0 is exact match, 1.0 is match anything (0.4 is a good balance for typo tolerance)
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
    
    const results = fuse.search(searchQuery);
    filteredProducts = results.map(result => result.item);
  }

  const STORE_CATEGORIES = [
    "Chemicals",
    "Packaging",
    "Accessories",
    "Machinery",
    "Technology",
    "Laundry Setup",
  ];

  return (
    <div className="bg-gray-100 min-h-screen pb-20 md:pb-8">
      
      {/* Header Area */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-[60px] md:top-20 z-30 border-b border-gray-200 shadow-sm">
        <h1 className="text-lg font-black text-gray-900 capitalize tracking-tight">
          {searchQuery ? `Search: "${searchQuery}"` : (selectedCategory ? selectedCategory : "All Products")}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{filteredProducts.length} items found</p>
        
        {/* Meesho-style Sort & Filter Bar */}
        <div className="flex items-center mt-3 pt-3 border-t border-gray-100 divide-x divide-gray-200 text-sm font-bold text-gray-700">
          <button className="flex-1 flex items-center justify-center gap-1.5 hover:text-blue-600">
            <ArrowDownUp className="w-3.5 h-3.5" /> Sort
          </button>
          <div className="flex-1 flex items-center justify-center gap-1.5 hover:text-blue-600">
            Category <span className="text-[10px]">▼</span>
          </div>
          <button className="flex-1 flex items-center justify-center gap-1.5 hover:text-blue-600">
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mt-2 md:mt-6 px-0 md:px-6 lg:px-8">
        
        {/* Desktop Sidebar Filters (Hidden on Mobile) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-28">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Categories</h2>
            <ul className="space-y-2 text-sm max-h-[70vh] overflow-y-auto custom-scrollbar">
              <li>
                <Link 
                  href="/products"
                  className={`block py-1 ${!selectedCategory ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  All Products
                </Link>
              </li>
              {STORE_CATEGORIES.map((catName) => {
                const isSelected = selectedCategory?.toLowerCase() === catName.toLowerCase() ||
                  (selectedCategory?.toLowerCase().includes("chemical") && catName === "Chemicals") ||
                  (selectedCategory?.toLowerCase().includes("packaging") && catName === "Packaging") ||
                  (selectedCategory?.toLowerCase().includes("setup") && catName === "Laundry Setup");
                return (
                  <li key={catName}>
                    <Link 
                      href={`/products?category=` + encodeURIComponent(catName)}
                      className={`block py-1 flex items-center justify-between ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <span>{catName}</span>
                      {catName === "Laundry Setup" && (
                        <span className="text-[9px] bg-rose-100 text-rose-600 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Product Grid - 3 columns on mobile, 3 on md, 4 on lg */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-gray-100 bg-white md:rounded-lg overflow-hidden">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-y border-gray-100 md:rounded-lg mt-2">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-lg font-black text-gray-900">No products found</h3>
              <p className="text-gray-500 text-sm mt-1 mb-6">Try selecting a different category or search term.</p>
              <Link href="/products" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
