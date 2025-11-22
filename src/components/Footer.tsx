import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-b from-cream-100/50 via-cream-50 to-cream-100/50 text-oak-900 border-t border-slate-200/60 relative overflow-hidden">
      <div className="absolute inset-0 texture-animated-grain opacity-40 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">
          <div>
            <h3 className="text-2xl font-serif text-oak-900 mb-6">
              Meubelmakerij Harts
            </h3>
            <p className="text-sm text-oak-700 mb-7 leading-relaxed">
              {t('footer.since1947')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-oak-200 rounded-full flex items-center justify-center hover:bg-oak-300 transition-all duration-500 text-oak-800 hover:text-oak-900 hover:scale-110 hover:shadow-md group">
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="w-11 h-11 bg-oak-200 rounded-full flex items-center justify-center hover:bg-oak-300 transition-all duration-500 text-oak-800 hover:text-oak-900 hover:scale-110 hover:shadow-md group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="w-11 h-11 bg-oak-200 rounded-full flex items-center justify-center hover:bg-oak-300 transition-all duration-500 text-oak-800 hover:text-oak-900 hover:scale-110 hover:shadow-md group">
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-oak-900 mb-6 text-lg font-medium">{t('footer.products')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/categories/chairs" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.chairs')}</Link></li>
              <li><Link to="/categories/tables" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.tables')}</Link></li>
              <li><Link to="/categories/storage" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.storage')}</Link></li>
              <li><Link to="/categories/sofas" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.sofas')}</Link></li>
              <li><Link to="/categories/lighting" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.lighting')}</Link></li>
              <li><Link to="/collections" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.collections')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-oak-900 mb-6 text-lg font-medium">{t('footer.information')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.aboutUs')}</Link></li>
              <li><Link to="/supply-chain" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">Supply Chain Transparency</Link></li>
              <li><Link to="/production-process" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">Production Process</Link></li>
              <li><Link to="/quality-control" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">Quality Control</Link></li>
              <li><Link to="/delivery" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('delivery.title')}</Link></li>
              <li><Link to="/warranty" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">10-Year Warranty</Link></li>
              <li><Link to="/faq" className="text-oak-700 hover:text-oak-900 transition-colors duration-300">{t('footerMenu.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-oak-900 mb-6 text-lg font-medium">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-sm text-oak-700">
              <li className="flex gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-oak-600" />
                <div>
                  <a href="tel:+31201234567" className="hover:text-oak-900 transition-colors duration-300">
                    +31 (0)20 123 4567
                  </a>
                  <p className="text-xs text-oak-600 mt-0.5">{t('footer.openingHours')}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-oak-600" />
                <a href="mailto:info@meubelmakerij.nl" className="hover:text-oak-900 transition-colors duration-300">
                  info@meubelmakerij.nl
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-oak-600" />
                <div>
                  <p>Keizersgracht 123</p>
                  <p>1015 CJ Amsterdam</p>
                  <p>Netherlands</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative pt-12">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-300/40 to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-champagne-400/50 rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div>
              <h5 className="text-sm font-serif font-semibold text-oak-900 mb-4">{t('footer.paymentMethods')}</h5>
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                <div className="bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-champagne-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center h-12 min-w-[60px]">
                  <img src="/IDEAL_Logo_2020.svg.png" alt="iDEAL" className="h-6 object-contain" />
                </div>
                <div className="bg-white px-3 py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-champagne-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center h-12 min-w-[70px]">
                  <svg className="h-5 w-auto" viewBox="0 0 90 20" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="2" width="10" height="16" rx="2" fill="#005498"/>
                    <rect x="12" y="2" width="10" height="16" rx="2" fill="#FFB71B"/>
                    <g fill="#005498" font-family="Arial, sans-serif" font-size="8" font-weight="bold">
                      <text x="25" y="14">Bancontact</text>
                    </g>
                  </svg>
                </div>
                <div className="bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-champagne-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center h-12 min-w-[60px]">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="VISA" className="h-4 object-contain" />
                </div>
                <div className="bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-champagne-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center h-12 min-w-[60px]">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7 object-contain" />
                </div>
                <div className="bg-white px-3 py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-champagne-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center h-12 min-w-[95px] flex-shrink-0">
                  <svg className="h-4 w-auto text-oak-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span className="ml-1.5 text-[10px] font-semibold text-oak-900 whitespace-nowrap">Bank Transfer</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-serif font-semibold text-oak-900 mb-4">{t('footer.qualityCertificates')}</h5>
              <div className="flex flex-wrap gap-3">
                <div className="bg-forest-700 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-500">{t('footer.fscCertified')}</div>
                <div className="bg-forest-700 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-500">{t('footer.euQuality')}</div>
                <div className="bg-oak-700 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-500">{t('footer.madeInNL')}</div>
                <div className="bg-champagne-700 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-500">{t('footer.warranty')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-oak-300/20 to-transparent"></div>
            <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-oak-400/40 rounded-full"></div>
            <div className="absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-oak-400/40 rounded-full"></div>
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-oak-600 gap-4 pt-8">
              <p>&copy; 2024 Meubelmakerij Harts. {t('footer.allRightsReserved')}</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-oak-900 transition-colors duration-300 relative group">
                  {t('footer.privacyPolicy')}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-oak-900 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/terms" className="hover:text-oak-900 transition-colors duration-300 relative group">
                  {t('footer.termsConditions')}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-oak-900 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/cookies" className="hover:text-oak-900 transition-colors duration-300 relative group">
                  {t('footer.cookiePolicy')}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-oak-900 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
