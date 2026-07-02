"use client";

import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import ProductsPage from "./ProductsPage";
import ProductDetail from "./ProductDetail";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
import LoginPage from "./LoginPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

export default function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (currentPage.startsWith("product-")) {
      const productId = currentPage.replace("product-", "");
      return <ProductDetail productId={productId} onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "products":
        return <ProductsPage onNavigate={handleNavigate} />;
      case "raksha-bandhan":
        return <ProductsPage onNavigate={handleNavigate} initialCategory="Raksha Bandhan" />;
      case "cart":
        return <CartPage onNavigate={handleNavigate} />;
      case "checkout":
        return <CheckoutPage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        {renderPage()}
      </CartProvider>
    </AuthProvider>
  );
}
