const fs = require('fs');
const crypto = require('crypto');

const tables = JSON.parse(fs.readFileSync('all-tables-scraped.json', 'utf8'));

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

function generateSKU(index) {
  return `TBL-MNM-${String(index + 200).padStart(4, '0')}`;
}

function getDefaultDimensions(name) {
  if (name.includes('трансформер') || name.includes('Transformer')) {
    return '162x80x79';
  }
  if (name.includes('журнальный') || name.includes('Журнальный')) {
    return '100x60x45';
  }
  if (name.includes('письменный') || name.includes('Письменный')) {
    return '120x60x75';
  }
  if (name.includes('обеденный') || name.includes('Обеденный') || name.includes('ЛОФТ') || name.includes('Boss One')) {
    return '140x80x75';
  }
  if (name.includes('приставка')) {
    return '80x40x75';
  }
  return '120x70x75';
}

let productInserts = [];
let imageInserts = [];
let dimensionUpdates = [];

tables.forEach((table, index) => {
  const sku = generateSKU(index);
  const slug = generateSlug(table.name);
  const dimensions = table.dimensions || getDefaultDimensions(table.name);
  const [length, width, height] = dimensions.split('x').map(d => parseInt(d) || 0);

  const description = `Premium table ${table.name}. High-quality European furniture with exceptional design and durability. ${dimensions ? `Dimensions: ${dimensions} cm (LxWxH)` : ''}`;

  productInserts.push(`
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
  ON CONFLICT (sku) DO NOTHING;`);

  if (table.images && table.images.length > 0) {
    table.images.forEach((imageUrl, imgIndex) => {
      imageInserts.push(`
  INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
  SELECT
    id,
    '${imageUrl}',
    '${table.name.replace(/'/g, "''")} - View ${imgIndex + 1}',
    ${imgIndex + 1},
    ${imgIndex === 0 ? 'true' : 'false'}
  FROM products WHERE sku = '${sku}';`);
    });
  }
});

const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
const migrationContent = `/*
  # Import 22 Tables from mnogomebeli.com

  1. New Products
    - 22 tables with real prices from website
    - Multiple categories: dining tables, coffee tables, transformers, writing desks
    - Includes dimensions (LxWxH) where available
    - Estimated dimensions added for products without specified dimensions

  2. Product Details
    - SKUs: TBL-MNM-0200 to TBL-MNM-0221
    - Price range: 600 BYN to 19,999 BYN
    - All products set to 'active' status
    - Stock quantity: 10 units per product

  3. Images
    - ${tables.reduce((sum, t) => sum + (t.images?.length || 0), 0)} product images total
    - Primary image set for each product
    - All images with alt text and display order

  4. Security
    - Uses existing RLS policies from products and product_images tables
*/

-- Insert Tables Category if not exists
INSERT INTO categories (name, slug, description, display_order, status, created_at, updated_at)
VALUES (
  'Tables',
  'tables',
  'Premium tables for every room - dining, coffee, writing desks, and transformers',
  5,
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
${productInserts.join('\n')}

-- Insert Product Images
${imageInserts.join('\n')}
`;

const filename = `supabase/migrations/${timestamp}_import_22_tables.sql`;
fs.writeFileSync(filename, migrationContent);

console.log('Migration generated successfully!');
console.log(`File: ${filename}`);
console.log(`Total products: ${tables.length}`);
console.log(`Total images: ${tables.reduce((sum, t) => sum + (t.images?.length || 0), 0)}`);
