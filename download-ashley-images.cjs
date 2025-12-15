const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ashleyProducts = [
  { sku: 'ASH-SOF-0001', url: 'https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html', code: '3100438' },
  { sku: 'ASH-SOF-0002', url: 'https://www.ashleyfurniture.com/p/altari_sofa/8721338.html', code: '8721338' },
  { sku: 'ASH-SOF-0003', url: 'https://www.ashleyfurniture.com/p/maimz_sofa/3290338.html', code: '3290338' },
  { sku: 'ASH-SOF-0004', url: 'https://www.ashleyfurniture.com/p/whitlock_sofa/2770438.html', code: '2770438' },
  { sku: 'ASH-SOF-0005', url: 'https://www.ashleyfurniture.com/p/larce_2-piece_sectional_with_chaise/50205S5.html', code: '50205S5' },
  { sku: 'ASH-SOF-0006', url: 'https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html', code: '7500538' },
  { sku: 'ASH-SOF-0007', url: 'https://www.ashleyfurniture.com/p/navi_sofa/9400238.html', code: '9400238' },
  { sku: 'ASH-SOF-0008', url: 'https://www.ashleyfurniture.com/p/vayda_sofa/3310438.html', code: '3310438' },
  { sku: 'ASH-SOF-0009', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa_chaise/5950518.html', code: '5950518' },
  { sku: 'ASH-SOF-0010', url: 'https://www.ashleyfurniture.com/p/belvoir_sofa/9230538.html', code: '9230538' },
  { sku: 'ASH-SOF-0011', url: 'https://www.ashleyfurniture.com/p/aviemore_sofa/2430338.html', code: '2430338' },
  { sku: 'ASH-SOF-0012', url: 'https://www.ashleyfurniture.com/p/emilia_3-piece_sectional_sofa/30901S2.html', code: '30901S2' },
  { sku: 'ASH-SOF-0013', url: 'https://www.ashleyfurniture.com/p/simplejoy_sofa/2420338.html', code: '2420338' },
  { sku: 'ASH-SOF-0014', url: 'https://www.ashleyfurniture.com/p/midnight-madness_2-piece_sectional_sofa_with_chaise/98103S2.html', code: '98103S2' },
  { sku: 'ASH-SOF-0015', url: 'https://www.ashleyfurniture.com/p/greaves_sofa_chaise/5510418.html', code: '5510418' },
  { sku: 'ASH-SOF-0016', url: 'https://www.ashleyfurniture.com/p/maggie_sofa/5200338.html', code: '5200338' },
  { sku: 'ASH-SOF-0017', url: 'https://www.ashleyfurniture.com/p/cashton_sofa/4060638.html', code: '4060638' },
  { sku: 'ASH-SOF-0018', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa/5950538.html', code: '5950538' },
  { sku: 'ASH-SOF-0019', url: 'https://www.ashleyfurniture.com/p/leesworth_power_reclining_sofa/U4380887.html', code: 'U4380887' },
  { sku: 'ASH-SOF-0020', url: 'https://www.ashleyfurniture.com/p/tasselton_sofa_chaise/9250418.html', code: '9250418' },
  { sku: 'ASH-SOF-0021', url: 'https://www.ashleyfurniture.com/p/adlai_sofa/3010338.html', code: '3010338' },
  { sku: 'ASH-SOF-0022', url: 'https://www.ashleyfurniture.com/p/modmax_3-piece_sectional_with_chaise/92102S18.html', code: '92102S18' },
  { sku: 'ASH-SOF-0023', url: 'https://www.ashleyfurniture.com/p/belcaro_place_sofa/7970238.html', code: '7970238' },
  { sku: 'ASH-SOF-0024', url: 'https://www.ashleyfurniture.com/p/bixler_sofa/2610638.html', code: '2610638' },
  { sku: 'ASH-SOF-0025', url: 'https://www.ashleyfurniture.com/p/colleton_sofa/5210738.html', code: '5210738' },
  { sku: 'ASH-SOF-0026', url: 'https://www.ashleyfurniture.com/p/lonoke_sofa/5050438.html', code: '5050438' },
  { sku: 'ASH-SOF-0027', url: 'https://www.ashleyfurniture.com/p/elissa_court_3-piece_sectional_sofa/39402S2.html', code: '39402S2' },
  { sku: 'ASH-SOF-0028', url: 'https://www.ashleyfurniture.com/p/bolsena_sofa/5560338.html', code: '5560338' },
  { sku: 'ASH-SOF-0029', url: 'https://www.ashleyfurniture.com/p/stoneland_reclining_sofa/3990588.html', code: '3990588' },
  { sku: 'ASH-SOF-0030', url: 'https://www.ashleyfurniture.com/p/lombardia_sofa/5730338.html', code: '5730338' }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.ashleyfurniture.com/'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function generateImageFilename(sku, index) {
  const hash = crypto.randomBytes(4).toString('hex');
  return `${sku}-${index}-${hash}.jpg`;
}

async function scrapeAndDownloadImages() {
  console.log('Downloading Ashley Furniture product images...\n');

  const outputDir = path.join(__dirname, 'public', 'ashley-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allResults = [];

  for (const product of ashleyProducts) {
    console.log(`\n${product.sku}: Processing...`);

    const { data: dbProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .maybeSingle();

    if (!dbProduct) {
      console.log(`  ✗ Product not found in database`);
      continue;
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', dbProduct.id);

    const imagePatterns = [
      `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}-SW`,
      `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}_10`,
      `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}_20`,
      `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}_30`,
      `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}_40`,
      `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}_50`
    ];

    const downloadedImages = [];

    for (let i = 0; i < imagePatterns.length; i++) {
      const imageUrl = imagePatterns[i];
      const filename = generateImageFilename(product.sku, i + 1);
      const filepath = path.join(outputDir, filename);

      try {
        await downloadImage(imageUrl, filepath);

        const stats = fs.statSync(filepath);
        if (stats.size > 1000) {
          const publicUrl = `/ashley-images/${filename}`;
          downloadedImages.push(publicUrl);
          console.log(`  ✓ Downloaded image ${i + 1} (${Math.round(stats.size / 1024)}KB)`);

          await supabase
            .from('product_images')
            .insert({
              product_id: dbProduct.id,
              image_url: publicUrl,
              display_order: i + 1,
              alt_text: `${product.sku} - View ${i + 1}`
            });
        } else {
          fs.unlinkSync(filepath);
        }
      } catch (error) {
        console.log(`  - Image ${i + 1} not available`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`  ✓ Total images downloaded: ${downloadedImages.length}`);

    allResults.push({
      sku: product.sku,
      imageCount: downloadedImages.length,
      images: downloadedImages
    });
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Download Complete!');
  console.log('='.repeat(60));
  console.log(`Total products processed: ${allResults.length}`);
  console.log(`Total images downloaded: ${allResults.reduce((sum, r) => sum + r.imageCount, 0)}`);
  console.log('='.repeat(60));

  fs.writeFileSync(
    'ashley-images-downloaded.json',
    JSON.stringify(allResults, null, 2)
  );
}

scrapeAndDownloadImages().catch(console.error);
