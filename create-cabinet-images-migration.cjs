const fs = require('fs');

const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped.json', 'utf8'));

// Map Russian names to SKUs
const nameToSku = {
  'Шкаф BOSS STANDART 120 - 3Д Кашемир серый': 'CAB-MNM-0001',
  'Шкаф BOSS STANDART 150 - 3Д Шиншилла серая': 'CAB-MNM-0002',
  'Шкаф BOSS STANDART 150 - 3Д Кашемир серый': 'CAB-MNM-0003',
  'Шкаф BOSS STANDART 180 - 4Д Шиншилла серая': 'CAB-MNM-0004',
  'Шкаф BOSS STANDART 180 - 4Д Кашемир серый': 'CAB-MNM-0005',
  'Идея 120 шкаф распашной 3Д Кашемир': 'CAB-MNM-0006',
  'Идея 135 шкаф распашной 3Д+ящики Белый': 'CAB-MNM-0007',
  'Идея 180 шкаф распашной 4Д+ящики Кашемир': 'CAB-MNM-0008',
  'Рим 80 шкаф распашной 2Д Белый': 'CAB-MNM-0009',
  'Рим 80 шкаф распашной 2Д Орех Селект': 'CAB-MNM-0010',
  'Рим 80 шкаф распашной 2Д Кашемир': 'CAB-MNM-0011',
  'Рим 80 шкаф распашной 2Д + ящики Белый': 'CAB-MNM-0012',
  'Рим 80 шкаф распашной 2Д + ящики Орех Селект': 'CAB-MNM-0013',
  'Рим 80 шкаф распашной 2Д + ящики Кашемир': 'CAB-MNM-0014',
  'Рим 90 шкаф распашной 2Д Белый': 'CAB-MNM-0015',
  'Рим 90 шкаф распашной 2Д Орех Селект': 'CAB-MNM-0016',
  'Рим 90 шкаф распашной 2Д Кашемир': 'CAB-MNM-0017',
  'Рим 90 шкаф распашной 2Д+ящики Белый': 'CAB-MNM-0018',
  'Рим 90 шкаф распашной 2Д+ящики Орех Селект': 'CAB-MNM-0019',
  'Рим 90 шкаф распашной 2Д+ящики Кашемир': 'CAB-MNM-0020',
  'Рим 120 шкаф распашной 3Д Кашемир': 'CAB-MNM-0021',
  'Рим 120 шкаф распашной 3Д Орех Селект': 'CAB-MNM-0022',
  'Рим 120 шкаф распашной 3Д Белый': 'CAB-MNM-0023',
  'Рим 120 шкаф распашной 3Д+ящики Кашемир': 'CAB-MNM-0024',
  'Рим 120 шкаф распашной 3Д+ящики Орех Селект': 'CAB-MNM-0025',
  'Рим 120 шкаф распашной 3Д+ящики Белый': 'CAB-MNM-0026',
  'Рим 135 шкаф распашной 3Д Кашемир': 'CAB-MNM-0027',
  'Рим 135 шкаф распашной 3Д Орех Селект': 'CAB-MNM-0028',
  'Рим 135 шкаф распашной 3Д Белый': 'CAB-MNM-0029',
  'Рим 135 шкаф распашной 3Д+ящики Кашемир': 'CAB-MNM-0030',
  'Рим 135 шкаф распашной 3Д+ящики Орех Селект': 'CAB-MNM-0031',
  'Рим 135 шкаф распашной 3Д+ящики Белый': 'CAB-MNM-0032',
  'Рим 160 шкаф распашной 4Д Белый': 'CAB-MNM-0033',
  'Рим 160 шкаф распашной 4Д Кашемир': 'CAB-MNM-0034',
  'Рим 160 шкаф распашной 4Д Орех Селект': 'CAB-MNM-0035',
  'Рим 160 шкаф распашной 4Д+ящики Белый': 'CAB-MNM-0036',
  'Рим 160 шкаф распашной 4Д+ящики Кашемир': 'CAB-MNM-0037',
  'Рим 160 шкаф распашной 4Д+ящики Орех Селект': 'CAB-MNM-0038',
  'Рим 180 шкаф распашной 4Д Кашемир': 'CAB-MNM-0039',
  'Рим 180 шкаф распашной 4Д Орех Селект': 'CAB-MNM-0040',
  'Рим 180 шкаф распашной 4Д Белый': 'CAB-MNM-0041',
  'Рим 180 шкаф распашной 4Д+ящики Кашемир': 'CAB-MNM-0042',
  'Рим 180 шкаф распашной 4Д+ящики Белый': 'CAB-MNM-0043',
  'Стеллаж 220 Кашемир': 'CAB-MNM-0044',
  'Стеллаж 220 Белый': 'CAB-MNM-0045'
};

console.log('/*');
console.log('  # Add Images for 45 Cabinets');
console.log('  ');
console.log('  Adding product images from the website for all cabinet variants.');
console.log('*/');
console.log('');
console.log('DO $$');
console.log('DECLARE');
console.log('  v_product_id uuid;');
console.log('BEGIN');

cabinets.forEach((cabinet, index) => {
  const sku = nameToSku[cabinet.russianName];

  if (!sku) {
    console.error(`Warning: No SKU mapping found for "${cabinet.russianName}"`);
    return;
  }

  // Convert image URL to full resolution
  const fullImageUrl = cabinet.imageUrl
    .replace('/resize_cache/', '/')
    .replace(/\/\d+_\d+_\d+\//, '/');

  const englishName = cabinet.russianName
    .replace(/Шкаф BOSS STANDART/, 'BOSS STANDART')
    .replace(/Идея/, 'Idea')
    .replace(/Рим/, 'Rim')
    .replace(/Стеллаж/, 'Shelving Unit')
    .replace(/шкаф распашной/, '')
    .replace(/Кашемир.*/, 'Cashmere')
    .replace(/Белый.*/, 'White')
    .replace(/Орех Селект.*/, 'Walnut')
    .replace(/Шиншилла.*/, 'Chinchilla')
    .trim();

  console.log(`  -- ${sku}: ${englishName}`);
  console.log(`  SELECT id INTO v_product_id FROM products WHERE sku = '${sku}';`);
  console.log(`  INSERT INTO product_images (product_id, image_url, display_order, alt_text)`);
  console.log(`  VALUES `);
  console.log(`    (v_product_id, '${fullImageUrl}', 0, '${englishName} Cabinet');`);
  console.log('');
});

console.log('END $$;');

