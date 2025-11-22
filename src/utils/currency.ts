export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value);
}
