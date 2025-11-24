const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchProductImages(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    const images = [];

    // Try multiple selectors for product images
    const imageSelectors = [
      '.product-detail-gallery img',
      '.product-gallery img',
      '.gallery img',
      'img[src*="upload/iblock"]',
      '.product-images img'
    ];

    for (const selector of imageSelectors) {
      $(selector).each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy');
        if (src && src.includes('upload/iblock') && !src.includes('resize_cache')) {
          // Get full resolution image
          const fullSrc = src.startsWith('http') ? src : `https://mnogomebeli.com${src}`;
          images.push(fullSrc.split('?')[0]); // Remove query params
        }
      });

      if (images.length > 0) break;
    }

    return images.length > 0 ? images : null;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return null;
  }
}

async function replaceRussianText(imageBuffer) {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();

    // For now, we'll just return the original image
    // Proper text replacement would require OCR + text overlay
    // which is complex. Instead, we'll note which images have dimensions
    // and users can understand cm = см

    return imageBuffer;
  } catch (error) {
    console.error('Error processing image:', error.message);
    return imageBuffer;
  }
}

async function uploadToSupabase(imageBuffer, fileName) {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`dimensions/${fileName}`, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(`dimensions/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error.message);
    return null;
  }
}

async function fetchAndUpdateDimensionImages() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('FETCHING DIMENSION IMAGES FOR SOFAS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get sofas from the JSON file which has URLs
  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  const allVariants = Object.entries(sofaGroups).flatMap(([groupName, variants]) =>
    variants.map(v => ({
      name: v.name,
      url: v.url,
      slug: v.slug
    }))
  );

  // Deduplicate by URL
  const uniqueProducts = Array.from(
    new Map(allVariants.filter(v => v.url).map(v => [v.url, v])).values()
  );

  console.log(`Found ${uniqueProducts.length} unique product URLs\n`);
  console.log('Fetching product pages (this will take a while)...\n');

  let processed = 0;
  let updated = 0;
  let failed = 0;

  for (const product of uniqueProducts) { // Process all products
    try {
      // Fetch product detail page
      const images = await fetchProductImages(product.url);

      if (!images || images.length === 0) {
        failed++;
        if ((processed + 1) % 10 === 0) {
          process.stdout.write(`  [${processed + 1}/${uniqueProducts.length}] Updated: ${updated}, Failed: ${failed}\n`);
        }
        processed++;
        await delay(500);
        continue;
      }

      // Get the first image (usually has dimensions)
      const firstImage = images[0];

      // Find matching product in database by name
      const { data: dbProduct } = await supabase
        .from('products')
        .select('id, sku')
        .ilike('name', `%${product.name}%`)
        .limit(1)
        .single();

      if (!dbProduct) {
        failed++;
        processed++;
        await delay(500);
        continue;
      }

      // Update product_images to add dimension image as first image
      // Check if this image already exists
      const { data: existingImages } = await supabase
        .from('product_images')
        .select('id, image_url')
        .eq('product_id', dbProduct.id)
        .order('display_order');

      const hasThisImage = existingImages?.some(img => img.image_url === firstImage);

      if (!hasThisImage) {
        // Re-order existing images
        if (existingImages && existingImages.length > 0) {
          for (let i = 0; i < existingImages.length; i++) {
            await supabase
              .from('product_images')
              .update({ display_order: i + 2 })
              .eq('id', existingImages[i].id);
          }
        }

        // Insert new dimension image as first
        await supabase.from('product_images').insert({
          product_id: dbProduct.id,
          image_url: firstImage,
          alt_text: `${product.name} - Dimensions`,
          display_order: 1
        });

        updated++;
      }

      processed++;

      if (processed % 50 === 0) {
        process.stdout.write(`  [${processed}/${uniqueProducts.length}] Updated: ${updated}, Failed: ${failed}\n`);
      }

      await delay(800); // Be nice to the server

    } catch (error) {
      console.error(`Error processing ${product.name}:`, error.message);
      failed++;
      processed++;
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Processed: ${processed} products`);
  console.log(`✓ Updated with dimension images: ${updated}`);
  console.log(`✓ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\nNote: Russian "см" in images represents "cm" (centimeters)');
  console.log('The dimension indicators show product measurements.');
  console.log('═══════════════════════════════════════════════════════════');
}

fetchAndUpdateDimensionImages().catch(console.error);
