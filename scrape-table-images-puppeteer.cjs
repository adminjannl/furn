const puppeteer = require('puppeteer');
const fs = require('fs');

const tables = [
  { sku: 'TBL-MNM-0200', url: 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-new-beton-chernyy/' },
  { sku: 'TBL-MNM-0201', url: 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-derevo/' },
  { sku: 'TBL-MNM-0202', url: 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-mramor/' },
  { sku: 'TBL-MNM-0203', url: 'https://mnogomebeli.com/stoly/obedennye/stol-loft-125/!stol-loft-125-kraft-tabachnyy/' },
  { sku: 'TBL-MNM-0204', url: 'https://mnogomebeli.com/stoly/obedennye/stol-loft-slide/!stol-loft-slide-new-orekh-selekt-chyernyy/' },
  { sku: 'TBL-MNM-0205', url: 'https://mnogomebeli.com/stoly/obedennye/stol-loft-slide/!stol-loft-slide-kraft/' },
  { sku: 'TBL-MNM-0206', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-venge/' },
  { sku: 'TBL-MNM-0207', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-kraft/' },
  { sku: 'TBL-MNM-0208', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-sonoma/' },
  { sku: 'TBL-MNM-0209', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-venge/' },
  { sku: 'TBL-MNM-0210', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-kraft/' },
  { sku: 'TBL-MNM-0211', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-sonoma/' },
  { sku: 'TBL-MNM-0212', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss/!stol-boss-wood-brown/' },
  { sku: 'TBL-MNM-0213', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss/!stol-boss-wood-beige/' },
  { sku: 'TBL-MNM-0214', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss/!stol-boss-wood-grafit/' },
  { sku: 'TBL-MNM-0215', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-real/' },
  { sku: 'TBL-MNM-0216', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-dark/' },
  { sku: 'TBL-MNM-0217', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-snow/' },
  { sku: 'TBL-MNM-0218', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-smok/' },
  { sku: 'TBL-MNM-0219', url: 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-boss-xo/!stol-pristavka-boss-xo-wood-rock/' },
  { sku: 'TBL-MNM-0220', url: 'https://mnogomebeli.com/stoly/pismennyy/stol-lux/!stol-pismennyy-lux-sonoma-belyy-sneg/' },
  { sku: 'TBL-MNM-0221', url: 'https://mnogomebeli.com/stoly/pismennyy/stol-simpl/!stol-pismennyy-simpl-belyy-sneg/' }
];

async function scrapeTableImages(page, url, sku) {
  try {
    console.log(`Scraping ${sku}...`);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);

    const images = await page.evaluate(() => {
      const imageUrls = [];

      const sliderImages = document.querySelectorAll('.product-item-detail-slider-container img');
      sliderImages.forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && src.startsWith('https://') && !src.includes('lazy-load')) {
          imageUrls.push(src);
        }
      });

      if (imageUrls.length === 0) {
        const allImages = document.querySelectorAll('.product-item-detail img, .bx-wrapper img, img[itemprop="image"]');
        allImages.forEach(img => {
          const src = img.src || img.getAttribute('data-src');
          if (src && src.startsWith('https://') && !src.includes('lazy-load')) {
            imageUrls.push(src);
          }
        });
      }

      return [...new Set(imageUrls)];
    });

    console.log(`  Found ${images.length} images`);
    return { sku, images: images.slice(0, 5) };

  } catch (error) {
    console.error(`  Error scraping ${sku}:`, error.message);
    return { sku, images: [], error: error.message };
  }
}

async function scrapeAll() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const results = [];

  for (const table of tables) {
    const result = await scrapeTableImages(page, table.url, table.sku);
    results.push(result);
    await page.waitForTimeout(1000);
  }

  await browser.close();

  fs.writeFileSync('tables-correct-images.json', JSON.stringify(results, null, 2));
  console.log('\n✓ Scraping complete! Results saved to tables-correct-images.json');

  const withImages = results.filter(r => r.images.length > 0);
  const withoutImages = results.filter(r => r.images.length === 0);

  console.log(`\nSummary:`);
  console.log(`- Tables with images: ${withImages.length}`);
  console.log(`- Tables without images: ${withoutImages.length}`);

  if (withoutImages.length > 0) {
    console.log('\nTables without images:');
    withoutImages.forEach(t => console.log(`  - ${t.sku}`));
  }
}

scrapeAll().catch(console.error);
