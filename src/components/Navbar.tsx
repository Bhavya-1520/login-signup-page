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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Shop" },
    { id: "raksha-bandhan", label: "Raksha Bandhan" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* Contact Banner */}
      <div className="bg-[#2C3E50] text-white text-center py-2 px-4 text-xs sm:text-sm">
        <p>
          Need help? Call or WhatsApp us on{" "}
          <a href="tel:+919346630240" className="underline font-semibold">+91 9346630240</a>
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="glass-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top: Logo centered */}
          <div className="flex justify-center items-center py-3 border-b border-gray-100">
            <button
              onClick={() => onNavigate("home")}
              className="flex flex-col items-center gap-1"
            >
              <img
                src="/images/House_of_gnapakam_logo.jpeg"
                alt="The House Of Gnapakam"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-md"
              />
              <span className="text-lg sm:text-2xl font-elegant font-semibold text-[#2C3E50] tracking-wide">
                The House Of Gnapakam
              </span>
            </button>
          </div>

          {/* Bottom: Nav links + icons */}
          <div className="flex justify-between items-center gap-2 h-14">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                    currentPage === item.id
                      ? "text-[#5EAED4]"
                      : "text-gray-600 hover:text-[#5EAED4]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Search Bar (desktop/tablet) - flexible width */}
            <div className="hidden md:block flex-1 max-w-xs mx-2">
              <SearchBar onNavigate={onNavigate} compact />
            </div>

            {/* Mobile: small search icon that opens menu */}
            <div className="md:hidden flex-1 mx-2">
              <SearchBar onNavigate={onNavigate} compact />
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* My Orders */}
              {user && (
                <button
                  onClick={() => onNavigate("orders")}
                  className={`hidden lg:block text-sm font-medium transition-colors ${
                    currentPage === "orders"
                      ? "text-[#5EAED4]"
                      : "text-gray-600 hover:text-[#5EAED4]"
                  }`}
                >
                  My Orders
                </button>
              )}

              {/* Manager Dashboard */}
              {user && isAdmin(user.email) && (
                <button
                  onClick={() => onNavigate("manager")}
                  className={`hidden lg:block text-sm font-medium transition-colors ${
                    currentPage === "manager"
                      ? "text-[#5EAED4]"
                      : "text-gray-600 hover:text-[#5EAED4]"
                  }`}
                >
                  🛠️ Dashboard
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => onNavigate("cart")}
                className="relative p-2 text-gray-600 hover:text-[#5EAED4] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#89C4E1] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium text-[10px]">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Login / User Avatar with Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#89C4E1] to-[#F8C8DC] text-white font-bold text-sm flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </button>

                  {/* Dropdown */}
                  {accountMenuOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                      {/* User info */}
                      <div className="px-4 pb-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-[#2C1810] truncate">{user.displayName || "User"}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { onNavigate("account"); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 transition-colors flex items-center gap-3"
                        >
                          👤 My Account
                        </button>
                        <button
                          onClick={() => { onNavigate("orders"); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 transition-colors flex items-center gap-3"
                        >
                          📦 My Orders
                        </button>
                        <button
                          onClick={() => { onNavigate("addresses"); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 transition-colors flex items-center gap-3"
                        >
                          📍 Saved Addresses
                        </button>
                        <button
                          onClick={() => { onNavigate("settings"); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 transition-colors flex items-center gap-3"
                        >
                          ⚙️ Settings
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => { logout(); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate("login")}
                  className="text-xs sm:text-sm font-medium text-[#5EAED4] hover:text-[#3A9BC8] transition-colors whitespace-nowrap"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl ${
                  currentPage === item.id
                    ? "text-[#5EAED4] bg-sky-50"
                    : "text-gray-600 hover:bg-sky-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => { onNavigate("orders"); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl ${
                  currentPage === "orders"
                    ? "text-[#5EAED4] bg-sky-50"
                    : "text-gray-600 hover:bg-sky-50"
                }`}
              >
                📦 My Orders
              </button>
            )}
            {user && isAdmin(user.email) && (
              <button
                onClick={() => { onNavigate("manager"); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl ${
                  currentPage === "manager"
                    ? "text-[#5EAED4] bg-sky-50"
                    : "text-gray-600 hover:bg-sky-50"
                }`}
              >
                🛠️ Manager Dashboard
              </button>
            )}
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500"
              >
                Logout ({user.displayName || user.email?.split("@")[0]})
              </button>
            ) : (
              <button
                onClick={() => { onNavigate("login"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#5EAED4]"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
