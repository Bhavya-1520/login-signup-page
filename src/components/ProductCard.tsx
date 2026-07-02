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

const productGradients: Record<string, string> = {
  "satin-ribbon-bouquet": "from-rose-100 via-pink-50 to-rose-100",
  "pipe-cleaner-bouquet": "from-violet-100 via-purple-50 to-fuchsia-50",
  "fridge-magnets": "from-sky-50 via-blue-50 to-indigo-50",
  "small-pots": "from-emerald-50 via-green-50 to-teal-50",
  "portrait-bouquet": "from-amber-50 via-yellow-50 to-orange-50",
  "accessories-bouquet": "from-fuchsia-50 via-pink-50 to-rose-50",
  "raksha-bandhan-combo": "from-orange-50 via-amber-50 to-yellow-50",
};

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  return (
    <div
      onClick={() => onNavigate(`product-${product.id}`)}
      className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-pink-100/40 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image placeholder */}
      <div className={`aspect-square bg-gradient-to-br ${productGradients[product.id] || "from-pink-50 to-rose-50"} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-7xl sm:text-8xl group-hover:scale-110 transition-transform duration-500">
          {productEmojis[product.id] || "🌸"}
        </span>
        {product.category === "Raksha Bandhan" && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            ✨ SPECIAL
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="text-xs text-[#E8A0BF] font-medium uppercase tracking-wider mb-1.5">
          {product.category}
        </div>
        <h3 className="font-display text-lg font-semibold text-[#3D2B1F] group-hover:text-[#C77DA5] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#C77DA5] font-bold text-lg">
            ₹{product.basePrice}
            {product.pricePerExtra && <span className="text-sm font-normal text-gray-400"> onwards</span>}
          </span>
          <span className="text-sm text-[#E8A0BF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}
