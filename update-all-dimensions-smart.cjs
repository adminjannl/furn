const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateAllDimensions() {
  const dimensionsData = JSON.parse(fs.readFileSync('./cabinet-dimensions-complete.json', 'utf8'));
  const scrapedProducts = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));
  
  // Get all cabinets
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();
  
  const { data: cabinets } = await supabase
    .from('products')
    .select('id, sku, source_url, original_name, name')
    .eq('category_id', category.id)
    .order('sku');
  
  console.log(`📏 Updating dimensions for ${cabinets.length} cabinets...\n`);
  
  let updates = [];
  
  for (const cabinet of cabinets) {
    // Try matching by URL first
    let dimensionData = dimensionsData.find(d => d.url === cabinet.source_url);
    
    // If no URL match, try by Russian name
    if (!dimensionData && cabinet.original_name) {
      dimensionData = dimensionsData.find(d => d.russianName === cabinet.original_name);
    }
    
    // If still no match, try by index (assuming same order)
    if (!dimensionData) {
      const scrapedIndex = scrapedProducts.findIndex(p => p.url === cabinet.source_url);
      if (scrapedIndex !== -1 && dimensionsData[scrapedIndex]) {
        dimensionData = dimensionsData[scrapedIndex];
      }
    }
    
    if (dimensionData && dimensionData.width_cm) {
      updates.push({
        sku: cabinet.sku,
        id: cabinet.id,
        width_cm: dimensionData.width_cm,
        depth_cm: dimensionData.depth_cm,
        height_cm: dimensionData.height_cm,
        dimensions_raw: dimensionData.dimensions_raw
      });
    }
  }
  
  console.log(`Found ${updates.length} products with dimensions\n`);
  
  // Apply updates via migration
  let sql = `/*
  # Add Cabinet Dimensions
  
  Adding width, depth (as length), and height for all 105 cabinets
*/

`;
  
  for (const update of updates) {
    sql += `UPDATE products SET width_cm = ${update.width_cm}, length_cm = ${update.depth_cm}, height_cm = ${update.height_cm} WHERE sku = '${update.sku}';\n`;
    console.log(`✅ ${update.sku}: ${update.dimensions_raw}`);
  }
  
  fs.writeFileSync('./add-cabinet-dimensions.sql', sql);
  console.log(`\n📝 Generated migration: add-cabinet-dimensions.sql`);
}

updateAllDimensions();
