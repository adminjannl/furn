const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function importAllProducts() {
  console.log('═'.repeat(70));
  console.log('IMPORTING ALL PRODUCTS FROM JSON FILES');
  console.log('═'.repeat(70));
  console.log('');

  const { data: categories } = await supabase.from('categories').select('id, slug');
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.slug] = cat.id);

  let stats = {
    sofas: 0,
    beds: 0,
    mattresses: 0,
    cabinets: 0,
    tables: 0,
    chairs: 0
  };

  // 1. Import Sofas from sofa-variant-groups.json (556 products)
  console.log('1/6 Importing sofas from variant groups...');
  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  for (const [groupName, variants] of Object.entries(sofaGroups)) {
    for (const variant of variants) {
      if (!variant.name || !variant.url) continue;

      const sku = `SOF-${String(stats.sofas + 1).padStart(4, '0')}`;
      const imageUrl = variant.imageUrl ||
                      (variant.url.includes('mnogomebeli.com') ?
                       variant.url.replace(/\/$/, '') + '.jpg' :
                       'https://mnogomebeli.com/images/placeholder.jpg');

      const { error } = await supabase.from('products').insert({
        sku,
        name: variant.name,
        slug: variant.slug || `${groupName.toLowerCase().replace(/\s+/g, '-')}-${sku.toLowerCase()}`,
        description: `Premium ${groupName} sofa${variant.color ? ' in ' + variant.color.colorName : ''}`,
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
            image_url: imageUrl,
            alt_text: variant.name,
            display_order: 1
          });

          if (variant.color) {
            await supabase.from('product_colors').insert({
              product_id: product.id,
              color_name: variant.color.colorName || 'Default',
              color_code: variant.color.colorCode || '#808080',
              image_url: imageUrl,
              is_available: true
            }).select();
          }

          stats.sofas++;
          if (stats.sofas % 100 === 0) process.stdout.write(`  ${stats.sofas}...`);
        }
      }

      if (stats.sofas >= 624) break;
    }
    if (stats.sofas >= 624) break;
  }
  console.log(`\n  ✓ Imported ${stats.sofas} sofas`);

  // 2. Import Beds from complete-bed-catalog.json + remaining-beds-64-95.json
  console.log('\n2/6 Importing beds...');
  let allBeds = [];

  try {
    const completeBeds = JSON.parse(fs.readFileSync('complete-bed-catalog.json', 'utf8'));
    allBeds = allBeds.concat(completeBeds);
  } catch(e) {}

  try {
    const remainingBeds = JSON.parse(fs.readFileSync('remaining-beds-64-95.json', 'utf8'));
    allBeds = allBeds.concat(remainingBeds);
  } catch(e) {}

  try {
    const allBedsFile = JSON.parse(fs.readFileSync('all-95-beds-scraped.json', 'utf8'));
    if (Array.isArray(allBedsFile)) allBeds = allBeds.concat(allBedsFile);
  } catch(e) {}

  const uniqueBeds = Array.from(new Map(allBeds.map(b => [
    b.url || b.russianName || b.name, b
  ])).values());

  for (const bed of uniqueBeds) {
    if (stats.beds >= 95) break;
    const bedName = bed.russianName || bed.name;
    const bedImage = bed.imageUrl || bed.image_url;
    if (!bedName || !bedImage) continue;

    const sku = `BED-${String(stats.beds + 1).padStart(4, '0')}`;
    const slug = bedName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: bedName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: bed.description || `Luxury bed ${bedName}`,
      price: bed.price || 1299.99,
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
        stats.beds++;
        if (stats.beds % 10 === 0) process.stdout.write(`  ${stats.beds}...`);
      }
    }
  }
  console.log(`\n  ✓ Imported ${stats.beds} beds`);

  // 3. Import Mattresses
  console.log('\n3/6 Importing mattresses...');
  const mattresses = JSON.parse(fs.readFileSync('mattresses-scraped.json', 'utf8'))
    .filter(m => m.russianName && m.imageUrl && !m.russianName.includes('★'));

  for (const mattress of mattresses.slice(0, 14)) {
    const sku = `MAT-${String(stats.mattresses + 1).padStart(4, '0')}`;
    const slug = mattress.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: mattress.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: mattress.description || `Premium mattress ${mattress.russianName}`,
      price: mattress.price || 799.99,
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
        stats.mattresses++;
      }
    }
  }
  console.log(`  ✓ Imported ${stats.mattresses} mattresses`);

  // 4. Import Cabinets from all-107-cabinets-complete.json
  console.log('\n4/6 Importing cabinets...');
  const cabinets = JSON.parse(fs.readFileSync('all-107-cabinets-complete.json', 'utf8'))
    .filter(c => c.russianName && c.imageUrl)
    .slice(0, 105);

  for (const cabinet of cabinets) {
    const sku = `CAB-${String(stats.cabinets + 1).padStart(4, '0')}`;
    const slug = cabinet.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error } = await supabase.from('products').insert({
      sku,
      name: cabinet.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: cabinet.description || `Premium wardrobe ${cabinet.russianName}`,
      price: cabinet.price || 899.99,
      category_id: categoryMap['cabinets'],
      stock_quantity: 12,
      status: 'active'
    }).select();

    if (!error) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: cabinet.imageUrl,
          alt_text: cabinet.russianName,
          display_order: 1
        });

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

        stats.cabinets++;
        if (stats.cabinets % 20 === 0) process.stdout.write(`  ${stats.cabinets}...`);
      }
    }
  }
  console.log(`\n  ✓ Imported ${stats.cabinets} cabinets`);

  // 5. Import Tables from tables-complete.json
  console.log('\n5/6 Importing tables...');
  const tables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'))
    .filter(t => t.name && t.images && t.images.length > 0)
    .slice(0, 22);

  for (const table of tables) {
    const sku = `TAB-${String(stats.tables + 1).padStart(4, '0')}`;

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
      if (product) {
        for (let j = 0; j < Math.min(table.images.length, 5); j++) {
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: table.images[j],
            alt_text: `${table.name} - View ${j + 1}`,
            display_order: j + 1
          });
        }
        stats.tables++;
      }
    }
  }
  console.log(`  ✓ Imported ${stats.tables} tables`);

  // 6. Import Chairs from all-chairs-with-prices.json
  console.log('\n6/6 Importing chairs...');
  const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'))
    .filter(c => c.name && c.images && c.images.length > 0)
    .slice(0, 22);

  for (const chair of chairs) {
    const sku = `CHR-${String(stats.chairs + 1).padStart(4, '0')}`;
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
      if (product) {
        for (let j = 0; j < Math.min(chair.images.length, 5); j++) {
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: chair.images[j],
            alt_text: `${chair.name} - View ${j + 1}`,
            display_order: j + 1
          });
        }
        stats.chairs++;
      }
    }
  }
  console.log(`  ✓ Imported ${stats.chairs} chairs`);

  // Final summary
  const { count: finalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: finalImages } = await supabase.from('product_images').select('*', { count: 'exact', head: true });

  console.log('\n' + '═'.repeat(70));
  console.log('IMPORT COMPLETE!');
  console.log('═'.repeat(70));
  console.log(`Sofas:      ${stats.sofas}/624`);
  console.log(`Beds:       ${stats.beds}/95`);
  console.log(`Mattresses: ${stats.mattresses}/14`);
  console.log(`Cabinets:   ${stats.cabinets}/105`);
  console.log(`Tables:     ${stats.tables}/22`);
  console.log(`Chairs:     ${stats.chairs}/22`);
  console.log('─'.repeat(70));
  console.log(`TOTAL:      ${finalProducts} products with ${finalImages} images`);
  console.log('═'.repeat(70));
}

importAllProducts().catch(console.error);
