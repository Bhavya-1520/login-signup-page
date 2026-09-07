"use client";

import { useWishlist } from "@/context/WishlistContext";

interface WishlistPageProps {
  onNavigate: (page: string) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { items, remove } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <span className="text-5xl block mb-4">🤍</span>
        <h2 className="font-display text-xl font-bold text-[#2C1810] mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 text-sm mb-6">Tap the heart on any product to save it here.</p>
        <button
          onClick={() => onNavigate("products")}
          className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1810] mb-4">
        My Wishlist <span className="text-gray-400 text-base">({items.length})</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <div key={item.productId} className="glass-card rounded-2xl overflow-hidden relative">
            <button
              onClick={() => remove(item.productId)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center z-10"
              title="Remove"
            >
              <svg className="w-4 h-4" fill="#E8A0BF" stroke="#E8A0BF" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <div
              onClick={() => onNavigate(`product-${item.productId}`)}
              className="cursor-pointer"
            >
              <div className="aspect-square bg-white">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = "/images/House_of_gnapakam_logo.jpeg"; }} />
              </div>
              <div className="p-3">
                <p className="text-xs sm:text-sm font-medium text-[#2C1810] line-clamp-2">{item.name}</p>
                <p className="text-[#5EAED4] font-bold mt-1 text-sm">₹{item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
