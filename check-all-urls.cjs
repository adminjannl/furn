const fs = require('fs');

// Check what we actually have
const existingData = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));

console.log('\n📊 EXISTING CABINET DATA ANALYSIS\n');
console.log(`Total products: ${existingData.length}`);
console.log(`With prices: ${existingData.filter(c => c.price && c.price > 0).length}`);
console.log(`With images: ${existingData.filter(c => c.allImages && c.allImages.length > 0).length}\n`);

// Check URL patterns
console.log('🔗 URL Pattern Analysis:\n');

const categories = {};
existingData.forEach(c => {
  const match = c.url.match(/\/shkafy\/([\w-]+)\//);
  const category = match ? match[1] : 'other';
  categories[category] = (categories[category] || 0) + 1;
});

console.log('Categories found:');
Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count} products`);
});

// Check for Boss Standart 220 series
const boss220 = existingData.filter(c => c.russianName.includes('220'));
console.log(`\n🏢 Босс Стандарт 220 series: ${boss220.length} products`);

// Check for cupboards (shkаf-kupe)
const kupe = existingData.filter(c => c.url.includes('shkafy-kupe'));
console.log(`🚪 Шкаф-купе (sliding door): ${kupe.length} products`);

// Regular raspashnye
const raspashnye = existingData.filter(c => c.url.includes('raspashnye') && !c.russianName.includes('220'));
console.log(`🚪 Рим raspashnye (regular): ${raspashnye.length} products`);

// Boss standard (not 220)
const bossStandard = existingData.filter(c => c.russianName.includes('BOSS') && !c.russianName.includes('220'));
console.log(`🏢 BOSS STANDART (200cm): ${bossStandard.length} products`);

console.log(`\n💡 INSIGHT:`);
console.log(`We have ${existingData.length} products across these categories.`);
console.log(`Website shows 107 total.`);
console.log(`Missing: ${107 - existingData.length} products\n`);
console.log(`These ${107 - existingData.length} missing items are likely:`);
console.log(`  1. Additional finish/color variants not in main listing`);
console.log(`  2. Products loaded via JavaScript`);
console.log(`  3. Products in hidden subcategories`);
console.log(`  4. Out of stock items not shown in scraping\n`);
