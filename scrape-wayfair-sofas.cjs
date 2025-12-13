const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeWayfairSofas() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Navigating to Wayfair living room furniture page...');
    await page.goto('https://www.wayfair.com/furniture/cat/living-room-furniture-c45982.html', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForTimeout(3000);

    console.log('Extracting product data...');

    const products = await page.evaluate(() => {
      const productList = [];

      const productCards = document.querySelectorAll('[data-enzyme-id="ProductCard"], .ProductCard, [class*="ProductCard"]');
      console.log('Found product cards:', productCards.length);

      productCards.forEach((card, index) => {
        try {
          const nameEl = card.querySelector('[data-enzyme-id="ProductCardName"], h2, [class*="ProductCardName"]');
          const priceEl = card.querySelector('[data-enzyme-id="ProductCardPrice"], .Price, [class*="Price"]');
          const imageEl = card.querySelector('img');
          const linkEl = card.querySelector('a[href*="/product/"]');

          if (nameEl || linkEl) {
            const product = {
              name: nameEl ? nameEl.textContent.trim() : 'Unknown',
              price: priceEl ? priceEl.textContent.trim() : null,
              image: imageEl ? imageEl.src : null,
              url: linkEl ? linkEl.href : null,
              index: index
            };

            productList.push(product);
          }
        } catch (err) {
          console.error('Error parsing product card:', err.message);
        }
      });

      return productList;
    });

    console.log(`\nFound ${products.length} products`);

    const outputFile = 'wayfair-sofas-scraped.json';
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
    console.log(`\nData saved to ${outputFile}`);

    if (products.length > 0) {
      console.log('\nSample product:');
      console.log(JSON.stringify(products[0], null, 2));
    }

    const htmlFile = 'wayfair-page-debug.html';
    const html = await page.content();
    fs.writeFileSync(htmlFile, html);
    console.log(`\nPage HTML saved to ${htmlFile} for debugging`);

    return products;

  } catch (error) {
    console.error('Error scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeWayfairSofas()
  .then(products => {
    console.log('\n✓ Scraping completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Scraping failed:', error);
    process.exit(1);
  });
