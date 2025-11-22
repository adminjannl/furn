#!/bin/bash
cd /tmp/cc-agent/60499082/project
source .env
export VITE_SUPABASE_URL
export VITE_SUPABASE_ANON_KEY

node << 'EOF'
const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const sql = fs.readFileSync('schema_to_apply.sql', 'utf8');

(async () => {
  console.log('Applying schema...');
  const lines = sql.split('\n');
  let batch = '';
  let count = 0;
  
  for (const line of lines) {
    batch += line + '\n';
    
    if (line.trim().endsWith(';') && batch.length > 100) {
      count++;
      const {error} = await supabase.rpc('exec_sql', {sql_query: batch}).maybeSingle();
      if (error) console.error(`Error in batch ${count}:`, error.message);
      else console.log(`Batch ${count} OK`);
      batch = '';
    }
  }
  
  console.log('Done!');
})();
EOF
