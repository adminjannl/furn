const fetch = require('node-fetch');
const fs = require('fs');

const tables = [
  { sku: 'TBL-MNM-0200', name: 'Стол Boss One NEW Бетон, черный', url: 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-new-beton-chernyy/' },
  { sku: 'TBL-MNM-0201', name: 'Стол Boss One NEW Дуб вотан, Черный', url: 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-derevo/' },
  { sku: 'TBL-MNM-0202', name: 'Стол Boss One NEW Белый мрамор, Белый', url: 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-mramor/' },
  { sku: 'TBL-MNM-0203', name: 'Стол Лофт-125 Крафт табачный', url: 'https://mnogomebeli.com/stoly/obedennye/stol-loft-125/!stol-loft-125-kraft-tabachnyy/' },
  { sku: 'TBL-MNM-0204', name: 'Стол ЛОФТ Slide NEW Орех Селект, Чёрный', url: 'https://mnogomebeli.com/stoly/obedennye/stol-loft-slide/!stol-loft-slide-new-orekh-selekt-chyernyy/' },
  { sku: 'TBL-MNM-0205', name: 'Стол ЛОФТ Slide NEW Крафт табачный, Чёрный', url: 'https://mnogomebeli.com/stoly/obedennye/stol-loft-slide/!stol-loft-slide-kraft/' },
  { sku: 'TBL-MNM-0206', name: 'Стол-трансформер LUX венге', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-venge/' },
  { sku: 'TBL-MNM-0207', name: 'Стол-трансформер LUX Крафт', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-kraft/' },
  { sku: 'TBL-MNM-0208', name: 'Стол-трансформер LUX Сонома', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-sonoma/' },
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

    const imageMatches = html.match(/https:\/\/mnogomebeli\.com\/upload\/[^"'\s]+\.(jpg|png|webp)[^"'\s]*/gi);

    if (imageMatches) {
      const unique = [...new Set(imageMatches)];

      const filteredImages = unique.filter(img =>
        !img.toLowerCase().includes('bed') &&
        !img.toLowerCase().includes('krov') &&
        !img.toLowerCase().includes('lazy')
      );

      console.log(`  Found ${filteredImages.length} images`);
      return { sku, name, images: filteredImages.slice(0, 5) };
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

  for (const table of tables) {
    const result = await scrapeTableImages(table.url, table.sku, table.name);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  fs.writeFileSync('tables-with-real-images.json', JSON.stringify(results, null, 2));
  console.log('\n✓ Scraping complete! Results saved to tables-with-real-images.json');

  const withImages = results.filter(r => r.images.length > 0);
  const withoutImages = results.filter(r => r.images.length === 0);

  console.log(`\nSummary:`);
  console.log(`- Tables with images: ${withImages.length}`);
  console.log(`- Tables without images: ${withoutImages.length}`);
  console.log(`- Total images: ${withImages.reduce((sum, t) => sum + t.images.length, 0)}`);

  if (withoutImages.length > 0) {
    console.log('\nTables without images:');
    withoutImages.forEach(t => console.log(`  - ${t.sku}: ${t.name}`));
  }
}

scrapeAll().catch(console.error);
