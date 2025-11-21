const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./new-products-to-add.json', 'utf8'));

function generateSlug(name, index) {
  return `cabinet-mnm-${String(index + 84).padStart(4, '0')}`;
}

function cleanForSQL(str) {
  return str.replace(/'/g, "''");
}

let sql = `/*
  # Import 22 New Cabinets

  1. Products Added
    - 22 new cabinet products (SKU: CAB-MNM-0084 to CAB-MNM-0105)
    - Includes Idea series and Boss Standart variants
    - Note: All have NULL prices (likely discontinued)
    - Status set to 'out_of_stock'

  2. Categories
    - Cabinets category

  3. Security
    - RLS policies already in place
*/

DO $$
DECLARE
  v_category_id UUID;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE name = 'Cabinets' LIMIT 1;

  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Category Cabinets not found';
  END IF;

`;

products.forEach((product, index) => {
  const sku = `CAB-MNM-${String(index + 84).padStart(4, '0')}`;
  const slug = generateSlug(product.russianName, index);
  const name = cleanForSQL(product.russianName);
  const description = cleanForSQL(`${product.russianName} из коллекции mnogomebeli.com`);
  const sourceUrl = cleanForSQL(product.url);

  sql += `  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('${sku}', v_category_id, '${name}', '${slug}', '${name}', '${description}', NULL, 'out_of_stock', 0, '${sourceUrl}')
  ON CONFLICT (sku) DO NOTHING;

`;
});

sql += `END $$;`;

fs.writeFileSync('./import-22-cabinets-with-slugs.sql', sql);
console.log('✅ Generated migration with slugs for 22 new cabinets');
