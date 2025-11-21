const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixAllPrices() {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Cabinets')
    .single();
  
  const { data: cabinets } = await supabase
    .from('products')
    .select('sku, price')
    .eq('category_id', category.id)
    .gt('price', 1000);
  
  console.log(`💰 Fixing ${cabinets.length} cabinet prices...`);
  
  for (const cabinet of cabinets) {
    const newPrice = (parseFloat(cabinet.price) / 100).toFixed(2);
    
    const { error } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('sku', cabinet.sku);
    
    if (error) {
      console.error(`Error: ${cabinet.sku}`, error);
    } else {
      console.log(`✅ ${cabinet.sku}: €${cabinet.price} → €${newPrice}`);
    }
  }
  
  console.log('\n🎉 All prices fixed!');
}

fixAllPrices();
