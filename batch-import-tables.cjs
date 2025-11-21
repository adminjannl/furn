const fs = require('fs');

const tables = JSON.parse(fs.readFileSync('all-tables-scraped.json', 'utf8'));

function getDefaultDimensions(name) {
  if (name.includes('трансформер') || name.includes('Transformer')) return '162x80x79';
  if (name.includes('журнальный') || name.includes('Журнальный')) return '100x60x45';
  if (name.includes('письменный') || name.includes('Письменный')) return '120x60x75';
  if (name.includes('обеденный') || name.includes('Обеденный') || name.includes('ЛОФТ') || name.includes('Boss One')) return '140x80x75';
  if (name.includes('приставка')) return '80x40x75';
  return '120x70x75';
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[а-я]/g, (char) => {
      const map = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i',
        'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
        'у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'',
        'э':'e','ю':'yu','я':'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate product inserts
let productSQL = '';
tables.forEach((table, index) => {
  const sku = `TBL-MNM-${String(index + 200).padStart(4, '0')}`;
  const slug = generateSlug(table.name);
  const dimensions = table.dimensions || getDefaultDimensions(table.name);
  const [length, width, height] = dimensions.split('x').map(d => parseInt(d) || 0);
  const description = `Premium table ${table.name}. High-quality European furniture with exceptional design and durability. Dimensions: ${dimensions} cm (LxWxH)`;

  productSQL += `
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  '${sku}',
  '${table.name.replace(/'/g, "''")}',
  '${slug}',
  '${description.replace(/'/g, "''")}',
  ${table.price},
  id,
  10,
  ${width},
  ${height},
  ${length},
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;
`;
});

fs.writeFileSync('import-tables-products.sql', productSQL);
console.log('✓ Generated import-tables-products.sql');
console.log(`  Total products: ${tables.length}`);

// Generate image inserts
let imageSQL = '';
tables.forEach((table, index) => {
  const sku = `TBL-MNM-${String(index + 200).padStart(4, '0')}`;

  if (table.images && table.images.length > 0) {
    table.images.slice(0, 5).forEach((imageUrl, imgIndex) => {
      imageSQL += `
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  id,
  '${imageUrl}',
  '${table.name.replace(/'/g, "''")} - View ${imgIndex + 1}',
  ${imgIndex + 1},
  ${imgIndex === 0 ? 'true' : 'false'}
FROM products WHERE sku = '${sku}';
`;
    });
  }
});

fs.writeFileSync('import-tables-images.sql', imageSQL);
console.log('✓ Generated import-tables-images.sql');
console.log(`  Total images: ${tables.reduce((sum, t) => sum + Math.min((t.images?.length || 0), 5), 0)}`);
