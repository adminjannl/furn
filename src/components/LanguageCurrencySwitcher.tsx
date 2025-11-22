import { useState, useRef, useEffect } from 'react';
import { Globe, DollarSign, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency, Currency } from '../contexts/CurrencyContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const currencies: { code: Currency; name: string; symbol: string }[] = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
];

export default function LanguageCurrencySwitcher() {
  const { i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [languageMenuPosition, setLanguageMenuPosition] = useState({ top: 0, right: 0 });
  const [currencyMenuPosition, setCurrencyMenuPosition] = useState({ top: 0, right: 0 });
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const currencyButtonRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];
  const currentCurrency = currencies.find((curr) => curr.code === currency) || currencies[0];

  useEffect(() => {
    if (showLanguageMenu && languageButtonRef.current) {
      const rect = languageButtonRef.current.getBoundingClientRect();
      setLanguageMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showLanguageMenu]);

  useEffect(() => {
    if (showCurrencyMenu && currencyButtonRef.current) {
      const rect = currencyButtonRef.current.getBoundingClientRect();
      setCurrencyMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showCurrencyMenu]);

  const changeLanguage = async (langCode: string) => {
    try {
      console.log('Changing language to:', langCode);
      await i18n.changeLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);
      console.log('Language changed successfully. Current language:', i18n.language);
      setShowLanguageMenu(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const changeCurrency = (currCode: Currency) => {
    setCurrency(currCode);
    setShowCurrencyMenu(false);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            ref={languageButtonRef}
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            onBlur={() => setTimeout(() => setShowLanguageMenu(false), 200)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-cream-50 hover:text-champagne-200 rounded transition-all duration-300"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLanguage.flag}</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="relative">
          <button
            ref={currencyButtonRef}
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            onBlur={() => setTimeout(() => setShowCurrencyMenu(false), 200)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-cream-50 hover:text-champagne-200 rounded transition-all duration-300"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{currentCurrency.code}</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {showLanguageMenu && (
        <div
          className="fixed w-48 bg-white backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/40 py-2 z-[9999] elegant-shadow animate-fade-in-up"
          style={{ top: `${languageMenuPosition.top}px`, right: `${languageMenuPosition.right}px` }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onMouseDown={(e) => {
                e.preventDefault();
                changeLanguage(lang.code);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-300 flex items-center gap-3 ${
                lang.code === i18n.language
                  ? 'bg-cream-50 text-oak-900 font-semibold'
                  : 'text-oak-700 hover:bg-cream-50/50'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {showCurrencyMenu && (
        <div
          className="fixed w-48 bg-white backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/40 py-2 z-[9999] elegant-shadow animate-fade-in-up"
          style={{ top: `${currencyMenuPosition.top}px`, right: `${currencyMenuPosition.right}px` }}
        >
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onMouseDown={(e) => {
                e.preventDefault();
                changeCurrency(curr.code);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-300 flex items-center justify-between ${
                curr.code === currency
                  ? 'bg-cream-50 text-oak-900 font-semibold'
                  : 'text-oak-700 hover:bg-cream-50/50'
              }`}
            >
              <span>{curr.name}</span>
              <span className="text-oak-500">{curr.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
