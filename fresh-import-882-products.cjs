const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function freshImport() {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('FRESH IMPORT: 882 PRODUCTS');
  console.log('Target: 624 Sofas + 95 Beds + 14 Mattresses + 105 Cabinets + 22 Tables + 22 Chairs');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  categories.forEach(c => catMap[c.slug] = c.id);

  // Clear all products
  console.log('Clearing database...');
  await supabase.from('product_colors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✓ Database cleared\n');

  let counts = { sofas: 0, beds: 0, mattresses: 0, cabinets: 0, tables: 0, chairs: 0 };

  // 1. SOFAS: Import 624 from sofa-variant-groups.json
  console.log('1/6 Importing 624 sofas...');
  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));
  const allSofaVariants = Object.entries(sofaGroups).flatMap(([group, variants]) =>
    variants.map(v => ({ ...v, group }))
  );

  for (let i = 0; i < Math.min(allSofaVariants.length, 624); i++) {
    const variant = allSofaVariants[i];
    if (!variant.name) continue;

    const sku = `SOF-${String(i + 1).padStart(4, '0')}`;
    const imageUrl = variant.imageUrl ||
                    (variant.url && variant.url.includes('mnogomebeli.com') ?
                     variant.url.replace(/\/$/, '') + '.jpg' :
                     'https://mnogomebeli.com/upload/resize_cache/default.jpg');

    const { data: product } = await supabase.from('products').insert({
      sku,
      name: variant.name,
      slug: (variant.slug || `${variant.group}-${variant.name}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .substring(0, 60) + `-${sku.toLowerCase()}`,
      description: `Premium ${variant.group || 'modular'} sofa${variant.color ? ' in ' + variant.color.colorName : ''}`,
      price: 1499.99,
      category_id: catMap['sofas'],
      stock_quantity: 8,
      status: 'active'
    }).select().single();

    if (product) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url: imageUrl,
        alt_text: variant.name,
        display_order: 1
      });

      if (variant.color) {
        await supabase.from('product_colors').insert({
          product_id: product.id,
          color_name: variant.color.colorName || 'Standard',
          color_code: variant.color.colorCode || '#808080',
          image_url: imageUrl,
          is_available: true
        });
      }

      counts.sofas++;
      if (counts.sofas % 50 === 0) process.stdout.write(`  ${counts.sofas}...`);
    }
  }
  console.log(`\n✓ Imported ${counts.sofas} sofas\n`);

  // 2. BEDS: Import 95
  console.log('2/6 Importing 95 beds...');
  const beds1 = JSON.parse(fs.readFileSync('complete-bed-catalog.json', 'utf8'));
  const beds2 = JSON.parse(fs.readFileSync('remaining-beds-64-95.json', 'utf8'));
  const allBeds = [...beds1, ...beds2].filter(b => (b.russianName || b.name) && (b.imageUrl || b.image_url));

  for (let i = 0; i < Math.min(allBeds.length, 95); i++) {
    const bed = allBeds[i];
    const bedName = bed.russianName || bed.name;
    const bedImg = bed.imageUrl || bed.image_url;

    const sku = `BED-${String(i + 1).padStart(4, '0')}`;
    const { data: product } = await supabase.from('products').insert({
      sku,
      name: bedName,
      slug: bedName.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').substring(0, 50) + `-${sku.toLowerCase()}`,
      description: bed.description || `Luxury bed ${bedName}`,
      price: bed.price || 1299.99,
      category_id: catMap['beds'],
      stock_quantity: 8,
      status: 'active'
    }).select().single();

    if (product) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url: bedImg,
        alt_text: bedName,
        display_order: 1
      });
      counts.beds++;
      if (counts.beds % 10 === 0) process.stdout.write(`  ${counts.beds}...`);
    }
  }
  console.log(`\n✓ Imported ${counts.beds} beds\n`);

  // 3. MATTRESSES: Import 14
  console.log('3/6 Importing 14 mattresses...');
  const mattresses = JSON.parse(fs.readFileSync('mattresses-scraped.json', 'utf8'))
    .filter(m => m.russianName && m.imageUrl).slice(0, 14);

  for (let i = 0; i < mattresses.length; i++) {
    const mat = mattresses[i];
    const sku = `MAT-${String(i + 1).padStart(4, '0')}`;
    const { data: product } = await supabase.from('products').insert({
      sku,
      name: mat.russianName,
      slug: mat.russianName.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').substring(0, 50) + `-${sku.toLowerCase()}`,
      description: mat.description || `Premium mattress ${mat.russianName}`,
      price: mat.price || 799.99,
      category_id: catMap['mattresses'],
      stock_quantity: 15,
      status: 'active'
    }).select().single();

    if (product) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url: mat.imageUrl,
        alt_text: mat.russianName,
        display_order: 1
      });
      counts.mattresses++;
    }
  }
  console.log(`✓ Imported ${counts.mattresses} mattresses\n`);

  // 4. CABINETS: Import 105
  console.log('4/6 Importing 105 cabinets...');
  const cabinets = JSON.parse(fs.readFileSync('all-107-cabinets-complete.json', 'utf8'))
    .filter(c => c.russianName && c.imageUrl).slice(0, 105);

  for (let i = 0; i < cabinets.length; i++) {
    const cab = cabinets[i];
    const sku = `CAB-${String(i + 1).padStart(4, '0')}`;
    const { data: product } = await supabase.from('products').insert({
      sku,
      name: cab.russianName,
      slug: cab.russianName.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').substring(0, 50) + `-${sku.toLowerCase()}`,
      description: cab.description || `Premium wardrobe ${cab.russianName}`,
      price: cab.price || 899.99,
      category_id: catMap['cabinets'],
      stock_quantity: 12,
      status: 'active'
    }).select().single();

    if (product) {
      const imagesToAdd = [cab.imageUrl];
      if (cab.allImages && Array.isArray(cab.allImages)) {
        imagesToAdd.push(...cab.allImages.slice(0, 4));
      }

      for (let j = 0; j < imagesToAdd.length; j++) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: imagesToAdd[j],
          alt_text: `${cab.russianName} - View ${j + 1}`,
          display_order: j + 1
        });
      }

      counts.cabinets++;
      if (counts.cabinets % 20 === 0) process.stdout.write(`  ${counts.cabinets}...`);
    }
  }
  console.log(`\n✓ Imported ${counts.cabinets} cabinets\n`);

  // 5. TABLES: Import 22
  console.log('5/6 Importing 22 tables...');
  const tables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'))
    .filter(t => t.name && t.images && t.images.length > 0).slice(0, 22);

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const sku = `TAB-${String(i + 1).padStart(4, '0')}`;
    const { data: product } = await supabase.from('products').insert({
      sku,
      name: table.name,
      slug: (table.slug || table.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).substring(0, 50) + `-${sku.toLowerCase()}`,
      description: table.description || `Premium table ${table.name}`,
      price: table.price || 799.99,
      category_id: catMap['tables'],
      stock_quantity: 10,
      status: 'active'
    }).select().single();

    if (product) {
      for (let j = 0; j < Math.min(table.images.length, 5); j++) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: table.images[j],
          alt_text: `${table.name} - View ${j + 1}`,
          display_order: j + 1
        });
      }
      counts.tables++;
    }
  }
  console.log(`✓ Imported ${counts.tables} tables\n`);

  // 6. CHAIRS: Import 22
  console.log('6/6 Importing 22 chairs...');
  const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'))
    .filter(c => c.name && c.images && c.images.length > 0).slice(0, 22);

  for (let i = 0; i < chairs.length; i++) {
    const chair = chairs[i];
    const sku = `CHR-${String(i + 1).padStart(4, '0')}`;
    const { data: product } = await supabase.from('products').insert({
      sku,
      name: chair.name,
      slug: chair.name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').substring(0, 50) + `-${sku.toLowerCase()}`,
      description: chair.description || `Premium chair ${chair.name}`,
      price: chair.price || 199.99,
      category_id: catMap['chairs'],
      stock_quantity: 20,
      status: 'active'
    }).select().single();

    if (product) {
      for (let j = 0; j < Math.min(chair.images.length, 5); j++) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: chair.images[j],
          alt_text: `${chair.name} - View ${j + 1}`,
          display_order: j + 1
        });
      }
      counts.chairs++;
    }
  }
  console.log(`✓ Imported ${counts.chairs} chairs\n`);

  const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: totalImages } = await supabase.from('product_images').select('*', { count: 'exact', head: true });

  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('IMPORT COMPLETE!');
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log(`✓ Sofas:      ${counts.sofas}/624`);
  console.log(`✓ Beds:       ${counts.beds}/95`);
  console.log(`✓ Mattresses: ${counts.mattresses}/14`);
  console.log(`✓ Cabinets:   ${counts.cabinets}/105`);
  console.log(`✓ Tables:     ${counts.tables}/22`);
  console.log(`✓ Chairs:     ${counts.chairs}/22`);
  console.log('──────────────────────────────────────────────────────────────────────');
  console.log(`📦 TOTAL:     ${total} products with ${totalImages} images`);
  console.log('══════════════════════════════════════════════════════════════════════');
}

freshImport().catch(console.error);
