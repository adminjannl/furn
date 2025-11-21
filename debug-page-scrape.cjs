const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function debugPageStructure() {
  console.log('🔍 Fetching page to analyze structure...\n');

  const response = await fetch('https://mnogomebeli.com/shkafy/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  console.log('📊 Page Analysis:\n');

  // Find all possible product containers
  const containers = [
    '.ty-grid-list__item',
    '.ut2-gl__item',
    '.ty-column',
    '[class*="product"]',
    '[class*="item"]'
  ];

  containers.forEach(selector => {
    const count = $(selector).length;
    if (count > 0) {
      console.log(`${selector}: ${count} elements`);
    }
  });

  // Check if there's a specific grid
  console.log('\n📦 Looking for product grids...');
  const gridClasses = $('[class*="grid"]').map((i, el) => $(el).attr('class')).get();
  console.log('Grid classes found:', [...new Set(gridClasses)].slice(0, 10));

  // Save first 5000 chars to file for manual inspection
  fs.writeFileSync('./page-debug.html', html.substring(0, 10000));
  console.log('\n💾 Saved first 10000 chars to page-debug.html');

  // Try to find products with different approach
  console.log('\n🔎 Trying different product selectors:');

  const testSelectors = [
    'div[class*="product"]',
    'div[class*="item"]',
    '.ut2-gl__item',
    '[data-ca-product-id]'
  ];

  for (const sel of testSelectors) {
    const items = $(sel);
    if (items.length > 0) {
      console.log(`\n✅ ${sel}: Found ${items.length} items`);
      const first = items.first();
      console.log('   Classes:', first.attr('class'));
      console.log('   Has link:', first.find('a').length);
      console.log('   Has image:', first.find('img').length);
    }
  }
}

debugPageStructure().catch(console.error);
