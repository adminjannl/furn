import { Link } from 'react-router-dom';
import { Armchair, ShoppingCart, User, Menu, X, Search, Snowflake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { formatEuro } from '../utils/currency';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import SearchBar from './SearchBar';
import UtilityHeader from './UtilityHeader';

type Category = Database['public']['Tables']['categories']['Row'];

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { items, getTotalItems, getTotalPrice } = useCart();
  const cartHideTimeoutRef = useState<NodeJS.Timeout | null>(null)[0];

  const totalItems = getTotalItems();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCartMouseEnter = () => {
    if (cartHideTimeoutRef) {
      clearTimeout(cartHideTimeoutRef);
    }
    setShowCartDropdown(true);
  };

  const handleCartMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowCartDropdown(false);
    }, 5000);
    if (cartHideTimeoutRef) {
      clearTimeout(cartHideTimeoutRef);
    }
    Object.assign(cartHideTimeoutRef, timeout);
  };

  async function loadCategories() {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (data) setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  return (
    <>
      <UtilityHeader />
      <nav className={`bg-white/95 backdrop-blur-xl shadow-sm sticky top-10 z-40 relative transition-all duration-500 ${
        isScrolled ? 'shadow-elevation-4' : ''
      }`}>
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50/30 via-white to-white pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className={`flex justify-between items-center transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className={`relative bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-md group-hover:shadow-lg ${
                isScrolled ? 'w-10 h-10' : 'w-12 h-12'
              }`}>
                <Armchair className={`text-cream-50 transition-all duration-500 ${
                  isScrolled ? 'w-5 h-5' : 'w-7 h-7'
                }`} />
                <Snowflake className="w-3 h-3 text-slate-100/80 absolute -top-0.5 -right-0.5 animate-elegant-shimmer" />
              </div>
              <div>
                <span className={`font-serif text-oak-900 block leading-tight transition-all duration-500 ${
                  isScrolled ? 'text-xl' : 'text-2xl'
                }`}>Harts</span>
                <span className={`text-oak-600 font-sans tracking-[0.15em] uppercase font-medium transition-all duration-500 ${
                  isScrolled ? 'text-[0.65rem]' : 'text-xs'
                }`}>{t('nav.furniture')}</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {categories
                .filter(cat => cat.slug !== 'wall-units')
                .sort((a, b) => {
                  const order = ['sofas', 'beds', 'mattresses', 'cabinets', 'armchairs-and-poufs', 'tables', 'chairs', 'sleep-accessories'];
                  return order.indexOf(a.slug) - order.indexOf(b.slug);
                })
                .map((category, index) => (
                  <div key={category.slug} className="relative">
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-oak-700 hover:text-oak-900 transition-all font-medium text-sm whitespace-nowrap relative group/link py-2"
                    >
                      {t(`categories.${category.slug}`, category.name)}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-champagne-600 via-champagne-600 to-champagne-600 group-hover/link:w-full transition-all duration-500"></span>
                    </Link>
                    {index < categories.filter(cat => cat.slug !== 'wall-units').length - 1 && (
                      <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-px h-4 bg-slate-200"></div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-3 text-oak-600 hover:text-oak-900 transition-all duration-500 rounded-xl hover:bg-cream-100/50"
            >
              <Search className="w-5 h-5" />
            </button>

            <div
              className="relative"
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <Link to="/cart" className="p-3 text-oak-600 hover:text-oak-900 transition-all duration-500 relative block rounded-xl hover:bg-cream-100/50" data-cart-icon>
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-champagne-600 via-champagne-500 to-champagne-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md font-semibold animate-spring-in">
                    {totalItems}
                  </span>
                )}
              </Link>

              {showCartDropdown && items.length > 0 && (
                <div className="absolute right-0 mt-3 w-96 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/40 p-6 animate-frost-spread elegant-shadow">
                  <h3 className="font-serif font-semibold text-oak-900 mb-5 text-lg tracking-tight">{t('cart.shoppingCart')} ({totalItems})</h3>
                  <div className="max-h-64 overflow-y-auto space-y-4 mb-5">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-cream-100 rounded-xl overflow-hidden flex-shrink-0">
                          {item.product.product_images?.[0] && (
                            <img
                              src={item.product.product_images[0].image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-oak-900 truncate">{item.product.name}</p>
                          <p className="text-sm text-oak-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-oak-900">
                            {formatEuro(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-sm text-oak-600 text-center">
                        +{items.length - 3} more items
                      </p>
                    )}
                  </div>
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex justify-between font-semibold text-oak-900 text-lg">
                      <span>{t('cart.subtotal')}</span>
                      <span>{formatEuro(getTotalPrice())}</span>
                    </div>
                  </div>
                  <Link
                    to="/cart"
                    className="block w-full bg-gradient-to-r from-oak-700 via-oak-600 to-oak-800 text-cream-50 text-center py-3.5 rounded-xl font-semibold hover:from-oak-800 hover:via-oak-700 hover:to-oak-900 transition-all duration-500 shadow-md hover:shadow-lg"
                  >
                    {t('nav.cart')}
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <div className="relative group">
                <button className="p-3 text-oak-600 hover:text-oak-900 transition-all duration-500 rounded-xl hover:bg-cream-100/50">
                  <User className="w-5 h-5" />
                </button>
                <div className="fixed top-20 right-4 sm:right-6 lg:right-8 w-52 bg-white backdrop-blur-xl rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 border border-slate-200/40 z-[100] elegant-shadow">
                  {profile?.is_admin && (
                    <Link
                      to="/admin"
                      className="block px-5 py-2.5 text-sm text-oak-700 hover:bg-cream-50/50 transition-colors duration-300"
                    >
                      {t('nav.adminDashboard')}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-5 py-2.5 text-sm text-oak-700 hover:bg-cream-50/50 transition-colors duration-300"
                  >
                    {t('nav.profile')}
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-5 py-2.5 text-sm text-oak-700 hover:bg-cream-50/50 transition-colors duration-300"
                  >
                    {t('nav.orders')}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-5 py-2.5 text-sm text-oak-700 hover:bg-cream-50/50 transition-colors duration-300"
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-oak-700 via-oak-600 to-oak-800 text-cream-50 rounded-lg hover:from-oak-800 hover:via-oak-700 hover:to-oak-900 transition-all duration-400 font-medium text-sm shadow-sm hover:shadow-md"
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-3xl mx-4">
            <div className="bg-white rounded-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">{t('nav.search')}</h2>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-2 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SearchBar onClose={() => setShowSearchModal(false)} />
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-oak-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                setShowSearchModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full text-oak-700 hover:text-oak-900 py-2"
            >
              <Search className="w-5 h-5" />
              {t('nav.search')}
            </button>

            <div className="border-b border-oak-100 pb-3 mb-3">
              <p className="text-xs font-semibold text-oak-600 mb-2">PRODUCTS</p>
              {categories
                .filter(cat => cat.slug !== 'wall-units')
                .sort((a, b) => {
                  const order = ['sofas', 'beds', 'mattresses', 'cabinets', 'armchairs-and-poufs', 'tables', 'chairs', 'sleep-accessories'];
                  return order.indexOf(a.slug) - order.indexOf(b.slug);
                })
                .map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="block text-oak-700 hover:text-oak-900 py-2 pl-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
            <Link
              to="/cart"
              className="block text-oak-700 hover:text-oak-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.cart')} {totalItems > 0 && `(${totalItems})`}
            </Link>
            {user ? (
              <>
                {profile?.is_admin && (
                  <Link
                    to="/admin"
                    className="block text-oak-700 hover:text-oak-900 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.adminDashboard')}
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block text-oak-700 hover:text-oak-900 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.profile')}
                </Link>
                <Link
                  to="/orders"
                  className="block text-oak-700 hover:text-oak-900 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.orders')}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-oak-700 hover:text-oak-900 py-2"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-oak-700 hover:text-oak-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
