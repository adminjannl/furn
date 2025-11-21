const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function applyMigration() {
  try {
    const sql = fs.readFileSync('supabase/migrations/20251029_103934_import_22_tables.sql', 'utf8');

    console.log('Applying tables migration...');
    console.log('SQL length:', sql.length, 'characters');

    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      console.error('Error applying migration:', error);
      process.exit(1);
    }

    console.log('✓ Migration applied successfully!');
    console.log('\nVerifying products...');

    const { data: products, error: queryError } = await supabase
      .from('products')
      .select('sku, name, price')
      .like('sku', 'TBL-MNM-%')
      .order('sku');

    if (queryError) {
      console.error('Error querying products:', queryError);
    } else {
      console.log(`\n✓ Found ${products.length} tables in database:`);
      products.slice(0, 5).forEach(p => {
        console.log(`  - ${p.sku}: ${p.name} (${p.price} BYN)`);
      });
      if (products.length > 5) {
        console.log(`  ... and ${products.length - 5} more`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
