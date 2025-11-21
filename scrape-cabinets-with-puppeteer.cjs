const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllCabinets() {
  console.log('🚀 Starting Puppeteer to scrape all cabinets...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  console.log('📄 Loading page: https://mnogomebeli.com/shkafy/\n');

  await page.goto('https://mnogomebeli.com/shkafy/', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('⏳ Waiting for products to load...\n');
  await page.waitForSelector('.ty-grid-list__item', { timeout: 10000 });

  // Count initial products
  let initialCount = await page.$$eval('.ty-grid-list__item', items => items.length);
  console.log(`📦 Initial products loaded: ${initialCount}\n`);

  // Click "Show More" button repeatedly until all products are loaded
  let clickCount = 0;
  const maxClicks = 10;

  while (clickCount < maxClicks) {
    try {
      // Look for various possible "Show More" selectors
      const showMoreSelectors = [
        '.ty-pagination__item .ty-pagination__more',
        'a.ty-pagination__more',
        '.ty-pagination__more',
        '[class*="show-more"]',
        '[class*="load-more"]'
      ];

      let buttonFound = false;

      for (const selector of showMoreSelectors) {
        const button = await page.$(selector);

        if (button) {
          const isVisible = await page.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.height > 0 &&
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   style.opacity !== '0';
          }, button);

          if (isVisible) {
            console.log(`🖱️  Found "Show More" button (${selector}), clicking...`);

            // Scroll to button
            await page.evaluate(el => el.scrollIntoView(), button);
            await page.waitForTimeout(500);

            // Click button
            await button.click();
            await page.waitForTimeout(2000);

            // Check if more products loaded
            const newCount = await page.$$eval('.ty-grid-list__item', items => items.length);
            console.log(`   Products now: ${newCount} (added ${newCount - initialCount})`);

            if (newCount === initialCount) {
              console.log('   No new products loaded, stopping...\n');
              buttonFound = false;
              break;
            }

            initialCount = newCount;
            buttonFound = true;
            clickCount++;
            break;
          }
        }
      }

      if (!buttonFound) {
        console.log('✅ No more "Show More" button found - all products loaded!\n');
        break;
      }

    } catch (error) {
      console.log(`✅ Finished loading products (${error.message})\n`);
      break;
    }
  }

  console.log('📦 Extracting product data...\n');

  // Extract all products
  const products = await page.evaluate(() => {
    const items = document.querySelectorAll('.ty-grid-list__item');
    const results = [];

    items.forEach(item => {
      const linkEl = item.querySelector('.product-title a');
      const imgEl = item.querySelector('.ty-pict img');

      if (linkEl) {
        const russianName = linkEl.textContent.trim();
        const url = linkEl.href;

        let imageUrl = '';
        if (imgEl) {
          imageUrl = imgEl.src || imgEl.dataset.src || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = 'https://mnogomebeli.com' + imageUrl;
          }
        }

        results.push({
          russianName,
          url,
          imageUrl
        });
      }
    });

    return results;
  });

  await browser.close();

  console.log(`\n✅ Successfully scraped ${products.length} cabinets!\n`);

  // Filter out "Idea" series
  const filtered = products.filter(p => !p.russianName.includes('Идея'));

  console.log(`📊 Results:`);
  console.log(`   Total scraped: ${products.length}`);
  console.log(`   Idea series removed: ${products.length - filtered.length}`);
  console.log(`   Final count: ${filtered.length}\n`);

  // Save to file
  fs.writeFileSync('./all-cabinets-puppeteer.json', JSON.stringify(filtered, null, 2));
  console.log('💾 Saved to: all-cabinets-puppeteer.json\n');

  // Show first 10
  console.log('📋 First 10 products:');
  filtered.slice(0, 10).forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.russianName}`);
  });

  return filtered;
}

scrapeAllCabinets().catch(console.error);
