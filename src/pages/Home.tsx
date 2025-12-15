import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Snowflake, Eye } from 'lucide-react';
import { useEffect, useState, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { formatEuro } from '../utils/currency';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';
import HeroBanner from '../components/HeroBanner';
import CraftsmanshipHighlights from '../components/CraftsmanshipHighlights';
import EnhancedSearch from '../components/EnhancedSearch';
import PromotionBanner from '../components/PromotionBanner';
import QuickViewModal from '../components/QuickViewModal';
import TrustBadges from '../components/TrustBadges';
import OrnamentalDivider from '../components/OrnamentalDivider';
import PremiumBadge from '../components/PremiumBadge';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  product_colors: Database['public']['Tables']['product_colors']['Row'][];
};

type Category = Database['public']['Tables']['categories']['Row'];

export default function Home() {
  const { t } = useTranslation();
  const [bestOffers, setBestOffers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal-from-bottom');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [loading]);

  async function loadData() {
    try {
      const [offersRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*, product_images(*), product_colors(*)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('categories')
          .select('*')
          .order('display_order')
      ]);

      if (offersRes.data) setBestOffers(offersRes.data as Product[]);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50/50 via-white to-cream-50/30 relative overflow-hidden">
      <HeroBanner />
      <PromotionBanner />
      <TrustBadges />

      {!loading && categories.length > 0 && (
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          className="py-24 bg-gradient-to-b from-cream-50/30 via-white to-cream-50/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,178,127,0.05),transparent_60%)] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Snowflake className="w-7 h-7 text-slate-300/70 animate-elegant-shimmer" />
                  <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight gradient-text-bronze">{t('home.shopByCategory')}</h2>
                </div>
                <p className="text-lg md:text-xl text-oak-600 tracking-wide">{t('home.curatedCollections')}</p>
              </div>
              <Link
                to="/categories"
                className="mt-6 md:mt-0 inline-flex items-center gap-3 font-semibold hover:gap-4 transition-all duration-500 bg-gradient-to-br from-oak-700 to-oak-800 text-cream-50 px-8 py-4 rounded-xl border border-oak-600 hover:border-oak-500 shadow-md hover:shadow-lg"
              >
                <span>{t('home.allCategories')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-7">
              {categories
                .filter((category) => {
                  const allowedSlugs = ['sofas', 'beds', 'mattresses', 'tables', 'chairs', 'cabinets'];
                  return allowedSlugs.includes(category.slug);
                })
                .sort((a, b) => {
                  const order = ['sofas', 'beds', 'mattresses', 'tables', 'chairs', 'cabinets'];
                  return order.indexOf(a.slug) - order.indexOf(b.slug);
                })
                .map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-cream-50 via-white to-cream-50 transition-all duration-700 border border-slate-200/30 hover:border-champagne-300/50 premium-card-hover"
                >
                  <span className="absolute top-2 left-2 z-30 text-xs font-semibold px-3 py-1.5 rounded-full category-tag-primary">
                    {t(`categories.${category.slug}`, category.name)}
                  </span>
                  <div className="absolute top-3 right-3 z-20">
                    <Snowflake className="w-3.5 h-3.5 text-slate-300/60 group-hover:text-slate-400/80 transition-colors duration-500 animate-elegant-shimmer" />
                  </div>
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={t(`categories.${category.slug}`, category.name)}
                      className="w-full h-full object-contain bg-cream-50 group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-oak-900/85 via-oak-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-xl tracking-wide">{t('product.explore')} {t(`categories.${category.slug}`, category.name)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-20 bg-gradient-to-b from-white via-cream-50/20 to-white border-b border-slate-200/40 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,178,127,0.04),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-5 mb-5">
              <Snowflake className="w-6 h-6 text-slate-400/70 animate-elegant-shimmer" />
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-0 tracking-tight gradient-text-premium">{t('home.findPerfectPiece')}</h2>
              <Snowflake className="w-6 h-6 text-slate-400/70 animate-elegant-shimmer" style={{ animationDelay: '2s' }} />
            </div>
            <p className="text-lg text-oak-600 tracking-wide">{t('home.discoverPremium')}</p>
          </div>
          <EnhancedSearch />
        </div>
      </section>

      {!loading && bestOffers.length > 0 && (
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="py-24 bg-gradient-to-b from-white via-cream-50/15 to-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-champagne-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/10 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="w-7 h-7 text-champagne-400/50 animate-elegant-shimmer" />
                  <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight gradient-text-elegant">{t('home.featuredMonth')}</h2>
                </div>
                <p className="text-lg md:text-xl text-oak-600 tracking-wide">{t('home.exceptionalPieces')}</p>
              </div>
              <Link
                to="/products"
                className="mt-6 md:mt-0 inline-flex items-center gap-3 font-semibold hover:gap-4 transition-all duration-500 bg-gradient-to-br from-oak-700 to-oak-800 text-cream-50 px-8 py-4 rounded-xl border border-oak-600 hover:border-oak-500 shadow-md hover:shadow-lg"
              >
                <span>{t('home.viewAllProducts')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {bestOffers.map((product) => {
                const showDiscount = hasDiscount(product.discount_percentage);
                const discountedPrice = showDiscount
                  ? calculateDiscountedPrice(product.price, product.discount_percentage!)
                  : product.price;

                return (
                  <div
                    key={product.id}
                    className="group relative"
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      className="block bg-gradient-to-b from-white to-cream-50/30 rounded-2xl overflow-hidden transition-all duration-300 border border-slate-200/50 hover:border-champagne-300/50 shadow-sm hover:shadow-lg relative"
                    >
                      <div className="aspect-square bg-cream-50 overflow-hidden relative hover-zoom-container">
                        {product.product_images?.[0] ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt={product.name}
                            className="hover-zoom-image w-full h-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-oak-400">
                            No image
                          </div>
                        )}
                        {showDiscount && (
                          <div className="absolute top-4 right-4">
                            <PremiumBadge variant="ribbon" animated>
                              <Sparkles className="w-3.5 h-3.5 inline animate-elegant-shimmer mr-1" />
                              -{product.discount_percentage}%
                            </PremiumBadge>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                          }}
                          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-oak-900/80 via-oak-800/50 to-transparent backdrop-blur-md p-6 text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center gap-3 border-t border-slate-300/20"
                        >
                          <Eye className="w-5 h-5" />
                          {t('product.quickView')}
                        </button>
                      </div>
                      <div className="p-8 bg-gradient-to-b from-white to-cream-50/20">
                        <h3 className="font-serif text-oak-900 mb-5 text-xl font-medium group-hover:text-oak-700 transition-colors duration-400 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-3">
                          <p className="text-2xl font-bold text-oak-900">{formatEuro(discountedPrice)}</p>
                          {showDiscount && (
                            <p className="text-base text-oak-400 line-through">{formatEuro(product.price)}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <OrnamentalDivider variant="wood-grain" />

      <div ref={(el) => (sectionsRef.current[3] = el)}>
        <CraftsmanshipHighlights />
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
