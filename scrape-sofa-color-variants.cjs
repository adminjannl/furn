const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function scrapeColorVariants() {
  console.log('\n🎨 Scraping sofa color variants...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Get all sofas from database
  const { data: sofas } = await supabase
    .from('products')
    .select('id, name, slug, source_url, source_name_russian')
    .like('source_url', '%divany%')
    .order('id');

  console.log(`Found ${sofas.length} sofas in database\n`);

  const variantGroups = {};
  let processed = 0;

  for (const sofa of sofas) {
    processed++;
    process.stdout.write(`\r[${processed}/${sofas.length}] ${sofa.name.substring(0, 50).padEnd(50)}`);

    try {
      await page.goto(sofa.source_url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(1000);

      // Look for color variant buttons on the page
      const variants = await page.evaluate(() => {
        const colorButtons = [];

        // Try different selectors for color variants
        const selectors = [
          'a[href*="!"]',  // Color variants usually have ! in URL
          '.color-variant',
          '.product-variant',
          'a.variant-link'
        ];

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const href = el.getAttribute('href');
            const title = el.getAttribute('title') || el.textContent?.trim();

            if (href && href.includes('!')) {
              colorButtons.push({
                url: href.startsWith('http') ? href : 'https://mnogomebeli.com' + href,
                title: title || ''
              });
            }
          });

          if (colorButtons.length > 0) break;
        }

        return colorButtons;
      });

      if (variants.length > 0) {
        // Group products by base URL (without the ! variant part)
        const baseUrl = sofa.source_url.split('/!')[0];

        if (!variantGroups[baseUrl]) {
          variantGroups[baseUrl] = [];
        }

        variantGroups[baseUrl].push({
          id: sofa.id,
          slug: sofa.slug,
          name: sofa.name,
          url: sofa.source_url,
          variants: variants
        });
      }

      await page.waitForTimeout(200);
    } catch (error) {
      // Skip errors, move to next
    }
  }

  await browser.close();

  console.log('\n\n✅ Scraping complete!');
  console.log(`Found ${Object.keys(variantGroups).length} product groups with color variants\n`);

  // Save results
  fs.writeFileSync('sofa-variant-groups.json', JSON.stringify(variantGroups, null, 2));
  console.log('Results saved to sofa-variant-groups.json');

  return variantGroups;
}

scrapeColorVariants().catch(console.error);
