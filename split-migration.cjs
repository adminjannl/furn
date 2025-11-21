const fs = require('fs');

const sql = fs.readFileSync('all-beds-migration.sql', 'utf8');

// Split by product comments
const products = sql.split(/-- Product \d+:/g).slice(1);

console.log(`Total products: ${products.length}`);

const batchSize = 10;
const batches = [];

for (let i = 0; i < products.length; i += batchSize) {
  const batch = products.slice(i, i + batchSize);
  const batchNumber = Math.floor(i / batchSize) + 1;

  const batchSql = `/*
  # Import Beds Batch ${batchNumber}

  Importing beds ${i + 1} to ${Math.min(i + batchSize, products.length)}
*/

DO $$
DECLARE
  v_category_id uuid;
  v_product_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'beds' LIMIT 1;

${batch.map((p, idx) => `  -- Product ${i + idx + 1}:${p}`).join('\n')}

  RAISE NOTICE 'Successfully imported batch ${batchNumber}';
END $$;
`;

  fs.writeFileSync(`batch-${batchNumber}.sql`, batchSql);
  console.log(`Created batch-${batchNumber}.sql (${batch.length} products)`);
}

console.log(`\nCreated ${Math.ceil(products.length / batchSize)} batch files`);
