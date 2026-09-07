"use client";

import { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
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
import BottomNav from "./BottomNav";
import WishlistPage from "./WishlistPage";
import ImageSearchPage from "./ImageSearchPage";

// Map internal page ids to URL path segments
function pageToPath(page: string): string {
  if (page === "home") return "/home";
  if (page.startsWith("product-")) return `/home/shop/${page.replace("product-", "")}`;
  if (page.startsWith("search-")) return `/home/search`;
  if (page.startsWith("category-")) return `/home/shop`;
  const map: Record<string, string> = {
    products: "/home/shop",
    "raksha-bandhan": "/home/shop/raksha-bandhan",
    cart: "/home/cart",
    checkout: "/home/checkout",
    orders: "/home/orders",
    manager: "/home/dashboard",
    account: "/home/account",
    addresses: "/home/addresses",
    settings: "/home/settings",
    "bank-details": "/home/bank-details",
    wishlist: "/home/wishlist",
    "image-search": "/home/image-search",
    about: "/home/about",
    contact: "/home/contact",
    login: "/",
  };
  return map[page] || "/home";
}

// Reverse: read a URL path and return the internal page id
function pathToPage(path: string): string {
  const clean = path.replace(/\/+$/, ""); // strip trailing slash
  if (clean === "" || clean === "/" || clean === "/home") return "home";

  const pathMap: Record<string, string> = {
    "/home/shop": "products",
    "/home/shop/raksha-bandhan": "raksha-bandhan",
    "/home/cart": "cart",
    "/home/checkout": "checkout",
    "/home/orders": "orders",
    "/home/dashboard": "manager",
    "/home/account": "account",
    "/home/addresses": "addresses",
    "/home/settings": "settings",
    "/home/bank-details": "bank-details",
    "/home/about": "about",
    "/home/contact": "contact",
    "/home/search": "search-",
  };
  if (pathMap[clean]) return pathMap[clean];

  // Product detail: /home/shop/<productId>
  const productMatch = clean.match(/^\/home\/shop\/(.+)$/);
  if (productMatch && productMatch[1] !== "raksha-bandhan") {
    return `product-${productMatch[1]}`;
  }

  return "home";
}

function GatedApp() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  // Own history stack (reliable for a single-page app)
  const historyRef = useRef<string[]>(["home"]);

  const handleNavigate = (page: string) => {
    historyRef.current.push(page);
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.history.pushState({ page }, "", pageToPath(page));
    }
    window.scrollTo(0, 0);
  };

  const goToPrevious = () => {
    const stack = historyRef.current;
    if (stack.length > 1) {
      stack.pop(); // remove current
      const target = stack[stack.length - 1];
      setCurrentPage(target);
      if (typeof window !== "undefined") {
        window.history.replaceState({ page: target }, "", pageToPath(target));
      }
    } else {
      setCurrentPage("home");
      if (typeof window !== "undefined") {
        window.history.replaceState({ page: "home" }, "", "/home");
      }
    }
    window.scrollTo(0, 0);
  };

  // Top-left Back button uses our own stack
  const handleBack = () => {
    goToPrevious();
  };

  // Listen for browser/phone back button
  useEffect(() => {
    const onPopState = () => {
      goToPrevious();
    };
    window.addEventListener("popstate", onPopState);

    // Read the initial URL on first load
    const path = window.location.pathname;
    const initialPage = pathToPage(path);
    if (initialPage && initialPage !== "home") {
      historyRef.current = ["home", initialPage];
      setCurrentPage(initialPage);
      window.history.replaceState({ page: initialPage }, "", path);
    } else {
      historyRef.current = ["home"];
      setCurrentPage("home");
      window.history.replaceState({ page: "home" }, "", "/home");
    }
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // If not logged in, show ONLY the login page (no navbar, no home). URL = "/"
  if (!user) {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.history.replaceState({ page: "login" }, "", "/");
    }
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

    if (currentPage.startsWith("category-")) {
      const category = currentPage.replace("category-", "");
      return <ProductsPage onNavigate={handleNavigate} initialCategory={category} />;
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
      case "wishlist":
        return <WishlistPage onNavigate={handleNavigate} />;
      case "image-search":
        return <ImageSearchPage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Show back button on all pages except home
  const showBack = currentPage !== "home";

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      {showBack && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#5EAED4] hover:text-[#3A9BC8] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}
      {/* Bottom padding so content isn't hidden behind bottom nav */}
      <div className="pb-20">
        {renderPage()}
      </div>
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </>
  );
}

export default function AppContent() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <GatedApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
