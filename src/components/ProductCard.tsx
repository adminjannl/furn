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
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-2 text-xl font-semibold text-neutral-900">{formattedPrice}</p>
      </div>
    </Link>
  );
}
