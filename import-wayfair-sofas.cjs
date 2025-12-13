const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SOFAS_CATEGORY_ID = 'f84fa665-d66a-4a7b-82e8-5c3b67d27520';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

function parsePrice(priceStr) {
  if (!priceStr) return null;
  return parseFloat(priceStr.replace(/[$,]/g, ''));
}

async function getNextSofaSKU() {
  const { data, error } = await supabase
    .from('products')
    .select('sku')
    .ilike('sku', 'SOF-%')
    .order('sku', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching SKUs:', error);
    return 'SOF-0001';
  }

  if (!data || data.length === 0) {
    return 'SOF-0001';
  }

  const lastSKU = data[0].sku;
  const match = lastSKU.match(/SOF-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1]) + 1;
    return `SOF-${String(nextNum).padStart(4, '0')}`;
  }

  return 'SOF-0001';
}

async function importWayfairSofas() {
  console.log('============================================================');
  console.log('IMPORTING WAYFAIR SOFAS TO DATABASE');
  console.log('============================================================\n');

  const wayfairData = JSON.parse(
    fs.readFileSync('./wayfair-products-complete.json', 'utf8')
  );

  console.log(`Found ${wayfairData.length} Wayfair sofas to import\n`);

  let startingSKU = await getNextSofaSKU();
  let skuNum = parseInt(startingSKU.match(/(\d+)/)[1]);

  const imported = [];
  const errors = [];

  for (const wayfair of wayfairData) {
    try {
      const sku = `SOF-${String(skuNum).padStart(4, '0')}`;
      const slug = generateSlug(wayfair.name);
      const price = parsePrice(wayfair.price);
      const originalPrice = parsePrice(wayfair.original_price);

      console.log(`Importing: ${wayfair.name}`);
      console.log(`  SKU: ${sku}`);
      console.log(`  Price: $${price}`);

      const description = [
        wayfair.manufacturer ? `by ${wayfair.manufacturer}` : null,
        wayfair.rating ? `★ ${wayfair.rating}/5 (${wayfair.review_count || 0} reviews)` : null,
        wayfair.badge ? `🏷️ ${wayfair.badge}` : null,
        originalPrice && originalPrice > price ? `Originally $${originalPrice}` : null,
      ]
        .filter(Boolean)
        .join(' • ');

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          category_id: SOFAS_CATEGORY_ID,
          name: wayfair.name,
          slug: slug,
          description: description || 'Premium sofa from Wayfair collection',
          price: price,
          sku: sku,
          stock_quantity: 5,
          allow_backorder: true,
          status: 'active',
        })
        .select()
        .single();

      if (productError) {
        console.error(`  ✗ Error inserting product:`, productError.message);
        errors.push({ name: wayfair.name, error: productError.message });
        continue;
      }

      if (wayfair.image) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: wayfair.image,
            display_order: 0,
            alt_text: wayfair.name,
          });

        if (imageError) {
          console.error(`  ⚠ Warning: Could not insert image:`, imageError.message);
        } else {
          console.log(`  ✓ Image added`);
        }
      }

      console.log(`  ✓ Imported successfully\n`);
      imported.push({ sku, name: wayfair.name, price });
      skuNum++;
    } catch (err) {
      console.error(`  ✗ Unexpected error:`, err.message);
      errors.push({ name: wayfair.name, error: err.message });
    }
  }

  console.log('============================================================');
  console.log('IMPORT SUMMARY');
  console.log('============================================================\n');
  console.log(`Total processed: ${wayfairData.length}`);
  console.log(`✓ Successfully imported: ${imported.length}`);
  console.log(`✗ Failed: ${errors.length}\n`);

  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach((err) => {
      console.log(`  - ${err.name}: ${err.error}`);
    });
  }

  console.log('\n✓ Import complete!');
}

importWayfairSofas().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
