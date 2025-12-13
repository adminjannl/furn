require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importSofaImages() {
  console.log('============================================================');
  console.log('IMPORTING IMAGES FOR 48 REAL WAYFAIR SOFAS');
  console.log('============================================================\n');

  // Load the scraped data
  const rawData = fs.readFileSync('./wayfair-sofas-all-48.json', 'utf8');
  const sofas = JSON.parse(rawData);
  console.log(`✓ Loaded ${sofas.length} sofas from JSON file\n`);

  // Get products from SOF-0009 to SOF-0056
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, sku, name')
    .gte('sku', 'SOF-0009')
    .lte('sku', 'SOF-0056')
    .order('sku');

  if (prodError) {
    console.error('Error fetching products:', prodError);
    process.exit(1);
  }

  console.log(`✓ Found ${products.length} products in database\n`);

  // Prepare images
  const images = [];
  for (let i = 0; i < sofas.length; i++) {
    const sofa = sofas[i];
    const product = products[i];

    if (sofa.image && product) {
      images.push({
        product_id: product.id,
        image_url: sofa.image,
        alt_text: sofa.name,
        display_order: 0,
      });
    }
  }

  console.log(`Prepared ${images.length} images for import\n`);

  // Import images
  const { error: imageError } = await supabase
    .from('product_images')
    .insert(images);

  if (imageError) {
    console.error('Error inserting images:', imageError);
    process.exit(1);
  }

  console.log('============================================================');
  console.log('IMPORT COMPLETE');
  console.log('============================================================');
  console.log(`Total images imported: ${images.length}`);
  console.log('============================================================\n');
}

importSofaImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
