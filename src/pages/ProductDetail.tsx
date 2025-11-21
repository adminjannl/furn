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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-900 border-r-transparent"></div>
        <p className="mt-4 text-neutral-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Product not found</h1>
        <Link to="/products" className="text-neutral-700 hover:text-neutral-900 flex items-center justify-center">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Products
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const inStock = product.stock_quantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/products" className="inline-flex items-center text-neutral-700 hover:text-neutral-900 mb-8">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden mb-4">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                No image available
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-400'
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
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>

          <div className="mb-6">
            <p className="text-3xl font-bold text-neutral-900">{formattedPrice}</p>
            <p className="text-sm text-neutral-600 mt-1">SKU: {product.sku}</p>
          </div>

          <div className="mb-8">
            {inStock ? (
              <div className="flex items-center text-green-700">
                <Check className="h-5 w-5 mr-2" />
                <span>In Stock ({product.stock_quantity} available)</span>
              </div>
            ) : (
              <div className="text-red-600">Out of Stock</div>
            )}
          </div>

          {product.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-2">Description</h2>
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {(product.length_cm || product.width_cm || product.height_cm || product.weight_kg) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">Dimensions & Weight</h2>
              <dl className="space-y-2 text-sm">
                {product.length_cm && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-24">Length:</dt>
                    <dd className="text-neutral-900 font-medium">{product.length_cm} cm</dd>
                  </div>
                )}
                {product.width_cm && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-24">Width:</dt>
                    <dd className="text-neutral-900 font-medium">{product.width_cm} cm</dd>
                  </div>
                )}
                {product.height_cm && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-24">Height:</dt>
                    <dd className="text-neutral-900 font-medium">{product.height_cm} cm</dd>
                  </div>
                )}
                {product.weight_kg && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-24">Weight:</dt>
                    <dd className="text-neutral-900 font-medium">{product.weight_kg} kg</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {(product.materials || product.fabric_type || product.mechanism_type || product.bed_size) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">Specifications</h2>
              <dl className="space-y-2 text-sm">
                {product.materials && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-32">Materials:</dt>
                    <dd className="text-neutral-900 font-medium flex-1">{product.materials}</dd>
                  </div>
                )}
                {product.fabric_type && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-32">Fabric:</dt>
                    <dd className="text-neutral-900 font-medium flex-1">{product.fabric_type}</dd>
                  </div>
                )}
                {product.mechanism_type && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-32">Mechanism:</dt>
                    <dd className="text-neutral-900 font-medium flex-1">{product.mechanism_type}</dd>
                  </div>
                )}
                {product.bed_size && (
                  <div className="flex">
                    <dt className="text-neutral-600 w-32">Size:</dt>
                    <dd className="text-neutral-900 font-medium flex-1">{product.bed_size}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                  >
                    {tag.tag_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            disabled={!inStock}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              inStock
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
