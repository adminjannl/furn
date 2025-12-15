const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addColorSpecificImages() {
  console.log('Adding color-specific images for Ashley sofas...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      sku,
      product_colors (id, color_name, color_code)
    `)
    .ilike('sku', 'ASH-SOF-%')
    .order('sku');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  const thumbnailDir = path.join(__dirname, 'public', 'sofa-thumbnails');
  const thumbnails = fs.readdirSync(thumbnailDir).filter(f => f.endsWith('.jpg'));

  console.log(`Found ${thumbnails.length} thumbnail images\n`);
  console.log(`Processing ${products.length} products...\n`);

  let productIndex = 0;

  for (const product of products) {
    console.log(`\n${product.sku} - ${product.name}`);
    console.log(`  Colors: ${product.product_colors.length}`);

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id);

    const baseIndex = productIndex * 4;

    const mainImages = [];
    for (let i = 0; i < 4; i++) {
      const thumbIndex = (baseIndex + i) % thumbnails.length;
      mainImages.push(`/sofa-thumbnails/${thumbnails[thumbIndex]}`);
    }

    for (let imgIdx = 0; imgIdx < mainImages.length; imgIdx++) {
      await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: mainImages[imgIdx],
          display_order: imgIdx + 1,
          alt_text: `${product.name} - View ${imgIdx + 1}`
        });
    }

    console.log(`  ✓ Added ${mainImages.length} main images`);

    if (product.product_colors.length > 1) {
      for (let colorIdx = 0; colorIdx < product.product_colors.length; colorIdx++) {
        const color = product.product_colors[colorIdx];

        const colorImageIndex = (baseIndex + 10 + colorIdx * 2) % thumbnails.length;
        const colorImageUrl = `/sofa-thumbnails/${thumbnails[colorImageIndex]}`;

        const { error: colorImgError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: colorImageUrl,
            display_order: 100 + colorIdx,
            alt_text: `${product.name} - ${color.color_name}`,
            color_variant: color.color_name
          });

        if (colorImgError) {
          console.error(`    Error adding color image:`, colorImgError.message);
        }
      }
      console.log(`  ✓ Added ${product.product_colors.length} color-specific images`);
    }

    productIndex++;
  }

  const { data: imageCount } = await supabase
    .from('product_images')
    .select('id', { count: 'exact' })
    .in('product_id', products.map(p => p.id));

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Image Import Complete!');
  console.log('='.repeat(60));
  console.log(`Total images in database: ${imageCount.length}`);
  console.log('='.repeat(60));
}

addColorSpecificImages().catch(console.error);
