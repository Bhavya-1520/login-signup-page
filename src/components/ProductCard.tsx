"use client";

import { useState } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
  const { getItemByProductId } = useCart();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.image,
      category: product.category,
    });
  };
  // Get images from product or fallback
  const fallback = fallbackProducts.find((p) => p.id === product.id);
  const images = product.images || fallback?.images || (product.image ? [product.image] : []);
  const hasImage = images.length > 0 && !images[0].includes("placeholder");
  const emoji = productEmojis[product.id] || "🌸";

  // Check if this product is in the cart (just to show a badge)
  const cartItem = getItemByProductId(product.id);
  const inCart = !!cartItem;

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

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition-transform z-10"
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="w-4 h-4" fill={wished ? "#E8A0BF" : "none"} stroke={wished ? "#E8A0BF" : "#9ca3af"} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {product.category === "Raksha Bandhan" && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
            ✨ SPECIAL
          </div>
        )}
        {inCart && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
            ✓ In Cart
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <div className="text-[10px] sm:text-xs text-[#89C4E1] font-medium uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="font-display text-sm sm:text-base font-semibold text-[#3D2B1F] group-hover:text-[#5EAED4] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#5EAED4] font-bold text-base sm:text-lg">
            ₹{product.basePrice}
            {product.pricePerExtra && <span className="text-xs sm:text-sm font-normal text-gray-400"> onwards</span>}
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#89C4E1]">
            View →
          </span>
        </div>
      </div>
    </div>
  );
}
