const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsd3F3ZGVhbWZqemFtdWx0ZXVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEyNDQ4NCwiZXhwIjoyMDc2NzAwNDg0fQ.6qBGPwPcD8y1S04D71A0YqkqOBu1T5jx1PW3O_wqMXI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  console.log('Testing product queries...\n');

  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name')
    .eq('sku', 'BED-MNM-0041');

  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));

  const { data: data2, error: error2 } = await supabase
    .from('products')
    .select('id, sku, name')
    .eq('sku', 'BED-MNM-0041')
    .maybeSingle();

  console.log('\nWith maybeSingle:');
  console.log('Error:', error2);
  console.log('Data:', JSON.stringify(data2, null, 2));
}

test().catch(console.error);
