"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isWished: (productId: string) => boolean;
  remove: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  toggle: () => {},
  isWished: () => false,
  remove: () => {},
  count: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist whenever items change
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items));
    } catch {}
  }, [items]);

  const toggle = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) {
        return prev.filter((i) => i.productId !== item.productId);
      }
      return [...prev, item];
    });
  };

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const isWished = (productId: string) => items.some((i) => i.productId === productId);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWished, remove, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
