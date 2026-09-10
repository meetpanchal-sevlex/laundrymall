"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, Tag, Sparkles } from "lucide-react";
import { Product } from "@/data/products";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

export default function SearchAutocomplete({
  placeholder = "Search Machinery, Chemicals, Packaging...",
  className = "",
  isMobile = false,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Fetch or search products
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        } else {
          // Fallback to client-side catalog search
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full group">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full ${
            isMobile
              ? "bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
              : "border-2 border-gray-200 rounded-full py-2 px-5 pl-11 focus:outline-none focus:border-blue-500 transition shadow-xs text-sm"
          }`}
        />
        {!isMobile && (
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {!isMobile && (
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 text-white px-3.5 rounded-full hover:bg-blue-700 transition flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            Search
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[380px] overflow-y-auto divide-y divide-gray-50">
          {/* Quick Category Suggestions */}
          <div className="p-3 bg-gray-50/70">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Browse Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: "Chemicals", href: "/products?category=Detergent+Chemicals" },
                { name: "Packaging", href: "/products?category=Packaging+Materials" },
                { name: "Accessories", href: "/products?category=Accessories" },
                { name: "Machinery", href: "/products?category=Machinery" },
                { name: "Laundry Setup", href: "/products?category=Laundry+Setup" },
              ].map((c) => (
                <Link
                  key={c.name}
                  href={c.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xs bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200/80 px-2.5 py-1 rounded-full text-gray-600 transition inline-flex items-center gap-1 font-medium"
                >
                  <Tag className="w-3 h-3 text-gray-400" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Results */}
          {isLoading ? (
            <div className="py-8 text-center text-xs text-gray-400">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin inline-block mr-2" />
              Searching industrial catalog...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Matching Products ({results.length})
              </p>
              {results.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-gray-400 capitalize">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-black text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
              <div className="p-2 border-t border-gray-100 bg-gray-50/40 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  View all results for &quot;{query}&quot; <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 text-center">
              <p className="text-xs text-gray-500 font-medium">
                No direct matches for &quot;{query}&quot;.
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Search catalog anyway <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
