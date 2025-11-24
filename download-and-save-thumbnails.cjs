const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('DOWNLOADING SOFA THUMBNAILS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Load sofa groups
  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));
  const allVariants = Object.entries(sofaGroups).flatMap(([_, variants]) => variants);

  console.log(`Loaded ${allVariants.length} sofa variants with URLs and images\n`);

  // Create thumbnails directory
  const thumbsDir = path.join(__dirname, 'public', 'sofa-thumbnails');
  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
  }

  // Get database sofas
  const { data: dbSofas } = await supabase
    .from('products')
    .select('id, name, sku')
    .eq('category_id', (await supabase.from('categories').select('id').eq('slug', 'sofas').single()).data.id);

  console.log(`Database has ${dbSofas.length} sofas\n`);

  // Create mapping
  const variantMap = new Map();
  allVariants.forEach(v => {
    const normalizedName = v.name.toLowerCase().trim();
    variantMap.set(normalizedName, v);
  });

  console.log('Processing sofas...\n');

  let processed = 0;
  let downloaded = 0;
  let failed = 0;
  let notFound = 0;

  const mapping = []; // Store SKU to local file mapping

  for (const dbSofa of dbSofas) {
    try {
      const normalizedName = dbSofa.name.toLowerCase().trim();
      const variant = variantMap.get(normalizedName);

      if (!variant || !variant.image) {
        notFound++;
        processed++;
        continue;
      }

      // Ensure full URL
      let imageUrl = variant.image;
      if (!imageUrl.startsWith('http')) {
        imageUrl = `https://mnogomebeli.com${imageUrl}`;
      }

      // Download image
      const imageBuffer = await downloadImage(imageUrl);
      if (!imageBuffer) {
        failed++;
        processed++;
        await delay(300);
        continue;
      }

      // Save to local file
      const ext = path.extname(imageUrl.split('?')[0]) || '.jpg';
      const filename = `${dbSofa.sku}${ext}`;
      const filepath = path.join(thumbsDir, filename);

      fs.writeFileSync(filepath, imageBuffer);

      mapping.push({
        sku: dbSofa.sku,
        productId: dbSofa.id,
        name: dbSofa.name,
        localPath: `/sofa-thumbnails/${filename}`,
        originalUrl: imageUrl
      });

      downloaded++;
      processed++;

      if (processed % 50 === 0) {
        console.log(`  [${processed}/${dbSofas.length}] Downloaded: ${downloaded}, Failed: ${failed}, Not found: ${notFound}`);
      }

      await delay(300);

    } catch (error) {
      console.error(`Error processing ${dbSofa.name}:`, error.message);
      failed++;
      processed++;
    }
  }

  // Save mapping
  fs.writeFileSync('thumbnail-mapping.json', JSON.stringify(mapping, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Total sofas: ${dbSofas.length}`);
  console.log(`✓ Processed: ${processed}`);
  console.log(`✓ Downloaded: ${downloaded}`);
  console.log(`✓ Failed: ${failed}`);
  console.log(`✓ Not found: ${notFound}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n✓ Thumbnails saved to: ${thumbsDir}`);
  console.log(`✓ Mapping saved to: thumbnail-mapping.json`);
}

main().catch(console.error);
