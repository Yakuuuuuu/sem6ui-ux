import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { Product, products as initialProducts } from "@/data/products";

export interface Product {
  _id?: string;
  id?: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  rating?: number;
  brand?: string;
  stock?: number;
  featured?: boolean;
  // Add other fields as needed
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const editProduct = async (product: Product) => {
    const id = product._id || product.id;
    if (!id) return;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
  return ctx;
}; 