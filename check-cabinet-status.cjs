const data = require('./cabinets-final-with-prices.json');

console.log('📊 Cabinet Data Status:\n');
console.log('Total cabinets in file:', data.length);
console.log('With prices:', data.filter(c => c.price && c.price !== 999.99).length);
console.log('With images:', data.filter(c => c.allImages && c.allImages.length > 0).length);

const withPrices = data.filter(c => c.price && c.price !== 999.99);
if (withPrices.length > 0) {
  const prices = withPrices.map(c => c.price);
  console.log('\nPrice range:', Math.min(...prices), '-', Math.max(...prices), '₽');
}
