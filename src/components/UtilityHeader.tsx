import { Link } from 'react-router-dom';
import { Phone, Package, Truck, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageCurrencySwitcher from './LanguageCurrencySwitcher';

export default function UtilityHeader() {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-oak-900 via-oak-800 to-oak-900 text-cream-50 border-b border-oak-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:+31201234567"
              className="flex items-center gap-2 hover:text-champagne-200 transition-colors duration-300"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+31 (0)20 123 4567</span>
            </a>
            <Link
              to="/delivery"
              className="flex items-center gap-2 hover:text-champagne-200 transition-colors duration-300"
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('delivery.title')}</span>
            </Link>
            <Link
              to="/reviews"
              className="flex items-center gap-2 hover:text-champagne-200 transition-colors duration-300"
            >
              <Star className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reviews</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageCurrencySwitcher />
            <Link
              to="/track-order"
              className="flex items-center gap-2 hover:text-champagne-200 transition-colors duration-300 font-medium"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.trackOrder')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
