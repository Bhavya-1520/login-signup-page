"use client";

import { useState } from "react";
import { products as fallbackProducts } from "@/lib/products";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    description: string;
    basePrice: number;
    image: string;
    images?: string[];
    pricePerExtra?: number;
  };
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
  // Get images from product or fallback
  const fallback = fallbackProducts.find((p) => p.id === product.id);
  const images = product.images || fallback?.images || (product.image ? [product.image] : []);
  const hasImage = images.length > 0 && !images[0].includes("placeholder");
  const emoji = productEmojis[product.id] || "🌸";

  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((currentImg + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((currentImg - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={() => onNavigate(`product-${product.id}`)}
      className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-sky-100/40 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-white flex items-center justify-center relative overflow-hidden">
        {hasImage ? (
          <img
            src={images[currentImg]}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span className="text-7xl sm:text-8xl group-hover:scale-110 transition-transform duration-500">
            {emoji}
          </span>
        )}

        {/* Swipe arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ‹
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${idx === currentImg ? "bg-[#5EAED4]" : "bg-gray-300"}`}
              />
            ))}
          </div>
        )}

        {product.category === "Raksha Bandhan" && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            ✨ SPECIAL
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="text-xs text-[#89C4E1] font-medium uppercase tracking-wider mb-1.5">
          {product.category}
        </div>
        <h3 className="font-display text-lg font-semibold text-[#3D2B1F] group-hover:text-[#5EAED4] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#5EAED4] font-bold text-lg">
            ₹{product.basePrice}
            {product.pricePerExtra && <span className="text-sm font-normal text-gray-400"> onwards</span>}
          </span>
          <span className="text-sm text-[#89C4E1] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}
