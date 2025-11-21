const fs = require('fs');

const allCabinets = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));

const skuMap = {
  'CAB-MNM-0084': 'Шкаф BOSS STANDART 120 - 3Д Кашемир серый',
  'CAB-MNM-0085': 'Рим 120 шкаф распашной 3Д Кашемир',
  'CAB-MNM-0086': 'Рим 120 шкаф распашной 3Д Орех Селект',
  'CAB-MNM-0087': 'Рим 160 шкаф распашной 4Д Белый',
  'CAB-MNM-0088': 'Шкаф BOSS STANDART 180 - 4Д Шиншилла серая',
  'CAB-MNM-0089': 'Рим 80 шкаф распашной 2Д Белый',
  'CAB-MNM-0090': 'Идея 180 шкаф распашной 4Д+ящики Кашемир',
  'CAB-MNM-0091': 'Идея 120 шкаф распашной 3Д Кашемир',
  'CAB-MNM-0092': 'Идея 135 шкаф распашной 3Д+ящики Белый',
  'CAB-MNM-0093': 'Идея 80 шкаф распашной 2Д+ящики Белый',
  'CAB-MNM-0094': 'Идея 80 шкаф распашной 2Д+ящики Кашемир',
  'CAB-MNM-0095': 'Идея 90 шкаф распашной 2Д+ящики Белый',
  'CAB-MNM-0096': 'Идея 90 шкаф распашной 2Д+ящики Кашемир',
  'CAB-MNM-0097': 'Идея 120 шкаф распашной 3Д Белый',
  'CAB-MNM-0098': 'Идея 120 шкаф распашной 3Д+ящики Белый',
  'CAB-MNM-0099': 'Идея 120 шкаф распашной 3Д+ящики Кашемир',
  'CAB-MNM-0100': 'Идея 135 шкаф распашной 3Д Белый',
  'CAB-MNM-0101': 'Идея 135 шкаф распашной 3Д Кашемир',
  'CAB-MNM-0102': 'Идея 135 шкаф распашной 3Д+ящики Кашемир',
  'CAB-MNM-0103': 'Идея 160 шкаф распашной 4Д+ящики Белый',
  'CAB-MNM-0104': 'Идея 160 шкаф распашной 4Д+ящики Кашемир',
  'CAB-MNM-0105': 'Идея 180 шкаф распашной 4Д+ящики Белый'
};

let sql = `/*
  # Add images for 19 missing cabinets
  
  Adding product images for CAB-MNM-0084 through CAB-MNM-0105
*/

`;

for (const [sku, name] of Object.entries(skuMap)) {
  const product = allCabinets.find(c => c.russianName === name);
  
  if (product && product.imageUrl) {
    sql += `INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, '${product.imageUrl}', '${name.replace(/'/g, "''")}', 0
FROM products p
WHERE p.sku = '${sku}'
ON CONFLICT DO NOTHING;

`;
  }
}

fs.writeFileSync('./add-missing-19-cabinet-images.sql', sql);
console.log('✅ Generated migration with 19 cabinet images');
