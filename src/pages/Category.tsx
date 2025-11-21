import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ url: string; display_order: number }>;
}

interface Category {
  name: string;
  description: string | null;
}

export default function Category() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;

    setLoading(true);

    supabase
      .from('categories')
      .select('name, description')
      .eq('slug', categorySlug)
      .single()
      .then(({ data }) => {
        if (data) setCategory(data);
      });

    supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images:product_images(url, display_order),
        category:categories!inner(slug)
      `)
      .eq('category.slug', categorySlug)
      .eq('status', 'active')
      .order('name')
      .then(({ data }) => {
        if (data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-oak-700 border-r-transparent"></div>
          <p className="mt-6 text-oak-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="pt-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold text-oak-900">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-oak-900 mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-oak-600 leading-relaxed max-w-3xl">{category.description}</p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-oak-600 text-lg">No products available in this category yet.</p>
          </div>
        ) : (
          <>
            <p className="text-oak-600 mb-8 font-medium">
              {products.length} {products.length === 1 ? 'product' : 'products'}
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
