const puppeteer = require('puppeteer');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BATCH_SIZE = 50;
const PROGRESS_FILE = '.scraper-progress/sofas-batch-progress.json';
const PRODUCTS_FILE = '.scraper-progress/sofas-all-products.json';

// Ensure progress directory exists
if (!fs.existsSync('.scraper-progress')) {
  fs.mkdirSync('.scraper-progress', { recursive: true });
}

async function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { currentBatch: 0, totalBatches: 0, completedProducts: 0, totalProducts: 0 };
}

async function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function loadAllProducts() {
  if (fs.existsSync(PRODUCTS_FILE)) {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  }
  return null;
}

async function saveAllProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

async function scrapeAllSofas() {
  console.log('\n🛋️  Scraping ALL Sofas from Category Page...\n');
  console.log('URL: https://mnogomebeli.com/divany/\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Loading category page...');
    await page.goto('https://mnogomebeli.com/divany/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Click "Show More" button until all products are loaded
    console.log('🖱️  Clicking "Показать еще" to load all 811 sofas...\n');
    console.log('   This will take several minutes...\n');

    let clickCount = 0;
    let previousProductCount = 0;
    let noChangeCount = 0;

    while (clickCount < 100) { // Increased limit for 811 products
      // Get unique product URLs count
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

      if (currentCount === previousProductCount) {
        noChangeCount++;
        if (noChangeCount >= 3) {
          console.log(`\n   ✓ All products loaded! Total: ${currentCount}`);
          break;
        }
      } else {
        noChangeCount = 0;
        console.log(`   Loaded: ${currentCount} unique products...`);
      }

      previousProductCount = currentCount;

      // Try to click "Show More" button
      const clicked = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button, a, div, span, [class*="show"], [class*="load"]')];
        const showMore = buttons.find(b => {
          const text = (b.textContent || '').toLowerCase().trim();
          return (text.includes('показать') && (text.includes('еще') || text.includes('ещё'))) ||
                 text.includes('load more') || text.includes('show more');
        });
        if (showMore && showMore.offsetParent !== null) {
          showMore.click();
          return true;
        }
        return false;
      });

      if (!clicked && noChangeCount > 1) {
        console.log('\n   ⚠️  No more "Show More" button - all products loaded');
        break;
      }

      clickCount++;
      await new Promise(resolve => setTimeout(resolve, 1500)); // Faster loading
    }

    console.log('\n🔍 Extracting all products with images...\n');

    // Extract product URLs and their corresponding images
    const productsWithImages = await page.evaluate(() => {
      const products = [];
      const productCards = document.querySelectorAll('a[href*="/divany/"][href*="!"]');

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

    console.log(`✅ Found ${productsWithImages.length} unique products\n`);

    // Save all products for batch processing
    await saveAllProducts(productsWithImages);

    const totalBatches = Math.ceil(productsWithImages.length / BATCH_SIZE);
    const progress = {
      currentBatch: 0,
      totalBatches: totalBatches,
      completedProducts: 0,
      totalProducts: productsWithImages.length,
      scrapedAt: new Date().toISOString()
    };
    await saveProgress(progress);

    console.log(`📦 Ready to import in batches of ${BATCH_SIZE}`);
    console.log(`   Total batches: ${totalBatches}`);
    console.log(`   Total products: ${productsWithImages.length}\n`);
    console.log('💾 Products saved to:', PRODUCTS_FILE);
    console.log('📊 Progress saved to:', PROGRESS_FILE);
    console.log('\n✅ Run this script again to import the first batch!\n');

    return productsWithImages;

  } finally {
    await browser.close();
  }
}

async function importBatch(batchNumber) {
  const allProducts = await loadAllProducts();

  if (!allProducts) {
    console.log('\n❌ No products found. Run scrape phase first.\n');
    return;
  }

  const progress = await loadProgress();

  if (batchNumber > progress.totalBatches) {
    console.log('\n✅ All batches completed!\n');
    return;
  }

  const startIdx = (batchNumber - 1) * BATCH_SIZE;
  const endIdx = Math.min(startIdx + BATCH_SIZE, allProducts.length);
  const batch = allProducts.slice(startIdx, endIdx);

  console.log(`\n📦 Importing Batch ${batchNumber}/${progress.totalBatches}`);
  console.log(`   Products: ${startIdx + 1}-${endIdx} of ${allProducts.length}\n`);

  // Get category ID for sofas
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sofas')
    .maybeSingle();

  let categoryId = category?.id;

  if (!categoryId) {
    // Create sofas category if it doesn't exist
    const { data: newCategory } = await supabase
      .from('categories')
      .insert({
        name: 'Sofas',
        slug: 'sofas',
        description: 'Premium sofas collection'
      })
      .select()
      .single();
    categoryId = newCategory.id;
    console.log('✅ Created Sofas category\n');
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < batch.length; i++) {
    const product = batch[i];
    const progress = `${i + 1}/${batch.length}`;

    process.stdout.write(`\r[${progress}] Processing: ${product.title.substring(0, 50).padEnd(50)}`);

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('source_url', product.url)
      .maybeSingle();

    if (existing) {
      // Update image
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', existing.id);

      await supabase
        .from('product_images')
        .insert({
          product_id: existing.id,
          image_url: product.imageUrl,
          display_order: 0,
          alt_text: product.title
        });

      updated++;
    } else {
      // Extract product name from title
      const name = product.title.replace(/^(Диван|Sofa)\s*/i, '').trim();

      // Insert new product
      const { data: newProduct } = await supabase
        .from('products')
        .insert({
          name: name || product.title,
          source_name_russian: product.title,
          source_url: product.url,
          category_id: categoryId,
          price: 0, // Will be scraped in detail phase
          is_active: true
        })
        .select()
        .single();

      if (newProduct) {
        // Insert image
        await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: product.imageUrl,
            display_order: 0,
            alt_text: product.title
          });

        imported++;
      } else {
        skipped++;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Update progress
  progress.currentBatch = batchNumber;
  progress.completedProducts = endIdx;
  await saveProgress(progress);

  console.log(`\n\n✅ Batch ${batchNumber} complete!`);
  console.log(`   New products: ${imported}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Progress: ${endIdx}/${allProducts.length} products (${Math.round(endIdx/allProducts.length*100)}%)\n`);

  if (batchNumber < progress.totalBatches) {
    console.log(`📝 Type "continue" to import batch ${batchNumber + 1}\n`);
  } else {
    console.log('🎉 All batches completed!\n');
  }
}

async function main() {
  const progress = await loadProgress();
  const allProducts = await loadAllProducts();

  if (!allProducts) {
    // First run - scrape all products
    await scrapeAllSofas();
  } else if (progress.currentBatch < progress.totalBatches) {
    // Continue importing next batch
    await importBatch(progress.currentBatch + 1);
  } else {
    console.log('\n✅ All batches already completed!');
    console.log(`   Total products: ${progress.totalProducts}`);
    console.log(`   Completed: ${progress.completedProducts}\n`);
  }
}

main().catch(console.error);
