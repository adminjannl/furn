const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const productUrls = [
  'https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html',
  'https://www.ashleyfurniture.com/p/altari_sofa/8721338.html',
  'https://www.ashleyfurniture.com/p/maimz_sofa/3290338.html',
  'https://www.ashleyfurniture.com/p/whitlock_sofa/2770438.html',
  'https://www.ashleyfurniture.com/p/larce_2-piece_sectional_with_chaise/50205S5.html',
  'https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html',
  'https://www.ashleyfurniture.com/p/navi_sofa/9400238.html',
  'https://www.ashleyfurniture.com/p/vayda_sofa/3310438.html',
  'https://www.ashleyfurniture.com/p/stonemeade_sofa_chaise/5950518.html',
  'https://www.ashleyfurniture.com/p/belvoir_sofa/9230538.html',
  'https://www.ashleyfurniture.com/p/aviemore_sofa/2430338.html',
  'https://www.ashleyfurniture.com/p/emilia_3-piece_sectional_sofa/30901S2.html',
  'https://www.ashleyfurniture.com/p/simplejoy_sofa/2420338.html',
  'https://www.ashleyfurniture.com/p/midnight-madness_2-piece_sectional_sofa_with_chaise/98103S2.html',
  'https://www.ashleyfurniture.com/p/greaves_sofa_chaise/5510418.html',
  'https://www.ashleyfurniture.com/p/maggie_sofa/5200338.html',
  'https://www.ashleyfurniture.com/p/cashton_sofa/4060638.html',
  'https://www.ashleyfurniture.com/p/stonemeade_sofa/5950538.html',
  'https://www.ashleyfurniture.com/p/leesworth_power_reclining_sofa/U4380887.html',
  'https://www.ashleyfurniture.com/p/tasselton_sofa_chaise/9250418.html',
  'https://www.ashleyfurniture.com/p/adlai_sofa/3010338.html',
  'https://www.ashleyfurniture.com/p/modmax_3-piece_sectional_with_chaise/92102S18.html',
  'https://www.ashleyfurniture.com/p/belcaro_place_sofa/7970238.html',
  'https://www.ashleyfurniture.com/p/bixler_sofa/2610638.html',
  'https://www.ashleyfurniture.com/p/colleton_sofa/5210738.html',
  'https://www.ashleyfurniture.com/p/lonoke_sofa/5050438.html',
  'https://www.ashleyfurniture.com/p/elissa_court_3-piece_sectional_sofa/39402S2.html',
  'https://www.ashleyfurniture.com/p/bolsena_sofa/5560338.html',
  'https://www.ashleyfurniture.com/p/stoneland_reclining_sofa/3990588.html',
  'https://www.ashleyfurniture.com/p/lombardia_sofa/5730338.html'
];

function extractColorFromText(text) {
  const colorKeywords = {
    'pebble': '#D4C4B0',
    'chocolate': '#3E2723',
    'slate': '#708090',
    'alloy': '#989898',
    'caramel': '#C68642',
    'umber': '#635147',
    'stone': '#9E9E9E',
    'dune': '#DCC9AA',
    'cobblestone': '#A19A8B',
    'black': '#000000',
    'smoke': '#848482',
    'fossil': '#8B7D6B',
    'taupe': '#B38B6D',
    'nutmeg': '#8B4513',
    'denim': '#1560BD',
    'snow': '#FFFAFA',
    'ink': '#2C3539',
    'spice': '#8B4513',
    'sand': '#C2B280',
    'onyx': '#353839',
    'navy': '#000080',
    'birch': '#ECE5D8',
    'flax': '#EED9C4',
    'blue': '#0066CC',
    'ice': '#D3E5EF',
    'dark brown': '#654321',
    'brown': '#654321',
    'ocean': '#006994',
    'granite': '#676767',
    'oyster': '#D9D4C4',
    'tumbleweed': '#DEAA88',
    'gray': '#808080',
    'grey': '#808080',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
    'white': '#FFFFFF',
    'charcoal': '#36454F',
    'graphite': '#383428',
    'pewter': '#899499',
    'ash': '#B2BEB5',
    'walnut': '#773F1A',
    'espresso': '#4E312D',
    'cognac': '#9A463D',
    'saddle': '#8B4513',
    'tan': '#D2B48C',
    'mocha': '#967969',
    'khaki': '#C3B091'
  };

  const lowerText = text.toLowerCase();
  for (const [colorName, colorCode] of Object.entries(colorKeywords)) {
    if (lowerText.includes(colorName)) {
      return { name: colorName.charAt(0).toUpperCase() + colorName.slice(1), code: colorCode };
    }
  }

  return null;
}

async function scrapeProductDetails(url) {
  console.log(`\nFetching: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      console.error(`  Failed to fetch: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const productName = $('h1').first().text().trim() ||
                       $('[data-testid="product-name"]').text().trim() ||
                       $('title').text().split('|')[0].trim();

    console.log(`  Product: ${productName}`);

    const colorVariants = [];
    const seenColors = new Set();

    $('[class*="color"], [class*="Color"], [data-testid*="color"], button[aria-label*="color"]').each((i, elem) => {
      const text = $(elem).text().trim() || $(elem).attr('aria-label') || $(elem).attr('title') || '';
      const color = extractColorFromText(text);

      if (color && !seenColors.has(color.name.toLowerCase())) {
        seenColors.add(color.name.toLowerCase());
        colorVariants.push(color);
      }
    });

    $('option, select option').each((i, elem) => {
      const text = $(elem).text().trim();
      const color = extractColorFromText(text);

      if (color && !seenColors.has(color.name.toLowerCase())) {
        seenColors.add(color.name.toLowerCase());
        colorVariants.push(color);
      }
    });

    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonData = JSON.parse($(elem).html());
        if (jsonData.color) {
          const colors = Array.isArray(jsonData.color) ? jsonData.color : [jsonData.color];
          colors.forEach(colorText => {
            const color = extractColorFromText(colorText);
            if (color && !seenColors.has(color.name.toLowerCase())) {
              seenColors.add(color.name.toLowerCase());
              colorVariants.push(color);
            }
          });
        }
      } catch (e) {}
    });

    const images = [];
    const seenUrls = new Set();

    $('img').each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy');

      if (src &&
          (src.includes('ashleyfurniture') || src.includes('cloudinary') || src.includes('afhs')) &&
          !src.includes('logo') &&
          !src.includes('icon') &&
          !src.includes('badge') &&
          !src.includes('spacer') &&
          !seenUrls.has(src)) {

        let fullUrl = src;
        if (src.startsWith('//')) {
          fullUrl = 'https:' + src;
        } else if (src.startsWith('/')) {
          fullUrl = 'https://www.ashleyfurniture.com' + src;
        }

        if (fullUrl.match(/\.(jpg|jpeg|png|webp)/i)) {
          seenUrls.add(src);
          images.push(fullUrl);
        }
      }
    });

    console.log(`  Found ${colorVariants.length} colors: ${colorVariants.map(c => c.name).join(', ')}`);
    console.log(`  Found ${images.length} images`);

    return {
      name: productName,
      url: url,
      colors: colorVariants,
      images: images.slice(0, 6)
    };

  } catch (error) {
    console.error(`  Error:`, error.message);
    return null;
  }
}

async function updateDatabase() {
  console.log('Starting comprehensive scrape of all Ashley sofas...\n');

  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, sku')
    .ilike('sku', 'ASH-SOF-%')
    .order('sku');

  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }

  console.log(`Found ${existingProducts.length} Ashley sofas in database\n`);

  const results = [];

  for (const url of productUrls) {
    const data = await scrapeProductDetails(url);
    if (data) {
      results.push(data);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(60));

  for (const result of results) {
    const dbProduct = existingProducts.find(p => {
      const namePart = result.name.toLowerCase().substring(0, 20);
      const dbNamePart = p.name.toLowerCase().substring(0, 20);
      return namePart.includes(dbNamePart) || dbNamePart.includes(namePart);
    });

    if (!dbProduct) {
      console.log(`\n❌ NOT FOUND: ${result.name}`);
      continue;
    }

    console.log(`\n✓ ${result.name}`);

    await supabase
      .from('product_colors')
      .delete()
      .eq('product_id', dbProduct.id);

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', dbProduct.id);

    if (result.colors.length > 0) {
      console.log(`  Colors (${result.colors.length}):`);
      for (const color of result.colors) {
        const { error } = await supabase
          .from('product_colors')
          .insert({
            product_id: dbProduct.id,
            color_name: color.name,
            color_code: color.code
          });

        if (!error) {
          console.log(`    • ${color.name} (${color.code})`);
        }
      }
    } else {
      console.log(`  Colors: None detected`);
    }

    if (result.images.length > 0) {
      console.log(`  Images (${result.images.length}):`);
      for (let i = 0; i < result.images.length; i++) {
        const { error } = await supabase
          .from('product_images')
          .insert({
            product_id: dbProduct.id,
            image_url: result.images[i],
            display_order: i + 1,
            alt_text: `${result.name} - View ${i + 1}`
          });

        if (!error) {
          console.log(`    • Image ${i + 1}`);
        }
      }
    } else {
      console.log(`  Images: Using fallback thumbnails`);
      const thumbnailDir = require('fs').readdirSync('./public/sofa-thumbnails').filter(f => f.endsWith('.jpg'));
      const startIdx = results.indexOf(result) % thumbnailDir.length;

      for (let i = 0; i < 4; i++) {
        const thumbIdx = (startIdx + i) % thumbnailDir.length;
        await supabase
          .from('product_images')
          .insert({
            product_id: dbProduct.id,
            image_url: `/sofa-thumbnails/${thumbnailDir[thumbIdx]}`,
            display_order: i + 1,
            alt_text: `${result.name} - View ${i + 1}`
          });
      }
      console.log(`    • Added 4 fallback images`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Import complete!');
  console.log('='.repeat(60));
}

updateDatabase().catch(console.error);
