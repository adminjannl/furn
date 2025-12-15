const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const products = [
  { name: 'Mahoney Sofa', url: 'https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html', colors: ['Pebble', 'Chocolate'] },
  { name: 'Altari Sofa', url: 'https://www.ashleyfurniture.com/p/altari_sofa/8721338.html', colors: ['Slate', 'Alloy'] },
  { name: 'Maimz Sofa', url: 'https://www.ashleyfurniture.com/p/maimz_sofa/3290338.html', colors: [] },
  { name: 'Whitlock Sofa', url: 'https://www.ashleyfurniture.com/p/whitlock_sofa/2770438.html', colors: ['Caramel', 'Umber'] },
  { name: 'Larce 2-Piece Next-Gen Nuvella™ Performance Fabric Sofa Chaise', url: 'https://www.ashleyfurniture.com/p/larce_2-piece_sectional_with_chaise/50205S5.html', colors: ['Stone', 'Dune'] },
  { name: 'Darcy Sofa', url: 'https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html', colors: ['Cobblestone', 'Black'] },
  { name: 'Navi Sofa', url: 'https://www.ashleyfurniture.com/p/navi_sofa/9400238.html', colors: ['Smoke', 'Fossil'] },
  { name: 'Vayda Sofa', url: 'https://www.ashleyfurniture.com/p/vayda_sofa/3310438.html', colors: [] },
  { name: 'Stonemeade Sofa Chaise', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa_chaise/5950518.html', colors: ['Taupe', 'Nutmeg'] },
  { name: 'Belvoir Next-Gen Nuvella™ Performance Fabric Sofa', url: 'https://www.ashleyfurniture.com/p/belvoir_sofa/9230538.html', colors: ['Denim', 'Snow'] },
  { name: 'Aviemore Sofa', url: 'https://www.ashleyfurniture.com/p/aviemore_sofa/2430338.html', colors: ['Ink', 'Spice', 'Stone'] },
  { name: 'Emilia 3-Piece Leather Modular Sofa', url: 'https://www.ashleyfurniture.com/p/emilia_3-piece_sectional_sofa/30901S2.html', colors: ['Caramel', 'Black'] },
  { name: 'SimpleJoy Sofa', url: 'https://www.ashleyfurniture.com/p/simplejoy_sofa/2420338.html', colors: ['Sand', 'Onyx', 'Navy'] },
  { name: 'Midnight-Madness 2-Piece Sofa with Chaise', url: 'https://www.ashleyfurniture.com/p/midnight-madness_2-piece_sectional_sofa_with_chaise/98103S2.html', colors: ['Onyx', 'Chocolate'] },
  { name: 'Greaves Sofa Chaise', url: 'https://www.ashleyfurniture.com/p/greaves_sofa_chaise/5510418.html', colors: [] },
  { name: 'Maggie Sofa', url: 'https://www.ashleyfurniture.com/p/maggie_sofa/5200338.html', colors: ['Birch', 'Flax'] },
  { name: 'Cashton Sofa', url: 'https://www.ashleyfurniture.com/p/cashton_sofa/4060638.html', colors: ['Blue', 'Ice'] },
  { name: 'Stonemeade Sofa', url: 'https://www.ashleyfurniture.com/p/stonemeade_sofa/5950538.html', colors: ['Taupe', 'Nutmeg'] },
  { name: 'Leesworth Power Reclining Leather Sofa', url: 'https://www.ashleyfurniture.com/p/leesworth_power_reclining_sofa/U4380887.html', colors: ['Dark Brown', 'Ocean'] },
  { name: 'Tasselton Next-Gen Nuvella™ Performance Fabric Sofa Chaise', url: 'https://www.ashleyfurniture.com/p/tasselton_sofa_chaise/9250418.html', colors: [] },
  { name: 'Adlai Sofa', url: 'https://www.ashleyfurniture.com/p/adlai_sofa/3010338.html', colors: [] },
  { name: 'Modmax 3-Piece Modular Next-Gen Nuvella™ Performance Fabric Sofa Chaise', url: 'https://www.ashleyfurniture.com/p/modmax_3-piece_sectional_with_chaise/92102S18.html', colors: ['Ink', 'Granite', 'Spice', 'Oyster'] },
  { name: 'Belcaro Place Next-Gen Nuvella™ Performance Fabric Sofa', url: 'https://www.ashleyfurniture.com/p/belcaro_place_sofa/7970238.html', colors: [] },
  { name: 'Bixler Sofa', url: 'https://www.ashleyfurniture.com/p/bixler_sofa/2610638.html', colors: ['Navy'] },
  { name: 'Colleton Leather Sofa', url: 'https://www.ashleyfurniture.com/p/colleton_sofa/5210738.html', colors: [] },
  { name: 'Lonoke Sofa', url: 'https://www.ashleyfurniture.com/p/lonoke_sofa/5050438.html', colors: [] },
  { name: 'Elissa Court 3-Piece Next-Gen Nuvella™ Performance Fabric Modular Sofa', url: 'https://www.ashleyfurniture.com/p/elissa_court_3-piece_sectional_sofa/39402S2.html', colors: [] },
  { name: 'Bolsena Leather Sofa', url: 'https://www.ashleyfurniture.com/p/bolsena_sofa/5560338.html', colors: ['Caramel'] },
  { name: 'Stoneland Manual Reclining Sofa', url: 'https://www.ashleyfurniture.com/p/stoneland_reclining_sofa/3990588.html', colors: ['Chocolate', 'Fossil'] },
  { name: 'Lombardia Leather Sofa', url: 'https://www.ashleyfurniture.com/p/lombardia_sofa/5730338.html', colors: ['Fossil'] }
];

const colorCodes = {
  'Pebble': '#D4C4B0',
  'Chocolate': '#3E2723',
  'Slate': '#708090',
  'Alloy': '#989898',
  'Caramel': '#C68642',
  'Umber': '#635147',
  'Stone': '#9E9E9E',
  'Dune': '#DCC9AA',
  'Cobblestone': '#A19A8B',
  'Black': '#000000',
  'Smoke': '#848482',
  'Fossil': '#8B7D6B',
  'Taupe': '#B38B6D',
  'Nutmeg': '#8B4513',
  'Denim': '#1560BD',
  'Snow': '#FFFAFA',
  'Ink': '#2C3539',
  'Spice': '#8B4513',
  'Sand': '#C2B280',
  'Onyx': '#353839',
  'Navy': '#000080',
  'Birch': '#ECE5D8',
  'Flax': '#EED9C4',
  'Blue': '#0066CC',
  'Ice': '#D3E5EF',
  'Dark Brown': '#654321',
  'Ocean': '#006994',
  'Granite': '#676767',
  'Oyster': '#D9D4C4'
};

async function scrapeProductImages(url, productName) {
  console.log(`  Fetching images...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const imageUrls = new Set();

    $('img').each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src &&
          (src.includes('ashleyfurniture') || src.includes('afhs-cloudinary')) &&
          !src.includes('logo') &&
          !src.includes('icon') &&
          !src.includes('badge')) {

        let fullUrl = src;
        if (src.startsWith('//')) {
          fullUrl = 'https:' + src;
        } else if (src.startsWith('/')) {
          fullUrl = 'https://www.ashleyfurniture.com' + src;
        }
        imageUrls.add(fullUrl);
      }
    });

    const images = Array.from(imageUrls).slice(0, 5);
    console.log(`    Found ${images.length} images`);
    return images;

  } catch (error) {
    console.error(`    Error fetching images:`, error.message);
    return [];
  }
}

async function importImagesAndColors() {
  console.log('Starting import of images and colors...\n');

  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name')
    .ilike('sku', 'ASH-SOF-%');

  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }

  console.log(`Found ${existingProducts.length} Ashley sofas in database\n`);

  for (const product of products) {
    const dbProduct = existingProducts.find(p =>
      p.name.toLowerCase().includes(product.name.toLowerCase().substring(0, 20)) ||
      product.name.toLowerCase().includes(p.name.toLowerCase().substring(0, 20))
    );

    if (!dbProduct) {
      console.log(`⚠️  Product not found in database: ${product.name}`);
      continue;
    }

    console.log(`\n📦 Processing: ${product.name}`);

    if (product.colors.length > 0) {
      console.log(`  Adding ${product.colors.length} color variants...`);

      for (const colorName of product.colors) {
        const colorCode = colorCodes[colorName] || '#CCCCCC';

        const { error: colorError } = await supabase
          .from('product_colors')
          .insert({
            product_id: dbProduct.id,
            color_name: colorName,
            color_code: colorCode
          });

        if (colorError && !colorError.message.includes('duplicate')) {
          console.error(`    Error adding color ${colorName}:`, colorError.message);
        } else if (!colorError) {
          console.log(`    ✓ Added color: ${colorName}`);
        }
      }
    }

    const images = await scrapeProductImages(product.url, product.name);

    if (images.length > 0) {
      console.log(`  Adding ${images.length} images...`);

      for (let i = 0; i < images.length; i++) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: dbProduct.id,
            image_url: images[i],
            display_order: i + 1,
            alt_text: `${product.name} - Image ${i + 1}`
          });

        if (imageError && !imageError.message.includes('duplicate')) {
          console.error(`    Error adding image ${i + 1}:`, imageError.message);
        } else if (!imageError) {
          console.log(`    ✓ Added image ${i + 1}`);
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Import complete!');
}

importImagesAndColors().catch(console.error);
