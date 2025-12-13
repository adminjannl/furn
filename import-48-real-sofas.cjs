require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importRealSofas() {
  console.log('============================================================');
  console.log('IMPORTING 48 REAL WAYFAIR SOFAS');
  console.log('============================================================\n');

  // Load the scraped data
  const rawData = fs.readFileSync('./wayfair-sofas-all-48.json', 'utf8');
  const sofas = JSON.parse(rawData);
  console.log(`✓ Loaded ${sofas.length} sofas from JSON file\n`);

  // Get the Sofas category ID
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sofas')
    .single();

  if (catError) {
    console.error('Error finding Sofas category:', catError);
    process.exit(1);
  }

  console.log(`✓ Found Sofas category ID: ${category.id}\n`);

  // Prepare products for import (SOF-0009 to SOF-0056)
  const products = sofas.map((sofa, index) => {
    const skuNumber = String(9 + index).padStart(4, '0');
    const sku = `SOF-${skuNumber}`;

    // Clean price
    const price = sofa.price ? parseFloat(sofa.price.replace(/[$,]/g, '')) : null;
    const originalPrice = sofa.original_price ? parseFloat(sofa.original_price.replace(/[$,]/g, '')) : null;

    // Generate slug from name
    const slug = sofa.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return {
      sku,
      name: sofa.name,
      slug: `${slug}-${sku.toLowerCase()}`,
      description: `Premium ${sofa.name} from ${sofa.manufacturer || 'top manufacturer'}. High-quality construction with modern design. Features comfortable seating and durable upholstery.`,
      price: price?.toFixed(2) || '999.00',
      category_id: category.id,
      stock_quantity: 5,
      length_cm: 200,
      width_cm: 90,
      height_cm: 85,
      weight_kg: 45,
      materials: 'Premium Fabric, Solid Wood Frame',
      status: 'active',
      allow_backorder: true,
    };
  });

  console.log('Sample products to import:');
  products.slice(0, 3).forEach(p => {
    console.log(`  - ${p.sku}: ${p.name} (€${p.price})`);
  });
  console.log(`  ... and ${products.length - 3} more\n`);

  // Import products
  console.log('Inserting products into database...');
  const { data: insertedProducts, error: insertError } = await supabase
    .from('products')
    .insert(products)
    .select('id, sku, name');

  if (insertError) {
    console.error('Error inserting products:', insertError);
    process.exit(1);
  }

  console.log(`✓ Successfully inserted ${insertedProducts.length} products\n`);

  // Now import images
  console.log('Importing product images...');
  const images = [];

  for (let i = 0; i < sofas.length; i++) {
    const sofa = sofas[i];
    const product = insertedProducts[i];

    if (sofa.image && product) {
      images.push({
        product_id: product.id,
        image_url: sofa.image,
        alt_text: sofa.name,
        display_order: 0,
      });
    }
  }

  if (images.length > 0) {
    const { error: imageError } = await supabase
      .from('product_images')
      .insert(images);

    if (imageError) {
      console.error('Error inserting images:', imageError);
    } else {
      console.log(`✓ Successfully inserted ${images.length} product images\n`);
    }
  }

  console.log('============================================================');
  console.log('IMPORT COMPLETE');
  console.log('============================================================');
  console.log(`Total products imported: ${insertedProducts.length}`);
  console.log(`SKU range: SOF-0009 to SOF-${String(8 + sofas.length).padStart(4, '0')}`);
  console.log('============================================================\n');
}

importRealSofas().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
