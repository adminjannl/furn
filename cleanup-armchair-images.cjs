const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupArmchairImages() {
  console.log('\n🧹 Cleaning up armchair images...\n');

  // Get all armchair products
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .ilike('source_url', '%kresla%');

  console.log(`Found ${products.length} armchair products\n`);

  let cleaned = 0;
  for (const product of products) {
    // Keep only the first image (display_order = 0, which is from category page)
    // Delete all others
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id)
      .neq('display_order', 0);

    if (error) {
      console.error(`Error cleaning ${product.name}:`, error.message);
    } else {
      cleaned++;
      process.stdout.write(`\rCleaned: ${cleaned}/${products.length}`);
    }
  }

  console.log('\n\n✅ Cleanup complete!\n');

  // Verify results
  const results = await Promise.all(
    products.map(async (p) => {
      const { count } = await supabase
        .from('product_images')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', p.id);
      return count;
    })
  );

  const total = results.reduce((a, b) => a + b, 0);
  const avg = total / products.length;

  console.log(`Total products: ${products.length}`);
  console.log(`Average images per product: ${avg.toFixed(1)}`);
  console.log(`Total images: ${total}\n`);
}

cleanupArmchairImages().catch(console.error);
