import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, Package, Check, Minus, Plus, Star, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import type { Database } from '../lib/database.types';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';
import BackOrderModal from '../components/BackOrderModal';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import Breadcrumb from '../components/Breadcrumb';
import GradientMesh from '../components/GradientMesh';
import ColorSwatchSelector from '../components/ColorSwatchSelector';
import ImageGalleryZoom from '../components/ImageGalleryZoom';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  product_colors: Database['public']['Tables']['product_colors']['Row'][];
  categories: Database['public']['Tables']['categories']['Row'] | null;
};

interface ColorVariant {
  id: string;
  colorName: string;
  colorCode: string;
  slug: string;
  thumbnailUrl?: string;
  isCurrentColor?: boolean;
}

export default function ProductDetail() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { addProduct } = useRecentlyViewed();
  const [product, setProduct] = useState<Product | null>(null);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBackOrderModal, setShowBackOrderModal] = useState(false);
  const [backOrderSuccess, setBackOrderSuccess] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  async function loadProduct() {
    setLoading(true);
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), categories(*)')
        .eq('slug', slug)
        .single();

      if (productData) {
        setProduct(productData as Product);

        addProduct({
          id: productData.id,
          slug: productData.slug,
          name: productData.name,
          price: productData.price,
          imageUrl: productData.product_images?.[0]?.image_url || ''
        });

        const variants: ColorVariant[] = (productData.product_colors || [])
          .filter(color => color.color_code)
          .map(color => ({
            id: color.id,
            colorName: color.color_name,
            colorCode: color.color_code || '#cccccc',
            slug: color.variant_slug || productData.slug,
            thumbnailUrl: color.variant_thumbnail_url || undefined,
            isCurrentColor: productData.slug === (color.variant_slug || productData.slug),
          }));
        setColorVariants(variants);

        if (productData.category_id) {
          const { data: related } = await supabase
            .from('products')
            .select('*, product_images(*), product_colors(*)')
            .eq('category_id', productData.category_id)
            .eq('status', 'active')
            .neq('id', productData.id)
            .limit(4);

          setRelatedProducts(related as Product[] || []);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!product) return;

    setAdding(true);
    try {
      await addToCart(product.id, quantity, selectedColor);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
          <Link to="/products" className="text-slate-600 hover:text-slate-900 underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = product.product_images.map(img => ({
    url: img.image_url,
    alt: img.alt_text || product.name
  }));

  const breadcrumbItems = [
    { label: 'Products', path: '/products' },
    ...(product.categories
      ? [{ label: product.categories.name, path: `/category/${product.categories.slug}` }]
      : []),
    { label: product.name, path: `/product/${product.slug}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-slate-50/20 to-white relative">
      <GradientMesh opacity={0.08} speed={0.001} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <ImageGalleryZoom
              images={galleryImages}
              productName={product.name}
            />
          </div>

          <div>
            <h1 className="text-4xl font-serif mb-5 leading-tight gradient-text-gold">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-slate-600">(24 {t('product.reviews')})</span>
            </div>

            <div className="mb-8">
              {hasDiscount(product.discount_percentage) ? (
                <div>
                  <div className="flex items-center gap-4">
                    <p className="text-4xl md:text-5xl font-bold text-oak-900">€{calculateDiscountedPrice(product.price, product.discount_percentage).toFixed(2)}</p>
                    <p className="text-2xl text-oak-400 line-through">€{product.price.toFixed(2)}</p>
                    <span className="bg-champagne-100 text-champagne-800 px-3 py-1.5 rounded-lg text-sm font-semibold">
                      -{product.discount_percentage}%
                    </span>
                  </div>
                  <p className="text-sm text-oak-500 mt-2 tracking-wide">{t('product.vatIncluded')}</p>
                </div>
              ) : (
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-oak-900">€{product.price.toFixed(2)}</p>
                  <p className="text-sm text-oak-500 mt-2 tracking-wide">{t('product.vatIncluded')}</p>
                </div>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <p className="text-slate-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {colorVariants.length > 0 && (
              <div className="mb-8">
                <ColorSwatchSelector
                  variants={colorVariants}
                  currentColorId={colorVariants.find(v => v.isCurrentColor)?.id}
                  size="lg"
                  showLabel={true}
                />
              </div>
            )}

            <div className="mb-6 p-4 border-2 border-oak-900 rounded-lg bg-white">
              <h3 className="font-semibold text-slate-900 mb-1">{t('product.delivery')}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-slate-700">{t('product.inStock')}</p>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {t('product.deliveryPossibleAt')} {new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">{t('product.quantity')}</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-slate-300 py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-800 text-white py-4 rounded-xl font-semibold hover:from-slate-700 hover:via-slate-600 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              {adding ? (
                'Adding...'
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {t('product.addToCart')}
                </>
              )}
            </button>

            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                Added to cart successfully!
              </div>
            )}

            {backOrderSuccess && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                Back-order request submitted! We'll email you when this product is available.
              </div>
            )}

            <div className="bg-gradient-to-br from-cream-100/60 to-cream-200/30 rounded-2xl p-7 space-y-5 border border-slate-200/50 backdrop-blur-sm shadow-sm">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{t('product.freeShipping')}</p>
                  <p className="text-sm text-slate-600">{t('product.deliveryWithin')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{t('product.twoYearWarranty')}</p>
                  <p className="text-sm text-slate-600">{t('product.europeanQuality')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{t('product.easyReturns')}</p>
                  <p className="text-sm text-slate-600">{t('product.returnPolicy')}</p>
                </div>
              </div>
            </div>

            {(product.length_cm || product.width_cm || product.height_cm || product.weight_kg || product.materials) && (
              <div className="mt-8 border-t border-slate-200 pt-8">
                <h3 className="font-semibold text-slate-900 mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {product.sku && (
                    <div className="flex justify-between">
                      <dt className="text-slate-600">SKU</dt>
                      <dd className="font-medium text-slate-900">{product.sku}</dd>
                    </div>
                  )}
                  {product.materials && (
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Materials</dt>
                      <dd className="font-medium text-slate-900">{product.materials}</dd>
                    </div>
                  )}
                  {(product.length_cm || product.width_cm || product.height_cm) && (
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Dimensions (L × W × H)</dt>
                      <dd className="font-medium text-slate-900">
                        {product.length_cm} × {product.width_cm} × {product.height_cm} cm
                      </dd>
                    </div>
                  )}
                  {product.weight_kg && (
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Weight</dt>
                      <dd className="font-medium text-slate-900">{product.weight_kg} kg</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-200/60 pt-16">
            <h2 className="text-3xl md:text-4xl font-serif text-oak-900 mb-14">{t('product.youMayAlsoLike')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.slug}`}
                  className="bg-gradient-to-b from-white to-cream-50/30 rounded-2xl overflow-hidden transition-all duration-500 group border border-slate-200/40 hover:border-champagne-300/60 elegant-shadow hover:luxury-shadow hover:-translate-y-2 shadow-sm"
                >
                  <div className="aspect-square bg-cream-50 overflow-hidden">
                    {relatedProduct.product_images[0] && (
                      <img
                        src={relatedProduct.product_images[0].image_url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="p-7 bg-gradient-to-b from-white to-cream-50/20">
                    <h3 className="font-serif text-oak-900 mb-4 group-hover:text-oak-700 transition-colors duration-400 text-lg font-medium leading-tight">
                      {relatedProduct.name}
                    </h3>
                    {hasDiscount(relatedProduct.discount_percentage) ? (
                      <div className="flex items-center gap-2.5">
                        <p className="text-xl font-bold text-oak-900">€{calculateDiscountedPrice(relatedProduct.price, relatedProduct.discount_percentage).toFixed(2)}</p>
                        <p className="text-sm text-oak-400 line-through">€{relatedProduct.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-oak-900">€{relatedProduct.price.toFixed(2)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showBackOrderModal && product && (
        <BackOrderModal
          product={product}
          onClose={() => setShowBackOrderModal(false)}
          onSuccess={() => {
            setBackOrderSuccess(true);
            setTimeout(() => setBackOrderSuccess(false), 5000);
          }}
        />
      )}
    </div>
  );
}
