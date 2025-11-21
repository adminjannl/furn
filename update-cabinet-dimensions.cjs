const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateDimensions() {
  const dimensionsData = JSON.parse(fs.readFileSync('./cabinet-dimensions-complete.json', 'utf8'));
  const productsData = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));
  
  // Get all cabinets from database
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();
  
  const { data: cabinets } = await supabase
    .from('products')
    .select('id, sku, name, original_name')
    .eq('category_id', category.id)
    .order('sku');
  
  console.log(`📏 Updating dimensions for ${cabinets.length} cabinets...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const cabinet of cabinets) {
    // Match by original_name (Russian name)
    const dimensionData = dimensionsData.find(d => 
      d.russianName === cabinet.original_name || 
      d.russianName === cabinet.name
    );
    
    if (dimensionData && dimensionData.width_cm) {
      const { error } = await supabase
        .from('products')
        .update({
          width_cm: dimensionData.width_cm,
          length_cm: dimensionData.depth_cm,  // depth -> length
          height_cm: dimensionData.height_cm
        })
        .eq('id', cabinet.id);
      
      if (error) {
        console.error(`❌ ${cabinet.sku}:`, error.message);
        failCount++;
      } else {
        console.log(`✅ ${cabinet.sku}: ${dimensionData.width_cm}x${dimensionData.depth_cm}x${dimensionData.height_cm} cm`);
        successCount++;
      }
    } else {
      console.log(`⚠️  ${cabinet.sku}: No dimensions found`);
      failCount++;
    }
  }
  
  console.log(`\n🎉 Complete! ${successCount} updated, ${failCount} failed`);
}

updateDimensions();
