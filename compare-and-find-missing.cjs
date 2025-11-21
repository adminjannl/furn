const fs = require('fs');

console.log('🔍 Comparing scraped data with database...\n');

// Load existing data in database
const existingData = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));
console.log(`📦 Products in database: ${existingData.length}`);

// Load newly scraped data
const scrapedData = JSON.parse(fs.readFileSync('./cabinets-scraped-complete.json', 'utf8'));
console.log(`🌐 Products scraped from website: ${scrapedData.length}\n`);

// Create URL sets
const existingUrls = new Set(existingData.map(c => c.url));
const scrapedUrls = new Set(scrapedData.map(c => c.url));

// Find products in scraped but not in database
const newProducts = scrapedData.filter(c => !existingUrls.has(c.url));

// Find products in database but not in scraped (might be removed from website)
const removedProducts = existingData.filter(c => !scrapedUrls.has(c.url));

console.log('📊 COMPARISON RESULTS:\n');
console.log(`✅ Products in both: ${existingData.length - removedProducts.length}`);
console.log(`🆕 New products found: ${newProducts.length}`);
console.log(`⚠️  Products in DB but not scraped: ${removedProducts.length}\n`);

if (newProducts.length > 0) {
  console.log('🆕 NEW PRODUCTS TO ADD:\n');
  newProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.russianName}`);
    console.log(`   URL: ${p.url}`);
  });

  // Save new products
  fs.writeFileSync('./new-products-to-add.json', JSON.stringify(newProducts, null, 2));
  console.log(`\n💾 Saved ${newProducts.length} new products to new-products-to-add.json`);
}

if (removedProducts.length > 0) {
  console.log('\n⚠️  PRODUCTS IN DB BUT NOT ON WEBSITE:\n');
  removedProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.russianName}`);
  });
}

console.log('\n💡 ANALYSIS:');
console.log(`   Current in DB: ${existingData.length}`);
console.log(`   Currently scrape-able: ${scrapedData.length}`);
console.log(`   Website claims: 107 products`);
console.log(`   Missing from scraping: ${107 - scrapedData.length} (likely JS-loaded)`);
console.log(`\n   If we add ${newProducts.length} new products, we'll have: ${existingData.length + newProducts.length} total`);
