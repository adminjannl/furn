import { useEffect, useState } from 'react';

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_ITEMS = 10;

interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    loadRecentProducts();
  }, []);

  function loadRecentProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored) as RecentlyViewedProduct[];
        setRecentProducts(products.sort((a, b) => b.viewedAt - a.viewedAt));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    }
  }

  function addProduct(product: Omit<RecentlyViewedProduct, 'viewedAt'>) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let products: RecentlyViewedProduct[] = stored ? JSON.parse(stored) : [];

      products = products.filter(p => p.id !== product.id);

      products.unshift({
        ...product,
        viewedAt: Date.now()
      });

      products = products.slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      setRecentProducts(products);
    } catch (error) {
      console.error('Error saving recently viewed product:', error);
    }
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentProducts([]);
    } catch (error) {
      console.error('Error clearing recently viewed products:', error);
    }
  }

  return {
    recentProducts,
    addProduct,
    clearHistory
  };
}
