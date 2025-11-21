const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function analyzeAndDedupeDatabase() {
  console.log('🔍 Analyzing database for duplicates...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, original_name, price, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`📊 Total products in database: ${products.length}\n`);

  const nameMap = new Map();
  const originalNameMap = new Map();
  const duplicates = [];
  const uniqueProducts = [];

  products.forEach(product => {
    const normalizedName = product.name.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedOriginal = product.original_name?.toLowerCase().replace(/\s+/g, ' ').trim();

    let isDuplicate = false;

    if (normalizedOriginal && originalNameMap.has(normalizedOriginal)) {
      const existing = originalNameMap.get(normalizedOriginal);
      duplicates.push({
        duplicate: product,
        original: existing,
        reason: 'Same original name'
      });
      isDuplicate = true;
    } else if (!normalizedOriginal && nameMap.has(normalizedName)) {
      const existing = nameMap.get(normalizedName);
      duplicates.push({
        duplicate: product,
        original: existing,
        reason: 'Same English name'
      });
      isDuplicate = true;
    }

    if (!isDuplicate) {
      uniqueProducts.push(product);
      if (normalizedOriginal) {
        originalNameMap.set(normalizedOriginal, product);
      }
      nameMap.set(normalizedName, product);
    }
  });

  console.log(`✅ Unique products: ${uniqueProducts.length}`);
  console.log(`❌ Duplicate products: ${duplicates.length}\n`);

  if (duplicates.length > 0) {
    console.log('📋 Duplicate Products Found:\n');
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. ${dup.reason}`);
      console.log(`   Original: ${dup.original.name} (SKU: ${dup.original.sku})`);
      console.log(`   Duplicate: ${dup.duplicate.name} (SKU: ${dup.duplicate.sku})`);
      console.log(`   Created: ${dup.original.created_at} vs ${dup.duplicate.created_at}\n`);
    });

    console.log('\n🗑️  Removing duplicates (keeping oldest entries)...\n');

    const idsToDelete = duplicates.map(d => d.duplicate.id);

    for (let i = 0; i < idsToDelete.length; i++) {
      const id = idsToDelete[i];
      console.log(`   Deleting ${i + 1}/${idsToDelete.length}: ${id}`);

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error(`   ❌ Error deleting ${id}: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Deleted successfully`);
      }
    }

    console.log(`\n✅ Removed ${idsToDelete.length} duplicate products\n`);
  } else {
    console.log('✅ No duplicates found!\n');
  }

  const { count: finalCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Final product count: ${finalCount}`);

  const groups = {};
  uniqueProducts.forEach(product => {
    const baseName = product.original_name || product.name;
    const baseMatch = baseName.match(/^(Кровать\s+[А-Я]+)/);
    const group = baseMatch ? baseMatch[1] : 'Other';

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(product);
  });

  console.log('\n📋 Product Groups:\n');
  Object.entries(groups).sort((a, b) => b[1].length - a[1].length).forEach(([group, items]) => {
    console.log(`   ${group}: ${items.length} products`);
  });

  return {
    total: products.length,
    unique: uniqueProducts.length,
    duplicates: duplicates.length,
    finalCount,
    groups
  };
}

analyzeAndDedupeDatabase()
  .then(result => {
    console.log('\n✅ Analysis complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Starting count: ${result.total}`);
    console.log(`   Duplicates removed: ${result.duplicates}`);
    console.log(`   Final count: ${result.finalCount}`);
    console.log(`   Missing to reach 95: ${95 - result.finalCount}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
