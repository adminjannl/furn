const fs = require('fs');

const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped-no-idea.json', 'utf8'));

console.log(`Processing ${cabinets.length} cabinets...\n`);

// Function to translate Russian names to English
function translateName(russianName) {
  let name = russianName
    .replace(/Шкаф/gi, 'Cabinet')
    .replace(/шкаф/gi, 'Cabinet')
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
    .replace(/\s+/g, ' ')
    .trim();

  return name;
}

// Function to extract color from name
function extractColor(russianName) {
  if (russianName.includes('Кашемир')) return 'Cashmere';
  if (russianName.includes('Белый')) return 'White';
  if (russianName.includes('Орех Селект')) return 'Walnut Select';
  if (russianName.includes('Шиншилла')) return 'Chinchilla';
  return 'Natural';
}

// Function to create slug
function createSlug(name) {
  return name.toLowerCase()
    .replace(/cabinet\s+/gi, 'cabinet-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Group cabinets by base model (without color)
const cabinetGroups = {};
let skuCounter = 90; // Start after existing cabinets

cabinets.forEach(cabinet => {
  const englishName = translateName(cabinet.russianName);
  const color = extractColor(cabinet.russianName);

  // Create base name without color
  const baseName = englishName
    .replace(/Cashmere/gi, '')
    .replace(/White/gi, '')
    .replace(/Walnut Select/gi, '')
    .replace(/Chinchilla Gray/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cabinetGroups[baseName]) {
    cabinetGroups[baseName] = [];
  }

  cabinetGroups[baseName].push({
    russianName: cabinet.russianName,
    englishName,
    color,
    imageUrl: cabinet.imageUrl,
    url: cabinet.url
  });
});

console.log(`Grouped into ${Object.keys(cabinetGroups).length} unique cabinet models\n`);

// Generate SQL
let productInserts = [];
let imageInserts = [];
let colorInserts = [];

Object.entries(cabinetGroups).forEach(([baseName, variants]) => {
  variants.forEach((variant, idx) => {
    const sku = `CAB-MNM-${String(skuCounter).padStart(4, '0')}`;
    const fullName = `${baseName} ${variant.color}`;
    const slug = createSlug(fullName);

    // Add product
    productInserts.push(`
  -- ${variant.russianName}
  INSERT INTO products (sku, name, slug, description, base_price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    '${sku}',
    '${fullName.replace(/'/g, "''")}',
    '${slug}',
    'Premium ${baseName} in ${variant.color} finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;`);

    // Add image if available
    if (variant.imageUrl && variant.imageUrl.includes('http')) {
      imageInserts.push(`
  INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
  SELECT
    p.id,
    '${variant.imageUrl.replace(/'/g, "''")}',
    '${fullName.replace(/'/g, "''")}',
    1,
    true
  FROM products p WHERE p.sku = '${sku}'
  ON CONFLICT DO NOTHING;`);
    }

    // Add color variant
    colorInserts.push(`
  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    '${variant.color}',
    '#${variant.color === 'White' ? 'FFFFFF' : variant.color === 'Cashmere' ? 'E8DCC4' : variant.color === 'Walnut Select' ? '8B4513' : 'D3D3D3'}',
    15
  FROM products p WHERE p.sku = '${sku}'
  ON CONFLICT DO NOTHING;`);

    skuCounter++;
  });
});

const migration = `/*
  # Import 83 New Cabinets from mnogomebeli.com

  1. Products Added
    - ${Object.keys(cabinetGroups).length} unique cabinet models
    - ${cabinets.length} total variants (different finishes)
    - SKU range: CAB-MNM-0090 to CAB-MNM-${String(skuCounter-1).padStart(4, '0')}

  2. Categories
    - BOSS STANDART 220cm series (36 products)
    - Rim series cabinets (42 products)
    - Cabinets with mirrors (5 products)

  3. Finishes Available
    - Cashmere
    - White
    - Walnut Select
    - Chinchilla Gray

  4. Images
    - Primary images linked from source website

  5. Notes
    - Excludes Idea series per user request
    - Base prices set to 999.99 (to be updated)
    - All items in stock with quantity 15
*/

-- Insert Products
${productInserts.join('\n')}

-- Insert Images
${imageInserts.join('\n')}

-- Insert Color Variants
${colorInserts.join('\n')}
`;

fs.writeFileSync('./import-83-new-cabinets.sql', migration);
console.log('✅ Migration generated: import-83-new-cabinets.sql');
console.log(`\n📊 Summary:`);
console.log(`   Products: ${cabinets.length}`);
console.log(`   Unique models: ${Object.keys(cabinetGroups).length}`);
console.log(`   Images: ${imageInserts.length}`);
console.log(`   Color variants: ${colorInserts.length}`);
