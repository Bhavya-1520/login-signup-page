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
        <button onClick={() => onNavigate("products")} className="mt-4 text-[#8B5E3C] font-medium">
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
      {/* Back button */}
      <button
        onClick={() => onNavigate("products")}
        className="text-[#8B5E3C] font-medium mb-8 flex items-center gap-2 hover:gap-3 transition-all"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-[#F5E6D3] to-[#FDF8F4] rounded-3xl flex items-center justify-center">
          <span className="text-9xl">
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
          <div className="text-sm text-[#D4A574] font-medium uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2C1810]">
            {product.name}
          </h1>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-8 space-y-6">
            {/* Size selector (for pipe cleaner) */}
            {product.sizes && (
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-3">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedSize === size.label
                          ? "border-[#8B5E3C] bg-[#F5E6D3] text-[#8B5E3C]"
                          : "border-gray-200 text-gray-600 hover:border-[#D4A574]"
                      }`}
                    >
                      {size.label} ({size.flowers} flowers) — ₹{size.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flower count (for satin ribbon) */}
            {product.pricePerExtra && (
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-3">
                  Number of Flowers
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFlowerCount(Math.max(1, flowerCount - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg hover:border-[#8B5E3C] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-[#2C1810] w-8 text-center">
                    {flowerCount}
                  </span>
                  <button
                    onClick={() => setFlowerCount(flowerCount + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg hover:border-[#8B5E3C] transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  1 flower = ₹199, each additional flower +₹100
                </p>
              </div>
            )}

            {/* Color preference */}
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                Color Preference
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g., Red, Pink, Yellow (any color you want!)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-transparent outline-none text-gray-900"
              />
            </div>

            {/* Custom note */}
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                Special Instructions (optional)
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Any specific design requests, message to include, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-transparent outline-none resize-none text-gray-900"
              />
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="text-3xl font-bold text-[#8B5E3C]">₹{calculatePrice()}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className={`px-8 py-4 rounded-full font-medium text-white transition-all ${
                  added
                    ? "bg-green-500"
                    : "bg-[#8B5E3C] hover:bg-[#6B4A2E] shadow-lg hover:shadow-xl"
                }`}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
