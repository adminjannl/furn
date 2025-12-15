require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const PRODUCTS = [
  { sku: 'ASH-SOF-0002', code: '87213-38', pattern: '-SW' },
  { sku: 'ASH-SOF-0005', code: '50205S5', pattern: '' },
  { sku: 'ASH-SOF-0006', code: '75005-38', pattern: '-SW' }
];

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.buffer();
    return buffer.length > 1000 ? buffer : null;
  } catch (error) {
    return null;
  }
}

async function uploadToStorage(buffer, path) {
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: true });

  if (error) return null;

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

async function migrate() {
  for (const { sku, code, pattern } of PRODUCTS) {
    console.log(`\n${sku} (${code}):`);

    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku)
      .maybeSingle();

    if (!product) {
      console.log('  Product not found');
      continue;
    }

    const url = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${code}${pattern}?$AFHS-Grid-1X$`;
    const buffer = await downloadImage(url);

    if (!buffer) {
      console.log('  Failed to download');
      continue;
    }

    const storagePath = `ashley-sofas/${sku}-1.jpg`;
    const publicUrl = await uploadToStorage(buffer, storagePath);

    if (!publicUrl) {
      console.log('  Failed to upload');
      continue;
    }

    const { error } = await supabase
      .from('product_images')
      .insert({
        product_id: product.id,
        image_url: publicUrl,
        alt_text: `${sku} view 1`,
        display_order: 1
      });

    if (error) {
      console.log('  DB error:', error.message);
    } else {
      console.log('  SUCCESS: ' + publicUrl);
    }
  }
}

migrate();
