const fs = require('fs');

const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped-no-idea.json', 'utf8'));

console.log(`📦 Processing ${cabinets.length} cabinets for import...\n`);

const batchSize = 20;
let skuCounter = 1;

// Split into batches
const batches = [];
for (let i = 0; i < cabinets.length; i += batchSize) {
  batches.push(cabinets.slice(i, i + batchSize));
}

console.log(`Creating ${batches.length} migration files...\n`);

batches.forEach((batch, batchIndex) => {
  const values = batch.map(cabinet => {
    const sku = `CAB-MNM-${String(skuCounter++).padStart(4, '0')}`;

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
      .replace(/\+/g, ' ')
      .replace(/'/g, "''")
      .replace(/\s+/g, ' ')
      .trim();

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    return `    ('${sku}', '${name}', '${slug}', 'Premium ${name}', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())`;
  }).join(',\n');

  const startSku = batchIndex * batchSize + 1;
  const endSku = startSku + batch.length - 1;

  const migration = `/*
  # Import Cabinets Batch ${batchIndex + 1}/${batches.length}

  SKU range: CAB-MNM-${String(startSku).padStart(4, '0')} to CAB-MNM-${String(endSku).padStart(4, '0')}
  Count: ${batch.length} cabinets
  Source: mnogomebeli.com/shkafy/ (excluding Idea series)
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

  const filename = `./import-cabinets-batch-${batchIndex + 1}.sql`;
  fs.writeFileSync(filename, migration);
  console.log(`✅ ${filename} (${batch.length} cabinets, SKU ${startSku}-${endSku})`);
});

console.log(`\n✅ Created ${batches.length} migration files!`);
console.log(`   Total cabinets: ${cabinets.length}`);
console.log(`   SKU range: CAB-MNM-0001 to CAB-MNM-${String(cabinets.length).padStart(4, '0')}`);
