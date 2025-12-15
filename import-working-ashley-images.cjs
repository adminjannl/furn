const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ashleyProducts = [
  { sku: 'ASH-SOF-0001', code: '3100438', name: 'Mahoney Sofa' },
  { sku: 'ASH-SOF-0002', code: '8721338', name: 'Altari Sofa' },
  { sku: 'ASH-SOF-0003', code: '3290338', name: 'Maimz Sofa' },
  { sku: 'ASH-SOF-0004', code: '2770438', name: 'Whitlock Sofa' },
  { sku: 'ASH-SOF-0005', code: '50205S5', name: 'Larce Sofa Chaise' },
  { sku: 'ASH-SOF-0006', code: '7500538', name: 'Darcy Sofa' },
  { sku: 'ASH-SOF-0007', code: '9400238', name: 'Navi Sofa' },
  { sku: 'ASH-SOF-0008', code: '3310438', name: 'Vayda Sofa' },
  { sku: 'ASH-SOF-0009', code: '5950518', name: 'Stonemeade Sofa Chaise' },
  { sku: 'ASH-SOF-0010', code: '9230538', name: 'Belvoir Sofa' },
  { sku: 'ASH-SOF-0011', code: '2430338', name: 'Aviemore Sofa' },
  { sku: 'ASH-SOF-0012', code: '30901S2', name: 'Emilia Modular Sofa' },
  { sku: 'ASH-SOF-0013', code: '2420338', name: 'SimpleJoy Sofa' },
  { sku: 'ASH-SOF-0014', code: '98103S2', name: 'Midnight-Madness Sofa' },
  { sku: 'ASH-SOF-0015', code: '5510418', name: 'Greaves Sofa Chaise' },
  { sku: 'ASH-SOF-0016', code: '5200338', name: 'Maggie Sofa' },
  { sku: 'ASH-SOF-0017', code: '4060638', name: 'Cashton Sofa' },
  { sku: 'ASH-SOF-0018', code: '5950538', name: 'Stonemeade Sofa' },
  { sku: 'ASH-SOF-0019', code: 'U4380887', name: 'Leesworth Reclining Sofa' },
  { sku: 'ASH-SOF-0020', code: '9250418', name: 'Tasselton Sofa Chaise' },
  { sku: 'ASH-SOF-0021', code: '3010338', name: 'Adlai Sofa' },
  { sku: 'ASH-SOF-0022', code: '92102S18', name: 'Modmax Modular Sofa' },
  { sku: 'ASH-SOF-0023', code: '7970238', name: 'Belcaro Place Sofa' },
  { sku: 'ASH-SOF-0024', code: '2610638', name: 'Bixler Sofa' },
  { sku: 'ASH-SOF-0025', code: '5210738', name: 'Colleton Leather Sofa' },
  { sku: 'ASH-SOF-0026', code: '5050438', name: 'Lonoke Sofa' },
  { sku: 'ASH-SOF-0027', code: '39402S2', name: 'Elissa Court Modular Sofa' },
  { sku: 'ASH-SOF-0028', code: '5560338', name: 'Bolsena Leather Sofa' },
  { sku: 'ASH-SOF-0029', code: '3990588', name: 'Stoneland Reclining Sofa' },
  { sku: 'ASH-SOF-0030', code: '5730338', name: 'Lombardia Leather Sofa' }
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

  const views = [
    'HEAD-ON-SW-P1-KO',
    'ANGLE-SW-P1-KO',
    'SIDE-SW-P1-KO',
    'HEAD-ON-SW',
    'ANGLE-SW',
    'SIDE-SW'
  ];

  const images = views.map((view, idx) => {
    return {
      url: `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${formattedCode}-${view}?$AFHS-Grid-1X$`,
      display_order: idx + 1,
      alt: `${product.name} - ${view.split('-')[0]} view`
    };
  });

  return images;
}

async function importToDatabase() {
  console.log('Importing Working Ashley Furniture Images...\n');
  console.log('='.repeat(60));

  let totalImported = 0;
  let totalImages = 0;

  for (const product of ashleyProducts) {
    console.log(`\n${product.sku} - ${product.name}`);
    console.log(`  Code: ${product.code} → ${formatProductCode(product.code)}`);

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
  console.log('\nUsing verified working URL patterns:');
  console.log('  • HEAD-ON-SW-P1-KO');
  console.log('  • ANGLE-SW-P1-KO');
  console.log('  • SIDE-SW-P1-KO');
  console.log('  • HEAD-ON-SW');
  console.log('  • ANGLE-SW');
  console.log('  • SIDE-SW');
  console.log('='.repeat(60));
}

importToDatabase().catch(console.error);
