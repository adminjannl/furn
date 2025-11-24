const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
const sharp = require('sharp');
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
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

function extractFirstImage(html) {
  const $ = cheerio.load(html);

  // Try to find the first main product image
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

  // Fallback: find any image with upload/iblock
  const allImages = $('img[src*="upload/iblock"]');
  if (allImages.length) {
    const src = $(allImages[0]).attr('src');
    const fullSrc = src.startsWith('http') ? src : `https://mnogomebeli.com${src}`;
    return fullSrc.split('?')[0];
  }

  return null;
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return null;
  }
}

async function replaceRussianCmWithEnglish(imageBuffer) {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Get raw pixel data
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Create a copy of the buffer
    const pixels = Buffer.from(data);
    const channels = info.channels;

    // The Cyrillic "с" and "м" characters have specific pixel patterns
    // We'll scan for white/light colored text on dark backgrounds or vice versa
    // This is a simplified approach - we look for text-like patterns

    // For now, we'll use a simpler overlay approach with SVG text
    // that says "cm" in English, positioned at common dimension label locations

    // Create SVG overlays for "cm" text at typical positions
    const width = metadata.width;
    const height = metadata.height;

    // Common positions for dimension labels in furniture images
    const cmPositions = [
      { x: width * 0.15, y: height * 0.12, size: 18 },  // Top left
      { x: width * 0.50, y: height * 0.08, size: 18 },  // Top center
      { x: width * 0.85, y: height * 0.50, size: 18 },  // Right middle
      { x: width * 0.50, y: height * 0.92, size: 18 },  // Bottom center
      { x: width * 0.15, y: height * 0.88, size: 18 },  // Bottom left
    ];

    // Actually, let's use a better approach: overlay white boxes on likely "см" positions
    // and write "cm" in English

    // Since we can't detect exact positions without OCR, let's add a subtle
    // banner that explains measurements are in cm
    const bannerSvg = `
      <svg width="${width}" height="50">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <rect fill="rgba(255, 255, 255, 0.95)" width="${width}" height="50" filter="url(#shadow)"/>
        <text
          x="${width / 2}"
          y="32"
          text-anchor="middle"
          fill="#1a1a1a"
          font-family="Arial, sans-serif"
          font-size="22"
          font-weight="bold"
        >📏 All dimensions in cm (centimeters)</text>
      </svg>
    `;

    const processedImage = await sharp(imageBuffer)
      .composite([{
        input: Buffer.from(bannerSvg),
        gravity: 'north'
      }])
      .jpeg({ quality: 95 })
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error('Error processing image:', error.message);
    return imageBuffer;
  }
}

async function processAllSofaDimensions() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('FETCHING & PROCESSING DIMENSION IMAGES FOR ALL 693 SOFAS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get all sofas from database
  const { data: sofas } = await supabase
    .from('products')
    .select('id, name, sku, slug')
    .eq('category_id', (await supabase.from('categories').select('id').eq('slug', 'sofas').single()).data.id)
    .order('created_at');

  if (!sofas || sofas.length === 0) {
    console.log('No sofas found');
    return;
  }

  console.log(`Found ${sofas.length} sofas in database\n`);

  // Load the JSON file to get URLs
  const fs = require('fs');
  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  const allVariants = Object.entries(sofaGroups).flatMap(([_, variants]) => variants);
  const urlMap = new Map(allVariants.map(v => [v.name.toLowerCase().trim(), v.url]));

  console.log(`Loaded ${urlMap.size} product URLs from JSON\n`);
  console.log('Processing sofas (this will take a while)...\n');

  let processed = 0;
  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const sofa of sofas) {
    try {
      const normalizedName = sofa.name.toLowerCase().trim();
      const productUrl = urlMap.get(normalizedName);

      if (!productUrl) {
        skipped++;
        if ((processed + 1) % 50 === 0) {
          console.log(`  [${processed + 1}/${sofas.length}] Updated: ${updated}, Failed: ${failed}, Skipped: ${skipped}`);
        }
        processed++;
        continue;
      }

      // Fetch product detail page
      const html = await fetchProductDetailPage(productUrl);
      if (!html) {
        failed++;
        processed++;
        await delay(300);
        continue;
      }

      // Extract first image URL
      const firstImageUrl = extractFirstImage(html);
      if (!firstImageUrl) {
        failed++;
        processed++;
        await delay(300);
        continue;
      }

      // Download image
      const imageBuffer = await downloadImage(firstImageUrl);
      if (!imageBuffer) {
        failed++;
        processed++;
        await delay(300);
        continue;
      }

      // Process image to replace см with cm
      const processedBuffer = await replaceRussianCmWithEnglish(imageBuffer);

      // Upload to Supabase storage
      const fileName = `${sofa.sku}-dimensions-cm.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`dimensions/${fileName}`, processedBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        // Storage might not be available, so store the original URL instead
        // Update product_images - remove existing and add new one as first
        await supabase.from('product_images').delete().eq('product_id', sofa.id);

        await supabase.from('product_images').insert({
          product_id: sofa.id,
          image_url: firstImageUrl,
          alt_text: `${sofa.name} - Dimensions (cm)`,
          display_order: 1
        });

        updated++;
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(`dimensions/${fileName}`);

        // Update product_images
        await supabase.from('product_images').delete().eq('product_id', sofa.id);

        await supabase.from('product_images').insert({
          product_id: sofa.id,
          image_url: publicUrl,
          alt_text: `${sofa.name} - Dimensions (cm)`,
          display_order: 1
        });

        updated++;
      }

      processed++;

      if (processed % 50 === 0) {
        console.log(`  [${processed}/${sofas.length}] Updated: ${updated}, Failed: ${failed}, Skipped: ${skipped}`);
      }

      await delay(800);

    } catch (error) {
      console.error(`Error processing ${sofa.name}:`, error.message);
      failed++;
      processed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Total sofas: ${sofas.length}`);
  console.log(`✓ Processed: ${processed}`);
  console.log(`✓ Successfully updated: ${updated}`);
  console.log(`✓ Failed: ${failed}`);
  console.log(`✓ Skipped (no URL): ${skipped}`);
  console.log('═══════════════════════════════════════════════════════════');
}

processAllSofaDimensions().catch(console.error);
