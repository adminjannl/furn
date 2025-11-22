const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Bed data from complete-bed-catalog.json
const beds = JSON.parse(fs.readFileSync('complete-bed-catalog.json', 'utf8'));

// Cabinet data from all-107-cabinets-complete.json
const cabinets = JSON.parse(fs.readFileSync('all-107-cabinets-complete.json', 'utf8'));

// Table data
const tables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'));

// Chair data
const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));

async function importProducts() {
  console.log('Starting bulk product import...\n');

  // Get category IDs
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.slug] = cat.id);

  let totalImported = 0;

  // Import beds
  console.log(`Importing ${beds.length} beds...`);
  for (let i = 0; i < beds.length && i < 30; i++) {
    const bed = beds[i];
    const sku = `BED-${String(i + 100).padStart(3, '0')}`;
    const slug = bed.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: bed.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium ${bed.russianName}`,
      price: 1299.99,
      category_id: categoryMap['beds'],
      stock_quantity: 8,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && bed.imageUrl) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: bed.imageUrl,
          alt_text: bed.russianName,
          display_order: 1
        });
      }
      totalImported++;
    }
  }
  console.log(`✓ Imported ${totalImported} beds`);

  // Import cabinets
  console.log(`\nImporting ${cabinets.length} cabinets...`);
  let cabinetCount = 0;
  for (let i = 0; i < cabinets.length && i < 50; i++) {
    const cabinet = cabinets[i];
    if (!cabinet.russianName) continue;

    const sku = `CAB-${String(i + 100).padStart(3, '0')}`;
    const slug = cabinet.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: cabinet.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium wardrobe ${cabinet.russianName}`,
      price: cabinet.price || 899.99,
      category_id: categoryMap['cabinets'],
      stock_quantity: 12,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && cabinet.imageUrl) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: cabinet.imageUrl,
          alt_text: cabinet.russianName,
          display_order: 1
        });
      }
      cabinetCount++;
    }
  }
  console.log(`✓ Imported ${cabinetCount} cabinets`);

  // Import tables
  console.log(`\nImporting ${tables.length} tables...`);
  let tableCount = 0;
  for (let i = 0; i < tables.length && i < 20; i++) {
    const table = tables[i];
    if (!table.name) continue;

    const sku = `TAB-${String(i + 100).padStart(3, '0')}`;

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: table.name,
      slug: table.slug || `table-${sku.toLowerCase()}`,
      description: table.description || `Premium table ${table.name}`,
      price: table.price || 799.99,
      category_id: categoryMap['tables'],
      stock_quantity: 10,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && table.imageUrl) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: table.imageUrl,
          alt_text: table.name,
          display_order: 1
        });
      }
      tableCount++;
    }
  }
  console.log(`✓ Imported ${tableCount} tables`);

  // Import chairs
  console.log(`\nImporting ${chairs.length} chairs...`);
  let chairCount = 0;
  for (let i = 0; i < chairs.length && i < 25; i++) {
    const chair = chairs[i];
    if (!chair.name) continue;

    const sku = `CHR-${String(i + 100).padStart(3, '0')}`;

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: chair.name,
      slug: chair.slug || `chair-${sku.toLowerCase()}`,
      description: chair.description || `Comfortable chair ${chair.name}`,
      price: chair.price || 199.99,
      category_id: categoryMap['chairs'],
      stock_quantity: 20,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && chair.imageUrl) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: chair.imageUrl,
          alt_text: chair.name,
          display_order: 1
        });
      }
      chairCount++;
    }
  }
  console.log(`✓ Imported ${chairCount} chairs`);

  // Final count
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`\n✅ Total products in database: ${count}`);
  console.log('Import complete!');
}

importProducts().catch(console.error);
