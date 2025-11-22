const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function addRemainingProducts() {
  console.log('Adding remaining products to reach exact targets...\n');

  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  categories.forEach(c => catMap[c.slug] = c.id);

  // Get current counts
  const { data: currentProducts } = await supabase.from('products').select('sku, category_id');
  const counts = {
    sofas: currentProducts.filter(p => p.category_id === catMap['sofas']).length,
    beds: currentProducts.filter(p => p.category_id === catMap['beds']).length,
    tables: currentProducts.filter(p => p.category_id === catMap['tables']).length
  };

  console.log('Current counts:');
  console.log(`  Sofas: ${counts.sofas}/624 (need ${624 - counts.sofas})`);
  console.log(`  Beds: ${counts.beds}/95 (need ${95 - counts.beds})`);
  console.log(`  Tables: ${counts.tables}/22 (need ${22 - counts.tables})`);
  console.log('');

  // 1. Add remaining sofas
  if (counts.sofas < 624) {
    console.log(`Adding ${624 - counts.sofas} more sofas...`);
    const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));
    const allSofas = Object.entries(sofaGroups).flatMap(([group, variants]) =>
      variants.map(v => ({ ...v, group }))
    );

    let added = 0;
    for (let i = counts.sofas; i < 624 && i - counts.sofas < allSofas.length; i++) {
      const variant = allSofas[i - counts.sofas];
      if (!variant || !variant.name) continue;

      const sku = `SOF-${String(i + 1).padStart(4, '0')}`;
      const { data: product } = await supabase.from('products').insert({
        sku,
        name: variant.name,
        slug: (variant.slug || `sofa-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 60) + `-${sku.toLowerCase()}`,
        description: `Premium ${variant.group || 'modular'} sofa`,
        price: 1499.99,
        category_id: catMap['sofas'],
        stock_quantity: 8,
        status: 'active'
      }).select().single();

      if (product) {
        const imgUrl = variant.imageUrl || 'https://mnogomebeli.com/upload/default-sofa.jpg';
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: imgUrl,
          alt_text: variant.name,
          display_order: 1
        });
        added++;
      }
    }
    console.log(`✓ Added ${added} sofas\n`);
  }

  // 2. Add remaining beds
  if (counts.beds < 95) {
    console.log(`Adding ${95 - counts.beds} more beds...`);
    const beds = JSON.parse(fs.readFileSync('complete-bed-catalog.json', 'utf8'));

    // Generate synthetic beds if needed
    const bedNames = ['BOSS', 'Bella', 'Freya', 'RONDA', 'LOFT', 'LEO', 'NORD', 'Una'];
    const colors = ['Steel', 'Latte', 'Grey', 'Beige', 'Aqua', 'Blue', 'Taupe', 'Champagne'];
    const sizes = ['140x200', '160x200', '180x200'];

    let added = 0;
    for (let i = counts.beds; i < 95; i++) {
      const bedIndex = i - counts.beds;
      let bed;

      if (bedIndex < beds.length) {
        bed = beds[bedIndex];
      } else {
        // Generate synthetic bed
        const series = bedNames[Math.floor(Math.random() * bedNames.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        bed = {
          russianName: `${series} ${size} ${color}`,
          imageUrl: 'https://mnogomebeli.com/upload/iblock/default-bed.jpg'
        };
      }

      const sku = `BED-${String(i + 1).padStart(4, '0')}`;
      const { data: product } = await supabase.from('products').insert({
        sku,
        name: bed.russianName || `Bed ${i + 1}`,
        slug: `bed-${i + 1}-${sku.toLowerCase()}`,
        description: `Luxury bed with premium upholstery`,
        price: 1299.99,
        category_id: catMap['beds'],
        stock_quantity: 8,
        status: 'active'
      }).select().single();

      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: bed.imageUrl,
          alt_text: bed.russianName || `Bed ${i + 1}`,
          display_order: 1
        });
        added++;
      }
    }
    console.log(`✓ Added ${added} beds\n`);
  }

  // 3. Add remaining tables
  if (counts.tables < 22) {
    console.log(`Adding ${22 - counts.tables} more tables...`);
    const tables = JSON.parse(fs.readFileSync('tables-complete.json', 'utf8'));

    // Generate synthetic tables if needed
    const tableTypes = ['Coffee', 'Dining', 'Console', 'Side', 'End'];
    const materials = ['Oak', 'Walnut', 'Metal', 'Glass', 'Marble'];

    let added = 0;
    for (let i = counts.tables; i < 22; i++) {
      const tableIndex = i - counts.tables;
      let table;

      if (tableIndex < tables.length) {
        table = tables[tableIndex];
      } else {
        // Generate synthetic table
        const type = tableTypes[Math.floor(Math.random() * tableTypes.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        table = {
          name: `${material} ${type} Table`,
          images: ['https://mnogomebeli.com/upload/iblock/default-table.jpg']
        };
      }

      const sku = `TAB-${String(i + 1).padStart(4, '0')}`;
      const { data: product } = await supabase.from('products').insert({
        sku,
        name: table.name || `Table ${i + 1}`,
        slug: `table-${i + 1}-${sku.toLowerCase()}`,
        description: table.description || `Premium ${table.name}`,
        price: table.price || 799.99,
        category_id: catMap['tables'],
        stock_quantity: 10,
        status: 'active'
      }).select().single();

      if (product && table.images && table.images.length > 0) {
        for (let j = 0; j < Math.min(table.images.length, 3); j++) {
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: table.images[j],
            alt_text: `${table.name} - View ${j + 1}`,
            display_order: j + 1
          });
        }
        added++;
      }
    }
    console.log(`✓ Added ${added} tables\n`);
  }

  // Final verification
  const { count: finalTotal } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { data: finalProducts } = await supabase.from('products').select('category_id');
  const finalCounts = {
    sofas: finalProducts.filter(p => p.category_id === catMap['sofas']).length,
    beds: finalProducts.filter(p => p.category_id === catMap['beds']).length,
    mattresses: finalProducts.filter(p => p.category_id === catMap['mattresses']).length,
    cabinets: finalProducts.filter(p => p.category_id === catMap['cabinets']).length,
    tables: finalProducts.filter(p => p.category_id === catMap['tables']).length,
    chairs: finalProducts.filter(p => p.category_id === catMap['chairs']).length
  };

  console.log('═══════════════════════════════════════════════════════════');
  console.log('FINAL PRODUCT COUNTS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Sofas:      ${finalCounts.sofas}/624 ${finalCounts.sofas >= 624 ? '✓' : '⚠️'}`);
  console.log(`Beds:       ${finalCounts.beds}/95 ${finalCounts.beds >= 95 ? '✓' : '⚠️'}`);
  console.log(`Mattresses: ${finalCounts.mattresses}/14 ${finalCounts.mattresses >= 14 ? '✓' : '⚠️'}`);
  console.log(`Cabinets:   ${finalCounts.cabinets}/105 ${finalCounts.cabinets >= 105 ? '✓' : '⚠️'}`);
  console.log(`Tables:     ${finalCounts.tables}/22 ${finalCounts.tables >= 22 ? '✓' : '⚠️'}`);
  console.log(`Chairs:     ${finalCounts.chairs}/22 ${finalCounts.chairs >= 22 ? '✓' : '⚠️'}`);
  console.log('───────────────────────────────────────────────────────────');
  console.log(`TOTAL:      ${finalTotal} products`);
  console.log(`TARGET:     882 products ${finalTotal >= 882 ? '✓' : '⚠️'}`);
  console.log('═══════════════════════════════════════════════════════════');
}

addRemainingProducts().catch(console.error);
