"use client";

import { useState, useEffect } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts, CATEGORIES } from "@/lib/productsDB";
import { getRecommendations } from "@/lib/recommendations";
import ProductCard from "./ProductCard";

interface ProductsPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export default function ProductsPage({ onNavigate, initialCategory }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [products, setProducts] = useState<any[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    getProducts()
      .then((dbProducts) => {
        if (dbProducts.length > 0) {
          setProducts(dbProducts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Load recommendations after products are loaded
    if (products.length > 0) {
      setRecommendations(getRecommendations(products));
    }
  }, [products]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#3D2B1F]">
          Our Collection
        </h1>
        <p className="text-gray-500 mt-3">Find the perfect handcrafted gift for your loved ones</p>
      </div>

      {/* Recommended for you */}
      {recommendations.length > 0 && selectedCategory === "All" && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-[#2C1810] mb-4 flex items-center gap-2">
            ✨ Recommended For You
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white shadow-lg shadow-sky-200/40"
                : "glass-card text-gray-600 hover:text-[#5EAED4] hover:border-sky-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-3">Loading products...</p>
        </div>
      )}

      {/* Products - Pinterest Masonry Layout */}
      {!loading && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="break-inside-avoid mb-6">
              <ProductCard product={product} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">🌸</span>
          <p className="text-gray-500">No products in this category yet</p>
        </div>
      )}
    </div>
  );
}
