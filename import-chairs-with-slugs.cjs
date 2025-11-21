const fs = require('fs');

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateChairsImport() {
  const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));

  console.log(`Generating import for ${chairs.length} chairs with slugs...\n`);

  // Set default price for chairs without prices
  chairs.forEach(chair => {
    if (!chair.price) {
      chair.price = 999;
    }
  });

  let sql = '';

  chairs.forEach((chair, index) => {
    const name = chair.name.replace(/'/g, "''");
    const description = chair.description ? chair.description.replace(/'/g, "''") : name;
    const price = chair.price;
    const slug = `chair-${index + 1}-${generateSlug(chair.name).substring(0, 40)}`;

    sql += `INSERT INTO products (sku, name, slug, description, price, category_id, status, stock_quantity) SELECT '${chair.sku}', '${name}', '${slug}', '${description}', ${price}, id, 'active', 10 FROM categories WHERE slug = 'chairs' LIMIT 1;\n`;
  });

  // Save to file for reference
  fs.writeFileSync('import-chairs-with-slugs.sql', sql);
  console.log('Saved to import-chairs-with-slugs.sql');

  return chairs;
}

generateChairsImport();
