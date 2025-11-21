require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicates() {
  console.log('🔍 Finding duplicate products...\n');

  const { data: duplicates, error } = await supabase
    .from('products')
    .select('name, id, created_at, sku, slug, source_url')
    .order('name, created_at');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  const groupedByName = {};
  duplicates.forEach(product => {
    if (!groupedByName[product.name]) {
      groupedByName[product.name] = [];
    }
    groupedByName[product.name].push(product);
  });

  let totalDuplicates = 0;
  let totalToDelete = 0;
  const idsToDelete = [];

  console.log('📊 Duplicate Analysis:\n');

  for (const [name, products] of Object.entries(groupedByName)) {
    if (products.length > 1) {
      totalDuplicates++;
      const toDelete = products.length - 1;
      totalToDelete += toDelete;

      console.log(`"${name}"`);
      console.log(`  Found: ${products.length} copies`);
      console.log(`  Keeping: ${products[0].slug} (oldest, created ${products[0].created_at})`);
      console.log(`  Deleting: ${toDelete} duplicates\n`);

      for (let i = 1; i < products.length; i++) {
        idsToDelete.push(products[i].id);
      }
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`  Product names with duplicates: ${totalDuplicates}`);
  console.log(`  Total duplicate products to delete: ${totalToDelete}`);
  console.log(`  Products to keep: ${totalDuplicates}\n`);

  if (idsToDelete.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  console.log('🗑️  Deleting duplicate products...\n');

  const batchSize = 50;
  let deleted = 0;

  for (let i = 0; i < idsToDelete.length; i += batchSize) {
    const batch = idsToDelete.slice(i, i + batchSize);

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', batch);

    if (deleteError) {
      console.error(`❌ Error deleting batch ${Math.floor(i / batchSize) + 1}:`, deleteError);
    } else {
      deleted += batch.length;
      console.log(`   ✅ Deleted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(idsToDelete.length / batchSize)} (${batch.length} products)`);
    }
  }

  console.log(`\n✨ Deduplication complete!`);
  console.log(`   Deleted: ${deleted} duplicate products`);
  console.log(`   Kept: ${totalDuplicates} unique products\n`);
}

removeDuplicates().catch(console.error);
