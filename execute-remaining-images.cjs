const fs = require('fs');
require('dotenv').config();

async function executeSQL(query) {
  const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ sql_query: query })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL execution failed: ${error}`);
  }

  return response.json();
}

async function importImages() {
  const tables = JSON.parse(fs.readFileSync('tables-with-real-images.json', 'utf8'));

  console.log(`Importing images for ${tables.length} tables...\n`);

  let success = 0;
  let errors = 0;

  for (const table of tables) {
    console.log(`Processing ${table.sku}: ${table.name}`);

    for (let i = 0; i < table.images.length; i++) {
      const img = table.images[i];
      const sql = `INSERT INTO product_images (product_id, image_url, alt_text, display_order) SELECT id, '${img}', '${table.name.replace(/'/g, "''")} - View ${i + 1}', ${i + 1} FROM products WHERE sku = '${table.sku}';`;

      try {
        await executeSQL(sql);
        success++;
        process.stdout.write('.');
      } catch (err) {
        errors++;
        console.error(`\n  Error on image ${i + 1}: ${err.message.substring(0, 100)}`);
      }
    }
    console.log(` ✓`);
  }

  console.log(`\n\n✓ Import complete!`);
  console.log(`  Successful: ${success}`);
  console.log(`  Errors: ${errors}`);
}

importImages().catch(console.error);
