import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Armchair } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="bg-blob bg-blob-animated w-96 h-96 -top-48 -left-48 opacity-30"></div>
      <div className="bg-blob bg-blob-animated w-[30rem] h-[30rem] -bottom-48 -right-48 opacity-30" style={{ animationDelay: '5s' }}></div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12 animate-spring-in">
          <div className="relative inline-block mb-8">
            <div className="text-[180px] font-serif font-bold text-oak-200 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Armchair className="w-24 h-24 text-oak-400 animate-float" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-oak-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-oak-600 mb-8 max-w-md mx-auto">
            It seems this furniture piece has been moved to another room. Let's help you find what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/"
            className="group bg-white hover:bg-cream-50 border-2 border-oak-200 hover:border-oak-400 rounded-2xl p-6 text-center transition-all duration-300 shadow-elevation-2 hover:shadow-elevation-4 animate-stagger-1"
          >
            <div className="w-12 h-12 bg-oak-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Home className="w-6 h-6 text-oak-700" />
            </div>
            <h3 className="font-semibold text-oak-900 mb-1">Home</h3>
            <p className="text-sm text-oak-600">Back to homepage</p>
          </Link>

          <Link
            to="/products"
            className="group bg-white hover:bg-cream-50 border-2 border-oak-200 hover:border-oak-400 rounded-2xl p-6 text-center transition-all duration-300 shadow-elevation-2 hover:shadow-elevation-4 animate-stagger-2"
          >
            <div className="w-12 h-12 bg-champagne-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Armchair className="w-6 h-6 text-champagne-700" />
            </div>
            <h3 className="font-semibold text-oak-900 mb-1">Products</h3>
            <p className="text-sm text-oak-600">Browse our collection</p>
          </Link>

          <Link
            to="/search"
            className="group bg-white hover:bg-cream-50 border-2 border-oak-200 hover:border-oak-400 rounded-2xl p-6 text-center transition-all duration-300 shadow-elevation-2 hover:shadow-elevation-4 animate-stagger-3"
          >
            <div className="w-12 h-12 bg-champagne-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-6 h-6 text-champagne-700" />
            </div>
            <h3 className="font-semibold text-oak-900 mb-1">Search</h3>
            <p className="text-sm text-oak-600">Find what you need</p>
          </Link>
        </div>

        <div className="text-center animate-stagger-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-oak-700 hover:text-oak-900 font-semibold transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Or go back to previous page
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="divider-ornamental"></div>
          <p className="text-sm text-oak-500 mt-6">
            Need help? Contact our customer service team
          </p>
        </div>
      </div>
    </div>
  );
}
