export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  if (discountPercentage <= 0) return price;
  return price - (price * discountPercentage / 100);
}

export function hasDiscount(discountPercentage: number | null | undefined): boolean {
  return !!discountPercentage && discountPercentage > 0;
}
