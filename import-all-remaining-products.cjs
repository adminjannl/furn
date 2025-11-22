const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function importAllProducts() {
  console.log('Importing ALL remaining products from data files...\n');

  const { data: categories } = await supabase.from('categories').select('id, slug');
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.slug] = cat.id);

  // Get current product count
  const { count: initialCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`Starting with ${initialCount} products\n`);

  // Import ALL remaining cabinets (107 available)
  console.log('Importing all 107 cabinets...');
  const allCabinets = JSON.parse(fs.readFileSync('all-107-cabinets-complete.json', 'utf8'));
  let cabinetCount = 0;

  for (let i = 0; i < allCabinets.length; i++) {
    const cabinet = allCabinets[i];
    if (!cabinet.russianName || !cabinet.imageUrl) continue;

    const sku = `CAB-${String(i + 200).padStart(4, '0')}`;
    const slug = cabinet.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: cabinet.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium wardrobe ${cabinet.russianName}`,
      price: cabinet.price || 899.99,
      category_id: categoryMap['cabinets'],
      stock_quantity: 12,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && cabinet.imageUrl) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: cabinet.imageUrl,
          alt_text: cabinet.russianName,
          display_order: 1
        });
        
        // Add additional images if available
        if (cabinet.allImages && Array.isArray(cabinet.allImages)) {
          for (let j = 0; j < Math.min(cabinet.allImages.length, 8); j++) {
            await supabase.from('product_images').insert({
              product_id: product.id,
              image_url: cabinet.allImages[j],
              alt_text: `${cabinet.russianName} - Image ${j + 2}`,
              display_order: j + 2
            });
          }
        }
        cabinetCount++;
      }
    }
  }
  console.log(`✓ Imported ${cabinetCount} cabinets`);

  // Import ALL beds (45 from complete-bed-catalog.json)
  console.log('\nImporting all beds...');
  const allBeds = JSON.parse(fs.readFileSync('complete-bed-catalog.json', 'utf8'));
  let bedCount = 0;

  for (let i = 0; i < allBeds.length; i++) {
    const bed = allBeds[i];
    if (!bed.russianName || !bed.imageUrl) continue;

    const sku = `BED-${String(i + 200).padStart(4, '0')}`;
    const slug = bed.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: bed.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Luxury bed ${bed.russianName}`,
      price: 1299.99,
      category_id: categoryMap['beds'],
      stock_quantity: 8,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: bed.imageUrl,
          alt_text: bed.russianName,
          display_order: 1
        });
        bedCount++;
      }
    }
  }
  console.log(`✓ Imported ${bedCount} beds`);

  // Import ALL remaining chairs
  console.log('\nImporting all chairs...');
  const allChairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));
  let chairCount = 0;

  for (let i = 0; i < allChairs.length; i++) {
    const chair = allChairs[i];
    if (!chair.name) continue;

    const sku = `CHR-${String(i + 200).padStart(4, '0')}`;
    const slug = chair.name.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: chair.name,
      slug: slug + `-${sku.toLowerCase()}`,
      description: chair.description || `Premium chair ${chair.name}`,
      price: chair.price || 199.99,
      category_id: categoryMap['chairs'],
      stock_quantity: 20,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && chair.images && chair.images.length > 0) {
        for (let j = 0; j < Math.min(chair.images.length, 5); j++) {
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: chair.images[j],
            alt_text: `${chair.name} - View ${j + 1}`,
            display_order: j + 1
          });
        }
        chairCount++;
      }
    }
  }
  console.log(`✓ Imported ${chairCount} chairs`);

  // Import ALL tables
  console.log('\nImporting all tables...');
  const allTables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'));
  let tableCount = 0;

  for (let i = 0; i < allTables.length; i++) {
    const table = allTables[i];
    if (!table.name) continue;

    const sku = `TAB-${String(i + 200).padStart(4, '0')}`;

    const { error } = await supabase.from('products').insert({
      sku,
      name: table.name,
      slug: table.slug || `table-${sku.toLowerCase()}`,
      description: table.description || `Premium table ${table.name}`,
      price: table.price || 799.99,
      category_id: categoryMap['tables'],
      stock_quantity: 10,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product && table.images && table.images.length > 0) {
        for (let j = 0; j < Math.min(table.images.length, 5); j++) {
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: table.images[j],
            alt_text: `${table.name} - View ${j + 1}`,
            display_order: j + 1
          });
        }
        tableCount++;
      }
    }
  }
  console.log(`✓ Imported ${tableCount} tables`);

  // Final count
  const { count: finalCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: imageCount } = await supabase.from('product_images').select('*', { count: 'exact', head: true });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Import Complete!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Products added: ${finalCount - initialCount}`);
  console.log(`Total products now: ${finalCount}`);
  console.log(`Total images: ${imageCount}`);
  console.log(`${'='.repeat(60)}`);
}

importAllProducts().catch(console.error);
