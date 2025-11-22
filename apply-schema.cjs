const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  const sql = fs.readFileSync('schema_to_apply.sql', 'utf8');

  console.log('Applying complete database schema...');
  console.log(`SQL length: ${sql.length} characters`);

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('Error applying schema:', error);
    process.exit(1);
  }

  console.log('Schema applied successfully!');
  console.log('Result:', data);
}

applySchema();
