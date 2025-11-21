require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllBeds() {
  console.log('🚀 Starting bed scraping with pagination...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const allBeds = [];
    const url = 'https://mnogomebeli.com/krovati/';

    console.log(`📄 Loading page: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for initial products to load
    await page.waitForSelector('.product-card, .product-item, [class*="product"]', { timeout: 10000 });

    let previousCount = 0;
    let attempts = 0;
    const maxAttempts = 10;

    // Keep clicking "View More" until no more products load
    while (attempts < maxAttempts) {
      // Get current product count
      const currentProducts = await page.evaluate(() => {
        const products = [];
        const productCards = document.querySelectorAll('.product-card, .product-item, [class*="product-grid"] > div, .product');

        productCards.forEach(card => {
          try {
            // Try multiple selectors for product name
            const nameEl = card.querySelector('h3, h2, .product-name, .product-title, [class*="product-name"], [class*="title"]');
            const linkEl = card.querySelector('a[href*="/product/"]');
            const imgEl = card.querySelector('img');

            if (nameEl && linkEl) {
              const name = nameEl.textContent.trim();
              const url = linkEl.href;
              const imageUrl = imgEl ? (imgEl.src || imgEl.dataset.src) : null;

              if (name && url) {
                products.push({ name, url, imageUrl });
              }
            }
          } catch (err) {
            // Skip problematic cards
          }
        });

        return products;
      });

      console.log(`📦 Found ${currentProducts.length} products so far...`);

      // Add new products to our collection (avoid duplicates by URL)
      currentProducts.forEach(product => {
        if (!allBeds.find(bed => bed.url === product.url)) {
          allBeds.push(product);
        }
      });

      // Check if we found new products
      if (allBeds.length === previousCount) {
        console.log('⚠️  No new products found, checking for "View More" button...');
        attempts++;
      } else {
        attempts = 0; // Reset attempts when we find new products
      }

      previousCount = allBeds.length;

      // Try to find and click "View More" button
      const buttonClicked = await page.evaluate(() => {
        // Look for various "View More" button selectors
        const selectors = [
          'button:contains("View More")',
          'button:contains("Load More")',
          'button:contains("Показать еще")',
          'button:contains("Загрузить еще")',
          '.load-more',
          '.view-more',
          '[class*="load-more"]',
          '[class*="show-more"]'
        ];

        // Try clicking buttons by text content
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const loadButton = buttons.find(btn => {
          const text = btn.textContent.toLowerCase();
          return text.includes('view more') ||
                 text.includes('load more') ||
                 text.includes('показать') ||
                 text.includes('загрузить') ||
                 text.includes('еще');
        });

        if (loadButton && loadButton.offsetParent !== null) {
          loadButton.click();
          return true;
        }

        return false;
      });

      if (!buttonClicked) {
        console.log('❌ No "View More" button found or clickable');
        break;
      }

      console.log('✅ Clicked "View More" button, waiting for new products...');

      // Wait for new products to load
      await page.waitForTimeout(2000);

      // Wait for network to settle
      await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});

      // Safety check: if we have 95+ beds, we're done
      if (allBeds.length >= 95) {
        console.log('🎯 Reached target of 95 beds!');
        break;
      }
    }

    console.log(`\n✅ Scraping complete! Found ${allBeds.length} total beds`);

    // Save to file
    fs.writeFileSync(
      './all-95-beds-scraped.json',
      JSON.stringify(allBeds, null, 2)
    );

    console.log('💾 Saved to all-95-beds-scraped.json');

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`Total beds found: ${allBeds.length}`);
    console.log(`Expected: 95`);
    console.log(`Missing: ${Math.max(0, 95 - allBeds.length)}`);

    return allBeds;

  } catch (error) {
    console.error('❌ Error during scraping:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeAllBeds().catch(console.error);
