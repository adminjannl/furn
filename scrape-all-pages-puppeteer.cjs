const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer');
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

async function scrapeWithPuppeteer() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('SCRAPING ALL SOFA PAGES WITH PUPPETEER');
  console.log('═══════════════════════════════════════════════════════════\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const allSofas = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Calculate pages: 693 sofas / ~25 per page = ~28 pages
    const maxPages = 35;

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = pageNum === 1
        ? 'https://mnogomebeli.com/divany/'
        : `https://mnogomebeli.com/divany/?PAGEN_1=${pageNum}`;

      console.log(`Loading page ${pageNum}...`);

      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        await delay(2000);

        // Extract products from this page
        const products = await page.evaluate(() => {
          const results = [];
          const items = document.querySelectorAll('.catalog-list__item');

          items.forEach(item => {
            const productDiv = item.querySelector('.product[data-impression-name]');
            let name = '';
            if (productDiv) {
              name = productDiv.getAttribute('data-impression-name') || '';
            }

            const img = item.querySelector('img');
            let thumbnailUrl = '';

            if (img) {
              thumbnailUrl = img.src ||
                            img.getAttribute('data-src') ||
                            img.getAttribute('data-lazy') ||
                            img.getAttribute('data-original') || '';

              if (thumbnailUrl) {
                thumbnailUrl = thumbnailUrl.split('?')[0];
                if (thumbnailUrl.startsWith('/')) {
                  thumbnailUrl = 'https://mnogomebeli.com' + thumbnailUrl;
                }
              }
            }

            if (name && thumbnailUrl && (thumbnailUrl.includes('upload/iblock') || thumbnailUrl.includes('upload/resize_cache'))) {
              results.push({ name: name.trim(), thumbnailUrl });
            }
          });

          return results;
        });

        if (products.length === 0) {
          console.log(`  No products on page ${pageNum}, stopping`);
          break;
        }

        console.log(`  Found ${products.length} products`);
        allSofas.push(...products);
        console.log(`  Total so far: ${allSofas.length}`);

        await delay(1500);

      } catch (error) {
        console.error(`Error on page ${pageNum}:`, error.message);
        break;
      }
    }

  } finally {
    await browser.close();
  }

  console.log(`\n✓ Scraped ${allSofas.length} sofa thumbnails total\n`);

  fs.writeFileSync('all-sofa-thumbnails.json', JSON.stringify(allSofas, null, 2));
  console.log('✓ Saved to all-sofa-thumbnails.json\n');

  return allSofas;
}

async function downloadAndHost(scrapedSofas) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('DOWNLOADING AND HOSTING THUMBNAILS');
  console.log('═══════════════════════════════════════════════════════════\n');

  const thumbsDir = path.join(__dirname, 'public', 'sofa-thumbnails');
  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
  }

  const { data: dbSofas } = await supabase
    .from('products')
    .select('id, name, sku')
    .eq('category_id', (await supabase.from('categories').select('id').eq('slug', 'sofas').single()).data.id);

  console.log(`Database has ${dbSofas.length} sofas\n`);

  // Create mapping
  const thumbnailMap = new Map();
  scrapedSofas.forEach(s => {
    const normalizedName = s.name.toLowerCase().trim();
    thumbnailMap.set(normalizedName, s.thumbnailUrl);
  });

  console.log('Processing sofas...\n');

  let processed = 0;
  let hosted = 0;
  let failed = 0;
  let notFound = 0;

  for (const dbSofa of dbSofas) {
    try {
      const normalizedName = dbSofa.name.toLowerCase().trim();
      const thumbnailUrl = thumbnailMap.get(normalizedName);

      if (!thumbnailUrl) {
        notFound++;
        processed++;
        continue;
      }

      const imageBuffer = await downloadImage(thumbnailUrl);
      if (!imageBuffer) {
        failed++;
        processed++;
        await delay(200);
        continue;
      }

      const ext = path.extname(thumbnailUrl.split('?')[0]) || '.jpg';
      const filename = `${dbSofa.sku}${ext}`;
      const filepath = path.join(thumbsDir, filename);

      fs.writeFileSync(filepath, imageBuffer);

      // Delete old images and insert new one
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', dbSofa.id);

      await supabase
        .from('product_images')
        .insert({
          product_id: dbSofa.id,
          image_url: `/sofa-thumbnails/${filename}`,
          alt_text: dbSofa.name,
          display_order: 0
        });

      hosted++;
      processed++;

      if (processed % 50 === 0) {
        console.log(`  [${processed}/${dbSofas.length}] Hosted: ${hosted}, Failed: ${failed}, Not found: ${notFound}`);
      }

      await delay(200);

    } catch (error) {
      console.error(`Error:`, error.message);
      failed++;
      processed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Total sofas: ${dbSofas.length}`);
  console.log(`✓ Processed: ${processed}`);
  console.log(`✓ Successfully hosted: ${hosted}`);
  console.log(`✓ Failed: ${failed}`);
  console.log(`✓ Not found: ${notFound}`);
  console.log('═══════════════════════════════════════════════════════════');
}

async function main() {
  const scrapedSofas = await scrapeWithPuppeteer();

  if (scrapedSofas.length === 0) {
    console.log('\n❌ No sofas scraped');
    return;
  }

  await downloadAndHost(scrapedSofas);
}

main().catch(console.error);
