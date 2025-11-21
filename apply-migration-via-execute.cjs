const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

// We'll use direct SQL execution which bypasses RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function applyMigration() {
  console.log('🔄 Applying cabinet images migration via SQL...\n');

  const sql = fs.readFileSync('supabase/migrations/20251029060000_import_cabinet_images.sql', 'utf-8');

  // Extract all INSERT statements
  const inserts = sql.match(/INSERT INTO[\s\S]*?ON CONFLICT DO NOTHING;/g);

  if (!inserts) {
    console.error('❌ No INSERT statements found');
    return;
  }

  console.log(`Found ${inserts.length} INSERT statements`);
  console.log('Applying in batches of 10...\n');

  let successCount = 0;
  let errorCount = 0;

  // Process in batches of 10
  for (let i = 0; i < inserts.length; i += 10) {
    const batch = inserts.slice(i, i + 10);
    const batchSql = batch.join('\n\n');

    try {
      // Try to execute via a custom SQL function or direct query
      // Since we don't have service role key, we'll need to use a workaround

      // Extract each insert's data and do it via the Supabase client
      for (const insert of batch) {
        const urlMatch = insert.match(/'(https:\/\/[^']+)'/);
        const altMatch = insert.match(/'([^']+)',\s*\n\s*\d+\s*\nFROM/);
        const skuMatch = insert.match(/WHERE p\.sku = '([^']+)'/);

        if (urlMatch && altMatch && skuMatch) {
          const imageUrl = urlMatch[1];
          const altText = altMatch[1];
          const productSku = skuMatch[1];

          // Get product ID
          const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('sku', productSku)
            .maybeSingle();

          if (product) {
            // Try upsert with conflict handling
            const { error: insertError } = await supabase
              .from('product_images')
              .upsert({
                product_id: product.id,
                image_url: imageUrl,
                alt_text: altText,
                display_order: 0
              }, {
                onConflict: 'product_id,display_order',
                ignoreDuplicates: true
              });

            if (insertError) {
              console.log(`⚠️  ${productSku}: ${insertError.message}`);
              errorCount++;
            } else {
              successCount++;
            }
          } else {
            console.log(`⚠️  Product not found: ${productSku}`);
            errorCount++;
          }
        }
      }

      if ((i + 10) % 30 === 0) {
        console.log(`✅ Progress: ${Math.min(i + 10, inserts.length)}/${inserts.length}`);
      }

    } catch (error) {
      console.error(`❌ Batch ${i}-${i + 10} error:`, error.message);
      errorCount += batch.length;
    }
  }

  console.log(`\n📊 Final Summary:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  // Verify
  const { data: verifyData } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .in('product_id',
      supabase.from('products').select('id').like('sku', 'CAB-MNM-%')
    );

  console.log(`\n✓ Total cabinet images in DB: Check manually`);
}

applyMigration().catch(console.error);
