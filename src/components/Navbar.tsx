"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Shop" },
    { id: "raksha-bandhan", label: "🎀 Raksha Bandhan" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="glass-card sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🌸</span>
            <div>
              <span className="text-xl sm:text-2xl font-display font-bold text-[#C77DA5]">
                Loom & Bloom
              </span>
              <span className="text-[10px] text-[#D4A76A] font-medium tracking-[0.2em] uppercase block -mt-1 hidden sm:block">
                Studio
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? "text-[#C77DA5]"
                    : "text-gray-600 hover:text-[#C77DA5]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => onNavigate("cart")}
              className="relative p-2 text-gray-600 hover:text-[#C77DA5] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E8A0BF] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Login */}
            <button
              onClick={() => onNavigate("login")}
              className="hidden sm:block text-sm font-medium text-white bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] px-5 py-2 rounded-full hover:shadow-lg hover:shadow-pink-200/50 transition-all"
            >
              Login
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-pink-100 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl ${
                  currentPage === item.id
                    ? "text-[#C77DA5] bg-pink-50"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate("login"); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#C77DA5]"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
