const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAll811Sofas() {
  console.log('\n🛋️  Scraping ALL 811 Sofas...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Loading https://mnogomebeli.com/divany/...\n');
    await page.goto('https://mnogomebeli.com/divany/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🖱️  Clicking "Показать еще" until all 811 sofas are loaded...\n');
    console.log('   This will take 5-10 minutes...\n');

    let clickCount = 0;
    let stableCount = 0;
    let previousCount = 0;

    while (clickCount < 200) { // Enough for 811 products
      // Wait for any ongoing loading to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Count unique product URLs
      const currentCount = await page.evaluate(() => {
        const uniqueUrls = new Set();
        document.querySelectorAll('a[href*="/divany/"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.includes('!') && !href.includes('#')) {
            uniqueUrls.add(href);
          }
        });
        return uniqueUrls.size;
      });

      if (currentCount === previousCount) {
        stableCount++;
        console.log(`   Products: ${currentCount} (stable ${stableCount}/3)`);

        if (stableCount >= 3) {
          console.log(`\n   ✅ All products loaded! Total: ${currentCount}\n`);
          break;
        }
      } else {
        stableCount = 0;
        console.log(`   Products: ${currentCount} (+${currentCount - previousCount})`);
      }

      previousCount = currentCount;

      // Find and click the "Показать еще" button
      const buttonClicked = await page.evaluate(() => {
        // Look for the exact button text
        const allElements = Array.from(document.querySelectorAll('*'));

        for (const element of allElements) {
          const text = element.textContent?.trim() || '';
          const tagName = element.tagName?.toLowerCase() || '';

          // Check if this is the show more button
          if (text === 'Показать еще' ||
              (text.includes('Показать') && text.includes('еще')) ||
              (text.includes('Показать') && text.includes('ещё'))) {

            // Make sure it's clickable (button, a, or has click handler)
            if (tagName === 'button' ||
                tagName === 'a' ||
                element.onclick ||
                element.getAttribute('onclick')) {

              // Check if visible
              const rect = element.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                element.click();
                return true;
              }
            }
          }
        }
        return false;
      });

      if (!buttonClicked) {
        console.log(`   ⚠️  "Показать еще" button not found - checking if all products loaded...`);
        stableCount++;
        if (stableCount >= 3) {
          break;
        }
      }

      clickCount++;

      // Longer wait after clicking to let products load
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    console.log('\n🔍 Extracting all products with their images...\n');

    // Extract all products
    const products = await page.evaluate(() => {
      const productMap = new Map();

      document.querySelectorAll('a[href*="/divany/"][href*="!"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.includes('#')) return;

        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        // Only add if not already in map
        if (!productMap.has(fullUrl)) {
          const img = link.querySelector('img');
          const imgSrc = img ? (img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy')) : null;
          const fullImgUrl = imgSrc && imgSrc.includes('http') ? imgSrc : (imgSrc ? `https://mnogomebeli.com${imgSrc}` : null);
          const title = link.getAttribute('title') || img?.getAttribute('alt') || '';

          if (fullImgUrl && fullImgUrl.includes('mnogomebeli.com')) {
            productMap.set(fullUrl, {
              url: fullUrl,
              imageUrl: fullImgUrl,
              title: title.trim()
            });
          }
        }
      });

      return Array.from(productMap.values());
    });

    console.log(`✅ Extracted ${products.length} unique products\n`);

    // Save to file
    if (!fs.existsSync('.scraper-progress')) {
      fs.mkdirSync('.scraper-progress', { recursive: true });
    }

    fs.writeFileSync(
      '.scraper-progress/sofas-all-products.json',
      JSON.stringify(products, null, 2)
    );

    const totalBatches = Math.ceil(products.length / 50);
    const progress = {
      currentBatch: 0,
      totalBatches: totalBatches,
      completedProducts: 0,
      totalProducts: products.length,
      scrapedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      '.scraper-progress/sofas-batch-progress.json',
      JSON.stringify(progress, null, 2)
    );

    console.log(`📦 Ready to import in batches of 50`);
    console.log(`   Total batches: ${totalBatches}`);
    console.log(`   Total products: ${products.length}\n`);
    console.log('💾 Products saved to: .scraper-progress/sofas-all-products.json');
    console.log('📊 Progress saved to: .scraper-progress/sofas-batch-progress.json\n');

    if (products.length < 800) {
      console.log('⚠️  WARNING: Expected ~811 products but only found', products.length);
      console.log('   The scraper may have stopped too early.\n');
    }

  } finally {
    await browser.close();
  }
}

scrapeAll811Sofas().catch(console.error);
