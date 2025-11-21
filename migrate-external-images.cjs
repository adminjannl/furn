const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function migrateExternalImages() {
  console.log('📥 Migrating External Images to Supabase Storage\n');
  console.log('='.repeat(70) + '\n');

  const { data: images } = await supabase
    .from('product_images')
    .select(`
      id,
      image_url,
      display_order,
      alt_text,
      product_id,
      products (
        name,
        sku
      )
    `)
    .ilike('image_url', '%mnogomebeli.com%')
    .order('product_id');

  console.log(`Found ${images.length} external images to migrate\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`\n[${i + 1}/${images.length}] ${img.products.name}`);
    console.log(`   SKU: ${img.products.sku}`);
    console.log(`   Display Order: ${img.display_order}`);
    console.log(`   Current URL: ${img.image_url.substring(0, 60)}...`);

    try {
      console.log(`   📥 Downloading image...`);
      const imageBuffer = await downloadImage(img.image_url);
      console.log(`   ✅ Downloaded ${imageBuffer.length} bytes`);

      const fileExt = img.image_url.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg';
      const fileName = `${img.products.sku.toLowerCase()}-${img.display_order}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log(`   📤 Uploading to Supabase Storage: ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('product-images')
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.log(`   ❌ Upload failed: ${uploadError.message}`);
        failCount++;
        continue;
      }

      const { data: publicUrl } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log(`   🔄 Updating database reference...`);

      const { error: updateError } = await supabase
        .from('product_images')
        .update({
          image_url: publicUrl.publicUrl
        })
        .eq('id', img.id);

      if (updateError) {
        console.log(`   ❌ Database update failed: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`   ✅ Migration complete!`);
        successCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(70) + '\n');
  console.log('📊 MIGRATION SUMMARY:\n');
  console.log(`   Total external images: ${images.length}`);
  console.log(`   Successfully migrated: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log();

  const { data: remainingExternal } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .ilike('image_url', '%mnogomebeli.com%');

  console.log(`   Still external: ${remainingExternal || 0}`);

  if (successCount === images.length) {
    console.log('\n   ✅ All external images successfully migrated!\n');
  } else if (successCount > 0) {
    console.log(`\n   ⚠️  ${images.length - successCount} images still need migration\n`);
  }

  console.log('='.repeat(70) + '\n');

  return { total: images.length, success: successCount, failed: failCount };
}

migrateExternalImages()
  .then(result => {
    console.log('✅ Migration process complete!\n');
    process.exit(result.failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
