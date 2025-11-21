const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function applyAllFixes() {
  const sql = fs.readFileSync('./fix-cabinet-names-and-prices.sql', 'utf8');
  
  // Extract all UPDATE statements
  const updates = [];
  const matches = sql.matchAll(/UPDATE products\s+SET[^;]+WHERE sku = '([^']+)';/gs);
  
  for (const match of matches) {
    const fullStatement = match[0];
    const sku = match[1];
    
    // Extract values
    const nameMatch = fullStatement.match(/name = '([^']+(?:''[^']+)*)'/);
    const originalMatch = fullStatement.match(/original_name = '([^']*(?:''[^']*)*)'/);
    const priceMatch = fullStatement.match(/price = ([\d.]+)/);
    
    if (nameMatch && priceMatch) {
      updates.push({
        sku,
        name: nameMatch[1].replace(/''/g, "'"),
        original_name: originalMatch ? originalMatch[1].replace(/''/g, "'") : null,
        price: parseFloat(priceMatch[1])
      });
    }
  }
  
  console.log(`📝 Applying ${updates.length} updates...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const update of updates) {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: update.name,
          original_name: update.original_name,
          price: update.price
        })
        .eq('sku', update.sku);
      
      if (error) {
        console.error(`❌ Error updating ${update.sku}:`, error.message);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`✅ Processed ${successCount}/${updates.length}`);
        }
      }
    } catch (err) {
      console.error(`❌ Exception for ${update.sku}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Complete! ${successCount} successful, ${errorCount} errors`);
}

applyAllFixes();
