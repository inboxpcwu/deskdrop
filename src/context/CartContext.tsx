'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id?: string;
  space_id: string;
  space_name: string;
  price_per_hour: number;
  start_at: string;
  end_at: string;
  total_price: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (spaceId: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount (for non-logged in or persistent state)
  useEffect(() => {
    const saved = localStorage.getItem('deskdrop_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('deskdrop_cart', JSON.stringify(items));
  }, [items]);

  const addItem = async (item: CartItem) => {
    setItems(prev => [...prev.filter(i => i.space_id !== item.space_id), item]);
  };

  const removeItem = (spaceId: string) => {
    setItems(prev => prev.filter(i => i.space_id !== spaceId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
