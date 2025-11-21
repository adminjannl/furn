const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mnogomebeli.com/krovati/';
const OUTPUT_FILE = path.join(__dirname, 'all-beds-complete-with-pagination.json');

async function scrapeAllBedsWithPagination() {
  console.log('🚀 Starting enhanced bed scraper with pagination support...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Navigating to:', BASE_URL);
    await page.goto(BASE_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForTimeout(2000);

    let clickCount = 0;
    let maxClicks = 10;

    console.log('🔄 Loading all products via pagination...');

    while (clickCount < maxClicks) {
      try {
        const showMoreButton = await page.$('button.show-more, a.show-more, .show-more-btn, [data-action="show-more"]');

        if (!showMoreButton) {
          console.log('✅ No more "Show More" button found. All products loaded.');
          break;
        }

        const isVisible = await showMoreButton.isVisible().catch(() => false);
        if (!isVisible) {
          console.log('✅ "Show More" button not visible. All products loaded.');
          break;
        }

        console.log(`   Clicking "Show More" button (attempt ${clickCount + 1})...`);

        await showMoreButton.click();

        await page.waitForTimeout(2000);

        clickCount++;

        if (clickCount >= maxClicks) {
          console.log('⚠️  Reached maximum click attempts. Proceeding with current products...');
        }
      } catch (error) {
        console.log('✅ Pagination complete or button not found:', error.message);
        break;
      }
    }

    console.log('📊 Extracting product data...');

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product-item, .catalog-item, [data-product], .product-card');
      const extractedProducts = [];

      productElements.forEach((element, index) => {
        try {
          const nameElement = element.querySelector('h3, .product-name, .product-title, [data-product-name]');
          const priceElement = element.querySelector('.price, .product-price, [data-price]');
          const imgElement = element.querySelector('img');
          const linkElement = element.querySelector('a[href*="/krovati/"]');

          const name = nameElement?.textContent?.trim() || '';
          const priceText = priceElement?.textContent?.trim() || '';
          const imageUrl = imgElement?.src || imgElement?.getAttribute('data-src') || '';
          const productUrl = linkElement?.href || '';

          const priceMatch = priceText.match(/(\d[\d\s]*)/);
          const price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 0;

          if (name && price > 0) {
            extractedProducts.push({
              russianName: name,
              price: price,
              imageUrl: imageUrl,
              productUrl: productUrl,
              extractedAt: new Date().toISOString(),
              index: index
            });
          }
        } catch (err) {
          console.error('Error extracting product:', err.message);
        }
      });

      return extractedProducts;
    });

    console.log(`✅ Successfully extracted ${products.length} products`);

    const uniqueProducts = [];
    const seenNames = new Set();
    const seenUrls = new Set();

    products.forEach(product => {
      const nameKey = product.russianName.toLowerCase().trim();
      const urlKey = product.productUrl.toLowerCase().trim();

      if (!seenNames.has(nameKey) && !seenUrls.has(urlKey)) {
        seenNames.add(nameKey);
        if (urlKey) seenUrls.add(urlKey);
        uniqueProducts.push(product);
      }
    });

    console.log(`🔍 Removed ${products.length - uniqueProducts.length} duplicates`);
    console.log(`📦 Final count: ${uniqueProducts.length} unique products`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    console.log(`💾 Saved to: ${OUTPUT_FILE}`);

    console.log('\n📊 Summary:');
    console.log(`   Total products scraped: ${products.length}`);
    console.log(`   Unique products: ${uniqueProducts.length}`);
    console.log(`   Duplicates removed: ${products.length - uniqueProducts.length}`);
    console.log(`   Pagination clicks: ${clickCount}`);

    return uniqueProducts;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeAllBedsWithPagination()
  .then(products => {
    console.log('\n✅ Scraping completed successfully!');
    console.log(`📋 Total unique beds: ${products.length}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Scraping failed:', error);
    process.exit(1);
  });
