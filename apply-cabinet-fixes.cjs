const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function applyFixes() {
  const sql = fs.readFileSync('./fix-cabinet-names-and-prices.sql', 'utf8');
  
  // Split into individual statements
  const statements = sql
    .split('\n\n')
    .filter(s => s.trim().startsWith('UPDATE'));
  
  console.log(`📝 Applying ${statements.length} updates...`);
  
  // Process in batches of 20
  const batchSize = 20;
  for (let i = 0; i < statements.length; i += batchSize) {
    const batch = statements.slice(i, i + batchSize);
    const batchSql = batch.join('\n\n');
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_string: batchSql });
      if (error) {
        // Try direct execution
        for (const stmt of batch) {
          const match = stmt.match(/WHERE sku = '([^']+)'/);
          if (match) {
            const sku = match[1];
            const nameMatch = stmt.match(/name = '([^']+)'/);
            const priceMatch = stmt.match(/price = ([\d.]+)/);
            const origMatch = stmt.match(/original_name = '([^']*)'/);
            
            if (nameMatch && priceMatch) {
              const { error: updateError } = await supabase
                .from('products')
                .update({
                  name: nameMatch[1].replace(/''/g, "'"),
                  original_name: origMatch ? origMatch[1].replace(/''/g, "'") : null,
                  price: priceMatch[1]
                })
                .eq('sku', sku);
              
              if (updateError) {
                console.error(`Error updating ${sku}:`, updateError);
              }
            }
          }
        }
      }
      
      console.log(`✅ Processed ${Math.min(i + batchSize, statements.length)}/${statements.length}`);
    } catch (err) {
      console.error('Batch error:', err);
    }
  }
  
  console.log('\n🎉 All updates applied!');
}

applyFixes();
