const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  console.log('Starting data import...\n');

  // Read and execute the fixed products SQL
  console.log('Importing 83 cabinets with images...');
  const productsSql = fs.readFileSync('fixed-all-products.sql', 'utf8');

  // Split into individual statements
  const statements = productsSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let productsImported = 0;
  let imagesImported = 0;

  for (const statement of statements) {
    if (statement.includes('INSERT INTO products')) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' }).maybeSingle();
      if (!error) productsImported++;
      else if (!error.message.includes('already exists')) console.error('Error importing product:', error.message);
    } else if (statement.includes('INSERT INTO product_images')) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' }).maybeSingle();
      if (!error) imagesImported++;
      else if (!error.message.includes('already exists')) console.error('Error importing image:', error.message);
    }
  }

  console.log(`✓ Imported ${productsImported} products`);
  console.log(`✓ Imported ${imagesImported} product images`);

  // Now import beds
  console.log('\nImporting beds...');
  const bedsSql = fs.readFileSync('all-beds-migration.sql', 'utf8')
    .replace(/, is_primary/g, '')
    .replace(/, true/g, '')
    .replace(/, false/g, '');

  const bedStatements = bedsSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let bedsImported = 0;
  let bedImagesImported = 0;

  for (const statement of bedStatements) {
    if (statement.includes('INSERT INTO products')) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' }).maybeSingle();
      if (!error) bedsImported++;
    } else if (statement.includes('INSERT INTO product_images')) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' }).maybeSingle();
      if (!error) bedImagesImported++;
    }
  }

  console.log(`✓ Imported ${bedsImported} beds`);
  console.log(`✓ Imported ${bedImagesImported} bed images`);

  // Verify final counts
  console.log('\nVerifying import...');
  const { data: products } = await supabase.from('products').select('id', { count: 'exact', head: true });
  const { data: images } = await supabase.from('product_images').select('id', { count: 'exact', head: true });

  console.log(`\n✓ Total products in database: ${products?.count || 0}`);
  console.log(`✓ Total images in database: ${images?.count || 0}`);
  console.log('\nData import complete!');
}

importData().catch(console.error);
