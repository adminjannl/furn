const fs = require('fs');

// Load the scraped data
const cabinetsFinal = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));

console.log('📊 Cabinet Data Analysis\n');
console.log(`Total products in JSON: ${cabinetsFinal.length}`);
console.log(`Total products in DB: 83 (confirmed from query)\n`);

// Group by base model (remove color/finish from name)
const baseModels = new Map();

cabinetsFinal.forEach(cabinet => {
  // Remove color/finish variations from the name
  const baseName = cabinet.russianName
    .replace(/(Белый|Кашемир серый|Кашемир|Орех Селект|Шиншилла серая|Венге|Дуб)$/i, '')
    .trim();

  if (!baseModels.has(baseName)) {
    baseModels.set(baseName, []);
  }
  baseModels.get(baseName).push(cabinet);
});

console.log(`📦 Unique base models: ${baseModels.size}`);
console.log(`🎨 Total variants: ${cabinetsFinal.length}\n`);

// Find models with multiple colors
console.log('🎨 Models with multiple color variants:\n');
let totalVariants = 0;
for (const [baseName, variants] of baseModels.entries()) {
  if (variants.length > 1) {
    console.log(`  ${baseName}`);
    console.log(`    Colors: ${variants.length} - ${variants.map(v => {
      const match = v.russianName.match(/(Белый|Кашемир серый|Кашемир|Орех Селект|Шиншилла серая|Венге|Дуб)$/i);
      return match ? match[1] : 'Unknown';
    }).join(', ')}`);
    totalVariants += variants.length;
  }
}

console.log(`\n📊 Summary:`);
console.log(`  - Base models with variants: ${Array.from(baseModels.values()).filter(v => v.length > 1).length}`);
console.log(`  - Total variants from these: ${totalVariants}`);
console.log(`  - Single-variant models: ${Array.from(baseModels.values()).filter(v => v.length === 1).length}`);
console.log(`\n💡 Analysis:`);
console.log(`  We have ${cabinetsFinal.length} products = ${baseModels.size} base models with color variations`);
console.log(`  Website shows 107 products total`);
console.log(`  Difference: ${107 - cabinetsFinal.length} products are missing`);
console.log(`\n  These missing ${107 - cabinetsFinal.length} products are likely:`);
console.log(`    - Additional color variants we haven't scraped yet`);
console.log(`    - Products that require JavaScript to load`);
console.log(`    - Products in subcategories or hidden sections`);
