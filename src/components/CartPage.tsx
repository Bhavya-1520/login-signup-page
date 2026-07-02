"use client";

import { useCart } from "@/context/CartContext";

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🛒</span>
        <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">Add some beautiful bouquets to get started!</p>
        <button
          onClick={() => onNavigate("products")}
          className="px-8 py-3 bg-[#8B5E3C] text-white font-medium rounded-full hover:bg-[#6B4A2E] transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-[#2C1810] mb-8">
        Your Cart
      </h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-[#2C1810]">{item.name}</h3>
              {item.size && (
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              )}
              {item.colors && (
                <p className="text-sm text-gray-500">Colors: {item.colors}</p>
              )}
              {item.customNote && (
                <p className="text-sm text-gray-500">Note: {item.customNote}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#8B5E3C] transition-colors"
                >
                  −
                </button>
                <span className="font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#8B5E3C] transition-colors"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <span className="font-bold text-[#8B5E3C] w-20 text-right">
                ₹{item.price * item.quantity}
              </span>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-xl text-[#2C1810]">₹{totalPrice}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Shipping calculated at checkout</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate("checkout")}
            className="flex-1 py-4 bg-[#8B5E3C] text-white font-medium rounded-full hover:bg-[#6B4A2E] transition-colors shadow-lg"
          >
            Proceed to Checkout — ₹{totalPrice}
          </button>
          <button
            onClick={clearCart}
            className="py-4 px-6 border border-gray-200 text-gray-600 font-medium rounded-full hover:bg-gray-50 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
