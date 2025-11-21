const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function populateSofaColors() {
  console.log('\n🎨 Populating sofa color variants (fast mode)...\n');

  const variantGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  // Collect all color entries first
  const allColorEntries = [];

  for (const [baseName, products] of Object.entries(variantGroups)) {
    for (const product of products) {
      const colorEntries = products
        .filter(p => p.color)
        .map(variant => ({
          product_id: product.id,
          color_name: variant.color.colorName,
          color_code: variant.color.colorCode,
          variant_slug: variant.slug
        }));

      allColorEntries.push(...colorEntries);
    }
  }

  console.log(`Total color entries to insert: ${allColorEntries.length}\n`);

  // Delete all existing sofa color entries first
  console.log('Deleting existing color entries...');
  const sofaIds = Object.values(variantGroups).flat().map(p => p.id);

  for (let i = 0; i < sofaIds.length; i += 100) {
    const batch = sofaIds.slice(i, i + 100);
    await supabase
      .from('product_colors')
      .delete()
      .in('product_id', batch);
  }

  // Insert in batches of 500
  console.log('Inserting new color entries...\n');
  let inserted = 0;

  for (let i = 0; i < allColorEntries.length; i += 500) {
    const batch = allColorEntries.slice(i, i + 500);
    const progress = Math.min(i + 500, allColorEntries.length);

    process.stdout.write(`\r[${progress}/${allColorEntries.length}] Inserting...`);

    const { error } = await supabase
      .from('product_colors')
      .insert(batch);

    if (!error) {
      inserted += batch.length;
    } else {
      console.error(`\nError in batch ${i}-${i + 500}:`, error.message);
    }
  }

  console.log('\n\n✅ Complete!');
  console.log(`Inserted ${inserted} color variant links`);
}

populateSofaColors().catch(console.error);
