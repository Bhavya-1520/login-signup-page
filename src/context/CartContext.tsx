"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  colors?: string;
  customNote?: string;
  image: string;
  requiresPhotos?: boolean;
  maxPhotos?: number;
  customPhotos?: string[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemByProductId: (productId: string) => CartItem | undefined;
  incrementByProductId: (productId: string) => void;
  decrementByProductId: (productId: string) => void;
  setItemPhotos: (id: string, photos: string[]) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemByProductId: () => undefined,
  incrementByProductId: () => {},
  decrementByProductId: () => {},
  setItemPhotos: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Match by productId + size + colors so identical configs merge
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.colors === item.colors
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                // Keep any newly-provided custom photos
                customPhotos: item.customPhotos && item.customPhotos.length > 0
                  ? item.customPhotos
                  : i.customPhotos,
              }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const getItemByProductId = (productId: string) =>
    items.find((i) => i.productId === productId);

  const incrementByProductId = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return prev;
    });
  };

  const decrementByProductId = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        // Remove from cart
        return prev.filter((i) => i.id !== existing.id);
      }
      return prev.map((i) =>
        i.id === existing.id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const setItemPhotos = (id: string, photos: string[]) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, customPhotos: photos } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemByProductId,
        incrementByProductId,
        decrementByProductId,
        setItemPhotos,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
