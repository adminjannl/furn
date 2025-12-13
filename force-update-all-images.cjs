require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function forceUpdateImages() {
  console.log('Force updating all sofa images SOF-0007 to SOF-0050...\n');

  const imageMap = {};
  for (let i = 7; i <= 50; i++) {
    const sku = `SOF-${String(i).padStart(4, '0')}`;
    imageMap[sku] = `/sofa-thumbnails/${sku}-`;
  }

  imageMap['SOF-0007'] = '/sofa-thumbnails/SOF-0007-6485ef04.jpg';
  imageMap['SOF-0008'] = '/sofa-thumbnails/SOF-0008-99996c74.jpg';
  imageMap['SOF-0009'] = '/sofa-thumbnails/SOF-0009-4aefcfd6.jpg';
  imageMap['SOF-0010'] = '/sofa-thumbnails/SOF-0010-842f05ed.jpg';
  imageMap['SOF-0011'] = '/sofa-thumbnails/SOF-0011-43d4969b.jpg';
  imageMap['SOF-0012'] = '/sofa-thumbnails/SOF-0012-dbb71065.jpg';
  imageMap['SOF-0013'] = '/sofa-thumbnails/SOF-0013-3d25e876.jpg';
  imageMap['SOF-0014'] = '/sofa-thumbnails/SOF-0014-e1e31e02.jpg';
  imageMap['SOF-0015'] = '/sofa-thumbnails/SOF-0015-0983a9b6.jpg';
  imageMap['SOF-0016'] = '/sofa-thumbnails/SOF-0016-e3039387.jpg';
  imageMap['SOF-0017'] = '/sofa-thumbnails/SOF-0017-507139f3.jpg';
  imageMap['SOF-0018'] = '/sofa-thumbnails/SOF-0018-2957d5aa.jpg';
  imageMap['SOF-0019'] = '/sofa-thumbnails/SOF-0019-9b0f3ec4.jpg';
  imageMap['SOF-0020'] = '/sofa-thumbnails/SOF-0020-bbc2ed3f.jpg';
  imageMap['SOF-0021'] = '/sofa-thumbnails/SOF-0021-19e42bf8.jpg';
  imageMap['SOF-0022'] = '/sofa-thumbnails/SOF-0022-6dbbe001.jpg';
  imageMap['SOF-0023'] = '/sofa-thumbnails/SOF-0023-bc7b743a.jpg';
  imageMap['SOF-0024'] = '/sofa-thumbnails/SOF-0024-4d4aeb9c.jpg';
  imageMap['SOF-0025'] = '/sofa-thumbnails/SOF-0025-ae4b0122.jpg';
  imageMap['SOF-0026'] = '/sofa-thumbnails/SOF-0026-235a6e1e.jpg';
  imageMap['SOF-0027'] = '/sofa-thumbnails/SOF-0027-c77806ee.jpg';
  imageMap['SOF-0028'] = '/sofa-thumbnails/SOF-0028-ddd85835.jpg';
  imageMap['SOF-0029'] = '/sofa-thumbnails/SOF-0029-308eda09.jpg';
  imageMap['SOF-0030'] = '/sofa-thumbnails/SOF-0030-fc634d5c.jpg';
  imageMap['SOF-0031'] = '/sofa-thumbnails/SOF-0031-eac89c7a.jpg';
  imageMap['SOF-0032'] = '/sofa-thumbnails/SOF-0032-e25d85b7.jpg';
  imageMap['SOF-0033'] = '/sofa-thumbnails/SOF-0033-2b75cb5c.jpg';
  imageMap['SOF-0034'] = '/sofa-thumbnails/SOF-0034-c026a4e7.jpg';
  imageMap['SOF-0035'] = '/sofa-thumbnails/SOF-0035-03353375.jpg';
  imageMap['SOF-0036'] = '/sofa-thumbnails/SOF-0036-64b6550c.jpg';
  imageMap['SOF-0037'] = '/sofa-thumbnails/SOF-0037-ff354fca.jpg';
  imageMap['SOF-0038'] = '/sofa-thumbnails/SOF-0038-ed913136.jpg';
  imageMap['SOF-0039'] = '/sofa-thumbnails/SOF-0039-2f1756a2.jpg';
  imageMap['SOF-0040'] = '/sofa-thumbnails/SOF-0040-0924e6ae.jpg';
  imageMap['SOF-0041'] = '/sofa-thumbnails/SOF-0041-28ed5ddf.jpg';
  imageMap['SOF-0042'] = '/sofa-thumbnails/SOF-0042-607a5252.jpg';
  imageMap['SOF-0043'] = '/sofa-thumbnails/SOF-0043-0a167f34.jpg';
  imageMap['SOF-0044'] = '/sofa-thumbnails/SOF-0044-7b864382.jpg';
  imageMap['SOF-0045'] = '/sofa-thumbnails/SOF-0045-12c1f129.jpg';
  imageMap['SOF-0046'] = '/sofa-thumbnails/SOF-0046-346a15af.jpg';
  imageMap['SOF-0047'] = '/sofa-thumbnails/SOF-0047-cde25973.jpg';
  imageMap['SOF-0048'] = '/sofa-thumbnails/SOF-0048-90569b14.jpg';
  imageMap['SOF-0049'] = '/sofa-thumbnails/SOF-0049-7177d648.jpg';
  imageMap['SOF-0050'] = '/sofa-thumbnails/SOF-0050-4b9660e7.jpg';

  const { data: products, error } = await supabase
    .from('products')
    .select('id, sku, name')
    .gte('sku', 'SOF-0007')
    .lte('sku', 'SOF-0050')
    .order('sku');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products\n`);

  let updated = 0;
  let errors = 0;

  for (const product of products) {
    const newImageUrl = imageMap[product.sku];

    if (!newImageUrl) {
      console.log(`⚠ No image mapping for ${product.sku}`);
      continue;
    }

    const { data: images, error: fetchError } = await supabase
      .from('product_images')
      .select('id, image_url')
      .eq('product_id', product.id);

    if (fetchError) {
      console.error(`Error fetching images for ${product.sku}:`, fetchError);
      errors++;
      continue;
    }

    if (images && images.length > 0) {
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ image_url: newImageUrl })
        .eq('product_id', product.id);

      if (updateError) {
        console.error(`✗ Error updating ${product.sku}:`, updateError.message);
        errors++;
      } else {
        console.log(`✓ ${product.sku}: ${newImageUrl}`);
        updated++;
      }
    } else {
      console.log(`⚠ No images found for ${product.sku}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`${'='.repeat(60)}`);
}

forceUpdateImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
