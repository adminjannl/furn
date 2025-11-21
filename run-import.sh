#!/bin/bash
echo "Importing 22 tables to database..."
echo ""

# Import products
cat import-tables-products.sql | while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        echo "$line"
    fi
done > /tmp/batch.sql

# Use execute_sql via MCP would go here, but we'll use direct approach
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const productSQL = fs.readFileSync('import-tables-products.sql', 'utf8');
  const imageSQL = fs.readFileSync('import-tables-images.sql', 'utf8');

  console.log('Importing products...');
  const productsStatements = productSQL.split(';').filter(s => s.trim());

  for (let i = 0; i < productsStatements.length; i++) {
    const stmt = productsStatements[i].trim();
    if (stmt) {
      const { error } = await supabase.rpc('exec_sql', { sql_string: stmt + ';' });
      if (error) console.error(\`Product \${i+1} error:\`, error.message);
      else process.stdout.write(\`.\`);
    }
  }

  console.log(\`\\n✓ Imported \${productsStatements.length} products\\n\`);

  console.log('Importing images...');
  const imageStatements = imageSQL.split(';').filter(s => s.trim());

  for (let i = 0; i < imageStatements.length; i++) {
    const stmt = imageStatements[i].trim();
    if (stmt) {
      const { error } = await supabase.rpc('exec_sql', { sql_string: stmt + ';' });
      if (error && !error.message.includes('duplicate')) {
        console.error(\`Image \${i+1} error:\`, error.message);
      }
      if (i % 10 === 0) process.stdout.write(\`.\`);
    }
  }

  console.log(\`\\n✓ Imported images\\n\`);

  const { data: tables, error: qError } = await supabase
    .from('products')
    .select('sku, name, price')
    .like('sku', 'TBL-MNM-%')
    .order('sku');

  if (!qError) {
    console.log(\`\\n✓ Successfully imported \${tables.length} tables!\\n\`);
    tables.slice(0, 3).forEach(t => console.log(\`  - \${t.name} (\${t.price} BYN)\`));
    if (tables.length > 3) console.log(\`  ... and \${tables.length - 3} more\\n\`);
  }
}

run().catch(console.error);
"
