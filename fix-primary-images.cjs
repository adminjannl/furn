const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixPrimaryImages() {
  console.log('🔧 Fixing Primary Image Issues\n');
  console.log('='.repeat(60) + '\n');

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      sku
    `)
    .order('name');

  const { data: allImages } = await supabase
    .from('product_images')
    .select('*')
    .order('product_id')
    .order('display_order');

  const productImageMap = {};
  allImages.forEach(img => {
    if (!productImageMap[img.product_id]) {
      productImageMap[img.product_id] = [];
    }
    productImageMap[img.product_id].push(img);
  });

  const productsToFix = [];

  products.forEach(product => {
    const images = productImageMap[product.id] || [];

    if (images.length === 0) {
      return;
    }

    const hasPrimary = images.some(img => img.display_order === 0);

    if (!hasPrimary) {
      productsToFix.push({
        product,
        images
      });
    }
  });

  console.log(`Found ${productsToFix.length} products needing fixes:\n`);

  for (const item of productsToFix) {
    console.log(`📌 ${item.product.name} (${item.product.sku})`);
    console.log(`   Current images: ${item.images.length}`);
    console.log(`   Display orders: ${item.images.map(i => i.display_order).join(', ')}`);

    const oldPrimaryImage = item.images.find(img => img.display_order === 1);

    if (oldPrimaryImage) {
      console.log(`   → Setting image (currently order=${oldPrimaryImage.display_order}) as primary (order=0)`);

      const { error: updateError } = await supabase
        .from('product_images')
        .update({ display_order: 0 })
        .eq('id', oldPrimaryImage.id);

      if (updateError) {
        console.log(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Fixed!`);
      }
    } else if (item.images.length > 0) {
      console.log(`   → Setting first image as primary`);

      const firstImage = item.images[0];
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ display_order: 0 })
        .eq('id', firstImage.id);

      if (updateError) {
        console.log(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Fixed!`);
      }
    }

    console.log();
  }

  console.log('='.repeat(60) + '\n');
  console.log(`✅ Fixed ${productsToFix.length} products\n`);

  const { data: verifyProducts } = await supabase
    .from('products')
    .select('id')
    .order('id');

  const { data: verifyImages } = await supabase
    .from('product_images')
    .select('product_id, display_order');

  const verifyMap = {};
  verifyImages.forEach(img => {
    if (!verifyMap[img.product_id]) {
      verifyMap[img.product_id] = [];
    }
    verifyMap[img.product_id].push(img.display_order);
  });

  let stillMissing = 0;
  verifyProducts.forEach(p => {
    const orders = verifyMap[p.id] || [];
    if (orders.length > 0 && !orders.includes(0)) {
      stillMissing++;
    }
  });

  console.log('📊 VERIFICATION:\n');
  console.log(`   Products with images but no primary (display_order=0): ${stillMissing}`);

  if (stillMissing === 0) {
    console.log('   ✅ All products with images now have a primary image!\n');
  } else {
    console.log(`   ⚠️  ${stillMissing} products still need attention\n`);
  }

  return { fixed: productsToFix.length, stillMissing };
}

fixPrimaryImages()
  .then(result => {
    console.log('✅ Primary image fix complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
