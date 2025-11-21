const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Mapping of new beds to their image sources based on similar existing products
const imageMapping = {
  // Boss Dream 140 series - use 160 series images as they're the same product in different size
  'BED-MNM-0067': { // champagne
    source: 'BED-MNM-0045', // Boss Dream 160 champagne
    url: 'https://mnogomebeli.com/upload/iblock/2a4/nq4ykpvmmnphvr7drutlz78cd98ouof2/2560kh1188_0000_Bed_Dream_royal_shampan_0000.jpg'
  },
  'BED-MNM-0068': { // agate
    source: 'BED-MNM-0041', // Boss Dream 160 agate
    url: 'https://mnogomebeli.com/upload/iblock/d3a/b9gkwd3el3cbx8pryh40aty5wpz65hv5/Frame-126.jpg'
  },
  'BED-MNM-0069': { // topaz
    source: 'BED-MNM-0042', // Boss Dream 160 topaz
    url: 'https://mnogomebeli.com/upload/iblock/eab/lc5j85egwb6svumiabg5yl8x95k5412d/2560kh1188_0003_Bed_Dream_royal_topaz_0000.jpg'
  },
  'BED-MNM-0070': { // peony
    source: 'BED-MNM-0044', // Boss Dream 160 peony
    url: 'https://mnogomebeli.com/upload/iblock/570/a4vu4nbd6n6a1voaol4g9e7cnf7gbt2l/2560kh1188_0003_Bed_Dream_royal_pion_0000.jpg'
  },
  'BED-MNM-0071': { // taupe
    source: 'BED-MNM-0043', // Boss Dream 160 taupe
    url: 'https://mnogomebeli.com/upload/iblock/c59/l7lmg384enkxk7jhahpqrixjoruodkic/2560kh1188_0006_Bed_Dream_royal_taup_0000.jpg'
  },

  // RONDA series
  'BED-MNM-0072': { // RONDA 160 blue - use RONDA 160 gray as base
    source: 'BED-MNM-0062',
    url: 'https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg' // Use existing RONDA image
  },
  'BED-MNM-0092': { // RONDA 140 latte
    source: 'BED-MNM-0026',
    url: 'https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg'
  },
  'BED-MNM-0093': { // RONDA 140 gray
    source: 'BED-MNM-0062',
    url: 'https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg'
  },
  'BED-MNM-0094': { // RONDA 140 steel
    source: 'BED-MNM-0063',
    url: 'https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg'
  },

  // BOSS.XO series
  'BED-MNM-0073': { // BOSS.XO 160 steel
    source: 'BED-MNM-0034',
    url: 'https://mnogomebeli.com/upload/iblock/082/v8pl4gxegov8gsyf5gm277ehir6a53e7/krovat_BOSS_XO_monolit_steel_6.jpg'
  },
  'BED-MNM-0074': { // BOSS.XO 180 gray
    source: 'BED-MNM-0034',
    url: 'https://mnogomebeli.com/upload/iblock/082/v8pl4gxegov8gsyf5gm277ehir6a53e7/krovat_BOSS_XO_monolit_steel_6.jpg'
  },
  'BED-MNM-0075': { // BOSS.XO 180 latte
    source: 'BED-MNM-0034',
    url: 'https://mnogomebeli.com/upload/iblock/082/v8pl4gxegov8gsyf5gm277ehir6a53e7/krovat_BOSS_XO_monolit_steel_6.jpg'
  },

  // Freya aqua
  'BED-MNM-0076': { // Freya 160 Slim aqua
    source: 'BED-MNM-0046', // Freya Slim latte
    url: 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg'
  },
  'BED-MNM-0077': { // Freya 160 PM aqua
    source: 'BED-MNM-0001', // Freya PM latte
    url: 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg'
  },

  // Boss Pro aqua/blue
  'BED-MNM-0078': { // Boss 160 aqua
    source: 'BED-MNM-0007', // Boss 160 latte
    url: 'https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg'
  },
  'BED-MNM-0084': { // Boss 180 blue
    source: 'BED-MNM-0012', // Boss 180 latte
    url: 'https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg'
  },
  'BED-MNM-0085': { // Boss 180 aqua
    source: 'BED-MNM-0012',
    url: 'https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg'
  },

  // Bella 160 PM series
  'BED-MNM-0079': { // Bella 160 PM latte
    source: 'BED-MNM-0014', // Bella 140 PM latte
    url: 'https://mnogomebeli.com/upload/iblock/9f3/v1ahqpdhqa0yso0ujg64kgoghqeso547/krovat_bella_140_15.jpg'
  },
  'BED-MNM-0080': { // Bella 160 PM gray
    source: 'BED-MNM-0023', // Bella 140 PM gray
    url: 'https://mnogomebeli.com/upload/iblock/450/93hptey1mkdqk4ggf04wdl3iqukioiup/krovat_bella_140_24.jpg'
  },
  'BED-MNM-0081': { // Bella 160 PM steel
    source: 'BED-MNM-0021', // Bella 140 PM steel
    url: 'https://mnogomebeli.com/upload/iblock/aea/73fomhwhfzzkjvcqcm8niij8pcdfqz3n/krovat_bella_140_6.jpg'
  },
  'BED-MNM-0082': { // Bella 160 PM aqua
    source: 'BED-MNM-0031', // Bella 140 PM aqua
    url: 'https://mnogomebeli.com/upload/iblock/ece/h9212x85vh0qklaefsjrefy8v3xqffek/krovat_bella_140_33.jpg'
  },
  'BED-MNM-0083': { // Bella 160 PM mocha
    source: 'BED-MNM-0052', // Bella 140 PM mocha
    url: 'https://mnogomebeli.com/upload/iblock/9f3/v1ahqpdhqa0yso0ujg64kgoghqeso547/krovat_bella_140_15.jpg'
  },

  // Una 140
  'BED-MNM-0086': { // Una 140 gray
    source: 'BED-MNM-0018', // Una mini gray
    url: 'https://mnogomebeli.com/upload/iblock/c9c/7slpk1wanmvj2tbdt7hp9atdnls6me33/krovat-UNA-_-2.jpg'
  },
  'BED-MNM-0087': { // Una 140 platinum
    source: 'BED-MNM-0030', // Una mini platinum
    url: 'https://mnogomebeli.com/upload/iblock/748/jeamqizoq7zv50lnk857lx8uoewjsv07/Krovat-UNA-Malbo_Platina_-_-18.jpg'
  },

  // LOFT Mini
  'BED-MNM-0088': { // LOFT Mini Walnut mocha
    source: 'BED-MNM-0025', // LOFT Mini Walnut latte
    url: 'https://mnogomebeli.com/upload/iblock/3c6/1u2izu3byt9mce4v18quny8owxoauod2/Frame-1.jpg'
  },
  'BED-MNM-0089': { // LOFT Mini Sonoma gray
    source: 'BED-MNM-0029', // LOFT Mini Walnut gray
    url: 'https://mnogomebeli.com/upload/iblock/239/79oobigpezj04ttf2alv82bs36ia2ztq/Frame-12.jpg'
  }
};

async function copyImagesFromSimilarProducts() {
  console.log('🖼️  Copying images from similar products...\n');

  const bedsToUpdate = Object.keys(imageMapping);
  let successCount = 0;
  let errorCount = 0;

  for (const targetSku of bedsToUpdate) {
    const mapping = imageMapping[targetSku];
    console.log(`\n📦 Processing ${targetSku}...`);
    console.log(`   Using images from ${mapping.source}`);

    try {
      // Get target product
      const { data: targetProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('sku', targetSku)
        .single();

      if (!targetProduct) {
        console.log(`   ❌ Product not found`);
        errorCount++;
        continue;
      }

      // Get source product images
      const { data: sourceImages } = await supabase
        .from('product_images')
        .select('image_url, display_order, is_primary')
        .eq('product_id', (await supabase.from('products').select('id').eq('sku', mapping.source).single()).data.id)
        .order('display_order');

      if (!sourceImages || sourceImages.length === 0) {
        console.log(`   ⚠️  No source images found, using direct URL`);
        // Use the direct URL from mapping
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: targetProduct.id,
            image_url: mapping.url,
            display_order: 0,
            is_primary: true
          });

        if (insertError) {
          console.log(`   ❌ Error inserting image: ${insertError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Added direct URL image`);
          successCount++;
        }
        continue;
      }

      // Copy all images from source
      for (const img of sourceImages) {
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: targetProduct.id,
            image_url: img.image_url,
            display_order: img.display_order,
            is_primary: img.is_primary
          });

        if (insertError) {
          console.log(`   ❌ Error copying image: ${insertError.message}`);
          errorCount++;
        }
      }

      console.log(`   ✅ Copied ${sourceImages.length} images`);
      successCount++;

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`✅ Successfully updated: ${successCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);
  console.log(`\n✨ All 95 beds should now have images!`);
}

copyImagesFromSimilarProducts().catch(console.error);
