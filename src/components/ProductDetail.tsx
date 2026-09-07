"use client";

import { useState, useEffect } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
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
  const { isWished, toggle } = useWishlist();
  const [showShare, setShowShare] = useState(false);

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
  const [quantity, setQuantity] = useState(1);
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
    // Build a clear size/detail label
    const sizeParts = [];
    if (selectedVariant) sizeParts.push(selectedVariant);
    if (selectedSize) sizeParts.push(selectedSize);
    else if (product.pricePerExtra) sizeParts.push(`Flowers: ${flowerCount}`);

    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      size: sizeParts.join(" • "),
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

  const handleWishlist = () => {
    if (!product) return;
    toggle({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.image,
      category: product.category,
    });
  };

  const getShareLink = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/home/shop/${product?.id}`;
  };

  const shareWhatsApp = () => {
    const text = `Check out this beautiful ${product?.name} from The House Of Gnapakam! ${getShareLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setShowShare(false);
  };

  const shareInstagram = () => {
    // Instagram doesn't support direct link sharing via URL; open Instagram DM/app
    // Copy link and open Instagram
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareLink()).catch(() => {});
    }
    window.open("https://www.instagram.com/direct/inbox/", "_blank");
    setShowShare(false);
  };

  const relatedProducts = product ? getRelatedProducts(allProducts, product) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-2">
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
          <h1 className="font-display text-xl sm:text-3xl font-bold text-[#3D2B1F]">
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

            {/* Quantity selector */}
            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-lg hover:border-sky-300 transition-colors font-medium"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-[#3D2B1F] w-10 text-center font-display">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-lg hover:border-sky-300 transition-colors font-medium"
                >
                  +
                </button>
                <span className="text-sm text-gray-400">
                  {quantity > 1 ? `${quantity} pieces` : "piece"}
                </span>
              </div>
            </div>

            {/* Wishlist + Share row */}
            <div className="flex items-center gap-8 pt-4">
              <button onClick={handleWishlist} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#E8A0BF]">
                <svg className="w-6 h-6" fill={isWished(product.id) ? "#E8A0BF" : "none"} stroke={isWished(product.id) ? "#E8A0BF" : "currentColor"} strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="text-xs font-medium">{isWished(product.id) ? "Wishlisted" : "Wishlist"}</span>
              </button>

              <div className="relative">
                <button onClick={() => setShowShare(!showShare)} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5EAED4]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  <span className="text-xs font-medium">Share</span>
                </button>
                {showShare && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 w-40">
                    <button onClick={shareWhatsApp} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-50 rounded-lg">
                      <span className="text-green-500">💬</span> WhatsApp
                    </button>
                    <button onClick={shareInstagram} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-pink-50 rounded-lg">
                      <span>📸</span> Instagram
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-pink-100">
              <p className="text-sm text-gray-400">Total Price {quantity > 1 && `(${quantity} × ₹${calculatePrice()})`}</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#5EAED4] font-display">₹{calculatePrice() * quantity}</p>
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
