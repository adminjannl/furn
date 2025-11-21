const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importMissingSofas() {
  console.log('\n🔄 Importing 140 missing sofas...\n');

  const missing = JSON.parse(fs.readFileSync('missing-sofas.json', 'utf8'));

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sofas')
    .single();

  if (!category) {
    console.error('❌ Sofas category not found');
    return;
  }

  let imported = 0;
  let failed = 0;

  for (let i = 0; i < missing.length; i++) {
    const product = missing[i];
    const progress = `${i + 1}/${missing.length}`;

    process.stdout.write(`\r[${progress}] ${product.title.substring(0, 60).padEnd(60)}`);

    let name = product.title
      .replace(/^(Диван|Угловой диван|Sofa)\s*/i, '')
      .trim();

    if (!name) name = product.title;

    // Create unique slug by including full product title + unique suffix
    const baseSlug = product.title
      .toLowerCase()
      .replace(/^(диван|угловой диван|sofa)\s*/i, '')
      .replace(/[^a-zа-яё0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 120);

    const slug = `${baseSlug}-${Date.now().toString(36)}-${i}`;

    const urlPart = product.url.split('/').pop().replace(/[^a-z0-9-]/gi, '').substring(0, 40);
    const sku = `${urlPart}-${Date.now().toString(36)}-${i}`;

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name: name,
        slug: slug,
        sku: sku,
        source_name_russian: product.title,
        source_url: product.url,
        category_id: category.id,
        price: 0
      })
      .select()
      .single();

    if (newProduct) {
      await supabase
        .from('product_images')
        .insert({
          product_id: newProduct.id,
          image_url: product.imageUrl,
          display_order: 0,
          alt_text: product.title
        });

      imported++;
    } else {
      if (error) console.error(`\n   Error: ${error.message}`);
      failed++;
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n\n✅ Import complete!');
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed: ${failed}`);
}

importMissingSofas().catch(console.error);
