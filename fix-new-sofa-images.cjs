require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixSofaImages() {
  console.log('============================================================');
  console.log('FIXING SOFA IMAGES FOR NEW PRODUCTS');
  console.log('============================================================\n');

  const thumbnailFiles = fs.readdirSync('./public/sofa-thumbnails/');

  const imageMap = {};
  thumbnailFiles.forEach(file => {
    const match = file.match(/^(SOF-\d+)/);
    if (match) {
      const sku = match[1];
      imageMap[sku] = `/sofa-thumbnails/${file}`;
    }
  });

  console.log(`Found ${Object.keys(imageMap).length} thumbnail images\n`);

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, sku, name')
    .gte('sku', 'SOF-0007')
    .lte('sku', 'SOF-0050')
    .order('sku');

  if (productsError) {
    console.error('Error fetching products:', productsError);
    return;
  }

  console.log(`Found ${products.length} products to update\n`);

  let updated = 0;
  let errors = 0;

  for (const product of products) {
    const imagePath = imageMap[product.sku];

    if (!imagePath) {
      console.log(`⚠ No image found for ${product.sku}: ${product.name}`);
      errors++;
      continue;
    }

    const { data: existingImages, error: fetchError } = await supabase
      .from('product_images')
      .select('id, image_url')
      .eq('product_id', product.id);

    if (fetchError) {
      console.error(`Error fetching images for ${product.sku}:`, fetchError);
      errors++;
      continue;
    }

    if (existingImages && existingImages.length > 0) {
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ image_url: imagePath })
        .eq('product_id', product.id);

      if (updateError) {
        console.error(`Error updating image for ${product.sku}:`, updateError);
        errors++;
      } else {
        console.log(`✓ Updated ${product.sku}: ${product.name}`);
        console.log(`  Image: ${imagePath}`);
        updated++;
      }
    } else {
      const { error: insertError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: imagePath,
          alt_text: product.name,
          display_order: 0
        });

      if (insertError) {
        console.error(`Error inserting image for ${product.sku}:`, insertError);
        errors++;
      } else {
        console.log(`✓ Added image for ${product.sku}: ${product.name}`);
        console.log(`  Image: ${imagePath}`);
        updated++;
      }
    }
  }

  console.log('\n============================================================');
  console.log('UPDATE SUMMARY');
  console.log('============================================================');
  console.log(`Total products: ${products.length}`);
  console.log(`✓ Successfully updated: ${updated}`);
  console.log(`✗ Errors: ${errors}`);
  console.log('============================================================\n');
}

fixSofaImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
