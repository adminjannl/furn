const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixArmchairImages() {
  console.log('\n🖼️  Fixing Armchair Images...\n');

  // Get all armchair products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, source_name_russian, source_url')
    .ilike('source_url', '%kresla%')
    .order('created_at');

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`📦 Found ${products.length} armchair products\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    let updated = 0;
    let errors = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const progress = `${i + 1}/${products.length}`;

      process.stdout.write(`\r[${progress}] ${product.source_name_russian.substring(0, 50).padEnd(50)}`);

      try {
        await page.goto(product.source_url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Extract images from the product page
        const imageData = await page.evaluate(() => {
          const images = [];

          // Look for product gallery images first
          const galleryImages = document.querySelectorAll('.product-gallery img, .gallery img, [class*="slider"] img, [class*="carousel"] img');
          galleryImages.forEach(img => {
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy');
            if (src && src.includes('mnogomebeli.com') && !src.includes('logo')) {
              images.push(src);
            }
          });

          // If no gallery images, get all product images
          if (images.length === 0) {
            const allImages = document.querySelectorAll('img[src], img[data-src]');
            allImages.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && src.includes('mnogomebeli.com') && !src.includes('logo') && !src.includes('icon')) {
                images.push(src);
              }
            });
          }

          // Remove duplicates
          return [...new Set(images)];
        });

        if (imageData.length === 0) {
          console.error(`\n⚠️  No images found for ${product.name}`);
          errors++;
          continue;
        }

        // Delete existing images for this product
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', product.id);

        if (deleteError) {
          console.error(`\n❌ Error deleting old images for ${product.name}:`, deleteError.message);
          errors++;
          continue;
        }

        // Insert new images
        const imagesToInsert = imageData.slice(0, 10).map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index
        }));

        const { error: insertError } = await supabase
          .from('product_images')
          .insert(imagesToInsert);

        if (insertError) {
          console.error(`\n❌ Error inserting images for ${product.name}:`, insertError.message);
          errors++;
        } else {
          updated++;
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`\n❌ Error processing ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n\n✅ Image update complete!');
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}\n`);

  } finally {
    await browser.close();
  }
}

fixArmchairImages().catch(console.error);
