"use client";

import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
}

const productEmojis: Record<string, string> = {
  "satin-ribbon-bouquet": "🌹",
  "pipe-cleaner-bouquet": "💐",
  "fridge-magnets": "🧲",
  "small-pots": "🪴",
  "portrait-bouquet": "🖼️",
  "accessories-bouquet": "💄",
  "raksha-bandhan-combo": "🎀",
};

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  return (
    <div
      onClick={() => onNavigate(`product-${product.id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-gradient-to-br from-[#F5E6D3] to-[#FDF8F4] flex items-center justify-center relative overflow-hidden">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {productEmojis[product.id] || "🌸"}
        </span>
        {product.category === "Raksha Bandhan" && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            SPECIAL
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="text-xs text-[#D4A574] font-medium uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="font-display text-lg font-semibold text-[#2C1810] group-hover:text-[#8B5E3C] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#8B5E3C] font-bold text-lg">
            ₹{product.basePrice}
            {product.pricePerExtra && <span className="text-sm font-normal text-gray-500"> onwards</span>}
          </span>
          <span className="text-sm text-[#8B5E3C] font-medium group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </div>
      </div>
    </div>
  );
}
