const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapeAll64Armchairs() {
  console.log('\n🪑 Scraping ALL 64 Armchairs from Category Page...\n');
  console.log('URL: https://mnogomebeli.com/kresla/\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Loading category page...');
    await page.goto('https://mnogomebeli.com/kresla/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Click "Show More" button repeatedly until all products are loaded
    console.log('🖱️  Clicking "Show More" to load all 64 products...\n');
    let clickCount = 0;
    let previousProductCount = 0;

    while (clickCount < 10) { // Safety limit
      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('a[href*="/kresla/"][href*="!"]').length;
      });

      console.log(`   Products visible: ${currentCount}`);

      if (currentCount === previousProductCount && previousProductCount > 0) {
        console.log('   ✓ All products loaded!');
        break;
      }

      previousProductCount = currentCount;

      // Try to click "Show More" button
      const clicked = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button, a, div[class*="show"], div[class*="load"]')];
        const showMore = buttons.find(b => {
          const text = (b.textContent || '').toLowerCase();
          return text.includes('показать') || text.includes('еще') || text.includes('ещё') ||
                 text.includes('load') || text.includes('more');
        });
        if (showMore && showMore.offsetParent !== null) { // Check if visible
          showMore.click();
          return true;
        }
        return false;
      });

      if (!clicked) {
        console.log('   ⚠️  No "Show More" button found - all products may already be loaded');
        break;
      }

      clickCount++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🔍 Extracting products with their images...\n');

    // Extract product URLs and their corresponding images
    const productsWithImages = await page.evaluate(() => {
      const products = [];
      const productCards = document.querySelectorAll('a[href*="/kresla/"][href*="!"]');

      productCards.forEach(card => {
        const href = card.getAttribute('href');
        if (!href || href.includes('#')) return;

        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        // Find the image within this product card
        const img = card.querySelector('img');
        const imgSrc = img ? (img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy')) : null;
        const fullImgUrl = imgSrc && imgSrc.includes('http') ? imgSrc : (imgSrc ? `https://mnogomebeli.com${imgSrc}` : null);

        const title = card.getAttribute('title') || img?.getAttribute('alt') || '';

        if (fullImgUrl && fullImgUrl.includes('mnogomebeli.com')) {
          products.push({
            url: fullUrl,
            imageUrl: fullImgUrl,
            title: title.trim()
          });
        }
      });

      // Remove duplicates by URL
      const uniqueProducts = {};
      products.forEach(p => {
        if (!uniqueProducts[p.url]) {
          uniqueProducts[p.url] = p;
        }
      });

      return Object.values(uniqueProducts);
    });

    console.log(`✅ Found ${productsWithImages.length} unique products with images\n`);

    if (productsWithImages.length < 60) {
      console.log('⚠️  WARNING: Expected 64 products but only found', productsWithImages.length);
      console.log('    Some products may not have loaded properly.\n');
    }

    // Get all existing armchair products from database
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, source_url, name')
      .ilike('source_url', '%kresla%');

    console.log(`Database has ${dbProducts.length} existing armchair products\n`);

    const urlToProductId = {};
    dbProducts.forEach(p => {
      urlToProductId[p.source_url] = p.id;
    });

    let updated = 0;
    let newProducts = 0;

    for (let i = 0; i < productsWithImages.length; i++) {
      const product = productsWithImages[i];
      const progress = `${i + 1}/${productsWithImages.length}`;

      const productId = urlToProductId[product.url];

      if (!productId) {
        console.log(`📝 [${progress}] NEW PRODUCT: ${product.title}`);
        console.log(`    URL: ${product.url}`);
        newProducts++;
        continue;
      }

      process.stdout.write(`\r[${progress}] Updating: ${product.title.substring(0, 50).padEnd(50)}`);

      // Delete old images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Insert the category page image
      await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: product.imageUrl,
          display_order: 0,
          alt_text: product.title
        });

      updated++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n\n✅ Scraping complete!');
    console.log(`   Total products found: ${productsWithImages.length}`);
    console.log(`   Updated existing: ${updated}`);
    console.log(`   New products (not in DB): ${newProducts}\n`);

    if (newProducts > 0) {
      console.log('⚠️  ACTION REQUIRED:');
      console.log(`   ${newProducts} products found on website but not in database.`);
      console.log('   These need to be scraped and imported.\n');
    }

  } finally {
    await browser.close();
  }
}

scrapeAll64Armchairs().catch(console.error);
