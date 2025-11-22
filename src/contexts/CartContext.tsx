import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../lib/database.types';
import { calculateDiscountedPrice } from '../utils/pricing';

type Product = Database['public']['Tables']['products']['Row'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_color: string | null;
  product: Product & {
    product_images: ProductImage[];
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  async function loadCartFromDatabase() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          selected_color,
          product:products (
            *,
            product_images (*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(data as CartItem[] || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }

  function loadCartFromLocalStorage() {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }

  function saveCartToLocalStorage(cartItems: CartItem[]) {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  async function addToCart(productId: string, quantity: number, color?: string) {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', productId)
        .single();

      if (!product) throw new Error('Product not found');

      if (user) {
        const existingItem = items.find(
          item => item.product_id === productId && item.selected_color === (color || null)
        );

        if (existingItem) {
          await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: productId,
              quantity,
              selected_color: color || null,
            })
            .select(`
              id,
              product_id,
              quantity,
              selected_color,
              product:products (
                *,
                product_images (*)
              )
            `)
            .single();

          if (error) throw error;
          setItems([...items, data as CartItem]);
        }
      } else {
        const existingItem = items.find(
          item => item.product_id === productId && item.selected_color === (color || null)
        );

        if (existingItem) {
          const updatedItems = items.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          setItems(updatedItems);
          saveCartToLocalStorage(updatedItems);
        } else {
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            product_id: productId,
            quantity,
            selected_color: color || null,
            product: product as any,
          };
          const updatedItems = [...items, newItem];
          setItems(updatedItems);
          saveCartToLocalStorage(updatedItems);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
      }

      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);

      if (!user) {
        saveCartToLocalStorage(updatedItems);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
      }

      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);

      if (!user) {
        saveCartToLocalStorage(updatedItems);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async function clearCart() {
    try {
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setItems([]);

      if (!user) {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  function getTotalItems() {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => {
      const price = item.product.discount_percentage > 0
        ? calculateDiscountedPrice(item.product.price, item.product.discount_percentage)
        : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
