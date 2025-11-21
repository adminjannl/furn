const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./new-products-to-add.json', 'utf8'));

console.log('Total new products:', data.length);
console.log('With prices:', data.filter(p => p.price).length);
console.log('Without prices:', data.filter(p => !p.price).length);
console.log('\nSample products:');
data.slice(0, 5).forEach((p, i) => {
  console.log(`${i+1}. ${p.russianName}`);
  console.log(`   Price: ${p.price || 'N/A'}`);
  console.log(`   Images: ${p.allImages.length}`);
});
