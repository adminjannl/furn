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
  console.log('SCRAPING SOFA THUMBNAILS WITH PUPPETEER + SCROLL');
  console.log('═══════════════════════════════════════════════════════════\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  const allSofas = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    console.log('Loading page...');

    await page.goto('https://mnogomebeli.com/divany/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Page loaded, waiting for content...');
    await delay(5000);

    // Debug: Check page content
    const pageContent = await page.content();
    fs.writeFileSync('puppeteer-page.html', pageContent);
    console.log('✓ Saved page HTML to puppeteer-page.html');

    // Try scrolling and clicking "Show More" to load all products
    console.log('\nScrolling and loading products...');

    for (let i = 0; i < 30; i++) {
      // Scroll down
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await delay(2000);

      // Look for and click "Show More" button
      try {
        const showMoreButton = await page.$('.load-more-btn, .show-more, button.js-show-more');
        if (showMoreButton) {
          await showMoreButton.click();
          console.log(`  Clicked "Show More" button (attempt ${i + 1})`);
          await delay(3000);
        } else {
          console.log(`  No more "Show More" button found after ${i + 1} attempts`);
          break;
        }
      } catch (e) {
        console.log(`  Finished loading products after ${i + 1} scrolls`);
        break;
      }
    }

    console.log('\nExtracting product data...');

    // Extract product data
    const products = await page.evaluate(() => {
      const results = [];

      // Get all catalog list items
      const items = document.querySelectorAll('.catalog-list__item');
      console.log(`Found ${items.length} catalog items`);

      items.forEach(item => {
        // Get product div with data attributes
        const productDiv = item.querySelector('.product[data-impression-name]');

        let name = '';
        if (productDiv) {
          name = productDiv.getAttribute('data-impression-name') || '';
        }

        // If no name from data attribute, try other methods
        if (!name) {
          const link = item.querySelector('a[href*="/divany/"]');
          if (link) {
            name = link.getAttribute('title') || link.textContent.trim();
          }
        }

        // Get thumbnail image
        const img = item.querySelector('img');
        let thumbnailUrl = '';

        if (img) {
          thumbnailUrl = img.src ||
                        img.getAttribute('data-src') ||
                        img.getAttribute('data-lazy') ||
                        img.getAttribute('data-original') || '';

          // Clean URL
          if (thumbnailUrl) {
            thumbnailUrl = thumbnailUrl.split('?')[0];

            // Ensure full URL
            if (thumbnailUrl.startsWith('/')) {
              thumbnailUrl = 'https://mnogomebeli.com' + thumbnailUrl;
            }
          }
        }

        if (name && thumbnailUrl && (thumbnailUrl.includes('upload/iblock') || thumbnailUrl.includes('upload/resize_cache'))) {
          results.push({
            name: name.trim(),
            thumbnailUrl
          });
        }
      });

      return results;
    });

    console.log(`✓ Extracted ${products.length} products\n`);

    allSofas.push(...products);

  } finally {
    await browser.close();
  }

  console.log(`\n✓ Scraped ${allSofas.length} sofa thumbnails total\n`);

  // Save for inspection
  fs.writeFileSync('scraped-sofas-puppeteer.json', JSON.stringify(allSofas, null, 2));
  console.log('✓ Saved to scraped-sofas-puppeteer.json\n');

  return allSofas;
}

async function downloadAndHost(scrapedSofas) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('DOWNLOADING AND HOSTING THUMBNAILS');
  console.log('═══════════════════════════════════════════════════════════\n');

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

  // Create mapping - try both exact and fuzzy matching
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

      // Download image
      const imageBuffer = await downloadImage(thumbnailUrl);
      if (!imageBuffer) {
        failed++;
        processed++;
        await delay(200);
        continue;
      }

      // Save to local file
      const ext = path.extname(thumbnailUrl.split('?')[0]) || '.jpg';
      const filename = `${dbSofa.sku}${ext}`;
      const filepath = path.join(thumbsDir, filename);

      fs.writeFileSync(filepath, imageBuffer);

      // Update database - delete old images and add new one
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
    console.log('\n❌ No sofas scraped. Check puppeteer-page.html to debug.');
    return;
  }

  await downloadAndHost(scrapedSofas);
}

main().catch(console.error);
