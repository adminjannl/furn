const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixArmchairImagesClean() {
  console.log('\n🖼️  Fixing Armchair Images - Clean Version...\n');

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
        await new Promise(resolve => setTimeout(resolve, 800));

        // Extract ONLY product images (not size charts, not promotional images)
        const imageData = await page.evaluate(() => {
          const images = [];
          const seenUrls = new Set();

          // Function to check if URL is a valid product image
          const isValidProductImage = (url) => {
            if (!url) return false;
            const urlLower = url.toLowerCase();

            // Exclude these types of images
            if (urlLower.includes('logo')) return false;
            if (urlLower.includes('icon')) return false;
            if (urlLower.includes('razmernik')) return false; // Size chart
            if (urlLower.includes('banner')) return false;
            if (urlLower.includes('promo')) return false;
            if (urlLower.includes('badge')) return false;
            if (urlLower.includes('delivery')) return false;
            if (urlLower.includes('payment')) return false;
            if (urlLower.includes('whatsapp')) return false;
            if (urlLower.includes('telegram')) return false;
            if (urlLower.includes('instagram')) return false;
            if (urlLower.includes('facebook')) return false;
            if (urlLower.includes('vk.')) return false;

            // Must be from the product catalog
            if (!urlLower.includes('mnogomebeli.com')) return false;

            return true;
          };

          // Strategy 1: Look for main product gallery/slider
          const gallerySelectors = [
            '.product-images img',
            '.product-gallery img',
            '.product-slider img',
            '[class*="gallery"] img',
            '[class*="slider"] img',
            '[class*="carousel"] img',
            '[data-fancybox] img',
            '.catalog-element-offer-picture img'
          ];

          gallerySelectors.forEach(selector => {
            const imgs = document.querySelectorAll(selector);
            imgs.forEach(img => {
              const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy');
              if (isValidProductImage(src) && !seenUrls.has(src)) {
                seenUrls.add(src);
                images.push(src);
              }
            });
          });

          // Strategy 2: If no gallery images, get images from product detail area
          if (images.length === 0) {
            const detailArea = document.querySelector('.product-detail, .product-info, [class*="product"]');
            if (detailArea) {
              const imgs = detailArea.querySelectorAll('img');
              imgs.forEach(img => {
                const src = img.src || img.getAttribute('data-src');
                if (isValidProductImage(src) && !seenUrls.has(src)) {
                  seenUrls.add(src);
                  images.push(src);
                }
              });
            }
          }

          // Strategy 3: Look for thumbnail navigation (these are usually product images)
          const thumbSelectors = [
            '.product-thumbnails img',
            '.thumbs img',
            '[class*="thumb"] img',
            '[class*="preview"] img'
          ];

          thumbSelectors.forEach(selector => {
            const imgs = document.querySelectorAll(selector);
            imgs.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              // Get larger version if it's a thumbnail
              const largerSrc = img.getAttribute('data-large') ||
                              img.getAttribute('data-full') ||
                              img.getAttribute('href') ||
                              src;
              if (isValidProductImage(largerSrc) && !seenUrls.has(largerSrc)) {
                seenUrls.add(largerSrc);
                images.push(largerSrc);
              }
            });
          });

          // Strategy 4: Look for links that contain images (often used for lightbox)
          document.querySelectorAll('a[href*=".jpg"], a[href*=".png"], a[href*=".webp"]').forEach(link => {
            const href = link.href;
            if (isValidProductImage(href) && !seenUrls.has(href)) {
              seenUrls.add(href);
              images.push(href);
            }
          });

          return images;
        });

        if (imageData.length === 0) {
          console.error(`\n⚠️  No valid product images found for ${product.name}`);
          errors++;
          continue;
        }

        console.log(`\n   Found ${imageData.length} clean images for ${product.source_name_russian}`);

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

        // Insert new clean images (max 8 to keep it focused)
        const imagesToInsert = imageData.slice(0, 8).map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index,
          alt_text: `${product.source_name_russian} - Image ${index + 1}`
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

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`\n❌ Error processing ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n\n✅ Clean image update complete!');
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}\n`);

  } finally {
    await browser.close();
  }
}

fixArmchairImagesClean().catch(console.error);
