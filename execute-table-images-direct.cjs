const fs = require('fs');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function executeImport() {
  try {
    const sql = fs.readFileSync('table-images-fixed-only.sql', 'utf8');

    const statements = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.startsWith('INSERT'));

    console.log(`Executing ${statements.length} image inserts...\n`);

    const { data: products } = await supabase
      .from('products')
      .select('id, sku')
      .like('sku', 'TBL-MNM-%');

    const productMap = {};
    products.forEach(p => productMap[p.sku] = p.id);

    const tables = JSON.parse(fs.readFileSync('tables-with-real-images.json', 'utf8'));

    const imageInserts = [];

    tables.forEach(table => {
      const productId = productMap[table.sku];
      if (!productId) {
        console.log(`⚠️  Product not found: ${table.sku}`);
        return;
      }

      table.images.forEach((imageUrl, index) => {
        imageInserts.push({
          product_id: productId,
          image_url: imageUrl,
          alt_text: `${table.name} - View ${index + 1}`,
          display_order: index + 1
        });
      });
    });

    console.log(`Inserting ${imageInserts.length} images...`);

    const BATCH_SIZE = 50;
    for (let i = 0; i < imageInserts.length; i += BATCH_SIZE) {
      const batch = imageInserts.slice(i, i + BATCH_SIZE);

      const { error } = await supabase
        .from('product_images')
        .insert(batch);

      if (error) {
        console.error(`Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
      } else {
        console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imageInserts.length / BATCH_SIZE)} (${batch.length} images)`);
      }
    }

    console.log('\n✓ Import complete!');
    console.log(`  Total images imported: ${imageInserts.length}`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

executeImport();
