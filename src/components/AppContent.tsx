"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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
import OrdersPage from "./OrdersPage";
import ManagerDashboard from "./ManagerDashboard";
import AccountPage from "./AccountPage";
import AddressesPage from "./AddressesPage";
import SettingsPage from "./SettingsPage";
import SearchResultsPage from "./SearchResultsPage";
import BankDetailsPage from "./BankDetailsPage";

function GatedApp() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // While checking auth, show a loading splash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F9FF] to-[#FDF2F8]">
        <div className="text-center">
          <img src="/images/House_of_gnapakam_logo.jpeg" alt="Logo" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 shadow-md animate-pulse" />
          <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // If not logged in, show ONLY the login page (no navbar, no home)
  if (!user) {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  const renderPage = () => {
    if (currentPage.startsWith("product-")) {
      const productId = currentPage.replace("product-", "");
      return <ProductDetail productId={productId} onNavigate={handleNavigate} />;
    }

    if (currentPage.startsWith("search-")) {
      const query = decodeURIComponent(currentPage.replace("search-", ""));
      return <SearchResultsPage query={query} onNavigate={handleNavigate} />;
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
        return <HomePage onNavigate={handleNavigate} />;
      case "orders":
        return <OrdersPage onNavigate={handleNavigate} />;
      case "manager":
        return <ManagerDashboard onNavigate={handleNavigate} />;
      case "account":
        return <AccountPage onNavigate={handleNavigate} />;
      case "addresses":
        return <AddressesPage onNavigate={handleNavigate} />;
      case "settings":
        return <AccountPage onNavigate={handleNavigate} />;
      case "bank-details":
        return <BankDetailsPage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </>
  );
}

export default function AppContent() {
  return (
    <AuthProvider>
      <CartProvider>
        <GatedApp />
      </CartProvider>
    </AuthProvider>
  );
}
