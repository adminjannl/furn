const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsd3F3ZGVhbWZqemFtdWx0ZXVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEyNDQ4NCwiZXhwIjoyMDc2NzAwNDg0fQ.6qBGPwPcD8y1S04D71A0YqkqOBu1T5jx1PW3O_wqMXI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getBeds() {
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name, original_name')
    .gte('sku', 'BED-MNM-0041')
    .lte('sku', 'BED-MNM-0063')
    .order('sku', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} beds:\n`);
  data.forEach(bed => {
    console.log(`${bed.sku}: ${bed.name}`);
    console.log(`  Original: ${bed.original_name || 'N/A'}\n`);
  });
}

getBeds().catch(console.error);
