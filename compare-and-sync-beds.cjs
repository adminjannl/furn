const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function normalizeNameForComparison(name) {
  return name
    .toLowerCase()
    .replace(/[*×x]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\s-]+/g, '')
    .trim();
}

async function compareAndSyncBeds() {
  console.log('🔄 Starting bed comparison and sync...\n');

  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, original_name, sku, price')
    .order('created_at', { ascending: true });

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }

  const jsonFile = path.join(__dirname, 'complete-bed-catalog.json');
  const jsonProducts = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

  console.log(`📊 Database: ${dbProducts.length} products`);
  console.log(`📊 JSON File: ${jsonProducts.length} products\n`);

  const dbNames = new Set(dbProducts.map(p => normalizeNameForComparison(p.original_name || p.name)));

  const missingInDb = [];

  jsonProducts.forEach(jsonProduct => {
    const normalized = normalizeNameForComparison(jsonProduct.russianName);

    if (!dbNames.has(normalized)) {
      missingInDb.push(jsonProduct);
    }
  });

  console.log(`✅ Found ${dbProducts.length - (jsonProducts.length - missingInDb.length)} beds in both DB and JSON`);
  console.log(`❌ Missing from DB: ${missingInDb.length} beds\n`);

  if (missingInDb.length > 0) {
    console.log('📋 Beds missing from database:\n');
    missingInDb.forEach((bed, index) => {
      console.log(`${index + 1}. ${bed.russianName}`);
    });

    console.log('\n💾 Importing missing beds to database...\n');

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'beds')
      .maybeSingle();

    if (!category) {
      throw new Error('Beds category not found in database');
    }

    for (let i = 0; i < missingInDb.length; i++) {
      const bed = missingInDb[i];

      const englishName = translateRussianToEnglish(bed.russianName);
      const slug = generateSlug(englishName);
      const sku = `BED-NEW-${String(i + 1).padStart(4, '0')}`;
      const price = extractPrice(bed.russianName) || 299.99;

      console.log(`   Importing ${i + 1}/${missingInDb.length}: ${bed.russianName}`);

      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert({
          category_id: category.id,
          name: englishName,
          slug: `${slug}-${Date.now()}`,
          description: `Elegant ${englishName} with premium upholstery`,
          original_name: bed.russianName,
          original_description: `Элегантная ${bed.russianName} с премиальной обивкой`,
          price: price,
          sku: sku,
          source_url: bed.productUrl || 'https://mnogomebeli.com/krovati/',
          stock_quantity: 10,
          status: 'active',
          materials: 'Premium upholstery'
        })
        .select()
        .single();

      if (insertError) {
        console.log(`   ❌ Error: ${insertError.message}`);
        continue;
      }

      if (bed.imageUrl) {
        await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: bed.imageUrl,
            display_order: 0,
            alt_text: englishName
          });
      }

      console.log(`   ✅ Imported successfully`);
    }

    console.log(`\n✅ Imported ${missingInDb.length} new beds\n`);
  }

  const { count: finalCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Final database count: ${finalCount}`);
  console.log(`📊 Target count: 95`);
  console.log(`📊 Still missing: ${95 - finalCount} beds`);

  return {
    dbCount: dbProducts.length,
    jsonCount: jsonProducts.length,
    missingCount: missingInDb.length,
    finalCount
  };
}

function translateRussianToEnglish(russianName) {
  const translations = {
    'Кровать': 'Bed',
    'Фрея': 'Freya',
    'ЛЕО': 'LEO',
    'Босс': 'Boss',
    'Белла': 'Bella',
    'NORD': 'NORD',
    'ЛОФТ': 'LOFT',
    'РОНДА': 'RONDA',
    'Уна': 'Una',
    'велюр': 'velvet',
    'рогожка': 'burlap',
    'с ПМ': 'with Lifting Mechanism',
    'Про': 'Pro',
    'Мини': 'Mini',
    'Слим': 'Slim',
    'Шенилл': 'Chenille',
    'Вельвет': 'Velvet',
    'CORD': 'CORD',
    'MONOLIT': 'Monolit',
    'Monolit': 'Monolit',
    'Malmo': 'Malmo',
    'Royal': 'Royal',
    'Дрим': 'Dream',
    'NEW': 'NEW',
    'серая': 'gray',
    'серый': 'gray',
    'Серая': 'Gray',
    'Серый': 'Gray',
    'латте': 'latte',
    'Латте': 'Latte',
    'мокко': 'mocha',
    'сталь': 'steel',
    'аква': 'aqua',
    'синяя': 'blue',
    'бежевая': 'beige',
    'графит': 'graphite',
    'платина': 'platinum',
    'черная': 'black',
    'Чёрная': 'Black',
    'агат': 'agate',
    'шампань': 'champagne',
    'топаз': 'topaz',
    'тауп': 'taupe',
    'пион': 'peony',
    'роуз': 'rose',
    'лаванда': 'lavender',
    'Орех': 'Walnut',
    'Селект': 'Select',
    'Сонома': 'Sonoma',
    'IQ': 'IQ',
    'XO': 'XO',
    'mini': 'mini'
  };

  let translated = russianName;
  for (const [russian, english] of Object.entries(translations)) {
    const regex = new RegExp(russian, 'g');
    translated = translated.replace(regex, english);
  }

  return translated.replace(/\s+/g, ' ').trim();
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractPrice(name) {
  const priceMatch = name.match(/(\d{2,3})\s*000/);
  if (priceMatch) {
    return parseFloat(priceMatch[1]) * 10;
  }
  return null;
}

compareAndSyncBeds()
  .then(result => {
    console.log('\n✅ Comparison and sync complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
