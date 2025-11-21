const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function findMissingProducts() {
  // Load all scraped products
  const allScraped = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));
  console.log(`📦 Total scraped: ${allScraped.length}`);

  // Get existing products from database
  const cabinetsCategory = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();

  const { data: existingProducts, error } = await supabase
    .from('products')
    .select('name, source_url')
    .eq('category_id', cabinetsCategory.data.id);

  if (error) {
    console.error('❌ Database error:', error);
    return;
  }

  console.log(`🗄️  Database products: ${existingProducts.length}`);

  // Create a set of existing URLs (but many are null, so also compare by name)
  const existingUrls = new Set(existingProducts.map(p => p.source_url).filter(Boolean));
  const existingNames = new Set(existingProducts.map(p => p.name));

  // Find products that don't exist in DB (by URL or name)
  const missing = allScraped.filter(p => {
    return !existingUrls.has(p.url) && !existingNames.has(p.russianName);
  });

  console.log(`\n✨ Missing products: ${missing.length}\n`);

  if (missing.length > 0) {
    missing.forEach((p, i) => {
      console.log(`${i + 1}. ${p.russianName}`);
      console.log(`   Price: ${p.price ? `${p.price} ₽` : 'N/A'}`);
      console.log(`   URL: ${p.url}\n`);
    });

    fs.writeFileSync('./missing-16-products.json', JSON.stringify(missing, null, 2));
    console.log('💾 Saved to: missing-16-products.json');
  }

  return missing;
}

findMissingProducts().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
