const fs = require('fs');

// Read the full SQL file
const sql = fs.readFileSync('import-cabinet-images.sql', 'utf-8');

// Extract just the INSERT statements
const lines = sql.split('\n').filter(line => line.trim().startsWith('INSERT') || line.trim().startsWith('SELECT') || line.trim().startsWith('FROM') || line.trim().startsWith('WHERE') || line.trim().startsWith('ON CONFLICT'));

// Remove is_primary column from all statements
const fixedLines = lines.map(line => {
  if (line.includes('is_primary')) {
    return line.replace(/, is_primary\)/, ')').replace(/, (true|false)$/, '');
  }
  return line;
});

// Reconstruct SQL with just 83 insert statements
let fixedSql = `/*
  # Import Cabinet Images

  1. Purpose
    - Add images for all 83 cabinets
    - Each cabinet gets its primary image from mnogomebeli.com

  2. Changes
    - Insert 83 image records into product_images table
    - Link images by matching SKU (CAB-MNM-0001 to CAB-MNM-0083)

  3. Security
    - Uses existing RLS policies on product_images table
*/

`;

// Process in groups of complete INSERT statements
let currentInsert = [];
for (const line of fixedLines) {
  currentInsert.push(line);
  if (line.includes('ON CONFLICT DO NOTHING')) {
    fixedSql += currentInsert.join('\n') + '\n\n';
    currentInsert = [];
  }
}

fs.writeFileSync('cabinet-images-fixed.sql', fixedSql);
console.log('✅ Generated cabinet-images-fixed.sql');
console.log(`📊 Total inserts: ${(fixedSql.match(/INSERT INTO/g) || []).length}`);
