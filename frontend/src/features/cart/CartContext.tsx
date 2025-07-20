import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
  id?: number;
  _id?: string;
  productId?: string;
  name?: string;
  price?: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: { productId: string; quantity?: number; size?: string; color?: string }) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  getTotalPrice: () => number;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart items from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]); // Not logged in, empty cart
      return;
    }
    fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          setCartItems([]); // Unauthorized, clear cart
          return [];
        }
        return res.json();
      })
      .then(data => Array.isArray(data) ? setCartItems(data.map(item => ({ ...item, stock: item.productId?.stock ?? 0 }))) : setCartItems([]))
      .catch(() => setCartItems([]));
  }, []);

  const addToCart = async (item: { productId: string; quantity?: number; size?: string; color?: string }) => {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: item.productId,
        quantity: item.quantity || 1,
        size: item.size,
        color: item.color
      })
    });
    if (res.ok) {
      // Refetch the cart to ensure it's in sync
      const token = localStorage.getItem('token');
      const cartRes = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });
      const cartData = await cartRes.json();
      setCartItems(Array.isArray(cartData) ? cartData.map(item => ({ ...item, stock: item.productId?.stock ?? 0 })) : []);
    }
  };

  const removeFromCart = async (id: string | number) => {
    const res = await fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
      credentials: 'include'
    });
    if (res.ok) {
      setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    const res = await fetch(`${API_URL}/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });
    if (res.ok) {
      const updatedItem = await res.json();
      setCartItems(prev => prev.map(item => (item._id || item.id) === id ? updatedItem : item));
    }
  };

  const getTotalPrice = () => {
    return Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) : 0;
  };

  const clearCart = async () => {
    const res = await fetch(`${API_URL}/cart/clear`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      credentials: 'include'
    });
    const data = await res.json();
    console.log('clearCart response:', res.status, data);
    if (res.ok) {
      setCartItems([]);
      // Force a refetch to ensure state is in sync
      fetch(`${API_URL}/cart`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => Array.isArray(data) ? setCartItems(data.map(item => ({ ...item, stock: item.productId?.stock ?? 0 }))) : setCartItems([]))
        .catch(() => setCartItems([]));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
