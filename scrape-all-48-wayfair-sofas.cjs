const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeWayfairSofas() {
  console.log('============================================================');
  console.log('SCRAPING WAYFAIR SOFAS - ALL 48 PRODUCTS FROM PAGE 1');
  console.log('============================================================\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  try {
    console.log('Navigating to Wayfair sofas page...');
    await page.goto('https://www.wayfair.com/furniture/sb0/sofas-c413892.html', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    console.log('Waiting for products to load...');
    await page.waitForSelector('[data-hb-id]', { timeout: 30000 });

    await page.waitForTimeout(3000);

    console.log('Scrolling to load all products...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000);

    console.log('Extracting product data...');
    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll('[data-hb-id]');
      const results = [];

      productCards.forEach((card, index) => {
        try {
          const nameEl = card.querySelector('h2[data-test-id="ListingCard-ListingCardName-Text"]');
          const name = nameEl?.textContent?.trim();

          const imgEl = card.querySelector('img');
          const image = imgEl?.src || imgEl?.getAttribute('data-src');

          const priceEl = card.querySelector('[class*="ProductCard-price"], [class*="PriceLabel"]');
          const priceText = priceEl?.textContent?.trim();
          const priceMatch = priceText?.match(/\$[\d,]+\.?\d*/);
          const price = priceMatch ? priceMatch[0] : null;

          const originalPriceEl = card.querySelector('[class*="original"], [class*="Original"], [class*="strike"]');
          const originalPriceText = originalPriceEl?.textContent?.trim();
          const originalPriceMatch = originalPriceText?.match(/\$[\d,]+\.?\d*/);
          const original_price = originalPriceMatch ? originalPriceMatch[0] : null;

          const manufacturerEl = card.querySelector('[class*="manufacturer"], [class*="Manufacturer"], [class*="brand"], [class*="Brand"]');
          const manufacturer = manufacturerEl?.textContent?.trim() || null;

          const ratingEl = card.querySelector('[class*="rating"], [class*="Rating"], [class*="stars"]');
          const ratingText = ratingEl?.getAttribute('aria-label') || ratingEl?.textContent;
          const ratingMatch = ratingText?.match(/([\d.]+)\s*(?:out of|\/)\s*5/i);
          const rating = ratingMatch ? ratingMatch[1] : null;

          const reviewEl = card.querySelector('[class*="review"]');
          const reviewText = reviewEl?.textContent?.trim();
          const reviewMatch = reviewText?.match(/(\d+)/);
          const review_count = reviewMatch ? reviewMatch[1] : null;

          const badgeEl = card.querySelector('[class*="Badge"], [class*="badge"], [class*="label"]');
          const badge = badgeEl?.textContent?.trim() || null;

          const linkEl = card.querySelector('a[href*="/pdp/"]');
          const url = linkEl ? 'https://www.wayfair.com' + linkEl.getAttribute('href') : null;

          if (name && price) {
            results.push({
              id: `WAY-${String(index + 1).padStart(4, '0')}`,
              sku: null,
              name,
              manufacturer,
              price,
              original_price,
              image,
              url,
              rating,
              review_count,
              availability: null,
              badge,
              source: 'wayfair',
              scraped_at: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Error parsing product:', err.message);
        }
      });

      return results;
    });

    console.log(`\n✓ Successfully scraped ${products.length} products\n`);

    if (products.length > 0) {
      console.log('Sample products:');
      products.slice(0, 3).forEach((p) => {
        console.log(`  - ${p.name} (${p.price})`);
      });
    }

    const filename = './wayfair-sofas-all-48.json';
    fs.writeFileSync(filename, JSON.stringify(products, null, 2));
    console.log(`\n✓ Saved ${products.length} products to ${filename}`);

    await browser.close();

    console.log('\n============================================================');
    console.log('SCRAPING COMPLETE');
    console.log('============================================================');

    return products;
  } catch (error) {
    console.error('Error during scraping:', error);
    await browser.close();
    throw error;
  }
}

scrapeWayfairSofas().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
