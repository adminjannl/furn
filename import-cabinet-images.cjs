const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cabinetData = require('./cabinets-final-with-prices.json');

function translateName(russianName) {
  const nameMap = {
    'Шкаф BOSS STANDART': 'Cabinet BOSS',
    'Рим': 'Rim',
    'шкаф распашной': 'Cabinet',
    'Кашемир серый': 'Cashmere',
    'Шиншилла серая': 'Chinchilla',
    'Орех Селект': 'Walnut',
    'Белый': 'White',
    'Кашемир': 'Cashmere'
  };

  let translated = russianName;
  for (const [rus, eng] of Object.entries(nameMap)) {
    translated = translated.replace(new RegExp(rus, 'g'), eng);
  }

  return translated
    .replace(/[^\w\s\d-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function importImages() {
  console.log('🖼️  Starting cabinet image import...\n');

  const { data: categories } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'cabinets')
    .single();

  if (!categories) {
    console.error('❌ Cabinets category not found');
    return;
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .eq('category_id', categories.id);

  console.log(`Found ${products.length} cabinets in database`);
  console.log(`Found ${cabinetData.length} cabinets in data file\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const cabinet of cabinetData) {
    const translatedName = translateName(cabinet.russianName);

    const product = products.find(p => {
      const normalizedDbName = p.name.toLowerCase().replace(/[^\w\s]/g, '');
      const normalizedCabinetName = translatedName.toLowerCase().replace(/[^\w\s]/g, '');
      return normalizedDbName.includes(normalizedCabinetName.substring(0, 20)) ||
             normalizedCabinetName.includes(normalizedDbName.substring(0, 20));
    });

    if (!product) {
      console.log(`⚠️  No match found for: ${translatedName}`);
      errorCount++;
      continue;
    }

    if (!cabinet.allImages || cabinet.allImages.length === 0) {
      console.log(`⚠️  No images for: ${product.name}`);
      errorCount++;
      continue;
    }

    for (let i = 0; i < cabinet.allImages.length; i++) {
      const imageUrl = cabinet.allImages[i];

      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: imageUrl,
          alt_text: product.name,
          display_order: i,
          is_primary: i === 0
        });

      if (error) {
        console.log(`❌ Error inserting image for ${product.name}:`, error.message);
        errorCount++;
      }
    }

    successCount++;
    console.log(`✅ Imported ${cabinet.allImages.length} image(s) for: ${product.name}`);
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

importImages().catch(console.error);
