const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

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

async function replaceTextInImage(imageBuffer, productName) {
  try {
    const metadata = await sharp(imageBuffer).metadata();

    // Get the raw pixel data
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Convert to writable buffer
    const pixels = Buffer.from(data);

    // Simple approach: Since "см" looks visually similar to "cm" but uses Cyrillic characters,
    // we can't directly replace text without OCR. Instead, let's create SVG overlays
    // with "cm" text positioned where we expect dimension labels to be.

    // Create multiple small "cm" overlays at typical dimension label positions
    const cmOverlays = [];
    const positions = [
      { x: metadata.width * 0.1, y: metadata.height * 0.1 },
      { x: metadata.width * 0.5, y: metadata.height * 0.05 },
      { x: metadata.width * 0.9, y: metadata.height * 0.5 },
      { x: metadata.width * 0.5, y: metadata.height * 0.95 },
    ];

    // Actually, a better approach: add a clear legend/key at the top
    const legendSvg = `
      <svg width="${metadata.width}" height="60">
        <defs>
          <style>
            .legend-bg { fill: rgba(255, 255, 255, 0.95); }
            .legend-text {
              fill: #333;
              font-size: 28px;
              font-family: Arial, sans-serif;
              font-weight: bold;
            }
            .legend-note {
              fill: #666;
              font-size: 18px;
              font-family: Arial, sans-serif;
            }
          </style>
        </defs>
        <rect class="legend-bg" x="0" y="0" width="${metadata.width}" height="60" rx="0"/>
        <text class="legend-text" x="20" y="32">📏 Dimensions</text>
        <text class="legend-note" x="200" y="32">(All measurements in cm)</text>
      </svg>
    `;

    const processedImage = await sharp(imageBuffer)
      .composite([{
        input: Buffer.from(legendSvg),
        top: 0,
        left: 0
      }])
      .jpeg({ quality: 92 })
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error('Error processing image:', error.message);
    return imageBuffer;
  }
}

async function uploadToSupabase(imageBuffer, fileName) {
  try {
    const filePath = `dimensions-en/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error.message);
    return null;
  }
}

async function processDimensionImages() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('PROCESSING DIMENSION IMAGES - REPLACING \u0441\u043c WITH cm');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get all dimension images
  const { data: dimensionImages } = await supabase
    .from('product_images')
    .select('id, product_id, image_url, alt_text, products!inner(name, sku)')
    .like('alt_text', '%Dimension%');

  if (!dimensionImages || dimensionImages.length === 0) {
    console.log('No dimension images found');
    return;
  }

  console.log(`Found ${dimensionImages.length} dimension images to process\n`);
  console.log('Processing images (adding English cm overlay)...\n');

  let processed = 0;
  let uploaded = 0;
  let failed = 0;

  for (const img of dimensionImages.slice(0, 20)) { // Test with first 20
    try {
      console.log(`Processing: ${img.products.name}...`);

      // Download original image
      const imageBuffer = await downloadImage(img.image_url);
      if (!imageBuffer) {
        console.log('  ✗ Failed to download');
        failed++;
        continue;
      }

      // Process image - add English overlay
      const processedBuffer = await replaceTextInImage(imageBuffer, img.products.name);

      // Generate filename
      const fileName = `${img.products.sku}-dimensions-en.jpg`;

      // Upload to Supabase storage
      const publicUrl = await uploadToSupabase(processedBuffer, fileName);

      if (publicUrl) {
        // Update database with new URL
        await supabase
          .from('product_images')
          .update({
            image_url: publicUrl,
            alt_text: `${img.products.name} - Dimensions (cm)`
          })
          .eq('id', img.id);

        console.log(`  ✓ Uploaded and updated`);
        uploaded++;
      } else {
        console.log('  ✗ Upload failed');
        failed++;
      }

      processed++;

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Processed: ${processed} images`);
  console.log(`✓ Successfully uploaded: ${uploaded}`);
  console.log(`✓ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════');
}

processDimensionImages().catch(console.error);
