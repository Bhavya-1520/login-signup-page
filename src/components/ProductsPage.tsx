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
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2C1810]">
          Our Products
        </h1>
        <p className="text-gray-600 mt-2">Find the perfect handcrafted gift</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-[#8B5E3C] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-[#F5E6D3] border border-gray-200"
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
