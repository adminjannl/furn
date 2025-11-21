const fs = require('fs');

const tables = JSON.parse(fs.readFileSync('tables-with-real-images.json', 'utf8'));

let migration = `/*
  # Add Product Images for 22 Tables

  1. Images
    - ${tables.reduce((sum, t) => sum + t.images.length, 0)} product images for tables
    - All images scraped from mnogomebeli.com
    - Primary image set for each product
    - Display order maintained

  2. Security
    - Uses existing RLS policies from product_images table
*/

`;

tables.forEach(table => {
  if (table.images && table.images.length > 0) {
    table.images.forEach((imageUrl, index) => {
      const isPrimary = index === 0;
      const displayOrder = index + 1;

      migration += `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  id,
  '${imageUrl}',
  '${table.name.replace(/'/g, "''")} - View ${displayOrder}',
  ${displayOrder},
  ${isPrimary}
FROM products WHERE sku = '${table.sku}';

`;
    });
  }
});

const filename = 'import-correct-table-images.sql';
fs.writeFileSync(filename, migration);

console.log(`✓ Migration generated: ${filename}`);
console.log(`  Total tables: ${tables.length}`);
console.log(`  Total images: ${tables.reduce((sum, t) => sum + t.images.length, 0)}`);
console.log(`  Migration size: ${(migration.length / 1024).toFixed(1)} KB`);
