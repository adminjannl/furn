const puppeteer = require('puppeteer');

async function researchCabinetPage() {
  console.log('🔍 Researching cabinet page structure...\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('📄 Loading page...\n');
  await page.goto('https://mnogomebeli.com/shkafy/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Wait for products
  await page.waitForSelector('.ty-grid-list__item', { timeout: 15000 });

  // Research the page
  const research = await page.evaluate(() => {
    const items = document.querySelectorAll('.ty-grid-list__item');
    const firstItem = items[0];

    // Get all possible price selectors
    const priceSelectors = [
      '.ty-price-num',
      '.ty-price',
      '[class*="price"]',
      '.cm-price',
      '.product-price'
    ];

    let priceInfo = {};
    priceSelectors.forEach(sel => {
      const el = firstItem?.querySelector(sel);
      if (el) {
        priceInfo[sel] = el.textContent.trim();
      }
    });

    // Check for Show More button
    const showMoreButtons = document.querySelectorAll('.ty-pagination a, .ty-pagination__more, [class*="more"]');
    const buttons = Array.from(showMoreButtons).map(b => ({
      text: b.textContent.trim(),
      class: b.className,
      visible: window.getComputedStyle(b).display !== 'none'
    }));

    return {
      totalItems: items.length,
      firstItemHTML: firstItem?.innerHTML.substring(0, 1000),
      priceInfo,
      showMoreButtons: buttons,
      pageTitle: document.title
    };
  });

  console.log('📊 Research Results:\n');
  console.log('Total items loaded:', research.totalItems);
  console.log('\nPrice Info:', JSON.stringify(research.priceInfo, null, 2));
  console.log('\nShow More Buttons:', JSON.stringify(research.showMoreButtons, null, 2));
  console.log('\nPage Title:', research.pageTitle);

  await browser.close();
}

researchCabinetPage().catch(console.error);
