"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/admin";
import SearchBar from "./SearchBar";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Shop" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const initial = (user?.displayName || user?.email || "U").charAt(0).toUpperCase();

  return (
    <nav className="glass-card sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Welcome line */}
        <div className="text-center text-[10px] sm:text-xs text-[#5EAED4] py-1 border-b border-gray-50">
          ✨ Welcome to The House Of Gnapakam ✨
        </div>

        {/* Main row: profile(left) + logo&name(center) + cart(right) */}
        <div className="flex items-center justify-between gap-2 py-2">
          {/* LEFT: Profile */}
          <div className="flex items-center flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#89C4E1] to-[#F8C8DC] text-white font-bold text-sm flex items-center justify-center hover:shadow-lg transition-all"
                >
                  {initial}
                </button>
                {accountMenuOpen && (
                  <div className="absolute left-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 pb-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#2C1810] truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { onNavigate("account"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">👤 My Account</button>
                    <button onClick={() => { onNavigate("orders"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">📦 My Orders</button>
                    <button onClick={() => { onNavigate("addresses"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">📍 Saved Addresses</button>
                    <button onClick={() => { onNavigate("bank-details"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">🏦 Bank & UPI</button>
                    <button onClick={() => { onNavigate("settings"); setAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 flex items-center gap-2">⚙️ Settings</button>
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

          {/* CENTER: Logo + Name side by side */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 flex-shrink-0">
            <img src="/images/House_of_gnapakam_logo.jpeg" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm" />
            <span className="text-sm sm:text-lg font-elegant font-semibold text-[#2C3E50] whitespace-nowrap">
              The House Of Gnapakam
            </span>
          </button>

          {/* RIGHT: Cart */}
          <div className="flex items-center flex-shrink-0">
            <button onClick={() => onNavigate("cart")} className="relative p-1.5 sm:p-2 text-gray-600 hover:text-[#5EAED4]">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#89C4E1] text-white w-4 h-4 rounded-full flex items-center justify-center font-medium text-[10px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav links + Search in ONE row */}
        <div className="flex items-center gap-2 sm:gap-4 py-2 border-t border-gray-50">
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentPage === item.id ? "text-[#5EAED4]" : "text-gray-600 hover:text-[#5EAED4]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <SearchBar onNavigate={onNavigate} compact />
          </div>
        </div>
      </div>
    </nav>
  );
}
