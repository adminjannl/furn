const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const productUrls = [
  { sku: 'ASH-SOF-0001', url: 'https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html' },
  { sku: 'ASH-SOF-0002', url: 'https://www.ashleyfurniture.com/p/altari_sofa/8721338.html' },
  { sku: 'ASH-SOF-0003', url: 'https://www.ashleyfurniture.com/p/maimz_sofa/3290338.html' },
  { sku: 'ASH-SOF-0004', url: 'https://www.ashleyfurniture.com/p/whitlock_sofa/2770438.html' },
  { sku: 'ASH-SOF-0005', url: 'https://www.ashleyfurniture.com/p/larce_2-piece_sectional_with_chaise/50205S5.html' },
  { sku: 'ASH-SOF-0006', url: 'https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html' },
  { sku: 'ASH-SOF-0007', url: 'https://www.ashleyfurniture.com/p/navi_sofa/9400238.html' },
  { sku: 'ASH-SOF-0008', url: 'https://www.ashleyfurniture.com/p/vayda_sofa/3310438.html' },
  { sku: 'ASH-SOF-0009', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa_chaise/5950518.html' },
  { sku: 'ASH-SOF-0010', url: 'https://www.ashleyfurniture.com/p/belvoir_sofa/9230538.html' },
  { sku: 'ASH-SOF-0011', url: 'https://www.ashleyfurniture.com/p/aviemore_sofa/2430338.html' },
  { sku: 'ASH-SOF-0012', url: 'https://www.ashleyfurniture.com/p/emilia_3-piece_sectional_sofa/30901S2.html' },
  { sku: 'ASH-SOF-0013', url: 'https://www.ashleyfurniture.com/p/simplejoy_sofa/2420338.html' },
  { sku: 'ASH-SOF-0014', url: 'https://www.ashleyfurniture.com/p/midnight-madness_2-piece_sectional_sofa_with_chaise/98103S2.html' },
  { sku: 'ASH-SOF-0015', url: 'https://www.ashleyfurniture.com/p/greaves_sofa_chaise/5510418.html' },
  { sku: 'ASH-SOF-0016', url: 'https://www.ashleyfurniture.com/p/maggie_sofa/5200338.html' },
  { sku: 'ASH-SOF-0017', url: 'https://www.ashleyfurniture.com/p/cashton_sofa/4060638.html' },
  { sku: 'ASH-SOF-0018', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa/5950538.html' },
  { sku: 'ASH-SOF-0019', url: 'https://www.ashleyfurniture.com/p/leesworth_power_reclining_sofa/U4380887.html' },
  { sku: 'ASH-SOF-0020', url: 'https://www.ashleyfurniture.com/p/tasselton_sofa_chaise/9250418.html' },
  { sku: 'ASH-SOF-0021', url: 'https://www.ashleyfurniture.com/p/adlai_sofa/3010338.html' },
  { sku: 'ASH-SOF-0022', url: 'https://www.ashleyfurniture.com/p/modmax_3-piece_sectional_with_chaise/92102S18.html' },
  { sku: 'ASH-SOF-0023', url: 'https://www.ashleyfurniture.com/p/belcaro_place_sofa/7970238.html' },
  { sku: 'ASH-SOF-0024', url: 'https://www.ashleyfurniture.com/p/bixler_sofa/2610638.html' },
  { sku: 'ASH-SOF-0025', url: 'https://www.ashleyfurniture.com/p/colleton_sofa/5210738.html' },
  { sku: 'ASH-SOF-0026', url: 'https://www.ashleyfurniture.com/p/lonoke_sofa/5050438.html' },
  { sku: 'ASH-SOF-0027', url: 'https://www.ashleyfurniture.com/p/elissa_court_3-piece_sectional_sofa/39402S2.html' },
  { sku: 'ASH-SOF-0028', url: 'https://www.ashleyfurniture.com/p/bolsena_sofa/5560338.html' },
  { sku: 'ASH-SOF-0029', url: 'https://www.ashleyfurniture.com/p/stoneland_reclining_sofa/3990588.html' },
  { sku: 'ASH-SOF-0030', url: 'https://www.ashleyfurniture.com/p/lombardia_sofa/5730338.html' }
];

async function scrapeProductImages(page, url, sku) {
  try {
    console.log(`\n${sku}: Loading ${url}`);

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    await page.waitForSelector('img', { timeout: 10000 });

    const imageData = await page.evaluate(() => {
      const images = [];
      const colorVariants = [];

      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.dataset.src || img.dataset.lazy;
        if (src &&
            (src.includes('ashleyfurniture') || src.includes('cloudinary') || src.includes('afhs')) &&
            !src.includes('logo') &&
            !src.includes('icon') &&
            !src.includes('badge') &&
            src.match(/\.(jpg|jpeg|png|webp)/i)) {

          const alt = img.alt || '';
          const parentText = img.closest('[class*="swatch"], [class*="color"]')?.textContent || '';

          images.push({
            url: src,
            alt: alt,
            context: parentText
          });
        }
      });

      document.querySelectorAll('[class*="color"], [class*="swatch"], button[aria-label*="color"]').forEach(elem => {
        const text = elem.textContent.trim() || elem.getAttribute('aria-label') || elem.getAttribute('title') || '';
        if (text && text.length < 50) {
          colorVariants.push(text);
        }
      });

      const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
      let productName = '';
      ldJsonScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data.name) productName = data.name;
        } catch (e) {}
      });

      if (!productName) {
        productName = document.querySelector('h1')?.textContent.trim() || '';
      }

      return {
        productName,
        images: images.slice(0, 20),
        colorVariants: [...new Set(colorVariants)]
      };
    });

    console.log(`  ✓ Product: ${imageData.productName}`);
    console.log(`  ✓ Found ${imageData.images.length} images`);
    console.log(`  ✓ Found ${imageData.colorVariants.length} color contexts`);

    return imageData;

  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Starting real image scraping with Puppeteer...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const results = [];

  for (const product of productUrls) {
    const data = await scrapeProductImages(page, product.url, product.sku);
    if (data) {
      results.push({
        sku: product.sku,
        ...data
      });
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  await browser.close();

  console.log(`\n${'='.repeat(60)}`);
  console.log('SCRAPING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total products scraped: ${results.length}`);
  console.log('='.repeat(60));

  const fs = require('fs');
  fs.writeFileSync(
    'ashley-real-images.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n✓ Saved to ashley-real-images.json');

  console.log('\nUpdating database...');

  for (const result of results) {
    const { data: product } = await supabase
      .from('products')
      .select('id, name')
      .eq('sku', result.sku)
      .maybeSingle();

    if (!product) continue;

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id);

    for (let i = 0; i < Math.min(result.images.length, 8); i++) {
      const img = result.images[i];
      await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: img.url,
          display_order: i + 1,
          alt_text: img.alt || `${product.name} - Image ${i + 1}`
        });
    }

    console.log(`✓ ${result.sku}: Updated ${Math.min(result.images.length, 8)} images`);
  }

  console.log('\n✅ Database update complete!');
}

main().catch(console.error);
