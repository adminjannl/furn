import { useCurrency } from '../contexts/CurrencyContext';

export function useCurrencyFormat() {
  const { formatPrice } = useCurrency();

  return {
    formatPrice,
  };
}
