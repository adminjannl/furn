const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRemainingArmchairs() {
  console.log('\n🖼️  Fixing Remaining Armchair Images...\n');

  // Get armchair products that have more than 10 images (need fixing)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, source_name_russian, source_url')
    .ilike('source_url', '%kresla%')
    .order('created_at');

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  // Filter products that need fixing (have >10 images)
  const productsToFix = [];
  for (const product of products) {
    const { count } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', product.id);

    if (count && count > 10) {
      productsToFix.push(product);
    }
  }

  console.log(`📦 Found ${productsToFix.length} products that need image cleanup\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < productsToFix.length; i++) {
    const product = productsToFix[i];
    const progress = `${i + 1}/${productsToFix.length}`;

    process.stdout.write(`\r[${progress}] ${product.source_name_russian.substring(0, 50).padEnd(50)}`);

    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(product.source_url, {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });
      await new Promise(resolve => setTimeout(resolve, 1500));

      const imageData = await page.evaluate(() => {
        const images = [];
        const seenUrls = new Set();

        const isValidProductImage = (url) => {
          if (!url) return false;
          const urlLower = url.toLowerCase();

          if (urlLower.includes('logo')) return false;
          if (urlLower.includes('icon')) return false;
          if (urlLower.includes('razmernik')) return false;
          if (urlLower.includes('banner')) return false;
          if (urlLower.includes('promo')) return false;
          if (urlLower.includes('badge')) return false;
          if (!urlLower.includes('mnogomebeli.com')) return false;

          return true;
        };

        // Get images from product-detail-pictures
        const productImages = document.querySelectorAll('.product-detail-pictures img, .catalog-element-offer-picture img, [itemprop="image"]');
        productImages.forEach(img => {
          const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy');
          if (isValidProductImage(src) && !seenUrls.has(src)) {
            seenUrls.add(src);
            images.push(src);
          }
        });

        // If still no images, get from any img in main content area
        if (images.length < 3) {
          const mainContent = document.querySelector('.product-detail, [itemtype*="Product"]');
          if (mainContent) {
            const imgs = mainContent.querySelectorAll('img');
            imgs.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (isValidProductImage(src) && !seenUrls.has(src)) {
                seenUrls.add(src);
                images.push(src);
              }
            });
          }
        }

        return images.slice(0, 8);
      });

      if (imageData.length === 0) {
        console.error(`\n⚠️  No images found for ${product.name}`);
        errors++;
        await page.close();
        continue;
      }

      // Delete old images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id);

      // Insert clean images
      const imagesToInsert = imageData.map((url, index) => ({
        product_id: product.id,
        image_url: url,
        display_order: index,
        alt_text: `${product.source_name_russian} - ${index + 1}`
      }));

      const { error: insertError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);

      if (insertError) {
        console.error(`\n❌ Error for ${product.name}:`, insertError.message);
        errors++;
      } else {
        updated++;
      }

      await page.close();
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error(`\n❌ Error processing ${product.name}:`, error.message);
      errors++;
      await page.close();
    }
  }

  await browser.close();

  console.log('\n\n✅ Cleanup complete!');
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}\n`);
}

fixRemainingArmchairs().catch(console.error);
