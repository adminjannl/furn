const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllCabinets() {
  console.log('🚀 Starting comprehensive cabinet scraping with Puppeteer...\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('📄 Navigating to: https://mnogomebeli.com/shkafy/\n');

  await page.goto('https://mnogomebeli.com/shkafy/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await page.waitForSelector('.ty-grid-list__item', { timeout: 10000 });

  let initialCount = await page.$$eval('.ty-grid-list__item', items => items.length);
  console.log(`📦 Initial products loaded: ${initialCount}\n`);

  // Click "Show More" until all products are loaded
  let clickAttempts = 0;
  const maxAttempts = 20;

  while (clickAttempts < maxAttempts) {
    try {
      // Wait a bit for any loading
      await page.waitForTimeout(1500);

      // Look for the "Show More" button with various selectors
      const showMoreButton = await page.evaluateHandle(() => {
        // Try multiple possible selectors
        const selectors = [
          '.ty-pagination__item a',
          '.ty-pagination__more',
          'a[class*="more"]',
          'a[class*="show"]',
          '.ty-pagination a'
        ];

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const text = el.textContent.toLowerCase().trim();
            if (text.includes('показать') || text.includes('more') || text.includes('еще')) {
              const rect = el.getBoundingClientRect();
              if (rect.height > 0 && window.getComputedStyle(el).display !== 'none') {
                return el;
              }
            }
          }
        }
        return null;
      });

      if (!showMoreButton || !showMoreButton.asElement()) {
        console.log('✅ No more "Show More" button found - all products loaded!\n');
        break;
      }

      console.log(`🖱️  Clicking "Show More" (attempt ${clickAttempts + 1})...`);

      // Scroll to button
      await page.evaluate(button => {
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, showMoreButton);

      await page.waitForTimeout(500);

      // Click the button
      await showMoreButton.asElement().click();

      // Wait for new content
      await page.waitForTimeout(2000);

      // Check new count
      const newCount = await page.$$eval('.ty-grid-list__item', items => items.length);
      console.log(`   Products now: ${newCount} (added ${newCount - initialCount})`);

      if (newCount === initialCount) {
        console.log('   No new products loaded, stopping...\n');
        break;
      }

      initialCount = newCount;
      clickAttempts++;

    } catch (error) {
      console.log(`   Error clicking: ${error.message}`);
      console.log('✅ Likely reached end of pagination\n');
      break;
    }
  }

  console.log('📦 Extracting all cabinet data...\n');

  const cabinets = await page.evaluate(() => {
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
          imageUrl,
          category: '/shkafy/'
        });
      }
    });

    return results;
  });

  await browser.close();

  console.log(`\n✅ Successfully scraped ${cabinets.length} cabinets!\n`);

  // Filter out Idea series
  const filtered = cabinets.filter(c => !c.russianName.includes('Идея'));

  console.log(`📊 Results:`);
  console.log(`   Total scraped: ${cabinets.length}`);
  console.log(`   Idea series: ${cabinets.length - filtered.length}`);
  console.log(`   Final (no Idea): ${filtered.length}\n`);

  // Save complete data
  fs.writeFileSync('./complete-cabinet-catalog.json', JSON.stringify(filtered, null, 2));
  console.log('💾 Saved to: complete-cabinet-catalog.json\n');

  // Show first 10
  console.log('📋 First 10 cabinets:');
  filtered.slice(0, 10).forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.russianName}`);
  });

  console.log(`\n📊 FINAL COUNT: ${filtered.length} cabinets (excluding Idea series)`);

  return filtered;
}

scrapeAllCabinets().catch(console.error);
