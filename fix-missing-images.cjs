const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));
const tables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'));

async function fixImages() {
  console.log('Fixing missing product images...\n');

  // Fix chair images
  console.log('Adding chair images...');
  const { data: chairProducts } = await supabase
    .from('products')
    .select('id, sku, name')
    .like('sku', 'CHR-%');

  let chairImagesAdded = 0;
  for (const product of chairProducts || []) {
    const chair = chairs.find(c => c.name === product.name);
    if (chair && chair.images && chair.images.length > 0) {
      for (let i = 0; i < Math.min(chair.images.length, 5); i++) {
        const { error } = await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: chair.images[i],
          alt_text: product.name,
          display_order: i + 1
        });
        if (!error) chairImagesAdded++;
      }
    }
  }
  console.log(`✓ Added ${chairImagesAdded} chair images`);

  // Fix table images
  console.log('\nAdding table images...');
  const { data: tableProducts } = await supabase
    .from('products')
    .select('id, sku, name')
    .like('sku', 'TAB-%');

  let tableImagesAdded = 0;
  for (const product of tableProducts || []) {
    const table = tables.find(t => t.name === product.name);
    if (table && table.images && table.images.length > 0) {
      for (let i = 0; i < Math.min(table.images.length, 5); i++) {
        const { error } = await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: table.images[i],
          alt_text: product.name,
          display_order: i + 1
        });
        if (!error) tableImagesAdded++;
      }
    }
  }
  console.log(`✓ Added ${tableImagesAdded} table images`);

  console.log('\n✅ Image fix complete!');
}

fixImages().catch(console.error);
