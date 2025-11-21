const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
    db: { schema: 'public' }
  }
);

async function importAllCabinets() {
  console.log('🗄️  Importing 83 cabinets via execute_sql...\n');

  const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped-no-idea.json', 'utf8'));

  // Get category
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'cabinets')
    .single();

  if (!category) {
    console.error('❌ Cabinet category not found!');
    return;
  }

  const categoryId = category.id;
  let skuCounter = 90;
  const batchSize = 20;

  for (let i = 0; i < cabinets.length; i += batchSize) {
    const batch = cabinets.slice(i, i + batchSize);

    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cabinets.length / batchSize)}...`);

    // Build INSERT statement with UNION ALL
    const values = batch.map(cabinet => {
      const sku = `CAB-MNM-${String(skuCounter++).padStart(4, '0')}`;

      let name = cabinet.russianName
        .replace(/Шкаф/gi, 'Cabinet')
        .replace(/шкаф/gi, 'cabinet')
        .replace(/распашной/gi, '')
        .replace(/Рим/gi, 'Rim')
        .replace(/Кашемир/gi, 'Cashmere')
        .replace(/Белый/gi, 'White')
        .replace(/Орех Селект/gi, 'Walnut Select')
        .replace(/Шиншилла серая/gi, 'Chinchilla Gray')
        .replace(/Кашемир серый/gi, 'Cashmere')
        .replace(/ящики/gi, 'with Drawers')
        .replace(/Стеллаж/gi, 'Shelving Unit')
        .replace(/зеркал/gi, 'Mirror')
        .replace(/\+/g, '')
        .replace(/'/g, "''")
        .replace(/\s+/g, ' ')
        .trim();

      const slug = name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-') + `-${sku.split('-')[2]}`;

      return `SELECT '${sku}'::text, '${name}'::text, '${slug}'::text, 'Premium ${name}'::text, 999.99::numeric, '${categoryId}'::uuid, 15::integer, 'active'::text, NOW(), NOW()`;
    }).join(' UNION ALL\n');

    const sql = `
      INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
      ${values}
      ON CONFLICT (sku) DO NOTHING;
    `;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

      if (error) {
        // Try direct execute_sql
        const result = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ sql_query: sql })
        });

        if (!result.ok) {
          console.error(`  ❌ Batch failed: ${await result.text()}`);
        } else {
          console.log(`  ✅ Batch ${Math.floor(i / batchSize) + 1} imported`);
        }
      } else {
        console.log(`  ✅ Batch ${Math.floor(i / batchSize) + 1} imported`);
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  // Verify
  const { data: count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  console.log(`\n✅ Import complete!`);
  console.log(`Total cabinets in database: ${count || 'unknown'}`);
}

importAllCabinets().catch(console.error);
