const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addPlaceholderImages() {
  console.log('Adding placeholder images for Ashley sofas...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku')
    .ilike('sku', 'ASH-SOF-%')
    .order('sku');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} Ashley sofas\n`);

  const thumbnailDir = path.join(__dirname, 'public', 'sofa-thumbnails');
  let availableThumbnails = [];

  try {
    const files = fs.readdirSync(thumbnailDir);
    availableThumbnails = files.filter(f => f.endsWith('.jpg'));
    console.log(`Found ${availableThumbnails.length} thumbnail images\n`);
  } catch (err) {
    console.log('No thumbnails directory found, using placeholder URLs\n');
  }

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`${i + 1}. ${product.name}`);

    const imageUrls = [];

    if (availableThumbnails.length > 0) {
      const thumbnailIndex = i % availableThumbnails.length;
      const thumbnailFile = availableThumbnails[thumbnailIndex];
      imageUrls.push(`/sofa-thumbnails/${thumbnailFile}`);

      for (let j = 1; j <= 3; j++) {
        const altIndex = (i + j) % availableThumbnails.length;
        imageUrls.push(`/sofa-thumbnails/${availableThumbnails[altIndex]}`);
      }
    } else {
      for (let j = 1; j <= 4; j++) {
        imageUrls.push(`https://via.placeholder.com/800x600/CCCCCC/666666?text=${encodeURIComponent(product.name + ' ' + j)}`);
      }
    }

    for (let imgIndex = 0; imgIndex < imageUrls.length; imgIndex++) {
      const { error: imgError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: imageUrls[imgIndex],
          display_order: imgIndex + 1,
          alt_text: `${product.name} - View ${imgIndex + 1}`
        });

      if (imgError && !imgError.message.includes('duplicate')) {
        console.error(`  Error adding image: ${imgError.message}`);
      }
    }

    console.log(`  ✓ Added ${imageUrls.length} images`);
  }

  console.log('\n✅ All images added!');
}

addPlaceholderImages().catch(console.error);
