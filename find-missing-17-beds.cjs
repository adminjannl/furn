const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function normalizeForComparison(name) {
  return name
    .toLowerCase()
    .replace(/[*×x]/g, '')
    .replace(/кровать\s+/i, '')
    .replace(/bed\s+/i, '')
    .replace(/\s+/g, '')
    .trim();
}

async function findMissing17Beds() {
  console.log('🔍 Finding the missing 17 beds...\n');

  const { data: dbProducts } = await supabase
    .from('products')
    .select('name, original_name')
    .order('created_at');

  const jsonBeds = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'complete-bed-catalog.json'), 'utf-8')
  );

  console.log(`📊 Database: ${dbProducts.length} beds`);
  console.log(`📊 JSON file: ${jsonBeds.length} beds`);
  console.log(`📊 Target: 95 beds`);
  console.log(`📊 Gap: ${95 - dbProducts.length} beds\n`);

  const dbNormalized = new Set(
    dbProducts.map(p => normalizeForComparison(p.original_name || p.name))
  );

  const missingFromDb = jsonBeds.filter(bed => {
    const normalized = normalizeForComparison(bed.russianName);
    return !dbNormalized.has(normalized);
  });

  console.log('📋 Beds in JSON but NOT in Database:\n');
  missingFromDb.forEach((bed, i) => {
    console.log(`${i + 1}. ${bed.russianName}`);
    console.log(`   URL: ${bed.productUrl}`);
    console.log(`   Image: ${bed.imageUrl}`);
    console.log();
  });

  const jsonNormalized = new Set(
    jsonBeds.map(bed => normalizeForComparison(bed.russianName))
  );

  const inDbNotInJson = dbProducts.filter(p => {
    const normalized = normalizeForComparison(p.original_name || p.name);
    return !jsonNormalized.has(normalized);
  });

  console.log(`\n📋 Beds in Database but NOT in JSON (${inDbNotInJson.length}):\n`);
  inDbNotInJson.slice(0, 20).forEach((bed, i) => {
    console.log(`${i + 1}. ${bed.original_name || bed.name}`);
  });

  if (inDbNotInJson.length > 20) {
    console.log(`   ... and ${inDbNotInJson.length - 20} more`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 ANALYSIS:\n');
  console.log(`   • You have ${dbProducts.length} beds in the database`);
  console.log(`   • The website shows only 45 beds initially (in JSON)`);
  console.log(`   • The website claims to have 95 total beds`);
  console.log(`   • Missing: ${95 - dbProducts.length} beds\n`);

  console.log('📝 NEXT STEPS TO GET ALL 95 BEDS:\n');
  console.log('   1. The website uses JavaScript pagination/lazy loading');
  console.log('   2. Initial page load shows only ~45 beds');
  console.log('   3. More beds load when scrolling or clicking "Show More"');
  console.log('   4. Options to get remaining beds:');
  console.log('      a) Manual: Browse website and note missing bed names');
  console.log('      b) Technical: Use browser DevTools to capture AJAX requests');
  console.log('      c) Automated: Use Playwright/Puppeteer with full browser install');
  console.log('      d) API: Check if site has a product API endpoint\n');

  console.log('🌐 INVESTIGATION STEPS:\n');
  console.log('   1. Visit: https://mnogomebeli.com/krovati/');
  console.log('   2. Open Browser DevTools (F12) → Network tab');
  console.log('   3. Scroll down or click "Show More" button');
  console.log('   4. Look for XHR/Fetch requests loading product data');
  console.log('   5. Copy the API endpoint URL');
  console.log('   6. We can then scrape that endpoint directly\n');

  const report = {
    database: {
      count: dbProducts.length,
      samples: dbProducts.slice(0, 5).map(p => p.original_name || p.name)
    },
    json: {
      count: jsonBeds.length,
      samples: jsonBeds.slice(0, 5).map(b => b.russianName)
    },
    gaps: {
      toTarget: 95 - dbProducts.length,
      missingFromDb: missingFromDb.length,
      inDbNotInJson: inDbNotInJson.length
    },
    missingBeds: missingFromDb.map(b => ({
      name: b.russianName,
      url: b.productUrl,
      image: b.imageUrl
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'missing-beds-analysis.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('💾 Detailed analysis saved to: missing-beds-analysis.json\n');

  return report;
}

findMissing17Beds()
  .then(() => {
    console.log('✅ Analysis complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
