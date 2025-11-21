const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function applyMigration() {
  console.log('🔄 Applying cabinet images migration...\n');

  const sql = fs.readFileSync('supabase/migrations/20251029060000_import_cabinet_images.sql', 'utf-8');

  // Extract all INSERT statements
  const inserts = sql.match(/INSERT INTO[\s\S]*?ON CONFLICT DO NOTHING;/g);

  if (!inserts) {
    console.error('❌ No INSERT statements found in migration');
    return;
  }

  console.log(`Found ${inserts.length} INSERT statements\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < inserts.length; i++) {
    const insert = inserts[i];

    const { error } = await supabase.rpc('exec_sql', { sql_query: insert }).maybeSingle();

    if (error) {
      // Most errors will be "function doesn't exist", so let's try direct execution
      // Extract the SKU for reporting
      const skuMatch = insert.match(/CAB-MNM-\d{4}/);
      const sku = skuMatch ? skuMatch[0] : `#${i + 1}`;

      console.log(`❌ Error with ${sku}: Trying alternate method...`);

      // Extract values and insert directly
      const urlMatch = insert.match(/'(https:\/\/[^']+)'/);
      const altMatch = insert.match(/'([^']+)',\s*\n\s*\d+\s*\nFROM/);
      const skuMatchFull = insert.match(/WHERE p\.sku = '([^']+)'/);

      if (urlMatch && altMatch && skuMatchFull) {
        const imageUrl = urlMatch[1];
        const altText = altMatch[1];
        const productSku = skuMatchFull[1];

        // Get product ID
        const { data: product } = await supabase
          .from('products')
          .select('id')
          .eq('sku', productSku)
          .maybeSingle();

        if (product) {
          const { error: insertError } = await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              image_url: imageUrl,
              alt_text: altText,
              display_order: 0
            });

          if (insertError && !insertError.message.includes('duplicate')) {
            console.log(`❌ Failed ${productSku}:`, insertError.message);
            errorCount++;
          } else {
            successCount++;
            if ((i + 1) % 10 === 0) {
              console.log(`✅ Progress: ${i + 1}/${inserts.length}`);
            }
          }
        } else {
          console.log(`⚠️  Product not found: ${productSku}`);
          errorCount++;
        }
      }
    } else {
      successCount++;
      if ((i + 1) % 10 === 0) {
        console.log(`✅ Progress: ${i + 1}/${inserts.length}`);
      }
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

applyMigration().catch(console.error);
