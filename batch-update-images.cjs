require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function batchUpdateImages() {
  console.log('Updating sofa images...');

  const imageMapping = {
    'SOF-0007': '/sofa-thumbnails/SOF-0007-6485ef04.jpg',
    'SOF-0008': '/sofa-thumbnails/SOF-0008-99996c74.jpg',
    'SOF-0009': '/sofa-thumbnails/SOF-0009-4aefcfd6.jpg',
    'SOF-0010': '/sofa-thumbnails/SOF-0010-842f05ed.jpg',
    'SOF-0011': '/sofa-thumbnails/SOF-0011-43d4969b.jpg',
    'SOF-0012': '/sofa-thumbnails/SOF-0012-dbb71065.jpg',
    'SOF-0013': '/sofa-thumbnails/SOF-0013-3d25e876.jpg',
    'SOF-0014': '/sofa-thumbnails/SOF-0014-e1e31e02.jpg',
    'SOF-0015': '/sofa-thumbnails/SOF-0015-0983a9b6.jpg',
    'SOF-0016': '/sofa-thumbnails/SOF-0016-e3039387.jpg',
    'SOF-0017': '/sofa-thumbnails/SOF-0017-507139f3.jpg',
    'SOF-0018': '/sofa-thumbnails/SOF-0018-2957d5aa.jpg',
    'SOF-0019': '/sofa-thumbnails/SOF-0019-9b0f3ec4.jpg',
    'SOF-0020': '/sofa-thumbnails/SOF-0020-bbc2ed3f.jpg',
    'SOF-0021': '/sofa-thumbnails/SOF-0021-19e42bf8.jpg',
    'SOF-0022': '/sofa-thumbnails/SOF-0022-6dbbe001.jpg',
    'SOF-0023': '/sofa-thumbnails/SOF-0023-bc7b743a.jpg',
    'SOF-0024': '/sofa-thumbnails/SOF-0024-4d4aeb9c.jpg',
    'SOF-0025': '/sofa-thumbnails/SOF-0025-ae4b0122.jpg',
    'SOF-0026': '/sofa-thumbnails/SOF-0026-235a6e1e.jpg',
    'SOF-0027': '/sofa-thumbnails/SOF-0027-c77806ee.jpg',
    'SOF-0028': '/sofa-thumbnails/SOF-0028-ddd85835.jpg',
    'SOF-0029': '/sofa-thumbnails/SOF-0029-308eda09.jpg',
    'SOF-0030': '/sofa-thumbnails/SOF-0030-fc634d5c.jpg',
    'SOF-0031': '/sofa-thumbnails/SOF-0031-eac89c7a.jpg',
    'SOF-0032': '/sofa-thumbnails/SOF-0032-e25d85b7.jpg',
    'SOF-0033': '/sofa-thumbnails/SOF-0033-2b75cb5c.jpg',
    'SOF-0034': '/sofa-thumbnails/SOF-0034-c026a4e7.jpg',
    'SOF-0035': '/sofa-thumbnails/SOF-0035-03353375.jpg',
    'SOF-0036': '/sofa-thumbnails/SOF-0036-64b6550c.jpg',
    'SOF-0037': '/sofa-thumbnails/SOF-0037-ff354fca.jpg',
    'SOF-0038': '/sofa-thumbnails/SOF-0038-ed913136.jpg',
    'SOF-0039': '/sofa-thumbnails/SOF-0039-2f1756a2.jpg',
    'SOF-0040': '/sofa-thumbnails/SOF-0040-0924e6ae.jpg',
    'SOF-0041': '/sofa-thumbnails/SOF-0041-28ed5ddf.jpg',
    'SOF-0042': '/sofa-thumbnails/SOF-0042-607a5252.jpg',
    'SOF-0043': '/sofa-thumbnails/SOF-0043-0a167f34.jpg',
    'SOF-0044': '/sofa-thumbnails/SOF-0044-7b864382.jpg',
    'SOF-0045': '/sofa-thumbnails/SOF-0045-12c1f129.jpg',
    'SOF-0046': '/sofa-thumbnails/SOF-0046-346a15af.jpg',
    'SOF-0047': '/sofa-thumbnails/SOF-0047-cde25973.jpg',
    'SOF-0048': '/sofa-thumbnails/SOF-0048-90569b14.jpg',
    'SOF-0049': '/sofa-thumbnails/SOF-0049-7177d648.jpg',
    'SOF-0050': '/sofa-thumbnails/SOF-0050-4b9660e7.jpg',
  };

  let updated = 0;

  for (const [sku, imageUrl] of Object.entries(imageMapping)) {
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku)
      .maybeSingle();

    if (!product) {
      console.log(`Product ${sku} not found`);
      continue;
    }

    const { error } = await supabase
      .from('product_images')
      .update({ image_url: imageUrl })
      .eq('product_id', product.id);

    if (error) {
      console.error(`Error updating ${sku}:`, error);
    } else {
      console.log(`✓ ${sku}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} images`);
}

batchUpdateImages();
