const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapeArmchairsFromCategoryPage() {
  console.log('\n🖼️  Scraping Armchair Images from Category Page...\n');
  console.log('This will get the exact images shown at: https://mnogomebeli.com/kresla/\n');

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

    // Click "Show More" to load all products
    console.log('🖱️  Loading all products...');
    for (let i = 0; i < 5; i++) {
      const clicked = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button, a, div')];
        const showMore = buttons.find(b => {
          const text = (b.textContent || '').toLowerCase();
          return text.includes('показать') || text.includes('еще') || text.includes('ещё');
        });
        if (showMore) {
          showMore.click();
          return true;
        }
        return false;
      });

      if (!clicked) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🔍 Extracting products with their images...\n');

    // Extract product URLs and their corresponding images from the category page
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

    console.log(`✅ Found ${productsWithImages.length} products with images\n`);

    // Get all existing armchair products from database
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, source_url')
      .ilike('source_url', '%kresla%');

    const urlToProductId = {};
    dbProducts.forEach(p => {
      urlToProductId[p.source_url] = p.id;
    });

    let updated = 0;
    let notFound = 0;

    for (let i = 0; i < productsWithImages.length; i++) {
      const product = productsWithImages[i];
      const progress = `${i + 1}/${productsWithImages.length}`;

      const productId = urlToProductId[product.url];

      if (!productId) {
        console.log(`⚠️  [${progress}] Product not found in DB: ${product.url.substring(0, 60)}`);
        notFound++;
        continue;
      }

      process.stdout.write(`\r[${progress}] Updating images... ${product.title.substring(0, 40).padEnd(40)}`);

      // Delete old images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Insert the category page image as the primary image
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

    console.log('\n\n✅ Category page images imported!');
    console.log(`   Updated: ${updated}`);
    console.log(`   Not found: ${notFound}\n`);

  } finally {
    await browser.close();
  }
}

scrapeArmchairsFromCategoryPage().catch(console.error);
