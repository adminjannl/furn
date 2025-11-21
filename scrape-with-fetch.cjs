const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mnogomebeli.com/krovati/';
const OUTPUT_FILE = path.join(__dirname, 'all-beds-fetched-complete.json');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapePage(url) {
  console.log(`📄 Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const products = [];

    $('.catalog-item, .product-item, [data-product]').each((index, element) => {
      try {
        const $el = $(element);

        const $name = $el.find('h3, .product-name, .product-title, [data-product-name]').first();
        const $price = $el.find('.price, .product-price, [data-price]').first();
        const $img = $el.find('img').first();
        const $link = $el.find('a[href*="/krovati/"]').first();

        const name = $name.text().trim();
        const priceText = $price.text().trim();
        const imageUrl = $img.attr('src') || $img.attr('data-src') || '';
        const productUrl = $link.attr('href') || '';

        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://mnogomebeli.com${imageUrl}`;
        const fullProductUrl = productUrl.startsWith('http') ? productUrl : `https://mnogomebeli.com${productUrl}`;

        const priceMatch = priceText.match(/(\d[\d\s]*)/);
        const price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 0;

        if (name && price > 0) {
          products.push({
            russianName: name,
            price: price,
            imageUrl: fullImageUrl,
            productUrl: fullProductUrl,
            extractedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('   ⚠️  Error extracting product:', err.message);
      }
    });

    console.log(`   ✅ Extracted ${products.length} products from this page`);
    return products;

  } catch (error) {
    console.error(`   ❌ Error fetching page: ${error.message}`);
    return [];
  }
}

async function scrapeAllPages() {
  console.log('🚀 Starting bed catalog scraper...\n');

  const allProducts = [];

  const pagesToScrape = [
    BASE_URL,
    `${BASE_URL}?PAGEN_1=2`,
    `${BASE_URL}?PAGEN_1=3`,
    `${BASE_URL}?PAGEN_1=4`,
    `${BASE_URL}?PAGEN_1=5`
  ];

  for (let i = 0; i < pagesToScrape.length; i++) {
    const pageUrl = pagesToScrape[i];
    const pageProducts = await scrapePage(pageUrl);

    if (pageProducts.length === 0 && i > 0) {
      console.log(`   ⚠️  No products on page ${i + 1}, stopping pagination.\n`);
      break;
    }

    allProducts.push(...pageProducts);

    console.log(`   📊 Running total: ${allProducts.length} products\n`);

    if (i < pagesToScrape.length - 1) {
      console.log('   ⏳ Waiting 2 seconds before next request...');
      await delay(2000);
    }
  }

  const uniqueProducts = [];
  const seenNames = new Set();
  const seenUrls = new Set();

  allProducts.forEach(product => {
    const nameKey = product.russianName.toLowerCase().trim();
    const urlKey = product.productUrl.toLowerCase().trim();

    if (!seenNames.has(nameKey) || !seenUrls.has(urlKey)) {
      if (!seenNames.has(nameKey)) {
        seenNames.add(nameKey);
      }
      if (urlKey && !seenUrls.has(urlKey)) {
        seenUrls.add(urlKey);
      }
      uniqueProducts.push(product);
    }
  });

  console.log('\n📊 Scraping Summary:');
  console.log(`   Total products scraped: ${allProducts.length}`);
  console.log(`   Unique products: ${uniqueProducts.length}`);
  console.log(`   Duplicates removed: ${allProducts.length - uniqueProducts.length}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueProducts, null, 2), 'utf-8');
  console.log(`\n💾 Saved ${uniqueProducts.length} products to: ${OUTPUT_FILE}`);

  return uniqueProducts;
}

scrapeAllPages()
  .then(products => {
    console.log('\n✅ Scraping completed successfully!');
    console.log(`📋 Total unique beds: ${products.length}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Scraping failed:', error);
    process.exit(1);
  });
