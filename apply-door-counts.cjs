const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function applyDoorCounts() {
  const sql = fs.readFileSync('./update-door-counts.sql', 'utf8');
  const updates = sql.match(/UPDATE products SET.*?;/g) || [];
  
  console.log(`🚪 Applying ${updates.length} door count updates...\n`);
  
  for (const update of updates) {
    const skuMatch = update.match(/sku = '([^']+)'/);
    const doorMatch = update.match(/door_count = (\d+)/);
    const nameMatch = update.match(/name = '([^']+)'/);
    
    if (skuMatch && doorMatch && nameMatch) {
      const sku = skuMatch[1];
      const doorCount = parseInt(doorMatch[1]);
      const name = nameMatch[1].replace(/''/g, "'");
      
      const { error } = await supabase
        .from('products')
        .update({ door_count: doorCount, name: name })
        .eq('sku', sku);
      
      if (error) {
        console.error(`❌ ${sku}:`, error.message);
      }
    }
  }
  
  console.log('\n✅ All updates applied!');
}

applyDoorCounts();
