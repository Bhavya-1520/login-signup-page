"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { isAdmin } from "@/lib/admin";
import SearchBar from "./SearchBar";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

// Desktop menu links -> internal navigation targets
const MENU = [
  { label: "Home", target: "home" },
  { label: "Bouquets", target: "category-Bouquets" },
  { label: "Rakhi Gifts", target: "category-Rakhi" },
  { label: "Resin Arts", target: "category-Resin" },
  { label: "Birthday Gifts", target: "category-Birthday" },
  { label: "About", target: "about" },
  { label: "Contact", target: "contact" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Only portal after mount (avoids SSR/hydration mismatch)
  useEffect(() => { setMounted(true); }, []);

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

  // Lock background scroll while the mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileMenuOpen]);

  const initial = (user?.displayName || user?.email || "U").charAt(0).toUpperCase();

  const isMenuActive = (target: string) => {
    if (target === "home") return currentPage === "home";
    if (target.startsWith("category-")) return currentPage === target;
    return currentPage === target;
  };

  return (
    <nav className="sticky top-0 z-50 shadow-md">
      {/* Main bar — deep pastel gradient */}
      <div className="navbar-bar">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top row */}
          <div className="relative flex items-center justify-between gap-2 py-2 sm:py-3">
            {/* LEFT: hamburger (mobile) + desktop menu links */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Hamburger — mobile/tablet only */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden p-1.5 text-white"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                  )}
                </svg>
              </button>

              {/* Desktop menu links (left side) */}
              <div className="hidden lg:flex items-center gap-5 xl:gap-7">
                {MENU.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => onNavigate(m.target)}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      isMenuActive(m.target) ? "text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER: logo + name (absolutely centered) */}
            <button
              onClick={() => onNavigate("home")}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
            >
              <img src="/images/House_of_gnapakam_logo.jpeg" alt="Logo" className="h-9 sm:h-11 w-auto object-contain drop-shadow" />
              <div className="flex flex-col items-center leading-none">
                <span className="text-[8px] sm:text-[10px] font-elegant tracking-[0.3em] text-[#FCE3EC] font-semibold uppercase">The House Of</span>
                <span className="navbar-brand text-base sm:text-2xl whitespace-nowrap">Gnapakam</span>
              </div>
            </button>

            {/* RIGHT: wishlist + cart + CTA (+ profile on desktop) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
              <button onClick={() => onNavigate("wishlist")} className="relative p-1.5 text-white/90 hover:text-[#FCE3EC]" title="Wishlist">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill={wishlistCount > 0 ? "#FCE3EC" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button onClick={() => onNavigate("cart")} className="relative p-1.5 text-white/90 hover:text-[#FCE3EC]" title="Cart">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E8A0BF] text-white w-4 h-4 rounded-full flex items-center justify-center font-medium text-[10px]">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Desktop profile avatar */}
              {user && (
                <div className="relative hidden lg:block" ref={accountMenuRef}>
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="w-9 h-9 rounded-full bg-white/90 text-[#2C6E8F] font-bold text-sm flex items-center justify-center shadow"
                  >
                    {initial}
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <button onClick={() => { onNavigate("account"); setAccountMenuOpen(false); }} className="w-full text-left px-4 pb-2 border-b border-gray-100 hover:bg-sky-50">
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
              )}

            </div>
          </div>

          {/* Search row (always visible) */}
          <div className="pb-2 sm:pb-3">
            <SearchBar onNavigate={onNavigate} compact />
          </div>
        </div>
      </div>

      {/* Mobile slide-in drawer (from the right) — portaled to body so it always overlays */}
      {mounted && createPortal(
        <div className={`lg:hidden fixed inset-0 z-[9998] ${mobileMenuOpen ? "" : "pointer-events-none"}`}>
          {/* Dim overlay — click outside to close */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          ></div>

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-xs navbar-bar shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            {/* Close */}
            <div className="flex justify-end mb-2">
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-white" aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Account header */}
            {user ? (
              <button
                onClick={() => { onNavigate("account"); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors mb-3"
              >
                <span className="w-11 h-11 rounded-full bg-white/90 text-[#2C6E8F] font-bold flex items-center justify-center flex-shrink-0">
                  {initial}
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[11px] text-[#FCE3EC] uppercase tracking-wide">Your Account</span>
                  <span className="block text-sm font-semibold text-white truncate">{user.displayName || "My Account"}</span>
                  <span className="block text-xs text-white/70 truncate">{user.email}</span>
                </span>
              </button>
            ) : (
              <button
                onClick={() => { onNavigate("login"); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors mb-3 text-left"
              >
                <span className="w-11 h-11 rounded-full bg-white/90 text-[#2C6E8F] font-bold flex items-center justify-center flex-shrink-0">👤</span>
                <span>
                  <span className="block text-sm font-semibold text-white">Login / Sign Up</span>
                  <span className="block text-xs text-white/70">Access your account</span>
                </span>
              </button>
            )}

            {/* Menu links */}
            <div className="flex flex-col">
              {MENU.map((m) => (
                <button
                  key={m.label}
                  onClick={() => { onNavigate(m.target); setMobileMenuOpen(false); }}
                  className={`text-left px-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isMenuActive(m.target) ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Account actions */}
            {user && (
              <div className="mt-3 pt-3 border-t border-white/15 flex flex-col">
                <button onClick={() => { onNavigate("account"); setMobileMenuOpen(false); }} className="text-left px-2 py-2.5 rounded-lg text-sm text-white/85 hover:bg-white/10 flex items-center gap-2">👤 My Account</button>
                <button onClick={() => { onNavigate("orders"); setMobileMenuOpen(false); }} className="text-left px-2 py-2.5 rounded-lg text-sm text-white/85 hover:bg-white/10 flex items-center gap-2">📦 My Orders</button>
                <button onClick={() => { onNavigate("addresses"); setMobileMenuOpen(false); }} className="text-left px-2 py-2.5 rounded-lg text-sm text-white/85 hover:bg-white/10 flex items-center gap-2">📍 Saved Addresses</button>
                <button onClick={() => { onNavigate("bank-details"); setMobileMenuOpen(false); }} className="text-left px-2 py-2.5 rounded-lg text-sm text-white/85 hover:bg-white/10 flex items-center gap-2">📱 UPI Details</button>
                {isAdmin(user.email) && (
                  <button onClick={() => { onNavigate("manager"); setMobileMenuOpen(false); }} className="text-left px-2 py-2.5 rounded-lg text-sm text-white/85 hover:bg-white/10 flex items-center gap-2">🛠️ Dashboard</button>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left px-2 py-2.5 rounded-lg text-sm text-[#FFD2D2] hover:bg-white/10 flex items-center gap-2">🚪 Logout</button>
              </div>
            )}
          </div>
        </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
