"use client";

import { useState, useEffect } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { searchProducts } from "@/lib/recommendations";
import ProductCard from "./ProductCard";

interface SearchResultsPageProps {
  query: string;
  onNavigate: (page: string) => void;
}

export default function SearchResultsPage({ query: initialQuery, onNavigate }: SearchResultsPageProps) {
  const [products, setProducts] = useState<any[]>(fallbackProducts);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((dbProducts) => {
        if (dbProducts.length > 0) setProducts(dbProducts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = query ? searchProducts(products, query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for bouquets, bangles, magazines..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 rounded-full glass-card border border-white/60 focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : query ? (
        <>
          <p className="text-gray-500 text-sm mb-6">
            {results.length > 0
              ? `Showing ${results.length} result${results.length > 1 ? "s" : ""} for "${query}"`
              : `No results for "${query}"`}
          </p>

          {results.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {results.map((product) => (
                <div key={product.id} className="break-inside-avoid mb-6">
                  <ProductCard product={product} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="font-display text-xl font-bold text-[#2C1810] mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try searching for something else, or browse our collection.</p>
              <button
                onClick={() => onNavigate("products")}
                className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Browse All Products
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="font-display text-xl font-bold text-[#2C1810] mb-2">Search Our Collection</h3>
          <p className="text-gray-500">Type above to find your perfect handcrafted gift</p>
        </div>
      )}
    </div>
  );
}
