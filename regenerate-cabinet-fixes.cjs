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

async function regenerateFixes() {
  console.log('🔍 Fetching cabinets from database...');
  
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();
  
  const { data: cabinets } = await supabase
    .from('products')
    .select('sku, name, original_name, price')
    .eq('category_id', category.id)
    .order('sku');
  
  const scrapedData = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));
  
  console.log(`📦 ${cabinets.length} cabinets, ${scrapedData.length} scraped\n`);
  
  const updates = [];
  
  for (const cabinet of cabinets) {
    const currentPrice = parseFloat(cabinet.price);
    
    // Check if this cabinet needs fixing
    const needsTranslation = /[А-Яа-яЁё]/.test(cabinet.name);
    const needsPriceConversion = currentPrice > 1000;
    
    if (needsTranslation || needsPriceConversion) {
      let scraped = scrapedData.find(s => s.russianName === cabinet.name || s.russianName === cabinet.original_name);
      
      const originalName = cabinet.name;
      const newName = needsTranslation ? translateName(cabinet.name) : cabinet.name;
      const newPrice = scraped && scraped.price ? (scraped.price / 100).toFixed(2) : needsPriceConversion ? (currentPrice / 100).toFixed(2) : currentPrice;
      
      console.log(`${cabinet.sku}: ${cabinet.name} → ${newName} | €${currentPrice} → €${newPrice}`);
      
      updates.push({
        sku: cabinet.sku,
        name: newName,
        originalName: originalName,
        price: newPrice
      });
    }
  }
  
  console.log(`\n✅ ${updates.length} cabinets need fixing\n`);
  
  // Apply updates directly
  for (const update of updates) {
    const { error } = await supabase
      .from('products')
      .update({
        name: update.name,
        original_name: update.originalName,
        price: update.price
      })
      .eq('sku', update.sku);
    
    if (error) {
      console.error(`Error updating ${update.sku}:`, error);
    }
  }
  
  console.log('🎉 All updates applied!');
}

regenerateFixes();
