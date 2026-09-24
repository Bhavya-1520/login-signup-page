"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { isAdmin } from "@/lib/admin";
import SearchBar from "./SearchBar";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const categories = [
  { label: "ALL", image: "/images/ALL.jpeg", group: "All" },
  { label: "BOQUETS", image: "/images/Boquets.jpeg", group: "Bouquets" },
  { label: "RAKHI", image: "/images/Rakhi.jpeg", group: "Rakhi" },
  { label: "RESINARTS", image: "/images/Resin.jpeg", group: "Resin" },
  { label: "BIRTHDAYGIFTS", image: "/images/BirthdayGifts.jpeg", group: "Birthday" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close the profile menu when tapping/clicking outside of it
  useEffect(() => {
    if (!accountMenuOpen) return;
    const handleClickOutside = (e: Event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [accountMenuOpen]);

  const initial = (user?.displayName || user?.email || "U").charAt(0).toUpperCase();

  return (
    <nav className="glass-card sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top row: profile (left) + logo (center) + wishlist & cart (right) */}
        <div className="flex items-center justify-between gap-2 py-2">
          {/* LEFT: Profile */}
          <div className="flex items-center flex-shrink-0">
            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#89C4E1] to-[#F8C8DC] text-white font-bold text-sm flex items-center justify-center hover:shadow-lg transition-all"
                >
                  {initial}
                </button>
                {accountMenuOpen && (
                  <div className="absolute left-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => { onNavigate("account"); setAccountMenuOpen(false); }}
                      className="w-full text-left px-4 pb-2 border-b border-gray-100 hover:bg-sky-50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-[#2C1810] truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </button>
                    <button onClick={() => { onNavigate("account"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">👤 My Account</button>
                    <button onClick={() => { onNavigate("orders"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">📦 My Orders</button>
                    <button onClick={() => { onNavigate("addresses"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">📍 Saved Addresses</button>
                    <button onClick={() => { onNavigate("bank-details"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">📱 UPI Details</button>
                    {isAdmin(user.email) && (
                      <button onClick={() => { onNavigate("manager"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">🛠️ Dashboard</button>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { logout(); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">🚪 Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onNavigate("login")} className="text-xs sm:text-sm font-medium text-[#5EAED4]">Login</button>
            )}
          </div>

          {/* CENTER: Logo + Name */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 flex-shrink-0">
            <img src="/images/House_of_gnapakam_logo.jpeg" alt="Logo" className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm ring-2 ring-[#F8C8DC]/50" />
            <div className="flex flex-col items-center leading-none">
              <span className="text-[9px] sm:text-[11px] font-elegant tracking-[0.3em] text-[#3A7C9A] font-semibold uppercase">The House Of</span>
              <span className="brand-name text-base sm:text-2xl whitespace-nowrap">Gnapakam</span>
            </div>
          </button>

          {/* RIGHT: Wishlist + Cart */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Wishlist — just a heart, no counter */}
            <button onClick={() => onNavigate("wishlist")} className="relative p-1.5 hover:text-[#E8A0BF]" title="Wishlist">
              <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${wishlistCount > 0 ? "text-[#E8A0BF]" : "text-gray-600"}`} fill={wishlistCount > 0 ? "#E8A0BF" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            {/* Cart */}
            <button onClick={() => onNavigate("cart")} className="relative p-1.5 text-gray-600 hover:text-[#5EAED4]" title="Cart">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E8A0BF] text-white w-4 h-4 rounded-full flex items-center justify-center font-medium text-[10px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar row */}
        <div className="pb-2">
          <SearchBar onNavigate={onNavigate} compact />
        </div>

        {/* Category strip — 5 items across one line, edge to edge */}
        <div className="flex pb-2">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => onNavigate(c.group === "All" ? "products" : `category-${c.group}`)}
              className="flex flex-col items-center gap-1 flex-1 min-w-0"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-[#F8C8DC]/50 shadow-sm">
                <img src={c.image} alt={c.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 text-center leading-tight truncate w-full">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
