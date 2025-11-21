const fs = require('fs');

function generateChairsMigration() {
  const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));

  console.log(`Generating migration for ${chairs.length} chairs...\n`);

  // Set default price for chairs without prices
  chairs.forEach(chair => {
    if (!chair.price) {
      chair.price = 999; // Default price
    }
  });

  // Get or create Chairs category
  let sql = `/*
  # Import 22 Chairs from mnogomebeli.com

  1. New Products
    - 22 chair products
    - Prices range from 900 to 999 руб
    - All images included

  2. Security
    - Uses existing RLS policies from products table
*/

-- Get Chairs category ID (create if doesn't exist)
DO $$
DECLARE
  v_category_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'chairs' LIMIT 1;

  IF v_category_id IS NULL THEN
    INSERT INTO categories (name, slug, description, is_active)
    VALUES ('Chairs', 'chairs', 'Dining and accent chairs', true)
    RETURNING id INTO v_category_id;
  END IF;
END $$;

`;

  chairs.forEach((chair, index) => {
    const name = chair.name.replace(/'/g, "''");
    const description = chair.description ? chair.description.replace(/'/g, "''") : name;
    const price = chair.price;

    sql += `
-- Chair ${index + 1}: ${chair.name}
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  '${chair.sku}',
  '${name}',
  '${description}',
  ${price},
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;

`;
  });

  // Save migration
  const timestamp = '20251105';
  const filename = `${timestamp}_import_22_chairs.sql`;
  fs.writeFileSync(filename, sql);
  console.log(`Generated: ${filename}`);
  console.log(`Total chairs: ${chairs.length}`);
  console.log(`Average price: ${Math.round(chairs.reduce((sum, c) => sum + c.price, 0) / chairs.length)} руб`);

  return filename;
}

generateChairsMigration();
