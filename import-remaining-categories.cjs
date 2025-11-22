const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function importRemainingProducts() {
  console.log('Importing remaining category products...\n');

  // Get category IDs
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.slug] = cat.id);

  // Import Sofas
  console.log('Importing sofas...');
  const sofas = JSON.parse(fs.readFileSync('missing-sofas.json', 'utf8'));
  let sofaCount = 0;

  for (let i = 0; i < Math.min(sofas.length, 50); i++) {
    const sofa = sofas[i];
    if (!sofa.title || !sofa.imageUrl) continue;

    const sku = `SOF-${String(i + 100).padStart(3, '0')}`;
    const slug = sofa.title.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: sofa.title,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium sofa ${sofa.title}`,
      price: 1499.99,
      category_id: categoryMap['sofas'],
      stock_quantity: 8,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: sofa.imageUrl,
          alt_text: sofa.title,
          display_order: 1
        });
        sofaCount++;
      }
    }
  }
  console.log(`✓ Imported ${sofaCount} sofas`);

  // Import Mattresses
  console.log('\nImporting mattresses...');
  const mattresses = JSON.parse(fs.readFileSync('mattresses-scraped.json', 'utf8'))
    .filter(m => m.russianName && m.imageUrl && !m.russianName.includes('★'));
  let mattressCount = 0;

  for (let i = 0; i < mattresses.length; i++) {
    const mattress = mattresses[i];
    const sku = `MAT-${String(i + 100).padStart(3, '0')}`;
    const slug = mattress.russianName.toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: mattress.russianName,
      slug: slug + `-${sku.toLowerCase()}`,
      description: `Premium mattress ${mattress.russianName}`,
      price: 799.99,
      category_id: categoryMap['mattresses'],
      stock_quantity: 15,
      status: 'active'
    }).select();

    if (!prodError) {
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
  console.log(`✓ Imported ${mattressCount} mattresses`);

  // Add some sample armchairs and sleep accessories
  console.log('\nAdding sample armchairs...');
  const armchairs = [
    {
      name: 'Velvet Armchair Grey',
      desc: 'Comfortable velvet armchair with wooden legs',
      price: 599.99,
      img: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg'
    },
    {
      name: 'Leather Armchair Brown',
      desc: 'Classic leather armchair with ottoman',
      price: 899.99,
      img: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg'
    },
    {
      name: 'Modern Pouf Blue',
      desc: 'Stylish round pouf perfect for any room',
      price: 199.99,
      img: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg'
    }
  ];

  let armchairCount = 0;
  for (let i = 0; i < armchairs.length; i++) {
    const ac = armchairs[i];
    const sku = `ARM-${String(i + 100).padStart(3, '0')}`;

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: ac.name,
      slug: ac.name.toLowerCase().replace(/\s+/g, '-') + `-${sku.toLowerCase()}`,
      description: ac.desc,
      price: ac.price,
      category_id: categoryMap['armchairs-poufs'],
      stock_quantity: 12,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: ac.img,
          alt_text: ac.name,
          display_order: 1
        });
        armchairCount++;
      }
    }
  }
  console.log(`✓ Imported ${armchairCount} armchairs & poufs`);

  // Add sleep accessories
  console.log('\nAdding sleep accessories...');
  const accessories = [
    {
      name: 'Premium Memory Foam Pillow',
      desc: 'Ergonomic memory foam pillow for perfect sleep',
      price: 49.99,
      img: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg'
    },
    {
      name: 'Luxury Duvet Set King',
      desc: 'Egyptian cotton duvet cover set',
      price: 149.99,
      img: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
    },
    {
      name: 'Bamboo Bed Sheet Set',
      desc: 'Soft and breathable bamboo sheets',
      price: 99.99,
      img: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg'
    }
  ];

  let accessoryCount = 0;
  for (let i = 0; i < accessories.length; i++) {
    const acc = accessories[i];
    const sku = `ACC-${String(i + 100).padStart(3, '0')}`;

    const { error: prodError } = await supabase.from('products').insert({
      sku,
      name: acc.name,
      slug: acc.name.toLowerCase().replace(/\s+/g, '-') + `-${sku.toLowerCase()}`,
      description: acc.desc,
      price: acc.price,
      category_id: categoryMap['sleep-accessories'],
      stock_quantity: 50,
      status: 'active'
    }).select();

    if (!prodError) {
      const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
      if (product) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: acc.img,
          alt_text: acc.name,
          display_order: 1
        });
        accessoryCount++;
      }
    }
  }
  console.log(`✓ Imported ${accessoryCount} sleep accessories`);

  // Final count
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`\n✅ Total products in database: ${count}`);
  console.log('All categories imported!');
}

importRemainingProducts().catch(console.error);
