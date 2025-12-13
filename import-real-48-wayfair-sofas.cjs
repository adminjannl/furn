require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importRealWayfairSofas() {
  console.log('============================================================');
  console.log('IMPORTING 48 REAL WAYFAIR SOFAS');
  console.log('============================================================\n');

  const realProducts = JSON.parse(fs.readFileSync('./wayfair-products-final.json', 'utf8'));
  const priceData = JSON.parse(fs.readFileSync('./wayfair-sofas-all-48.json', 'utf8'));

  console.log(`✓ Loaded ${realProducts.length} real products\n`);

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sofas')
    .single();

  console.log(`✓ Found Sofas category ID: ${category.id}\n`);

  const products = realProducts.map((product, index) => {
    const skuNumber = String(9 + index).padStart(4, '0');
    const sku = `SOF-${skuNumber}`;

    const priceInfo = priceData[index];
    let price = 999.00;
    if (priceInfo && priceInfo.price) {
      price = parseFloat(priceInfo.price.replace(/[$,]/g, ''));
    }

    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    return {
      sku,
      name: product.name,
      slug: `${slug}-${sku.toLowerCase()}`,
      description: `${product.name}. Premium quality furniture from top manufacturers. Features durable construction and modern design perfect for any living space.`,
      price: price.toFixed(2),
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
    console.log(`  - ${p.sku}: ${p.name.substring(0, 60)}... (€${p.price})`);
  });
  console.log(`  ... and ${products.length - 3} more\n`);

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

  console.log('Importing product images...');
  const images = [];

  for (let i = 0; i < realProducts.length; i++) {
    const product = realProducts[i];
    const dbProduct = insertedProducts[i];

    if (product.image && dbProduct && !product.image.includes('default_name.jpg')) {
      images.push({
        product_id: dbProduct.id,
        image_url: product.image,
        alt_text: product.name,
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
  console.log(`Total images imported: ${images.length}`);
  console.log(`SKU range: SOF-0009 to SOF-${String(8 + realProducts.length).padStart(4, '0')}`);
  console.log('============================================================\n');
}

importRealWayfairSofas().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
