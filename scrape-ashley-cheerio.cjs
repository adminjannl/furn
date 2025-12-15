const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ashleyProducts = [
  { sku: 'ASH-SOF-0001', url: 'https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html', name: 'Mahoney Sofa' },
  { sku: 'ASH-SOF-0002', url: 'https://www.ashleyfurniture.com/p/altari_sofa/8721338.html', name: 'Altari Sofa' },
  { sku: 'ASH-SOF-0003', url: 'https://www.ashleyfurniture.com/p/maimz_sofa/3290338.html', name: 'Maimz Sofa' },
  { sku: 'ASH-SOF-0004', url: 'https://www.ashleyfurniture.com/p/whitlock_sofa/2770438.html', name: 'Whitlock Sofa' },
  { sku: 'ASH-SOF-0005', url: 'https://www.ashleyfurniture.com/p/larce_2-piece_sectional_with_chaise/50205S5.html', name: 'Larce Sofa Chaise' },
  { sku: 'ASH-SOF-0006', url: 'https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html', name: 'Darcy Sofa' },
  { sku: 'ASH-SOF-0007', url: 'https://www.ashleyfurniture.com/p/navi_sofa/9400238.html', name: 'Navi Sofa' },
  { sku: 'ASH-SOF-0008', url: 'https://www.ashleyfurniture.com/p/vayda_sofa/3310438.html', name: 'Vayda Sofa' },
  { sku: 'ASH-SOF-0009', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa_chaise/5950518.html', name: 'Stonemeade Sofa Chaise' },
  { sku: 'ASH-SOF-0010', url: 'https://www.ashleyfurniture.com/p/belvoir_sofa/9230538.html', name: 'Belvoir Sofa' },
  { sku: 'ASH-SOF-0011', url: 'https://www.ashleyfurniture.com/p/aviemore_sofa/2430338.html', name: 'Aviemore Sofa' },
  { sku: 'ASH-SOF-0012', url: 'https://www.ashleyfurniture.com/p/emilia_3-piece_sectional_sofa/30901S2.html', name: 'Emilia Modular Sofa' },
  { sku: 'ASH-SOF-0013', url: 'https://www.ashleyfurniture.com/p/simplejoy_sofa/2420338.html', name: 'SimpleJoy Sofa' },
  { sku: 'ASH-SOF-0014', url: 'https://www.ashleyfurniture.com/p/midnight-madness_2-piece_sectional_sofa_with_chaise/98103S2.html', name: 'Midnight-Madness Sofa' },
  { sku: 'ASH-SOF-0015', url: 'https://www.ashleyfurniture.com/p/greaves_sofa_chaise/5510418.html', name: 'Greaves Sofa Chaise' },
  { sku: 'ASH-SOF-0016', url: 'https://www.ashleyfurniture.com/p/maggie_sofa/5200338.html', name: 'Maggie Sofa' },
  { sku: 'ASH-SOF-0017', url: 'https://www.ashleyfurniture.com/p/cashton_sofa/4060638.html', name: 'Cashton Sofa' },
  { sku: 'ASH-SOF-0018', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa/5950538.html', name: 'Stonemeade Sofa' },
  { sku: 'ASH-SOF-0019', url: 'https://www.ashleyfurniture.com/p/leesworth_power_reclining_sofa/U4380887.html', name: 'Leesworth Reclining Sofa' },
  { sku: 'ASH-SOF-0020', url: 'https://www.ashleyfurniture.com/p/tasselton_sofa_chaise/9250418.html', name: 'Tasselton Sofa Chaise' },
  { sku: 'ASH-SOF-0021', url: 'https://www.ashleyfurniture.com/p/adlai_sofa/3010338.html', name: 'Adlai Sofa' },
  { sku: 'ASH-SOF-0022', url: 'https://www.ashleyfurniture.com/p/modmax_3-piece_sectional_with_chaise/92102S18.html', name: 'Modmax Modular Sofa' },
  { sku: 'ASH-SOF-0023', url: 'https://www.ashleyfurniture.com/p/belcaro_place_sofa/7970238.html', name: 'Belcaro Place Sofa' },
  { sku: 'ASH-SOF-0024', url: 'https://www.ashleyfurniture.com/p/bixler_sofa/2610638.html', name: 'Bixler Sofa' },
  { sku: 'ASH-SOF-0025', url: 'https://www.ashleyfurniture.com/p/colleton_sofa/5210738.html', name: 'Colleton Leather Sofa' },
  { sku: 'ASH-SOF-0026', url: 'https://www.ashleyfurniture.com/p/lonoke_sofa/5050438.html', name: 'Lonoke Sofa' },
  { sku: 'ASH-SOF-0027', url: 'https://www.ashleyfurniture.com/p/elissa_court_3-piece_sectional_sofa/39402S2.html', name: 'Elissa Court Modular Sofa' },
  { sku: 'ASH-SOF-0028', url: 'https://www.ashleyfurniture.com/p/bolsena_sofa/5560338.html', name: 'Bolsena Leather Sofa' },
  { sku: 'ASH-SOF-0029', url: 'https://www.ashleyfurniture.com/p/stoneland_reclining_sofa/3990588.html', name: 'Stoneland Reclining Sofa' },
  { sku: 'ASH-SOF-0030', url: 'https://www.ashleyfurniture.com/p/lombardia_sofa/5730338.html', name: 'Lombardia Leather Sofa' }
];

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.ashleyfurniture.com/'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.text();
}

function extractImagesFromHTML(html, sku) {
  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();

  $('img').each((idx, elem) => {
    const src = $(elem).attr('src');
    const dataSrc = $(elem).attr('data-src');
    const dataZoom = $(elem).attr('data-zoom-image');
    const alt = $(elem).attr('alt') || '';

    [src, dataSrc, dataZoom].forEach(url => {
      if (url && url.includes('scene7.com') && !url.includes('icon') && !url.includes('logo')) {
        const cleanUrl = url.split('?')[0] + '?$AFHS-PDP-Main$';

        if (!seen.has(cleanUrl)) {
          seen.add(cleanUrl);
          images.push({
            url: cleanUrl,
            alt: alt || `${sku} View ${images.length + 1}`
          });
        }
      }
    });
  });

  $('[data-zoom-image], [data-large-image]').each((idx, elem) => {
    const url = $(elem).attr('data-zoom-image') || $(elem).attr('data-large-image');
    if (url && url.includes('scene7.com')) {
      const cleanUrl = url.split('?')[0] + '?$AFHS-PDP-Main$';
      if (!seen.has(cleanUrl)) {
        seen.add(cleanUrl);
        images.push({
          url: cleanUrl,
          alt: `${sku} View ${images.length + 1}`
        });
      }
    }
  });

  return images;
}

async function scrapeProduct(product) {
  console.log(`\n${product.sku} - ${product.name}`);

  try {
    const html = await fetchPage(product.url);
    const images = extractImagesFromHTML(html, product.sku);

    console.log(`  ✓ Found ${images.length} images`);
    images.forEach((img, idx) => {
      console.log(`    ${idx + 1}. ${img.url.substring(50, 100)}`);
    });

    return {
      ...product,
      images,
      success: true
    };

  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return {
      ...product,
      images: [],
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('Starting Ashley Furniture Image Scraper with Cheerio...\n');
  console.log('='.repeat(60));

  const results = [];

  for (const product of ashleyProducts) {
    const result = await scrapeProduct(product);
    results.push(result);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Scraping Complete!');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const totalImages = results.reduce((sum, r) => sum + r.images.length, 0);

  console.log(`Products scraped: ${successful}/${results.length}`);
  console.log(`Total images found: ${totalImages}`);

  fs.writeFileSync(
    'ashley-real-images-scraped.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\nResults saved to ashley-real-images-scraped.json');
  console.log('='.repeat(60));

  return results;
}

main().catch(console.error);
