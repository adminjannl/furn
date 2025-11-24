const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchProductDetailPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    return null;
  }
}

function extractFirstImage(html) {
  const $ = cheerio.load(html);

  // Try various selectors for the first product image
  const selectors = [
    '.product-detail-gallery img:first',
    '.product-gallery img:first',
    '.gallery img:first',
    'img[src*="upload/iblock"]:first',
    '.bx-wrapper img:first',
    '.product-slider img:first'
  ];

  for (const selector of selectors) {
    const img = $(selector);
    if (img.length) {
      const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy');
      if (src && src.includes('upload/iblock')) {
        const fullSrc = src.startsWith('http') ? src : `https://mnogomebeli.com${src}`;
        return fullSrc.split('?')[0];
      }
    }
  }

  const allImages = $('img[src*="upload/iblock"]');
  if (allImages.length) {
    const src = $(allImages[0]).attr('src');
    const fullSrc = src.startsWith('http') ? src : `https://mnogomebeli.com${src}`;
    return fullSrc.split('?')[0];
  }

  return null;
}

async function continueProcessing() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('CONTINUING DIMENSION IMAGE PROCESSING');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get sofas that DON'T have images yet or have very few images
  const { data: allSofas } = await supabase
    .from('products')
    .select('id, name, sku')
    .eq('category_id', (await supabase.from('categories').select('id').eq('slug', 'sofas').single()).data.id);

  const { data: sofasWithImages } = await supabase
    .from('product_images')
    .select('product_id')
    .in('product_id', allSofas.map(s => s.id));

  const sofasWithImageIds = new Set(sofasWithImages?.map(img => img.product_id) || []);
  const sofasNeedingImages = allSofas.filter(s => !sofasWithImageIds.has(s.id));

  console.log(`Sofas needing images: ${sofasNeedingImages.length}`);
  console.log(`Sofas with images: ${allSofas.length - sofasNeedingImages.length}\n`);

  // Load URL mapping
  const fs = require('fs');
  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));
  const allVariants = Object.entries(sofaGroups).flatMap(([_, variants]) => variants);
  const urlMap = new Map(allVariants.map(v => [v.name.toLowerCase().trim(), v.url]));

  let processed = 0;
  let updated = 0;
  let failed = 0;

  for (const sofa of sofasNeedingImages) {
    try {
      const normalizedName = sofa.name.toLowerCase().trim();
      const productUrl = urlMap.get(normalizedName);

      if (!productUrl) {
        processed++;
        continue;
      }

      const html = await fetchProductDetailPage(productUrl);
      if (!html) {
        failed++;
        processed++;
        await delay(300);
        continue;
      }

      const firstImageUrl = extractFirstImage(html);
      if (!firstImageUrl) {
        failed++;
        processed++;
        await delay(300);
        continue;
      }

      // Insert the dimension image
      await supabase.from('product_images').insert({
        product_id: sofa.id,
        image_url: firstImageUrl,
        alt_text: `${sofa.name} - Dimensions`,
        display_order: 1
      });

      updated++;
      processed++;

      if (processed % 20 === 0) {
        console.log(`  [${processed}/${sofasNeedingImages.length}] Updated: ${updated}, Failed: ${failed}`);
      }

      await delay(600);

    } catch (error) {
      failed++;
      processed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Processed: ${processed}`);
  console.log(`✓ Updated: ${updated}`);
  console.log(`✓ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════');

  // Final count
  const { count } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .in('product_id', allSofas.map(s => s.id));

  console.log(`\n✓ Total sofa images in database: ${count}`);
}

continueProcessing().catch(console.error);
