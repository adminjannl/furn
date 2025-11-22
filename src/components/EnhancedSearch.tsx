import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { formatEuro } from '../utils/currency';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';
import { LoadingSkeleton } from './LoadingSpinner';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
};

interface EnhancedSearchProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

export default function EnhancedSearch({ onClose, autoFocus = false }: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  async function performSearch(query: string) {
    setLoading(true);
    setShowResults(true);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%,materials.ilike.%${query}%`)
        .limit(6);

      if (error) throw error;
      setResults(data as Product[] || []);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleViewAll() {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setShowResults(false);
    onClose?.();
  }

  function handleClear() {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  }

  function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-slate-200 text-oak-900 font-semibold">{part}</mark>
      ) : (
        part
      )
    );
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-oak-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, material, or product code..."
          className="w-full pl-12 pr-12 py-3.5 border-2 border-oak-200 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all text-oak-900 placeholder-oak-400"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-oak-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-oak-600" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-oak-100 overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <LoadingSkeleton className="w-16 h-16" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton className="h-4 w-3/4" />
                    <LoadingSkeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 bg-oak-50 border-b border-oak-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-oak-600" />
                <span className="text-sm font-semibold text-oak-700">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-oak-100">
                {results.map((product) => {
                  const showDiscount = hasDiscount(product.discount_percentage);
                  const discountedPrice = showDiscount
                    ? calculateDiscountedPrice(product.price, product.discount_percentage!)
                    : product.price;

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={() => {
                        setSearchQuery('');
                        setShowResults(false);
                        onClose?.();
                      }}
                      className="flex gap-4 p-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-16 h-16 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {product.product_images?.[0] ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-oak-400 text-xs">
                            No image
                          </div>
                        )}
                        {showDiscount && (
                          <div className="absolute top-0 right-0 bg-red-600 text-white px-1 py-0.5 rounded-bl text-xs font-bold">
                            -{product.discount_percentage}%
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-oak-900 group-hover:text-slate-700 transition-colors truncate">
                          {highlightMatch(product.name, searchQuery)}
                        </h4>
                        {product.sku && (
                          <p className="text-xs text-oak-500 mt-0.5">
                            SKU: {highlightMatch(product.sku, searchQuery)}
                          </p>
                        )}
                        <div className="mt-1">
                          {showDiscount ? (
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-oak-900">{formatEuro(discountedPrice)}</p>
                              <p className="text-xs text-oak-500 line-through">{formatEuro(product.price)}</p>
                            </div>
                          ) : (
                            <p className="text-sm font-bold text-oak-900">{formatEuro(product.price)}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <button
                onClick={handleViewAll}
                className="w-full p-4 text-center text-slate-700 font-semibold hover:bg-slate-50 transition-colors border-t border-oak-100"
              >
                View all results for "{searchQuery}"
              </button>
            </>
          ) : searchQuery.length >= 2 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-oak-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-oak-400" />
              </div>
              <p className="text-oak-600 font-medium mb-2">No products found</p>
              <p className="text-sm text-oak-500">
                Try searching with different keywords or check your spelling
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
