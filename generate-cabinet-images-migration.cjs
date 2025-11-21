const fs = require('fs');
const cabinetData = require('./cabinets-final-with-prices.json');

function translateName(russianName) {
  const nameMap = {
    'Шкаф BOSS STANDART': 'Cabinet BOSS',
    'BOSS STANDART': 'Boss',
    'Рим': 'Rim',
    'шкаф распашной': 'Cabinet',
    'Кашемир серый': 'Cashmere',
    'Шиншилла серая': 'Chinchilla',
    'Орех Селект': 'Walnut',
    'Белый': 'White',
    'Кашемир': 'Cashmere',
    'серый': '',
    'серая': ''
  };

  let translated = russianName;
  for (const [rus, eng] of Object.entries(nameMap)) {
    translated = translated.replace(new RegExp(rus, 'gi'), eng);
  }

  return translated
    .replace(/[^\w\s\d-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSKU(index) {
  return `CAB-MNM-${String(index).padStart(4, '0')}`;
}

let sql = `/*
  # Import Cabinet Images

  1. Purpose
    - Add images for all 83 cabinets imported in previous migration
    - Each cabinet gets its primary image from the scraped data

  2. Changes
    - Insert image records into product_images table
    - Link images to existing cabinet products by matching SKU patterns

  3. Security
    - Uses existing RLS policies on product_images table
*/

-- Insert cabinet images
`;

cabinetData.forEach((cabinet, index) => {
  if (!cabinet.allImages || cabinet.allImages.length === 0) {
    return;
  }

  const sku = generateSKU(index + 1);
  const translatedName = translateName(cabinet.russianName);

  cabinet.allImages.forEach((imageUrl, imgIndex) => {
    const escapedUrl = imageUrl.replace(/'/g, "''");
    const escapedName = translatedName.replace(/'/g, "''");

    sql += `
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  '${escapedUrl}',
  '${escapedName}',
  ${imgIndex}
FROM products p
WHERE p.sku = '${sku}'
ON CONFLICT DO NOTHING;
`;
  });
});

fs.writeFileSync('import-cabinet-images.sql', sql);
console.log('✅ Generated import-cabinet-images.sql');
console.log(`📊 Total cabinets with images: ${cabinetData.filter(c => c.allImages && c.allImages.length > 0).length}`);
