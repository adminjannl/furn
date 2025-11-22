import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { formatEuro } from '../utils/currency';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
};

export default function ProductOfTheMonth() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) {
        setProducts(data as Product[]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function nextProduct() {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }

  function prevProduct() {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }

  if (loading) {
    return (
      <div className="w-full lg:w-[325px] bg-slate-100 rounded-lg animate-pulse" style={{ height: '400px' }} />
    );
  }

  if (products.length === 0) {
    return null;
  }

  const product = products[currentIndex];

  return (
    <div
      className="premium-product-card bg-gradient-to-br from-white via-cream-50/30 to-white rounded-2xl shadow-elevation-3 overflow-hidden w-full flex flex-col relative border-2 border-transparent hover:border-champagne-200/50 transition-all duration-700"
      style={{ minHeight: '400px', maxHeight: '450px' }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none texture-paper"></div>
      <div className="absolute top-3 left-3 z-20">
        <Sparkles className="w-4 h-4 text-champagne-400 animate-elegant-shimmer" />
      </div>
      <div className="absolute top-3 right-3 z-20">
        <Sparkles className="w-4 h-4 text-champagne-400 animate-elegant-shimmer" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative flex-shrink-0 z-10" style={{ height: '200px' }}>
        <div className="w-full h-full bg-gradient-to-br from-cream-100 to-cream-50 relative">
          {product.product_images && product.product_images.length > 0 ? (
            <img
              src={product.product_images[0].image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-oak-400 text-sm">
              {t('trackOrder.noImage')}
            </div>
          )}
        </div>

        {products.length > 1 && (
          <>
            <button
              onClick={prevProduct}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-4 h-4 text-oak-700" />
            </button>
            <button
              onClick={nextProduct}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
              aria-label="Next product"
            >
              <ChevronRight className="w-4 h-4 text-oak-700" />
            </button>
          </>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 relative z-10">
        <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-champagne-600 via-champagne-500 to-champagne-600 text-oak-900 text-xs font-bold rounded-full mb-2 self-start shadow-lg tracking-wider uppercase border-2 border-champagne-700">
          <Sparkles className="w-3 h-3 inline mr-1" />
          {t('product.productOfTheMonth')}
        </span>

        <div className="w-16 h-px bg-gradient-to-r from-oak-300 via-oak-400 to-transparent mb-2"></div>

        <h3 className="text-base font-serif font-semibold text-oak-900 mb-2 line-clamp-2 tracking-tight leading-tight">
          {product.name}
        </h3>

        {hasDiscount(product.discount_percentage) ? (
          <div className="mb-2">
            <span className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow-md mb-1.5">
              -{product.discount_percentage}% {t('product.off')}
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-oak-900 tracking-tight">
                {formatEuro(calculateDiscountedPrice(product.price, product.discount_percentage))}
              </p>
              <p className="text-xs text-oak-400 line-through">
                {formatEuro(product.price)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xl font-bold text-oak-900 mb-2 tracking-tight">
            {formatEuro(product.price)}
          </p>
        )}

        <div className="mt-auto pt-2">
          <Link
            to={`/product/${product.slug}`}
            className="block w-full text-center bg-gradient-to-br from-champagne-600 via-champagne-500 to-champagne-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md border border-champagne-500/30"
          >
            {t('product.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
}
