import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

interface ExchangeRates {
  EUR: number;
  USD: number;
  GBP: number;
  CHF: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInEuro: number) => number;
  formatPrice: (priceInEuro: number) => string;
  exchangeRates: ExchangeRates;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'CHF',
};

const defaultExchangeRates: ExchangeRates = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  CHF: 0.94,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferredCurrency');
    return (saved as Currency) || 'EUR';
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(defaultExchangeRates);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();

        setExchangeRates({
          EUR: 1,
          USD: data.rates.USD || defaultExchangeRates.USD,
          GBP: data.rates.GBP || defaultExchangeRates.GBP,
          CHF: data.rates.CHF || defaultExchangeRates.CHF,
        });
      } catch (error) {
        console.error('Failed to fetch exchange rates, using defaults:', error);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 3600000);

    return () => clearInterval(interval);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  const convertPrice = (priceInEuro: number): number => {
    return priceInEuro * exchangeRates[currency];
  };

  const formatPrice = (priceInEuro: number): string => {
    const convertedPrice = convertPrice(priceInEuro);
    const symbol = currencySymbols[currency];

    if (currency === 'CHF') {
      return `${symbol} ${convertedPrice.toFixed(2)}`;
    }

    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        formatPrice,
        exchangeRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
