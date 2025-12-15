require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const VIEW_PATTERNS = [
  'HEAD-ON-SW-P1-KO',
  'ANGLE-SW-P1-KO',
  'SIDE-SW-P1-KO',
  'HEAD-ON-SW',
  'ANGLE-SW',
  'SIDE-SW'
];

const PRODUCT_CODES = {
  'ASH-SOF-0001': '31004-38',
  'ASH-SOF-0002': '87213-38',
  'ASH-SOF-0003': '32903-38',
  'ASH-SOF-0004': '27704-38',
  'ASH-SOF-0005': '50205S5',
  'ASH-SOF-0006': '75005-38',
  'ASH-SOF-0007': '94002-38',
  'ASH-SOF-0008': '33104-38',
  'ASH-SOF-0009': '59505-18',
  'ASH-SOF-0010': '92305-38',
  'ASH-SOF-0011': '24303-38',
  'ASH-SOF-0012': '30901S2',
  'ASH-SOF-0013': '24203-38',
  'ASH-SOF-0014': '98103S2',
  'ASH-SOF-0015': '55104-18',
  'ASH-SOF-0016': '52003-38',
  'ASH-SOF-0017': '40606-38',
  'ASH-SOF-0018': '59505-38',
  'ASH-SOF-0019': 'U4380887',
  'ASH-SOF-0020': '92504-18',
  'ASH-SOF-0021': '30103-38',
  'ASH-SOF-0022': '92102S18',
  'ASH-SOF-0023': '79702-38',
  'ASH-SOF-0024': '26106-38',
  'ASH-SOF-0025': '52107-38',
  'ASH-SOF-0026': '50504-38',
  'ASH-SOF-0027': '39402S2',
  'ASH-SOF-0028': '55603-38',
  'ASH-SOF-0029': '39905-88',
  'ASH-SOF-0030': '57303-38'
};

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    return null;
  }
}

async function uploadToStorage(buffer, path) {
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error(`  Upload error for ${path}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

async function migrateImages() {
  console.log('Migrating Ashley Sofa Images to Supabase Storage\n');
  console.log('='.repeat(60) + '\n');

  let totalUploaded = 0;
  let totalFailed = 0;

  for (const [sku, code] of Object.entries(PRODUCT_CODES)) {
    console.log(`\n${sku} (${code})`);

    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku)
      .maybeSingle();

    if (!product) {
      console.log(`  Product not found, skipping`);
      continue;
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id);

    const newImages = [];

    for (let i = 0; i < VIEW_PATTERNS.length; i++) {
      const view = VIEW_PATTERNS[i];
      const scene7Url = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${code}-${view}?$AFHS-Grid-1X$`;

      const buffer = await downloadImage(scene7Url);

      if (buffer && buffer.length > 1000) {
        const storagePath = `ashley-sofas/${sku}-${i + 1}.jpg`;
        const publicUrl = await uploadToStorage(buffer, storagePath);

        if (publicUrl) {
          newImages.push({
            product_id: product.id,
            image_url: publicUrl,
            alt_text: `${sku} view ${i + 1}`,
            display_order: i + 1
          });
          process.stdout.write(`  [${i + 1}] OK  `);
          totalUploaded++;
        } else {
          process.stdout.write(`  [${i + 1}] FAIL  `);
          totalFailed++;
        }
      } else {
        process.stdout.write(`  [${i + 1}] SKIP  `);
      }
    }

    if (newImages.length > 0) {
      const { error } = await supabase
        .from('product_images')
        .insert(newImages);

      if (error) {
        console.log(`\n  DB insert error: ${error.message}`);
      } else {
        console.log(`\n  Saved ${newImages.length} images`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Migration Complete!`);
  console.log(`Uploaded: ${totalUploaded} | Failed: ${totalFailed}`);
  console.log('='.repeat(60));
}

migrateImages().catch(console.error);
