import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';
import { formatEuro } from '../utils/currency';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  categories: Database['public']['Tables']['categories']['Row'] | null;
};

type Category = Database['public']['Tables']['categories']['Row'];
type SearchHistory = Database['public']['Tables']['search_history']['Row'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    loadCategories();
    if (user) {
      loadSearchHistory();
    }
  }, [user]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  async function loadCategories() {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function loadSearchHistory() {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setSearchHistory(data);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('products')
        .select('*, product_images(*), categories(*)')
        .eq('status', 'active')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%,materials.ilike.%${searchQuery}%`);

      if (selectedCategory !== 'all') {
        queryBuilder = queryBuilder.eq('category_id', selectedCategory);
      }

      if (minPrice) {
        queryBuilder = queryBuilder.gte('price', parseFloat(minPrice));
      }

      if (maxPrice) {
        queryBuilder = queryBuilder.lte('price', parseFloat(maxPrice));
      }

      switch (sortBy) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('price', { ascending: true });
          break;
        case 'price_desc':
          queryBuilder = queryBuilder.order('price', { ascending: false });
          break;
        case 'name':
          queryBuilder = queryBuilder.order('name', { ascending: true });
          break;
        default:
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }

      const { data } = await queryBuilder;
      const results = (data as Product[]) || [];
      setProducts(results);

      await supabase.from('search_history').insert({
        user_id: user?.id || null,
        search_query: searchQuery,
        results_count: results.length,
      });

      if (user) {
        loadSearchHistory();
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  }

  function handleHistoryClick(historyQuery: string) {
    setQuery(historyQuery);
    setSearchParams({ q: historyQuery });
  }

  async function clearSearchHistory() {
    if (!user) return;
    try {
      await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  function highlightMatch(text: string, search: string) {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark> : part
    );
  }

  const searchQuery = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Search</h1>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for furniture, materials, or SKU..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Search
            </button>
          </form>

          {user && searchHistory.length > 0 && !searchQuery && (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Recent Searches</h3>
                </div>
                <button
                  onClick={clearSearchHistory}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHistoryClick(item.search_query)}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    {item.search_query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg p-6 space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Filters</h2>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setMinPrice('');
                      setMaxPrice('');
                      setSortBy('relevance');
                    }}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Clear all
                  </button>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="text-slate-900"
                      />
                      <span className="text-sm text-slate-700">All Categories</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="text-slate-900"
                        />
                        <span className="text-sm text-slate-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Price Range (€)</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={() => performSearch(searchQuery)}
                  className="w-full bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </aside>

            <div className="flex-1">
              <div className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>

                  <p className="text-slate-600">
                    {loading ? 'Searching...' : `${products.length} results for "${searchQuery}"`}
                  </p>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                      <div className="aspect-square bg-slate-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <SearchIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg mb-2">No products found</p>
                  <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const showDiscount = hasDiscount(product.discount_percentage);
                    const discountedPrice = showDiscount
                      ? calculateDiscountedPrice(product.price, product.discount_percentage!)
                      : product.price;

                    return (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow group border border-slate-200"
                      >
                        <div className="aspect-square bg-slate-100 overflow-hidden relative">
                          {product.product_images[0] ? (
                            <img
                              src={product.product_images[0].image_url}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              No image
                            </div>
                          )}
                          {showDiscount && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              -{product.discount_percentage}%
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          {product.categories && (
                            <p className="text-sm text-slate-500 mb-1">{product.categories.name}</p>
                          )}
                          <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-slate-700">
                            {highlightMatch(product.name, searchQuery)}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {highlightMatch(product.description, searchQuery)}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div>
                              {showDiscount ? (
                                <div className="flex items-center gap-2">
                                  <p className="text-xl font-bold text-slate-900">{formatEuro(discountedPrice)}</p>
                                  <p className="text-sm text-slate-500 line-through">{formatEuro(product.price)}</p>
                                </div>
                              ) : (
                                <p className="text-xl font-bold text-slate-900">{formatEuro(product.price)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
