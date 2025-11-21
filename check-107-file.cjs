const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./all-107-cabinets-complete.json', 'utf8'));

console.log('📊 All-107-cabinets-complete.json Analysis:\n');
console.log('Total products:', data.length);
console.log('With prices:', data.filter(p => p.price).length);
console.log('Without prices:', data.filter(p => !p.price).length);

// Check if Idea products are included
const ideya = data.filter(p => p.url && p.url.includes('/shkafy-ideya/'));
console.log('\nIdea series products:', ideya.length);

// Show first 5 products
console.log('\nFirst 5 products:');
data.slice(0, 5).forEach((p, i) => {
  console.log(`${i+1}. ${p.russianName}`);
  console.log(`   Price: ${p.price ? `${p.price} ₽` : 'N/A'}`);
});
