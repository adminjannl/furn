import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  stock_quantity: number;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  materials: string | null;
  mechanism_type: string | null;
  fabric_type: string | null;
  bed_size: string | null;
  category: {
    name: string;
    slug: string;
  };
  images: Array<{ url: string; display_order: number }>;
  tags: Array<{ tag_name: string; tag_type: string }>;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        images:product_images(url, display_order),
        tags:product_tags(tag_name, tag_type)
      `)
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (data) {
          const sortedImages = data.images?.sort((a, b) => a.display_order - b.display_order) || [];
          setProduct({ ...data, images: sortedImages } as Product);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-oak-700 border-r-transparent"></div>
          <p className="mt-6 text-oak-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold text-oak-900 mb-6">Product not found</h1>
          <Link to="/products" className="text-oak-700 hover:text-oak-900 inline-flex items-center font-medium">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const inStock = product.stock_quantity > 0;

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <Link to="/products" className="inline-flex items-center text-oak-700 hover:text-oak-900 mb-10 font-medium group">
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="aspect-[4/3] bg-cream-100 rounded-lg overflow-hidden mb-6 border-2 border-oak-200">
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-oak-400">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-oak-700 shadow-md'
                        : 'border-oak-200 hover:border-oak-400'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <Link
                to={`/category/${product.category.slug}`}
                className="text-sm text-oak-600 hover:text-oak-900 uppercase tracking-wider font-medium"
              >
                {product.category.name}
              </Link>
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-oak-900 mb-6 leading-tight">{product.name}</h1>

            <div className="mb-8 pb-8 border-b border-oak-200">
              <p className="text-4xl font-serif font-bold text-oak-800">{formattedPrice}</p>
              <p className="text-sm text-oak-600 mt-2">SKU: {product.sku}</p>
            </div>

            <div className="mb-8">
              {inStock ? (
                <div className="flex items-center text-forest-600 bg-forest-500/10 px-4 py-3 rounded-lg">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">In Stock ({product.stock_quantity} available)</span>
                </div>
              ) : (
                <div className="text-red-700 bg-red-50 px-4 py-3 rounded-lg font-medium">Out of Stock</div>
              )}
            </div>

            {product.description && (
              <div className="mb-10">
                <h2 className="text-xl font-serif font-semibold text-oak-900 mb-3">Description</h2>
                <p className="text-oak-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {(product.length_cm || product.width_cm || product.height_cm || product.weight_kg) && (
              <div className="mb-10 bg-cream-50 p-6 rounded-lg">
                <h2 className="text-xl font-serif font-semibold text-oak-900 mb-4">Dimensions & Weight</h2>
                <dl className="space-y-3">
                  {product.length_cm && (
                    <div className="flex">
                      <dt className="text-oak-600 w-28">Length:</dt>
                      <dd className="text-oak-900 font-medium">{product.length_cm} cm</dd>
                    </div>
                  )}
                  {product.width_cm && (
                    <div className="flex">
                      <dt className="text-oak-600 w-28">Width:</dt>
                      <dd className="text-oak-900 font-medium">{product.width_cm} cm</dd>
                    </div>
                  )}
                  {product.height_cm && (
                    <div className="flex">
                      <dt className="text-oak-600 w-28">Height:</dt>
                      <dd className="text-oak-900 font-medium">{product.height_cm} cm</dd>
                    </div>
                  )}
                  {product.weight_kg && (
                    <div className="flex">
                      <dt className="text-oak-600 w-28">Weight:</dt>
                      <dd className="text-oak-900 font-medium">{product.weight_kg} kg</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {(product.materials || product.fabric_type || product.mechanism_type || product.bed_size) && (
              <div className="mb-10 bg-cream-50 p-6 rounded-lg">
                <h2 className="text-xl font-serif font-semibold text-oak-900 mb-4">Specifications</h2>
                <dl className="space-y-3">
                  {product.materials && (
                    <div className="flex">
                      <dt className="text-oak-600 w-36">Materials:</dt>
                      <dd className="text-oak-900 font-medium flex-1">{product.materials}</dd>
                    </div>
                  )}
                  {product.fabric_type && (
                    <div className="flex">
                      <dt className="text-oak-600 w-36">Fabric:</dt>
                      <dd className="text-oak-900 font-medium flex-1">{product.fabric_type}</dd>
                    </div>
                  )}
                  {product.mechanism_type && (
                    <div className="flex">
                      <dt className="text-oak-600 w-36">Mechanism:</dt>
                      <dd className="text-oak-900 font-medium flex-1">{product.mechanism_type}</dd>
                    </div>
                  )}
                  {product.bed_size && (
                    <div className="flex">
                      <dt className="text-oak-600 w-36">Size:</dt>
                      <dd className="text-oak-900 font-medium flex-1">{product.bed_size}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-serif font-semibold text-oak-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-champagne-100 text-oak-700 text-sm rounded-full border border-champagne-300"
                    >
                      {tag.tag_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!inStock}
              className={`w-full py-4 rounded-lg font-medium transition-all text-base uppercase tracking-wide ${
                inStock
                  ? 'bg-oak-700 text-cream-50 hover:bg-oak-800 shadow-md hover:shadow-lg'
                  : 'bg-oak-300 text-oak-500 cursor-not-allowed'
              }`}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
