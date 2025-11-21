const fs = require('fs');
const tables = JSON.parse(fs.readFileSync('tables-with-real-images.json', 'utf8'));

console.log(`Generating 110 image import statements for ${tables.length} tables...\n`);

let count = 0;
tables.forEach(table => {
  table.images.forEach((img, idx) => {
    count++;
    const sql = `INSERT INTO product_images (product_id, image_url, alt_text, display_order) SELECT id, '${img}', '${table.name.replace(/'/g, "''")} - View ${idx + 1}', ${idx + 1} FROM products WHERE sku = '${table.sku}';`;
    console.log(sql);
  });
});

console.error(`\n✓ Generated ${count} statements`);
