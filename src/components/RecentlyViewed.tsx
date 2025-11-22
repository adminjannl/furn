import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { formatEuro } from '../utils/currency';

export default function RecentlyViewed() {
  const { recentProducts, clearHistory } = useRecentlyViewed();

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white via-cream-50/10 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-oak-600" />
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-oak-900 tracking-tight">
              Recently Viewed
            </h2>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm text-oak-600 hover:text-oak-900 transition-colors duration-300 group"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Clear History
          </button>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-oak-300 scrollbar-track-cream-100">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group flex-shrink-0 w-64 snap-start"
              >
                <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 border border-slate-200/30 hover:border-slate-300/50 hover:-translate-y-2 elegant-shadow hover:luxury-shadow">
                  <div className="aspect-square bg-cream-50 overflow-hidden relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-semibold text-oak-900 mb-3 group-hover:text-oak-700 transition-colors duration-500 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-oak-900">{formatEuro(product.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
