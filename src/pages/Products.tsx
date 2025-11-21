import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ url: string; display_order: number }>;
}

interface Category {
  id: string;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        category_id,
        images:product_images(url, display_order)
      `)
      .eq('status', 'active')
      .order('name');

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    query.then(({ data }) => {
      if (data) setProducts(data as Product[]);
      setLoading(false);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-oak-900 mb-4">Our Collection</h1>
          <p className="text-lg text-oak-600">Discover handcrafted furniture for every room</p>
        </div>

        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-oak-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-oak-200 rounded-lg focus:ring-2 focus:ring-oak-500 focus:border-oak-500 transition-colors bg-white text-oak-900 placeholder:text-oak-400"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-oak-700 text-cream-50 shadow-md'
                  : 'bg-cream-100 text-oak-700 hover:bg-cream-200 border border-oak-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-oak-700 text-cream-50 shadow-md'
                    : 'bg-cream-100 text-oak-700 hover:bg-cream-200 border border-oak-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-oak-700 border-r-transparent"></div>
            <p className="mt-6 text-oak-600 font-medium">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-oak-600 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <>
            <p className="text-oak-600 mb-8 font-medium">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
