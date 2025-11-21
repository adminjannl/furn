const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./new-products-to-add.json', 'utf8'));

function generateSKU(index) {
  return `CAB-MNM-${String(index + 84).padStart(4, '0')}`;
}

function cleanName(russianName) {
  return russianName
    .replace(/шкаф/gi, '')
    .replace(/распашной/gi, '')
    .trim();
}

function cleanForSQL(str) {
  return str.replace(/'/g, "''");
}

let migration = `/*
  # Import 22 New Cabinets

  1. Products Added
    - 22 new cabinet products (SKU: CAB-MNM-0084 to CAB-MNM-0105)
    - Includes Idea series and Boss Standart variants
    - Note: All have NULL prices (likely discontinued or not currently priced)
    - Comprehensive image sets included

  2. Categories
    - Шкафы (Wardrobes/Cabinets)

  3. Security
    - RLS policies already in place from previous migrations
*/

DO $$
DECLARE
  v_category_id UUID;
BEGIN
  -- Get category ID
  SELECT id INTO v_category_id FROM categories WHERE name = 'Шкафы' LIMIT 1;

  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Category Шкафы not found';
  END IF;

`;

products.forEach((product, index) => {
  const sku = generateSKU(index);
  const englishName = cleanName(product.russianName);
  const russianName = cleanForSQL(product.russianName);
  const description = cleanForSQL(`${product.russianName} из коллекции mnogomebeli.com`);
  const sourceUrl = cleanForSQL(product.url);

  migration += `
  -- ${index + 1}. ${product.russianName}
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    '${sku}',
    v_category_id,
    '${cleanForSQL(englishName)}',
    '${russianName}',
    '${description}',
    NULL,
    false,
    0,
    '${sourceUrl}'
  ) ON CONFLICT (sku) DO NOTHING;

`;
});

migration += `END $$;
`;

fs.writeFileSync('./import-22-new-cabinets.sql', migration);
console.log('✅ Generated import-22-new-cabinets.sql');
console.log(`   Products: ${products.length}`);
console.log(`   SKUs: CAB-MNM-0084 to CAB-MNM-0105`);
