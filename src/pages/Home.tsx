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
    <div>
      <section className="bg-gradient-to-br from-neutral-100 to-neutral-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Premium European Furniture
            </h1>
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Discover handcrafted furniture made with exceptional quality and timeless design.
              Quality craftsmanship since 1947.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-200"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group p-6 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-neutral-900 group-hover:text-neutral-700">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">Featured Products</h2>
            <Link
              to="/products"
              className="text-neutral-700 hover:text-neutral-900 flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-neutral-900 mb-2">75+</div>
              <p className="text-neutral-600">Years of Experience</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-neutral-900 mb-2">1000+</div>
              <p className="text-neutral-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-neutral-900 mb-2">Free</div>
              <p className="text-neutral-600">Shipping Over €500</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
