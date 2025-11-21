const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importAllCabinets() {
  console.log('📦 Importing 83 cabinets with real prices...\n');

  const cabinets = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));

  // Get cabinet category ID
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'cabinets')
    .single();

  if (!category) {
    throw new Error('Cabinet category not found!');
  }

  console.log(`✅ Found cabinet category: ${category.id}\n`);

  const products = cabinets.map((cab, i) => ({
    sku: `CAB-MNM-${String(i + 1).padStart(4, '0')}`,
    name: cab.russianName
      .replace(/Шкаф/gi, 'Cabinet')
      .replace(/шкаф/gi, 'cabinet')
      .replace(/Рим/gi, 'Rim')
      .replace(/Босс Стандарт/gi, 'Boss Standard')
      .replace(/Кашемир/gi, 'Cashmere')
      .replace(/Белый/gi, 'White')
      .replace(/Орех Селект/gi, 'Walnut Select')
      .replace(/Шиншилла серая/gi, 'Chinchilla Gray')
      .replace(/ящики/gi, 'with Drawers')
      .replace(/Стеллаж/gi, 'Shelving Unit')
      .replace(/купе/gi, 'Sliding Door')
      .replace(/дверный/gi, 'Door')
      .replace(/Венге/gi, 'Wenge')
      .replace(/Дуб/gi, 'Oak')
      .replace(/\+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
    slug: `cabinet-${i + 1}`,
    description: `Premium cabinet from mnogomebeli.com`,
    price: cab.price || 999.99,
    category_id: category.id,
    stock_quantity: 15,
    status: 'active'
  }));

  // Import in batches of 20
  const batchSize = 20;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)} (${batch.length} products)...`);

    const { error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'sku' });

    if (error) {
      console.error(`❌ Error:`, error);
    } else {
      console.log(`✅ Imported ${batch.length} products`);
    }
  }

  console.log(`\n✅ ALL DONE! Imported ${products.length} cabinets with real prices`);
}

importAllCabinets().catch(console.error);
