const puppeteer = require('puppeteer');

async function verifyCabinetCount() {
  console.log('🔍 Verifying cabinet count on mnogomebeli.com/shkafy/...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('📄 Loading page...');
    await page.goto('https://mnogomebeli.com/shkafy/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait a bit for any lazy loading
    await page.waitForTimeout(3000);

    // Get the product count from the page
    const count = await page.evaluate(() => {
      // Look for the count in various locations
      const countElement = document.querySelector('.count, .catalog-count, [class*="count"]');
      if (countElement) {
        return countElement.textContent;
      }

      // Count actual product items
      const items = document.querySelectorAll('.catalog-item, .product-item, [class*="item"]');
      return items.length;
    });

    console.log(`\n📊 Product count on page: ${count}`);

    // Get all product links
    const products = await page.evaluate(() => {
      const links = [];
      const seenUrls = new Set();

      // Find all links
      document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.includes('!') && href.includes('/shkafy/') && !href.includes('#review')) {
          const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

          if (!seenUrls.has(fullUrl)) {
            seenUrls.add(fullUrl);

            // Get product name
            const title = a.getAttribute('title');
            const img = a.querySelector('img');
            const imgAlt = img ? img.getAttribute('alt') : null;
            const text = a.textContent.trim();

            let name = title || imgAlt || text;
            name = name.replace(/\s+/g, ' ').trim();

            if (name && name.length > 5 && name.length < 200) {
              links.push({
                url: fullUrl,
                name: name
              });
            }
          }
        }
      });

      return links;
    });

    console.log(`\n✅ Found ${products.length} unique product URLs\n`);

    // Group by base model
    const baseModels = new Map();
    products.forEach(p => {
      // Extract base model name (before color/finish)
      const baseName = p.name
        .replace(/(Белый|Кашемир|Орех Селект|Шиншилла серая|Венге|Дуб).*$/i, '')
        .trim();

      if (!baseModels.has(baseName)) {
        baseModels.set(baseName, []);
      }
      baseModels.get(baseName).push(p);
    });

    console.log(`📦 Base models: ${baseModels.size}`);
    console.log(`🎨 Total variants: ${products.length}\n`);

    // Show breakdown
    console.log('📋 Breakdown by base model:');
    let index = 1;
    for (const [baseName, variants] of baseModels.entries()) {
      console.log(`${index}. ${baseName} - ${variants.length} variant(s)`);
      index++;
      if (index > 10) {
        console.log(`... and ${baseModels.size - 10} more models`);
        break;
      }
    }

    // Save complete data
    const fs = require('fs');
    fs.writeFileSync('./all-107-cabinets-complete.json', JSON.stringify(products, null, 2));
    console.log(`\n💾 Saved ${products.length} products to all-107-cabinets-complete.json`);

  } finally {
    await browser.close();
  }
}

verifyCabinetCount().catch(console.error);
