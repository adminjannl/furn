import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';
import { formatEuro } from '../utils/currency';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
};

type SearchHistory = Database['public']['Tables']['search_history']['Row'];

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadSearchHistory();
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        loadSuggestions(query);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  async function loadSearchHistory() {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setSearchHistory(data);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }

  async function loadSuggestions(searchQuery: string) {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`)
        .limit(5);

      setSuggestions((data as Product[]) || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setQuery('');
      if (onClose) onClose();
    }
  }

  function handleHistoryClick(historyQuery: string) {
    navigate(`/search?q=${encodeURIComponent(historyQuery)}`);
    setShowSuggestions(false);
    setQuery('');
    if (onClose) onClose();
  }

  function handleSuggestionClick() {
    setShowSuggestions(false);
    setQuery('');
    if (onClose) onClose();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search furniture, materials, or SKU..."
          className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {showSuggestions && (query.trim().length >= 2 || searchHistory.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50">
          {query.trim().length < 2 && searchHistory.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">Recent Searches</h3>
              </div>
              <div className="space-y-2">
                {searchHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHistoryClick(item.search_query)}
                    className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded"
                  >
                    {item.search_query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim().length >= 2 && (
            <>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mx-auto"></div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase">Products</p>
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={handleSuggestionClick}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        {product.product_images[0] ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-sm text-slate-600">{formatEuro(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    to={`/search?q=${encodeURIComponent(query)}`}
                    onClick={handleSuggestionClick}
                    className="block mt-2 px-3 py-2 text-sm text-center text-slate-900 font-semibold hover:bg-slate-50 rounded"
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-slate-600">No products found</p>
                  <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
