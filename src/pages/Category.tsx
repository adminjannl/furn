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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-900 border-r-transparent"></div>
        <p className="mt-4 text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-neutral-600">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600">No products available in this category.</p>
        </div>
      ) : (
        <>
          <p className="text-neutral-600 mb-6">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
