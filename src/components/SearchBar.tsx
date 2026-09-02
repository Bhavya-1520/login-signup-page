"use client";

import { useState, useEffect, useRef } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { searchProducts } from "@/lib/recommendations";

interface SearchBarProps {
  onNavigate: (page: string) => void;
  compact?: boolean;
}

export default function SearchBar({ onNavigate, compact }: SearchBarProps) {
  const [products, setProducts] = useState<any[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProducts().then((dbProducts) => {
      if (dbProducts.length > 0) setProducts(dbProducts);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = query ? searchProducts(products, query) : [];

  const handleSelect = (productId: string) => {
    setShowSuggestions(false);
    setQuery("");
    onNavigate(`product-${productId}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      onNavigate(`search-${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <div ref={ref} className={`relative ${compact ? "w-full" : "max-w-xl w-full"}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Search products..."
          className="w-full pl-9 pr-8 py-2 rounded-full bg-white/80 border border-gray-200 focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-sm text-gray-900"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setShowSuggestions(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && query && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-50 overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C1810] truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <span className="text-sm font-bold text-[#5EAED4]">₹{product.basePrice}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              No products found
            </div>
          )}
          {results.length > 0 && (
            <button
              onClick={handleSearch}
              className="w-full text-center px-4 py-2.5 text-sm text-[#5EAED4] font-medium hover:bg-sky-50 border-t border-gray-100"
            >
              See all results for &quot;{query}&quot; →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
