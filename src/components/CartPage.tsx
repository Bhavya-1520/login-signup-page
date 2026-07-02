"use client";

import { useCart } from "@/context/CartContext";

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="text-7xl block mb-6">🛒</span>
        <h2 className="font-display text-3xl font-bold text-[#3D2B1F] mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">Add some beautiful bouquets to get started!</p>
        <button
          onClick={() => onNavigate("products")}
          className="px-8 py-3 bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] text-white font-medium rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-[#3D2B1F] mb-8">Your Cart 🌸</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-[#3D2B1F]">{item.name}</h3>
              {item.size && <p className="text-sm text-gray-400">Size: {item.size}</p>}
              {item.colors && <p className="text-sm text-gray-400">Colors: {item.colors}</p>}
              {item.customNote && <p className="text-sm text-gray-400">Note: {item.customNote}</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:border-pink-300 transition-colors"
                >−</button>
                <span className="font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:border-pink-300 transition-colors"
                >+</button>
              </div>

              <span className="font-bold text-[#C77DA5] w-20 text-right">₹{item.price * item.quantity}</span>

              <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-bold text-2xl text-[#3D2B1F] font-display">₹{totalPrice}</span>
        </div>
        <p className="text-sm text-gray-400 mb-6">Shipping calculated at checkout</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate("checkout")}
            className="flex-1 py-4 bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] text-white font-medium rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all text-lg"
          >
            Checkout — ₹{totalPrice}
          </button>
          <button
            onClick={clearCart}
            className="py-4 px-6 glass-card text-gray-500 font-medium rounded-full hover:text-red-400 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
