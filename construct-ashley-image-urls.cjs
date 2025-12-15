const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ashleyProducts = [
  { sku: 'ASH-SOF-0001', code: '3100438', name: 'Mahoney Sofa', colors: ['Pebble', 'Chocolate'] },
  { sku: 'ASH-SOF-0002', code: '8721338', name: 'Altari Sofa', colors: ['Slate', 'Alloy'] },
  { sku: 'ASH-SOF-0003', code: '3290338', name: 'Maimz Sofa', colors: ['Charcoal'] },
  { sku: 'ASH-SOF-0004', code: '2770438', name: 'Whitlock Sofa', colors: ['Caramel', 'Umber'] },
  { sku: 'ASH-SOF-0005', code: '50205S5', name: 'Larce Sofa Chaise', colors: ['Stone', 'Dune'] },
  { sku: 'ASH-SOF-0006', code: '7500538', name: 'Darcy Sofa', colors: ['Cobblestone', 'Black', 'Sky'] },
  { sku: 'ASH-SOF-0007', code: '9400238', name: 'Navi Sofa', colors: ['Smoke', 'Fossil', 'Chestnut'] },
  { sku: 'ASH-SOF-0008', code: '3310438', name: 'Vayda Sofa', colors: ['Cream'] },
  { sku: 'ASH-SOF-0009', code: '5950518', name: 'Stonemeade Sofa Chaise', colors: ['Taupe', 'Nutmeg'] },
  { sku: 'ASH-SOF-0010', code: '9230538', name: 'Belvoir Sofa', colors: ['Denim', 'Snow'] },
  { sku: 'ASH-SOF-0011', code: '2430338', name: 'Aviemore Sofa', colors: ['Ink', 'Spice', 'Stone'] },
  { sku: 'ASH-SOF-0012', code: '30901S2', name: 'Emilia Modular Sofa', colors: ['Caramel', 'Black'] },
  { sku: 'ASH-SOF-0013', code: '2420338', name: 'SimpleJoy Sofa', colors: ['Sand', 'Onyx', 'Navy'] },
  { sku: 'ASH-SOF-0014', code: '98103S2', name: 'Midnight-Madness Sofa', colors: ['Onyx', 'Chocolate'] },
  { sku: 'ASH-SOF-0015', code: '5510418', name: 'Greaves Sofa Chaise', colors: ['Pewter'] },
  { sku: 'ASH-SOF-0016', code: '5200338', name: 'Maggie Sofa', colors: ['Birch', 'Flax'] },
  { sku: 'ASH-SOF-0017', code: '4060638', name: 'Cashton Sofa', colors: ['Blue', 'Ice'] },
  { sku: 'ASH-SOF-0018', code: '5950538', name: 'Stonemeade Sofa', colors: ['Taupe', 'Nutmeg'] },
  { sku: 'ASH-SOF-0019', code: 'U4380887', name: 'Leesworth Reclining Sofa', colors: ['Dark Brown', 'Ocean'] },
  { sku: 'ASH-SOF-0020', code: '9250418', name: 'Tasselton Sofa Chaise', colors: ['Graphite'] },
  { sku: 'ASH-SOF-0021', code: '3010338', name: 'Adlai Sofa', colors: ['Walnut'] },
  { sku: 'ASH-SOF-0022', code: '92102S18', name: 'Modmax Modular Sofa', colors: ['Gray'] },
  { sku: 'ASH-SOF-0023', code: '7970238', name: 'Belcaro Place Sofa', colors: ['Charcoal'] },
  { sku: 'ASH-SOF-0024', code: '2610638', name: 'Bixler Sofa', colors: ['Linen'] },
  { sku: 'ASH-SOF-0025', code: '5210738', name: 'Colleton Leather Sofa', colors: ['Gray'] },
  { sku: 'ASH-SOF-0026', code: '5050438', name: 'Lonoke Sofa', colors: ['Putty'] },
  { sku: 'ASH-SOF-0027', code: '39402S2', name: 'Elissa Court Modular Sofa', colors: ['Charcoal'] },
  { sku: 'ASH-SOF-0028', code: '5560338', name: 'Bolsena Leather Sofa', colors: ['Brown'] },
  { sku: 'ASH-SOF-0029', code: '3990588', name: 'Stoneland Reclining Sofa', colors: ['Fossil'] },
  { sku: 'ASH-SOF-0030', code: '5730338', name: 'Lombardia Leather Sofa', colors: ['Brown'] }
];

function formatProductCode(code) {
  if (code.includes('S') || code.includes('U')) {
    return code;
  }

  if (code.length === 7) {
    return code.substring(0, 5) + '-' + code.substring(5);
  }

  return code;
}

function generateImageUrls(product) {
  const formattedCode = formatProductCode(product.code);
  const images = [];

  const thumbnailUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${formattedCode}-HEAD-ON-SW-P1-KO?$AFHS-Grid-1X$`;
  images.push({
    url: thumbnailUrl,
    type: 'thumbnail',
    display_order: 1,
    alt: `${product.name} - Thumbnail`
  });

  const viewAngles = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  viewAngles.forEach((angle, idx) => {
    const url = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.code}_${angle}?$AFHS-PDP-Main$`;
    images.push({
      url,
      type: 'gallery',
      display_order: idx + 2,
      alt: `${product.name} - View ${idx + 1}`
    });
  });

  return images;
}

async function importToDatabase() {
  console.log('Constructing Ashley Furniture Image URLs...\n');
  console.log('='.repeat(60));

  let totalImported = 0;
  let totalImages = 0;

  for (const product of ashleyProducts) {
    console.log(`\n${product.sku} - ${product.name}`);

    const { data: dbProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .maybeSingle();

    if (!dbProduct) {
      console.log(`  ✗ Product not found in database`);
      continue;
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', dbProduct.id);

    const images = generateImageUrls(product);

    for (const image of images) {
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: dbProduct.id,
          image_url: image.url,
          display_order: image.display_order,
          alt_text: image.alt
        });

      if (!error) {
        totalImages++;
      }
    }

    console.log(`  ✓ Added ${images.length} images`);
    totalImported++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Import Complete!');
  console.log('='.repeat(60));
  console.log(`Products updated: ${totalImported}`);
  console.log(`Total images added: ${totalImages}`);
  console.log('='.repeat(60));
}

importToDatabase().catch(console.error);
