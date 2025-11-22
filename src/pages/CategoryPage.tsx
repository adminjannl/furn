import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  product_colors: Database['public']['Tables']['product_colors']['Row'][];
  categories: Database['public']['Tables']['categories']['Row'] | null;
};

type Category = Database['public']['Tables']['categories']['Row'];

type SortOption = 'newest' | 'best_sellers' | 'price_asc' | 'price_desc';

export default function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    if (slug) {
      loadCategoryData();
    }
  }, [slug, sortBy]);

  async function loadCategoryData() {
    setLoading(true);
    try {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryData) {
        setCategory(categoryData);

        let query = supabase
          .from('products')
          .select('*, product_images(*), product_colors(*), categories(*)')
          .eq('category_id', categoryData.id)
          .eq('status', 'active');

        switch (sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'best_sellers':
            query = query.order('stock_quantity', { ascending: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data: productsData } = await query;
        setProducts(productsData as Product[] || []);
      }
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category not found</h1>
          <Link to="/products" className="text-slate-600 hover:text-slate-900 underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: t('nav.categories'), path: '/categories' },
    { label: t(`categories.${category.slug}`, category.name), path: `/category/${category.slug}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                {t(`categories.${category.slug}`, category.name)}
              </h1>
              <p className="text-base text-slate-600 max-w-2xl">
                {t(`categoryDescriptions.${category.slug}`, category.description || '')}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-sm text-slate-500 mb-1">
                {t('product.showing', 'Showing')}
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {products.length} {products.length === 1 ? t('product.product', 'Product') : t('product.products', 'Products')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-8 flex items-center justify-between border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600">
            Sort by:
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-900 hover:border-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="best_sellers">Best Sellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg mb-4">No products in this category yet.</p>
            <Link
              to="/products"
              className="text-slate-900 font-semibold hover:underline"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
