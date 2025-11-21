import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, slug')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream-50/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-oak-700 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <ShoppingBag className="h-8 w-8 text-oak-700 relative" strokeWidth={1.5} />
            </div>
            <div>
              <span className="block text-2xl font-serif font-semibold text-oak-800 tracking-tight">Harts</span>
              <span className="block text-xs text-oak-600 tracking-widest uppercase -mt-1">Furniture</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/products"
              className="px-4 py-2 text-sm font-medium text-oak-700 hover:text-oak-900 hover:bg-cream-100 rounded transition-colors duration-200"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="px-4 py-2 text-sm font-medium text-oak-700 hover:text-oak-900 hover:bg-cream-100 rounded transition-colors duration-200"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <button
            className="lg:hidden p-2 text-oak-700 hover:bg-cream-100 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-oak-200 bg-cream-50/98 backdrop-blur-sm">
          <div className="px-6 py-4 space-y-1">
            <Link
              to="/products"
              className="block px-4 py-3 text-sm font-medium text-oak-700 hover:text-oak-900 hover:bg-cream-100 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="block px-4 py-3 text-sm font-medium text-oak-700 hover:text-oak-900 hover:bg-cream-100 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
