const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function translateName(russianName) {
  let translated = russianName;
  
  const translations = {
    'Шкаф': 'Wardrobe',
    'шкаф': 'wardrobe',
    'распашной': 'Hinged',
    'Кашемир': 'Cashmere',
    'Белый': 'White',
    'Орех Селект': 'Walnut Select',
    'Шиншилла серая': 'Chinchilla Gray',
    'Кашемир серый': 'Cashmere Gray',
    'ящики': 'Drawers',
    'Идея': 'Idea',
    'Рим': 'Rim',
    'серая': 'Gray',
    'серый': 'Gray'
  };
  
  for (const [ru, en] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(ru, 'gi'), en);
  }
  
  translated = translated
    .replace(/\s+/g, ' ')
    .replace(/(\d+)\s*[DД]/gi, '$1D')
    .replace(/\+/g, ' with ')
    .trim();
  
  return translated;
}

async function fixCabinets() {
  console.log('🔍 Fetching all cabinets...');
  
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();
  
  const { data: cabinets, error } = await supabase
    .from('products')
    .select('id, sku, name, original_name, price')
    .eq('category_id', category.id)
    .order('sku');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`📦 Found ${cabinets.length} cabinets\n`);
  
  const allCabinetsData = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));
  
  let sqlUpdates = [];
  
  for (const cabinet of cabinets) {
    const currentPrice = parseFloat(cabinet.price);
    let newPrice = currentPrice;
    let newName = cabinet.name;
    let originalName = cabinet.original_name || cabinet.name;
    
    // Find scraped data
    const scrapedData = allCabinetsData.find(c => 
      c.russianName === cabinet.name || c.russianName === cabinet.original_name
    );
    
    if (scrapedData && scrapedData.price) {
      newPrice = (scrapedData.price / 100).toFixed(2);
      originalName = scrapedData.russianName;
      newName = translateName(scrapedData.russianName);
    } else if (/[А-Яа-яЁё]/.test(cabinet.name)) {
      originalName = cabinet.name;
      newName = translateName(cabinet.name);
      if (currentPrice > 1000) {
        newPrice = (currentPrice / 100).toFixed(2);
      }
    } else {
      if (currentPrice > 1000) {
        newPrice = (currentPrice / 100).toFixed(2);
      }
      if (!cabinet.original_name) {
        originalName = cabinet.name;
      }
    }
    
    if (newPrice !== currentPrice || newName !== cabinet.name || originalName !== cabinet.original_name) {
      sqlUpdates.push({
        sku: cabinet.sku,
        newName: newName,
        originalName: originalName,
        newPrice: newPrice
      });
    }
  }
  
  console.log(`✅ Generating migration for ${sqlUpdates.length} updates\n`);
  
  let sql = `/*
  # Fix Cabinet Names and Prices
  
  - Translating Russian names to English
  - Converting ruble prices to euros (÷100)
  - Preserving original Russian names in original_name field
*/

`;
  
  for (const update of sqlUpdates) {
    sql += `UPDATE products
SET 
  name = '${update.newName.replace(/'/g, "''")}',
  original_name = '${(update.originalName || '').replace(/'/g, "''")}',
  price = ${update.newPrice}
WHERE sku = '${update.sku}';

`;
  }
  
  fs.writeFileSync('./fix-cabinet-names-and-prices.sql', sql);
  console.log('📝 Generated: fix-cabinet-names-and-prices.sql');
}

fixCabinets();
