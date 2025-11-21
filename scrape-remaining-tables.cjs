const fetch = require('node-fetch');
const fs = require('fs');

const remainingTables = [
  { sku: 'TBL-MNM-0209', name: 'Журнальный стол LUX NEW Венге', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-venge/' },
  { sku: 'TBL-MNM-0210', name: 'Журнальный стол LUX NEW Крафт табачный', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-kraft/' },
  { sku: 'TBL-MNM-0211', name: 'Журнальный стол LUX new Сонома', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-sonoma/' },
  { sku: 'TBL-MNM-0212', name: 'Стол журнальный BOSS 42 см Wood Brown', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss/!stol-boss-wood-brown/' },
  { sku: 'TBL-MNM-0213', name: 'Стол журнальный BOSS 42 см Wood Beige', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss/!stol-boss-wood-beige/' },
  { sku: 'TBL-MNM-0214', name: 'Стол журнальный BOSS 42 см Wood Grafit', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss/!stol-boss-wood-grafit/' },
  { sku: 'TBL-MNM-0215', name: 'Стол-приставка BOSS.XO WOOD Real', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-real/' },
  { sku: 'TBL-MNM-0216', name: 'Стол-приставка BOSS.XO WOOD Dark', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-dark/' },
  { sku: 'TBL-MNM-0217', name: 'Стол-приставка BOSS.XO WOOD Snow', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-snow/' },
  { sku: 'TBL-MNM-0218', name: 'Стол-приставка BOSS.XO WOOD Smok', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-smok/' },
  { sku: 'TBL-MNM-0219', name: 'Стол-приставка BOSS.XO WOOD Rock', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-rock/' },
  { sku: 'TBL-MNM-0220', name: 'Письменный стол LUX Сонома, Белый снег', url: 'https://mnogomebeli.com/stoly/pismennyy/stol-lux/!stol-pismennyy-lux-sonoma-belyy-sneg/' },
  { sku: 'TBL-MNM-0221', name: 'Стол письменный СИМПЛ Белый снег', url: 'https://mnogomebeli.com/stoly/pismennyy/stol-simpl/!stol-pismennyy-simpl-belyy-sneg/' }
];

async function scrapeTableImages(url, sku, name) {
  try {
    console.log(`Scraping ${sku}: ${name}`);

    const response = await fetch(url);
    const html = await response.text();

    // Try multiple patterns
    const patterns = [
      /https:\/\/mnogomebeli\.com\/upload\/iblock\/[a-z0-9]+\/[a-z0-9]+\/[^"'\s<>]+\.(?:jpg|png|webp)/gi,
      /https:\/\/mnogomebeli\.com\/upload\/resize_cache\/iblock\/[a-z0-9]+\/[a-z0-9]+\/[^"'\s<>]+\.(?:jpg|png|webp)/gi,
      /\/upload\/iblock\/[a-z0-9]+\/[a-z0-9]+\/[^"'\s<>]+\.(?:jpg|png|webp)/gi,
      /\/upload\/resize_cache\/iblock\/[a-z0-9]+\/[a-z0-9]+\/[^"'\s<>]+\.(?:jpg|png|webp)/gi
    ];

    let allImages = [];
    for (const pattern of patterns) {
      const matches = html.match(pattern);
      if (matches) {
        allImages = allImages.concat(matches);
      }
    }

    if (allImages.length > 0) {
      // Add base URL if needed
      const images = allImages.map(img =>
        img.startsWith('http') ? img : `https://mnogomebeli.com${img}`
      );

      // Filter and dedupe
      const unique = [...new Set(images)];
      const filtered = unique.filter(img =>
        !img.toLowerCase().includes('bed') &&
        !img.toLowerCase().includes('krov') &&
        !img.toLowerCase().includes('lazy') &&
        !img.toLowerCase().includes('logo')
      );

      console.log(`  Found ${filtered.length} images`);
      return { sku, name, images: filtered.slice(0, 5) };
    }

    console.log(`  No images found`);
    return { sku, name, images: [] };

  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { sku, name, images: [], error: error.message };
  }
}

async function scrapeAll() {
  const results = [];

  for (const table of remainingTables) {
    const result = await scrapeTableImages(table.url, table.sku, table.name);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Load existing results
  const existing = JSON.parse(fs.readFileSync('tables-with-real-images.json', 'utf8'));

  // Merge results
  results.forEach(newResult => {
    const index = existing.findIndex(e => e.sku === newResult.sku);
    if (index !== -1) {
      existing[index] = newResult;
    }
  });

  fs.writeFileSync('tables-with-real-images.json', JSON.stringify(existing, null, 2));
  console.log('\n✓ Scraping complete! Updated tables-with-real-images.json');

  const withImages = results.filter(r => r.images.length > 0);
  const withoutImages = results.filter(r => r.images.length === 0);

  console.log(`\nNew results:`);
  console.log(`- Tables with images: ${withImages.length}`);
  console.log(`- Tables without images: ${withoutImages.length}`);

  if (withoutImages.length > 0) {
    console.log('\nStill missing images:');
    withoutImages.forEach(t => console.log(`  - ${t.sku}: ${t.name}`));
  }
}

scrapeAll().catch(console.error);
