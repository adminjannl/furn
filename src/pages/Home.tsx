import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ url: string; display_order: number }>;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data);
      });

    supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images:product_images(url, display_order)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setFeaturedProducts(data as Product[]);
      });
  }, []);

  return (
    <div className="pt-20">
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-cream-50 via-champagne-50 to-cream-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1YzUxNDUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2aDRWMTBoLTR6TTMyIDE0djRoNHYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-oak-600 tracking-widest uppercase mb-6">Since 1947</p>
            <h1 className="text-6xl lg:text-7xl font-serif font-bold text-oak-900 mb-8 leading-tight">
              Premium European<br/>Furniture
            </h1>
            <p className="text-xl text-oak-700 mb-12 leading-relaxed max-w-2xl">
              Discover handcrafted furniture made with exceptional quality and timeless design.
              Each piece tells a story of European craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/category/sofas" className="btn-secondary inline-flex items-center justify-center">
                View Sofas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-oak-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-oak-600">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-cream-50 border border-oak-200 hover:border-oak-400 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-8 text-center">
                  <h3 className="text-lg font-serif font-semibold text-oak-800 group-hover:text-oak-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-oak-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center text-sm text-oak-700 group-hover:text-oak-900">
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-oak-900 mb-2">Featured Collection</h2>
              <p className="text-lg text-oak-600">Handpicked pieces for your home</p>
            </div>
            <Link
              to="/products"
              className="text-oak-700 hover:text-oak-900 flex items-center font-medium group"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-oak-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-serif font-bold text-champagne-300 mb-3">75+</div>
              <p className="text-cream-200 text-lg">Years of Experience</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-champagne-300 mb-3">1000+</div>
              <p className="text-cream-200 text-lg">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-champagne-300 mb-3">Free</div>
              <p className="text-cream-200 text-lg">Shipping Over €500</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
