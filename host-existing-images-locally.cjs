const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('HOSTING SOFA IMAGES LOCALLY');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Create thumbnails directory
  const thumbsDir = path.join(__dirname, 'public', 'sofa-thumbnails');
  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
  }

  // Get all sofa images
  const { data: sofaImages } = await supabase
    .from('product_images')
    .select('id, product_id, image_url, products(id, name, sku, category_id)')
    .eq('products.category_id', (await supabase.from('categories').select('id').eq('slug', 'sofas').single()).data.id)
    .order('display_order');

  if (!sofaImages || sofaImages.length === 0) {
    console.log('No sofa images found');
    return;
  }

  console.log(`Found ${sofaImages.length} sofa images to download\n`);

  let processed = 0;
  let downloaded = 0;
  let failed = 0;
  let updated = 0;

  for (const img of sofaImages) {
    try {
      const product = img.products;
      if (!product) {
        processed++;
        continue;
      }

      // Skip if already local
      if (img.image_url.includes('/sofa-thumbnails/')) {
        processed++;
        continue;
      }

      // Download image
      const imageBuffer = await downloadImage(img.image_url);
      if (!imageBuffer) {
        failed++;
        processed++;
        await delay(200);
        continue;
      }

      // Save to local file
      const ext = path.extname(img.image_url.split('?')[0].split('/').pop()) || '.jpg';
      const filename = `${product.sku}-${img.id.substring(0, 8)}${ext}`;
      const filepath = path.join(thumbsDir, filename);

      fs.writeFileSync(filepath, imageBuffer);
      downloaded++;

      // Update database with local path
      const localUrl = `/sofa-thumbnails/${filename}`;
      await supabase
        .from('product_images')
        .update({ image_url: localUrl })
        .eq('id', img.id);

      updated++;
      processed++;

      if (processed % 50 === 0) {
        console.log(`  [${processed}/${sofaImages.length}] Downloaded: ${downloaded}, Updated: ${updated}, Failed: ${failed}`);
      }

      await delay(200);

    } catch (error) {
      console.error(`Error:`, error.message);
      failed++;
      processed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Processed: ${processed}`);
  console.log(`✓ Downloaded: ${downloaded}`);
  console.log(`✓ Database updated: ${updated}`);
  console.log(`✓ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n✓ Thumbnails saved to: ${thumbsDir}`);
}

main().catch(console.error);
