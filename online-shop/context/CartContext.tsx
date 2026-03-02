// context/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Product } from "@/types/product";

// Each item in the cart
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: { url: string; alt: string };
  quantity: number;
}

// The shape of the cart context
interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  totalCost: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        // Increase quantity if already in cart
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Otherwise add new item
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  // Remove item by id
  const removeFromCart = (id: string) => {
    setCartItems((prev: CartItem[]) => prev.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev: CartItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Compute total quantity
  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Compute total cost
  const totalCost = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        totalCost,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
