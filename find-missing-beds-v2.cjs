const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function findMissingBeds() {
  console.log('🔍 Finding missing beds...\n');

  // Load the complete catalog
  const completeCatalog = JSON.parse(fs.readFileSync('./complete-bed-catalog.json', 'utf8'));
  console.log(`📚 Complete catalog has: ${completeCatalog.length} beds`);

  // Get all beds from database
  const { data: dbBeds, error } = await supabase
    .from('products')
    .select('name, slug')
    .eq('status', 'active')
    .eq('category_id', (await supabase.from('categories').select('id').eq('slug', 'beds').single()).data.id);

  if (error) {
    console.error('❌ Error fetching beds:', error);
    return;
  }

  console.log(`💾 Database has: ${dbBeds.length} beds\n`);

  // Create a simplified version of DB names for matching
  const dbBedNames = dbBeds.map(bed => {
    // Normalize the name for comparison
    return bed.name.toLowerCase()
      .replace(/\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  });

  // Find missing beds
  const missingBeds = [];

  completeCatalog.forEach(catalogBed => {
    const russianName = catalogBed.russianName;

    // Try to translate Russian name to English pattern
    const englishPattern = russianName
      .toLowerCase()
      .replace('кровать', 'bed')
      .replace('босс', 'boss')
      .replace('белла', 'bella')
      .replace('фрея', 'freya')
      .replace('уна', 'una')
      .replace('лео', 'leo')
      .replace('лофт', 'loft')
      .replace('норд', 'nord')
      .replace('ронда', 'ronda')
      .replace('латте', 'latte')
      .replace('мокко', 'mocha')
      .replace('серая', 'gray')
      .replace('серый', 'gray')
      .replace('сталь', 'steel')
      .replace('синяя', 'blue')
      .replace('синий', 'blue')
      .replace('про', 'pro')
      .replace('велюр', 'velvet')
      .replace('дрим', 'dream')
      .replace('мини', 'mini')
      .replace('слим', 'slim')
      .replace('роуз', 'rose')
      .replace('рогожка', 'burlap')
      .replace('агат', 'agate')
      .replace('шампань', 'champagne')
      .replace('пион', 'peony')
      .replace('топаз', 'topaz')
      .replace('таупе', 'taupe')
      .replace('аква', 'aqua')
      .replace('платина', 'platinum')
      .replace('бежевая', 'beige')
      .replace('чёрная', 'black')
      .replace('графит', 'graphite')
      .replace('лаванда', 'lavender')
      .replace(/\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Check if any database bed matches this pattern
    const found = dbBedNames.some(dbName => {
      // Check if the pattern is contained in the DB name
      return dbName.includes(englishPattern.substring(0, 30)) ||
             englishPattern.includes(dbName.substring(0, 30));
    });

    if (!found) {
      missingBeds.push({
        russianName: russianName,
        englishPattern: englishPattern,
        imageUrl: catalogBed.imageUrl,
        productUrl: catalogBed.productUrl
      });
    }
  });

  console.log(`\n❌ Missing beds: ${missingBeds.length}\n`);

  if (missingBeds.length > 0) {
    console.log('📝 Missing beds list:');
    missingBeds.forEach((bed, i) => {
      console.log(`${i + 1}. ${bed.russianName}`);
      console.log(`   Pattern: ${bed.englishPattern}`);
      console.log(`   URL: ${bed.productUrl}\n`);
    });

    // Save to file
    fs.writeFileSync('./missing-beds-list.json', JSON.stringify(missingBeds, null, 2));
    console.log('\n💾 Saved to missing-beds-list.json');
  } else {
    console.log('✅ All beds from catalog are in the database!');
  }

  console.log(`\n📊 Summary:`);
  console.log(`Complete catalog: ${completeCatalog.length} beds`);
  console.log(`In database: ${dbBeds.length} beds`);
  console.log(`Missing: ${missingBeds.length} beds`);
  console.log(`Target: 95 beds`);
  console.log(`Need to add: ${Math.max(0, 95 - dbBeds.length)} more beds`);
}

findMissingBeds().catch(console.error);
