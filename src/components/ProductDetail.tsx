"use client";

import { useState, useEffect } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { trackProductView, getRelatedProducts } from "@/lib/recommendations";
import ProductCard from "./ProductCard";

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export default function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const [product, setProduct] = useState<any>(fallbackProducts.find((p) => p.id === productId) || null);
  const [allProducts, setAllProducts] = useState<any[]>(fallbackProducts);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    getProducts()
      .then((dbProducts) => {
        if (dbProducts.length > 0) {
          setAllProducts(dbProducts);
          const found = dbProducts.find((p) => p.id === productId);
          if (found) {
            // Merge with fallback to keep images array if not in DB
            const fallback = fallbackProducts.find((p) => p.id === productId);
            setProduct({ ...fallback, ...found, images: (found as any).images || fallback?.images });
          }
        }
      })
      .catch(() => {});
  }, [productId]);

  // Track product view for recommendations
  useEffect(() => {
    if (product) {
      trackProductView(product.id, product.category);
    }
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.label || "");
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]?.label || "");
  const [flowerCount, setFlowerCount] = useState(1);
  const [colors, setColors] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Product not found</p>
        <button onClick={() => onNavigate("products")} className="mt-4 text-[#5EAED4] font-medium">
          ← Back to Shop
        </button>
      </div>
    );
  }

  const calculatePrice = () => {
    let price = product.basePrice;
    if (product.sizes) {
      const size = product.sizes.find((s: any) => s.label === selectedSize);
      price = size?.price || product.basePrice;
    } else if (product.pricePerExtra) {
      price = product.basePrice + (flowerCount - 1) * product.pricePerExtra;
    }
    // Add variant price adjustment
    if (product.variants) {
      const variant = product.variants.find((v: any) => v.label === selectedVariant);
      price += variant?.priceAdjust || 0;
    }
    return price;
  };

  const addToCart = () => {
    const cartItemId = `${product.id}-${selectedSize}-${flowerCount}-${Date.now()}`;
    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: 1,
      size: [selectedVariant, selectedSize || `${flowerCount} flower(s)`].filter(Boolean).join(" • "),
      colors: colors,
      customNote: customNote,
      image: product.image,
    });
  };

  const handleAddToCart = () => {
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    // Send "added to cart" reminder email to logged-in customer
    if (user?.email) {
      fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cart-reminder",
          to: user.email,
          data: {
            customerName: user.displayName || "there",
            productName: product.name,
            price: calculatePrice(),
            image: product.image,
          },
        }),
      }).catch(() => {});
    }
  };

  const handleBuyNow = () => {
    addToCart();
    // Go directly to checkout
    onNavigate("checkout");
  };

  const relatedProducts = product ? getRelatedProducts(allProducts, product) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => onNavigate("products")}
        className="text-[#5EAED4] font-medium mb-8 flex items-center gap-2 hover:gap-3 transition-all"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="relative">
          <div className="aspect-square bg-white rounded-3xl flex items-center justify-center relative overflow-hidden glass-card">
            {product.image && !product.image.includes("placeholder") ? (
              <img
                src={product.images ? product.images[currentImage] : product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <div className="absolute top-6 left-6 text-2xl opacity-30 animate-float">🌸</div>
                <div className="absolute bottom-6 right-6 text-2xl opacity-30 animate-float-slow">✿</div>
                <span className="text-[120px] sm:text-[150px]">🌸</span>
              </>
            )}

            {/* Image navigation arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((currentImage - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImage((currentImage + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail dots */}
          {product.images && product.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {product.images.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentImage
                      ? "bg-[#5EAED4] w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-[#89C4E1] font-medium uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3D2B1F]">
            {product.name}
          </h1>
          <p className="text-gray-500 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-8 space-y-6">
            {/* Variant selector (e.g., Blood Resin / Rose Resin) */}
            {product.variants && (
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-3">Choose Type</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.label}
                      onClick={() => setSelectedVariant(variant.label)}
                      className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
                        selectedVariant === variant.label
                          ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white shadow-lg shadow-sky-200/40"
                          : "glass-card text-gray-600 hover:border-sky-200"
                      }`}
                    >
                      {variant.label}
                      {variant.priceAdjust > 0 && ` (+₹${variant.priceAdjust})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && (
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-3">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: any) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
                        selectedSize === size.label
                          ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white shadow-lg shadow-pink-200/40"
                          : "glass-card text-gray-600 hover:border-pink-200"
                      }`}
                    >
                      {size.label}{size.flowers ? ` (${size.flowers})` : ""} — ₹{size.price}
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
                className="w-full px-4 py-3 glass-card rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
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
                className="w-full px-4 py-3 glass-card rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none resize-none text-gray-900"
              />
            </div>

            {/* Price */}
            <div className="pt-6 border-t border-pink-100">
              <p className="text-sm text-gray-400">Total Price</p>
              <p className="text-3xl font-bold text-[#5EAED4] font-display">₹{calculatePrice()}</p>
            </div>

            {/* Buy Now & Add to Cart buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 px-6 py-4 rounded-full font-semibold border-2 transition-all ${
                  added
                    ? "bg-green-50 border-green-400 text-green-600"
                    : "bg-white border-[#89C4E1] text-[#5EAED4] hover:bg-sky-50"
                }`}
              >
                {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-6 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] hover:shadow-xl hover:shadow-sky-200/50 hover:-translate-y-0.5 transition-all"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You may also like (Related Products) */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-6 text-center">
            You May Also Like 💝
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
