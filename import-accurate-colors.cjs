const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importAccurateColors() {
  console.log('Importing accurate color variants for Ashley sofas...\n');

  const productsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'ashley-products-complete.json'), 'utf-8')
  );

  const { data: dbProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, sku')
    .ilike('sku', 'ASH-SOF-%')
    .order('sku');

  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }

  console.log(`Found ${dbProducts.length} Ashley sofas in database\n`);

  let updated = 0;
  let totalColors = 0;

  for (const productData of productsData) {
    const dbProduct = dbProducts.find(p => {
      const namePart = productData.name.toLowerCase().substring(0, 25);
      const dbNamePart = p.name.toLowerCase().substring(0, 25);
      return namePart.includes(dbNamePart) || dbNamePart.includes(namePart);
    });

    if (!dbProduct) {
      console.log(`❌ NOT FOUND: ${productData.name}`);
      continue;
    }

    console.log(`\n✓ ${dbProduct.name}`);

    await supabase
      .from('product_colors')
      .delete()
      .eq('product_id', dbProduct.id);

    console.log(`  Colors (${productData.colors.length}):`);
    for (const color of productData.colors) {
      const { error } = await supabase
        .from('product_colors')
        .insert({
          product_id: dbProduct.id,
          color_name: color.name,
          color_code: color.code
        });

      if (!error) {
        console.log(`    • ${color.name} ${color.code}`);
        totalColors++;
      } else {
        console.error(`    ✗ Error adding ${color.name}:`, error.message);
      }
    }

    updated++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Import Complete!');
  console.log('='.repeat(60));
  console.log(`Products updated: ${updated}`);
  console.log(`Total color variants: ${totalColors}`);
  console.log('='.repeat(60));

  const { data: stats } = await supabase
    .from('product_colors')
    .select('product_id')
    .in('product_id', dbProducts.map(p => p.id));

  console.log(`\nVerification: ${stats.length} color variants in database`);
}

importAccurateColors().catch(console.error);
