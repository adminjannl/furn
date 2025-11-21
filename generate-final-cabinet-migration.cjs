const fs = require('fs');

const cabinets = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));

console.log(`📦 Generating migration for ${cabinets.length} cabinets with REAL prices...\n`);

function translateToEnglish(russian) {
  return russian
    .replace(/Шкаф/gi, 'Cabinet')
    .replace(/шкаф/gi, 'cabinet')
    .replace(/распашной/gi, '')
    .replace(/купе/gi, 'Sliding Door')
    .replace(/Рим/gi, 'Rim')
    .replace(/Босс Стандарт/gi, 'Boss Standard')
    .replace(/Кашемир/gi, 'Cashmere')
    .replace(/Белый/gi, 'White')
    .replace(/Орех Селект/gi, 'Walnut Select')
    .replace(/Шиншилла серая/gi, 'Chinchilla Gray')
    .replace(/Кашемир серый/gi, 'Cashmere')
    .replace(/ящики/gi, 'with Drawers')
    .replace(/Стеллаж/gi, 'Shelving Unit')
    .replace(/Венге/gi, 'Wenge')
    .replace(/Дуб/gi, 'Oak')
    .replace(/дверный/gi, 'Door')
    .replace(/\+/g, ' ')
    .replace(/'/g, "''")
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const values = cabinets.map((cabinet, i) => {
  const sku = `CAB-MNM-${String(i + 1).padStart(4, '0')}`;
  const name = translateToEnglish(cabinet.russianName);
  const slug = generateSlug(name) + `-${i + 1}`;
  const description = `Premium ${name} from mnogomebeli.com`;
  const price = cabinet.price || 999.99;

  return `    ('${sku}', '${name}', '${slug}', '${description}', ${price}, cabinet_cat_id, 15, 'active', NOW(), NOW())`;
}).join(',\n');

const migration = `/*
  # Import ${cabinets.length} Cabinets with REAL PRICES

  Source: mnogomebeli.com/shkafy/
  Price extraction: Individual product pages
  Success rate: ${cabinets.filter(c => c.price).length}/${cabinets.length} products have prices
  Image coverage: ${cabinets.filter(c => c.allImages && c.allImages.length > 0).length}/${cabinets.length} products
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  IF cabinet_cat_id IS NULL THEN
    RAISE EXCEPTION 'Cabinets category not found';
  END IF;

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
${values}
  ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

END $$;
`;

fs.writeFileSync('./final-cabinets-import.sql', migration);
console.log('✅ Generated: final-cabinets-import.sql\n');

console.log('📊 Summary:');
console.log(`   Total cabinets: ${cabinets.length}`);
console.log(`   With prices: ${cabinets.filter(c => c.price).length}`);
console.log(`   Price range: ${Math.min(...cabinets.filter(c => c.price).map(c => c.price))} - ${Math.max(...cabinets.filter(c => c.price).map(c => c.price))} ₽`);
