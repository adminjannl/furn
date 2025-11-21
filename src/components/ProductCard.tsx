import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: Array<{ url: string; display_order: number }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.display_order === 0) || product.images?.[0];
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white border border-oak-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-oak-400"
    >
      <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
        {primaryImage ? (
          <>
            <img
              src={primaryImage.url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-oak-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-oak-400">
            <span className="text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-serif font-semibold text-oak-900 group-hover:text-oak-700 transition-colors line-clamp-2 mb-3">
          {product.name}
        </h3>
        <p className="text-xl font-medium text-oak-800">{formattedPrice}</p>
      </div>
    </Link>
  );
}
