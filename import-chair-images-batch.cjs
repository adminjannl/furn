require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importChairImagesBatch() {
  const batchFiles = ['chair_img_batch_aa', 'chair_img_batch_ab', 'chair_img_batch_ac', 'chair_img_batch_ad', 'chair_img_batch_ae', 'chair_img_batch_af', 'chair_img_batch_ag', 'chair_img_batch_ah'];

  console.log(`Importing chair images in ${batchFiles.length} batches...\n`);

  let totalSuccess = 0;
  let totalErrors = 0;

  for (let i = 0; i < batchFiles.length; i++) {
    const filename = batchFiles[i];
    console.log(`[${i + 1}/${batchFiles.length}] Processing ${filename}...`);

    try {
      const sql = fs.readFileSync(filename, 'utf8');
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

      if (error) {
        console.log(`  ✗ Error: ${error.message}`);
        totalErrors++;
      } else {
        console.log(`  ✓ Success`);
        totalSuccess++;
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      totalErrors++;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Success: ${totalSuccess}/${batchFiles.length}`);
  console.log(`Errors: ${totalErrors}/${batchFiles.length}`);
}

importChairImagesBatch().catch(console.error);
