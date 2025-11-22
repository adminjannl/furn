import { Link } from 'react-router-dom';
import type { Database } from '../lib/database.types';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';
import ColorSwatchSelector from './ColorSwatchSelector';
import ProductDimensionsOverlay from './ProductDimensionsOverlay';

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
  isCurrentColor?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const colorVariants: ColorVariant[] = product.product_colors
    .filter(color => color.color_code)
    .map(color => ({
      id: color.id,
      colorName: color.color_name,
      colorCode: color.color_code || '#cccccc',
      slug: color.variant_slug || product.slug,
      isCurrentColor: color.is_current || false,
    }));

  return (
    <div
      className={`bg-gradient-to-b from-white to-cream-50/30 rounded-2xl overflow-hidden transition-all duration-500 group border-animated shadow-elevation-2 hover:shadow-elevation-5 hover:-translate-y-2 ambient-light-product ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={viewMode === 'list' ? 'w-48' : ''}>
        <Link
          to={`/product/${product.slug}`}
          className={`bg-cream-50 overflow-hidden hover-zoom-container block ${
            viewMode === 'list' ? 'h-48' : 'aspect-square'
          }`}
        >
          {product.product_images[0] ? (
            <img
              src={product.product_images[0].image_url}
              alt={product.name}
              className="hover-zoom-image w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No image
            </div>
          )}
        </Link>
        <ProductDimensionsOverlay
          widthCm={product.width_cm}
          lengthCm={product.length_cm}
          heightCm={product.height_cm}
          doorCount={product.door_count}
        />
      </div>

      <div className="p-7 flex-1 bg-gradient-to-b from-white to-cream-50/20">
        {product.categories && (
          <p className="text-sm text-oak-500 mb-2 tracking-wide">{product.categories.name}</p>
        )}

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif text-oak-900 mb-4 group-hover:text-oak-700 transition-colors duration-400 text-xl font-medium leading-tight">
            {product.name}
          </h3>
        </Link>

        {viewMode === 'list' && product.description && (
          <p className="text-sm text-oak-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        )}

        {colorVariants.length > 0 && (
          <div className="mb-4">
            <ColorSwatchSelector
              variants={colorVariants}
              currentColorId={colorVariants.find(v => v.isCurrentColor)?.id}
              size="sm"
              showLabel={true}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            {hasDiscount(product.discount_percentage) ? (
              <div className="flex items-center gap-2.5">
                <p className="text-2xl font-bold text-oak-900">€{calculateDiscountedPrice(product.price, product.discount_percentage).toFixed(2)}</p>
                <p className="text-lg text-oak-400 line-through">€{product.price.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-oak-900">€{product.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
