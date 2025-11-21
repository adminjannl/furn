const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fetch = require('node-fetch');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

async function getDominantColor(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = await response.buffer();

    // Resize to small size for faster processing and get stats
    const { data, info } = await sharp(buffer)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate average color from center region (ignore background)
    const centerSize = 50;
    const startX = 25;
    const startY = 25;

    let r = 0, g = 0, b = 0, count = 0;

    for (let y = startY; y < startY + centerSize; y++) {
      for (let x = startX; x < startX + centerSize; x++) {
        const idx = (y * info.width + x) * info.channels;
        r += data[idx];
        g += data[idx + 1];
        b += data[idx + 2];
        count++;
      }
    }

    r = r / count;
    g = g / count;
    b = b / count;

    return rgbToHex(r, g, b);
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
    return null;
  }
}

async function extractRealColors() {
  console.log('\n🎨 Extracting real colors from product images...\n');

  // Get unique color entries with thumbnails, grouped by color name
  const { data: colorGroups } = await supabase
    .from('product_colors')
    .select('color_name, variant_thumbnail_url')
    .not('variant_thumbnail_url', 'is', null)
    .limit(1000);

  if (!colorGroups || colorGroups.length === 0) {
    console.log('No colors with thumbnails found');
    return;
  }

  // Group by color name and get one sample image per color
  const colorSamples = new Map();
  colorGroups.forEach(item => {
    if (item.variant_thumbnail_url && !colorSamples.has(item.color_name)) {
      colorSamples.set(item.color_name, item.variant_thumbnail_url);
    }
  });

  console.log(`Found ${colorSamples.size} unique colors to analyze\n`);

  const colorUpdates = new Map();

  for (const [colorName, imageUrl] of colorSamples) {
    process.stdout.write(`Analyzing ${colorName.padEnd(15)}... `);

    const dominantColor = await getDominantColor(imageUrl);

    if (dominantColor) {
      colorUpdates.set(colorName, dominantColor);
      console.log(`✓ ${dominantColor}`);
    } else {
      console.log(`✗ Failed`);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n\nUpdating color codes in database...\n');

  let updated = 0;
  for (const [colorName, colorCode] of colorUpdates) {
    const { error } = await supabase
      .from('product_colors')
      .update({ color_code: colorCode })
      .eq('color_name', colorName);

    if (!error) {
      updated++;
      console.log(`Updated ${colorName.padEnd(15)} to ${colorCode}`);
    }
  }

  console.log('\n✅ Complete!');
  console.log(`Extracted and updated ${updated} color codes from real product images`);
}

extractRealColors().catch(console.error);
