const fs = require('fs');

const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped-no-idea.json', 'utf8'));

console.log(`Generating migrations for ${cabinets.length} cabinets...\n`);

// Skip first 10 (already imported as test)
const remaining = cabinets.slice(10);

const batchSize = 20;
const batches = [];

for (let i = 0; i < remaining.length; i += batchSize) {
  batches.push(remaining.slice(i, i + batchSize));
}

console.log(`Creating ${batches.length} migration files...\n`);

batches.forEach((batch, batchIndex) => {
  const startSku = 100 + (batchIndex * batchSize);

  const values = batch.map((cabinet, idx) => {
    const sku = `CAB-MNM-${String(startSku + idx).padStart(4, '0')}`;

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

    return `    ('${sku}', '${name}', '${slug}', 'Premium ${name}', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())`;
  }).join(',\n');

  const migration = `/*
  # Import Cabinets Batch ${batchIndex + 1}/${batches.length}

  SKU range: CAB-MNM-${String(startSku).padStart(4, '0')} to CAB-MNM-${String(startSku + batch.length - 1).padStart(4, '0')}
  Count: ${batch.length} cabinets
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
${values}
  ON CONFLICT (sku) DO NOTHING;
END $$;
`;

  const filename = `./cabinet-batch-${batchIndex + 1}.sql`;
  fs.writeFileSync(filename, migration);
  console.log(`✅ Created ${filename} (${batch.length} cabinets)`);
});

console.log(`\n📝 All migration files created!`);
console.log(`Run these migrations in order to complete the import.`);
