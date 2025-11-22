import { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, ZoomIn, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '../lib/database.types';
import { formatEuro } from '../utils/currency';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';
import { useCart } from '../contexts/CartContext';
import Button from './Button';
import ImageGalleryZoom from './ImageGalleryZoom';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  product_colors: Database['public']['Tables']['product_colors']['Row'][];
};

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoomGallery, setShowZoomGallery] = useState(false);

  const showDiscount = hasDiscount(product.discount_percentage);
  const displayPrice = showDiscount
    ? calculateDiscountedPrice(product.price, product.discount_percentage!)
    : product.price;

  async function handleAddToCart() {
    setAdding(true);
    try {
      await addToCart(product.id, quantity, selectedColor);
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  }

  const galleryImages = product.product_images.map(img => ({
    url: img.image_url,
    alt: product.name
  }));

  if (showZoomGallery) {
    return (
      <div className="fixed inset-0 z-[60]">
        <button
          onClick={() => setShowZoomGallery(false)}
          className="absolute top-6 right-6 z-[70] p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <ImageGalleryZoom
          images={galleryImages}
          initialIndex={selectedImage}
          productName={product.name}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-oak-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-serif font-bold text-oak-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-oak-50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            <div className="aspect-square bg-cream-100 rounded-xl overflow-hidden mb-4 relative group cursor-pointer">
              {product.product_images[selectedImage] ? (
                <>
                  <img
                    src={product.product_images[selectedImage].image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setShowZoomGallery(true)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
                      <Maximize2 className="w-5 h-5 text-slate-700" />
                      <span className="font-semibold text-sm text-slate-900">View fullscreen</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-oak-400">
                  No image
                </div>
              )}
            </div>

            {product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.product_images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-cream-100 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index ? 'ring-2 ring-slate-600 scale-95' : 'hover:ring-2 hover:ring-oak-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold text-oak-900 mb-3">{product.name}</h3>

            <div className="mb-4">
              {showDiscount ? (
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-oak-900">{formatEuro(displayPrice)}</p>
                  <p className="text-xl text-oak-400 line-through">{formatEuro(product.price)}</p>
                  <span className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount_percentage}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-oak-900">{formatEuro(product.price)}</p>
              )}
              <p className="text-sm text-oak-600 mt-1">VAT included</p>
            </div>

            {product.description && (
              <p className="text-oak-700 leading-relaxed mb-6 line-clamp-4">{product.description}</p>
            )}

            {product.product_colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-oak-900 mb-3">Available Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {product.product_colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.color_name)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        selectedColor === color.color_name
                          ? 'border-slate-600 bg-slate-50 shadow-md'
                          : 'border-oak-200 hover:border-oak-300'
                      }`}
                    >
                      {color.color_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-semibold text-oak-900 mb-3">Quantity</h4>
              <div className="flex items-center border-2 border-oak-200 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-oak-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x-2 border-oak-200 py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-oak-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAddToCart}
                loading={adding}
                fullWidth
                variant="primary"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <Link to={`/product/${product.slug}`} onClick={onClose}>
                <Button fullWidth variant="outline" size="lg">
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
