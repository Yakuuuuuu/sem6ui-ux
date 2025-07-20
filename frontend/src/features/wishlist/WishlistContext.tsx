import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    console.log('WishlistContext updated:', wishlist);
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    let id = item.id;
    if (!id || id === '' || id === undefined || id === null) {
      id = Math.random().toString(36).substr(2, 9);
    }
    const newItem = { ...item, id: String(id) };
    setWishlist((prev) => (prev.some((i) => String(i.id) === String(newItem.id)) ? prev : [...prev, newItem]));
    console.log('addToWishlist:', newItem, 'Current wishlist:', wishlist);
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const isInWishlist = (id: string | number) => wishlist.some((item) => String(item.id) === String(id));

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}; 