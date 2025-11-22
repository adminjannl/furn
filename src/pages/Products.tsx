import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Grid2x2 as Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';
import SkeletonLoader from '../components/SkeletonLoader';
import PremiumBadge from '../components/PremiumBadge';
import ProductCard from '../components/ProductCard';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  product_colors: Database['public']['Tables']['product_colors']['Row'][];
  categories: Database['public']['Tables']['categories']['Row'] | null;
};

type Category = Database['public']['Tables']['categories']['Row'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const showDiscountOnly = searchParams.get('discount') === 'true';

  useEffect(() => {
    loadData();
  }, [searchParams]);

  async function loadData() {
    setLoading(true);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        loadProducts(),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (productsRes) setProducts(productsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    let query = supabase
      .from('products')
      .select('*, product_images(*), product_colors(*), categories(*)')
      .eq('status', 'active');

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (showDiscountOnly) {
      query = query.gt('discount_percentage', 0);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    return data as Product[] || [];
  }

  function updateFilter(key: string, value: string) {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams());
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50/50 via-white to-cream-50/30 texture-paper">
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/40 shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-3 tracking-tight gradient-text-elegant">
            {showDiscountOnly ? 'Discounted Products' : 'Our Collection'}
          </h1>
          <p className="text-lg text-oak-600 tracking-wide">
            {showDiscountOnly
              ? 'Exclusive deals with up to 70% off on premium furniture'
              : 'Premium European furniture handcrafted with precision'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/98 backdrop-blur-xl rounded-2xl p-7 space-y-7 sticky top-28 border-gradient-warm shadow-elevation-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-semibold text-oak-900 text-lg">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-oak-600 hover:text-oak-900 transition-colors duration-300"
                >
                  Clear all
                </button>
              </div>

              <div>
                <h3 className="font-serif font-medium text-oak-900 mb-4 text-base">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => updateFilter('category', 'all')}
                      className="text-slate-900"
                    />
                    <span className="text-sm text-slate-700">All Products</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => updateFilter('category', category.id)}
                        className="text-slate-900"
                      />
                      <span className="text-sm text-slate-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-serif font-medium text-oak-900 mb-4 text-base">Price Range (€)</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateFilter('min_price', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateFilter('max_price', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white/98 backdrop-blur-xl rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-200/40 elegant-shadow">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <SkeletonLoader variant="product" count={6} />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-slate-600 text-lg">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-slate-900 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
              }>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
