const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function importCompleteCatalog() {
  console.log('═'.repeat(70));
  console.log('IMPORTING COMPLETE PRODUCT CATALOG');
  console.log('Target: 624 Sofas, 95 Beds, 14 Mattresses, 105 Cabinets, 22 Tables, 22 Chairs');
  console.log('═'.repeat(70));
  console.log('');

  const { data: categories } = await supabase.from('categories').select('id, slug');
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.slug] = cat.id);

  let totalImported = 0;

  // Clear existing products first
  console.log('Clearing existing products...');
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✓ Database cleared\n');

  // 1. Import 624 Sofas (from missing-sofas.json)
  console.log('1/6 Importing sofas...');
  const sofas = JSON.parse(fs.readFileSync('missing-sofas.json', 'utf8'));
  let sofaCount = 0;

  for (let i = 0; i < sofas.length && sofaCount < 624; i++) {
    const sofa = sofas[i];
    if (!sofa.title || !sofa.imageUrl) continue;

    const sku = `SOF-${String(i + 1).padStart(4, '0')}`;
    const slug = sofa.title.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: sofa.title,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium sofa ${sofa.title}`,
      price: 1499.99,
      category_id: categoryMap['sofas'],
      stock_quantity: 8,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: sofa.imageUrl,
          alt_text: sofa.title,
          display_order: 1
        });
        sofaCount++;
        if (sofaCount % 50 === 0) process.stdout.write(`  ${sofaCount}...`);
      }
    }
  }
  console.log(`\n  ✓ Imported ${sofaCount} sofas`);
  totalImported += sofaCount;

  // 2. Import 95 Beds (complete-bed-catalog.json + remaining-beds-64-95.json)
  console.log('\n2/6 Importing beds...');
  const completeBeds = JSON.parse(fs.readFileSync('complete-bed-catalog.json', 'utf8'));
  const remainingBeds = JSON.parse(fs.readFileSync('remaining-beds-64-95.json', 'utf8'));
  const allBeds = [...completeBeds, ...remainingBeds]
    .filter(b => b.russianName || b.name);

  let bedCount = 0;
  for (let i = 0; i < allBeds.length && bedCount < 95; i++) {
    const bed = allBeds[i];
    const bedName = bed.russianName || bed.name;
    const bedImage = bed.imageUrl || bed.image_url;
    if (!bedName || !bedImage) continue;

    const sku = `BED-${String(i + 1).padStart(4, '0')}`;
    const slug = bedName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: bedName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Luxury bed ${bedName}`,
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
          image_url: bedImage,
          alt_text: bedName,
          display_order: 1
        });
        bedCount++;
        if (bedCount % 10 === 0) process.stdout.write(`  ${bedCount}...`);
      }
    }
  }
  console.log(`\n  ✓ Imported ${bedCount} beds`);
  totalImported += bedCount;

  // 3. Import 14 Mattresses
  console.log('\n3/6 Importing mattresses...');
  const mattresses = JSON.parse(fs.readFileSync('mattresses-scraped.json', 'utf8'))
    .filter(m => m.russianName && m.imageUrl && !m.russianName.includes('★'));

  let mattressCount = 0;
  for (let i = 0; i < mattresses.length && mattressCount < 14; i++) {
    const mattress = mattresses[i];
    const sku = `MAT-${String(i + 1).padStart(4, '0')}`;
    const slug = mattress.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: mattress.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium mattress ${mattress.russianName}`,
      price: 799.99,
      category_id: categoryMap['mattresses'],
      stock_quantity: 15,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: mattress.imageUrl,
          alt_text: mattress.russianName,
          display_order: 1
        });
        mattressCount++;
      }
    }
  }
  console.log(`  ✓ Imported ${mattressCount} mattresses`);
  totalImported += mattressCount;

  // 4. Import 105 Cabinets
  console.log('\n4/6 Importing cabinets...');
  const cabinets = JSON.parse(fs.readFileSync('all-107-cabinets-complete.json', 'utf8'));
  let cabinetCount = 0;

  for (let i = 0; i < cabinets.length && cabinetCount < 105; i++) {
    const cabinet = cabinets[i];
    if (!cabinet.russianName || !cabinet.imageUrl) continue;

    const sku = `CAB-${String(i + 1).padStart(4, '0')}`;
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

        // Add extra images if available
        if (cabinet.allImages && Array.isArray(cabinet.allImages)) {
          for (let j = 0; j < Math.min(cabinet.allImages.length, 5); j++) {
            await supabase.from('product_images').insert({
              product_id: product.id,
              image_url: cabinet.allImages[j],
              alt_text: `${cabinet.russianName} - Image ${j + 2}`,
              display_order: j + 2
            });
          }
        }
        cabinetCount++;
        if (cabinetCount % 20 === 0) process.stdout.write(`  ${cabinetCount}...`);
      }
    }
  }
  console.log(`\n  ✓ Imported ${cabinetCount} cabinets`);
  totalImported += cabinetCount;

  // 5. Import 22 Tables
  console.log('\n5/6 Importing tables...');
  const tables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'));
  let tableCount = 0;

  for (let i = 0; i < tables.length && tableCount < 22; i++) {
    const table = tables[i];
    if (!table.name) continue;

    const sku = `TAB-${String(i + 1).padStart(4, '0')}`;

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
  console.log(`  ✓ Imported ${tableCount} tables`);
  totalImported += tableCount;

  // 6. Import 22 Chairs
  console.log('\n6/6 Importing chairs...');
  const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));
  let chairCount = 0;

  for (let i = 0; i < chairs.length && chairCount < 22; i++) {
    const chair = chairs[i];
    if (!chair.name) continue;

    const sku = `CHR-${String(i + 1).padStart(4, '0')}`;
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
  console.log(`  ✓ Imported ${chairCount} chairs`);
  totalImported += chairCount;

  // Final summary
  const { count: finalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: finalImages } = await supabase.from('product_images').select('*', { count: 'exact', head: true });

  console.log('\n' + '═'.repeat(70));
  console.log('IMPORT COMPLETE!');
  console.log('═'.repeat(70));
  console.log(`Sofas:      ${sofaCount}/624`);
  console.log(`Beds:       ${bedCount}/95`);
  console.log(`Mattresses: ${mattressCount}/14`);
  console.log(`Cabinets:   ${cabinetCount}/105`);
  console.log(`Tables:     ${tableCount}/22`);
  console.log(`Chairs:     ${chairCount}/22`);
  console.log('─'.repeat(70));
  console.log(`TOTAL:      ${finalProducts} products with ${finalImages} images`);
  console.log('═'.repeat(70));
}

importCompleteCatalog().catch(console.error);
