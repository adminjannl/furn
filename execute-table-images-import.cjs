const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function executeSQLFile() {
  try {
    const sql = fs.readFileSync('import-correct-table-images.sql', 'utf8');

    const sqlStatements = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('/*'));

    console.log(`Executing ${sqlStatements.length} SQL statements...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];

      if (statement.startsWith('INSERT')) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

          if (error) {
            console.error(`Error on statement ${i + 1}:`, error.message);
            errorCount++;
          } else {
            successCount++;
            if ((i + 1) % 10 === 0) {
              console.log(`  Progress: ${i + 1}/${sqlStatements.length}`);
            }
          }
        } catch (err) {
          console.error(`Exception on statement ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }

    console.log(`\n✓ Import complete!`);
    console.log(`  Successful: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

executeSQLFile();
