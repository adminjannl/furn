const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function extractDoorCounts() {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();
  
  const { data: cabinets } = await supabase
    .from('products')
    .select('id, sku, name')
    .eq('category_id', category.id)
    .order('sku');
  
  console.log(`🚪 Extracting door counts from ${cabinets.length} cabinets...\n`);
  
  const updates = [];
  
  for (const cabinet of cabinets) {
    let doorCount = null;
    let newName = cabinet.name;
    
    // Match patterns like "2D", "3D", "4D" (doors)
    const doorMatch = cabinet.name.match(/(\d)[Dd]\s/);
    if (doorMatch) {
      doorCount = parseInt(doorMatch[1]);
      // Remove the door count from name
      newName = cabinet.name.replace(/\s*\d[Dd]\s*/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    if (doorCount) {
      updates.push({
        sku: cabinet.sku,
        id: cabinet.id,
        oldName: cabinet.name,
        newName: newName,
        doorCount: doorCount
      });
      console.log(`✅ ${cabinet.sku}: ${doorCount} doors | "${cabinet.name}" → "${newName}"`);
    } else {
      console.log(`⚠️  ${cabinet.sku}: No door count found in "${cabinet.name}"`);
    }
  }
  
  console.log(`\n📝 Found ${updates.length} products with door counts`);
  
  // Generate SQL
  let sql = `/*
  # Update Door Counts and Clean Names
  
  Extracting door counts from product names and storing separately
*/

`;
  
  for (const update of updates) {
    sql += `UPDATE products SET door_count = ${update.doorCount}, name = '${update.newName.replace(/'/g, "''")}' WHERE sku = '${update.sku}';\n`;
  }
  
  fs.writeFileSync('./update-door-counts.sql', sql);
  console.log('\n📄 Generated: update-door-counts.sql');
}

extractDoorCounts();
