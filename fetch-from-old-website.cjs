const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fetchOldWebsiteProducts() {
  console.log('Fetching products from old website...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set a longer timeout
  page.setDefaultTimeout(60000);

  // Monitor network requests to catch API calls
  const apiCalls = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('supabase') || url.includes('api') || url.includes('products')) {
      try {
        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          apiCalls.push({ url, data: json });
        }
      } catch (e) {
        // Skip non-JSON responses
      }
    }
  });

  console.log('Loading sofas page...');
  await page.goto('https://furniture-webshop-de-pjua.bolt.host/category/sofas', {
    waitUntil: 'networkidle2'
  });

  // Wait a bit for products to load
  await page.waitForTimeout(5000);

  // Try to extract products from the page
  const products = await page.evaluate(() => {
    const productElements = document.querySelectorAll('[data-product], .product-card, [class*="product"]');
    const products = [];

    productElements.forEach(el => {
      const nameEl = el.querySelector('h2, h3, .product-name, [class*="name"]');
      const priceEl = el.querySelector('[class*="price"]');
      const imgEl = el.querySelector('img');
      const linkEl = el.querySelector('a');

      if (nameEl) {
        products.push({
          name: nameEl.textContent?.trim(),
          price: priceEl?.textContent?.trim(),
          image: imgEl?.src,
          url: linkEl?.href
        });
      }
    });

    return products;
  });

  console.log(`Found ${products.length} products on page`);
  console.log(`Captured ${apiCalls.length} API calls`);

  // Save the data
  const fs = require('fs');
  fs.writeFileSync('old-website-products.json', JSON.stringify({
    products,
    apiCalls
  }, null, 2));

  console.log('\nSaved to old-website-products.json');

  // Also save page HTML for analysis
  const html = await page.content();
  fs.writeFileSync('old-website-page.html', html);
  console.log('Saved HTML to old-website-page.html');

  await browser.close();

  // If we found API calls with product data, extract and import them
  for (const call of apiCalls) {
    if (call.data && Array.isArray(call.data)) {
      console.log(`\nFound ${call.data.length} products in API call to ${call.url}`);
      console.log('Sample:', JSON.stringify(call.data[0], null, 2));
    }
  }
}

fetchOldWebsiteProducts().catch(console.error);
