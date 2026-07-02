"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export default function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const product = products.find((p) => p.id === productId);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.label || "");
  const [flowerCount, setFlowerCount] = useState(1);
  const [colors, setColors] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Product not found</p>
        <button onClick={() => onNavigate("products")} className="mt-4 text-[#C77DA5] font-medium">
          ← Back to Shop
        </button>
      </div>
    );
  }

  const calculatePrice = () => {
    if (product.sizes) {
      const size = product.sizes.find((s) => s.label === selectedSize);
      return size?.price || product.basePrice;
    }
    if (product.pricePerExtra) {
      return product.basePrice + (flowerCount - 1) * product.pricePerExtra;
    }
    return product.basePrice;
  };

  const handleAddToCart = () => {
    const cartItemId = `${product.id}-${selectedSize}-${flowerCount}-${Date.now()}`;
    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: 1,
      size: selectedSize || `${flowerCount} flower(s)`,
      colors: colors,
      customNote: customNote,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => onNavigate("products")}
        className="text-[#C77DA5] font-medium mb-8 flex items-center gap-2 hover:gap-3 transition-all"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 rounded-3xl flex items-center justify-center relative overflow-hidden glass-card">
          <div className="absolute top-6 left-6 text-2xl opacity-30 animate-float">🌸</div>
          <div className="absolute bottom-6 right-6 text-2xl opacity-30 animate-float-slow">✿</div>
          <span className="text-[120px] sm:text-[150px]">
            {productId === "satin-ribbon-bouquet" && "🌹"}
            {productId === "pipe-cleaner-bouquet" && "💐"}
            {productId === "fridge-magnets" && "🧲"}
            {productId === "small-pots" && "🪴"}
            {productId === "portrait-bouquet" && "🖼️"}
            {productId === "accessories-bouquet" && "💄"}
            {productId === "raksha-bandhan-combo" && "🎀"}
          </span>
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-[#E8A0BF] font-medium uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3D2B1F]">
            {product.name}
          </h1>
          <p className="text-gray-500 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-8 space-y-6">
            {/* Size selector */}
            {product.sizes && (
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-3">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
                        selectedSize === size.label
                          ? "bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] text-white shadow-lg shadow-pink-200/40"
                          : "glass-card text-gray-600 hover:border-pink-200"
                      }`}
                    >
                      {size.label} ({size.flowers}) — ₹{size.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flower count */}
            {product.pricePerExtra && (
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-3">Number of Flowers</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFlowerCount(Math.max(1, flowerCount - 1))}
                    className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-lg hover:border-pink-300 transition-colors font-medium"
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold text-[#3D2B1F] w-10 text-center font-display">
                    {flowerCount}
                  </span>
                  <button
                    onClick={() => setFlowerCount(flowerCount + 1)}
                    className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-lg hover:border-pink-300 transition-colors font-medium"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  1 flower = ₹199, each additional +₹100
                </p>
              </div>
            )}

            {/* Color preference */}
            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-2">Color Preference</label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g., Red, Pink, Lavender (any color!)"
                className="w-full px-4 py-3 glass-card rounded-2xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none text-gray-900"
              />
            </div>

            {/* Custom note */}
            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-2">Special Instructions (optional)</label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Any specific design requests..."
                rows={3}
                className="w-full px-4 py-3 glass-card rounded-2xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none resize-none text-gray-900"
              />
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-6 border-t border-pink-100">
              <div>
                <p className="text-sm text-gray-400">Total Price</p>
                <p className="text-3xl font-bold text-[#C77DA5] font-display">₹{calculatePrice()}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className={`px-8 py-4 rounded-full font-medium text-white transition-all ${
                  added
                    ? "bg-green-400 shadow-green-200/50"
                    : "bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-0.5"
                } shadow-lg`}
              >
                {added ? "✓ Added!" : "Add to Cart 🛒"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
