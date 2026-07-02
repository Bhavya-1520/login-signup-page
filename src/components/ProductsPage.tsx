"use client";

import { useState } from "react";
import { products, categories } from "@/lib/products";
import ProductCard from "./ProductCard";

interface ProductsPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export default function ProductsPage({ onNavigate, initialCategory }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[#E8A0BF] font-medium tracking-wider uppercase text-sm mb-2">Shop</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#3D2B1F]">
          Our Collection
        </h1>
        <p className="text-gray-500 mt-3">Find the perfect handcrafted gift for your loved ones</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] text-white shadow-lg shadow-pink-200/40"
                : "glass-card text-gray-600 hover:text-[#C77DA5] hover:border-pink-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
