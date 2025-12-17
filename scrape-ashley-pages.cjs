require('dotenv').config();
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function scrapeAshleyPage(page, pageNum) {
  const startParam = (pageNum - 1) * 30;
  const url = `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

  console.log(`\n📄 Scraping Page ${pageNum}: ${url}`);

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForTimeout(3000);

    const products = await page.evaluate(() => {
      const items = [];

      const productTiles = document.querySelectorAll('.product-tile, .product, [data-pid]');

      productTiles.forEach(tile => {
        try {
          const nameEl = tile.querySelector('.product-name, .pdp-link a, [class*="product-name"]');
          const priceEl = tile.querySelector('.price, .sales, [class*="price"]');
          const imageEl = tile.querySelector('img[src*="scene7"], img[data-src*="scene7"]');
          const linkEl = tile.querySelector('a[href*="/p/"]');

          if (nameEl && priceEl) {
            const name = nameEl.textContent?.trim() || '';
            const priceText = priceEl.textContent?.trim() || '';
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

            let imageUrl = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src') || '';
            if (imageUrl) {
              imageUrl = imageUrl.split('?')[0] + '?$AFHS-PDP-Main$';
              if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
              }
            }

            const productUrl = linkEl?.getAttribute('href') || '';
            const sku = productUrl.match(/\/p\/[^\/]+\/([^\/\.]+)/)?.[1] || '';

            if (name && !isNaN(price) && price > 0) {
              items.push({
                name,
                price,
                imageUrl,
                sku,
                productUrl
              });
            }
          }
        } catch (err) {
          console.error('Error parsing product:', err.message);
        }
      });

      return items;
    });

    console.log(`✓ Found ${products.length} products on page ${pageNum}`);

    let succeeded = 0;
    let failed = 0;

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'sofas')
      .maybeSingle();

    for (const product of products) {
      try {
        const finalSku = product.sku || `ASH-SOF-P${pageNum}-${succeeded + failed + 1}`;

        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('sku', finalSku)
          .maybeSingle();

        if (existingProduct) {
          console.log(`⊘ Skipped (already exists): ${product.name}`);
          failed++;
          continue;
        }

        const slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            slug: `${slug}-${finalSku.toLowerCase()}`,
            sku: finalSku,
            price: product.price,
            description: product.name,
            category_id: category?.id || null,
            stock_quantity: 10,
            status: 'active',
          })
          .select()
          .single();

        if (productError || !newProduct) {
          console.log(`✗ Failed to insert: ${product.name}`);
          failed++;
          continue;
        }

        if (product.imageUrl) {
          await supabase.from('product_images').insert({
            product_id: newProduct.id,
            image_url: product.imageUrl,
            display_order: 0,
          });
        }

        console.log(`✓ Imported: ${product.name} - $${product.price}`);
        succeeded++;

      } catch (error) {
        console.log(`✗ Error importing ${product.name}:`, error.message);
        failed++;
      }
    }

    console.log(`\n📊 Page ${pageNum} Summary: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, total: products.length };

  } catch (error) {
    console.error(`✗ Error scraping page ${pageNum}:`, error.message);
    return { succeeded: 0, failed: 0, total: 0, error: error.message };
  }
}

async function scrapeAllPages() {
  console.log('🚀 Starting Ashley Furniture Scraper\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
    ]
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    const totalStats = {
      succeeded: 0,
      failed: 0,
      total: 0
    };

    for (let pageNum = 2; pageNum <= 9; pageNum++) {
      const result = await scrapeAshleyPage(page, pageNum);
      totalStats.succeeded += result.succeeded;
      totalStats.failed += result.failed;
      totalStats.total += result.total;

      if (pageNum < 9) {
        console.log('\n⏳ Waiting 3 seconds before next page...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SCRAPING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total Products Found: ${totalStats.total}`);
    console.log(`Successfully Imported: ${totalStats.succeeded}`);
    console.log(`Failed/Skipped: ${totalStats.failed}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }
}

scrapeAllPages().catch(console.error);
