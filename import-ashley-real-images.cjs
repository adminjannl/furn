const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ashleyProducts = [
  {
    sku: 'ASH-SOF-0001',
    ashleyCode: '3100438',
    name: 'Mahoney Sofa',
    colors: ['Pebble', 'Chocolate']
  },
  {
    sku: 'ASH-SOF-0002',
    ashleyCode: '8721338',
    name: 'Altari Sofa',
    colors: ['Slate', 'Alloy']
  },
  {
    sku: 'ASH-SOF-0003',
    ashleyCode: '3290338',
    name: 'Maimz Sofa',
    colors: ['Charcoal']
  },
  {
    sku: 'ASH-SOF-0004',
    ashleyCode: '2770438',
    name: 'Whitlock Sofa',
    colors: ['Caramel', 'Umber']
  },
  {
    sku: 'ASH-SOF-0005',
    ashleyCode: '50205S5',
    name: 'Larce 2-Piece Sofa Chaise',
    colors: ['Stone', 'Dune']
  },
  {
    sku: 'ASH-SOF-0006',
    ashleyCode: '7500538',
    name: 'Darcy Sofa',
    colors: ['Cobblestone', 'Black', 'Sky']
  },
  {
    sku: 'ASH-SOF-0007',
    ashleyCode: '9400238',
    name: 'Navi Sofa',
    colors: ['Smoke', 'Fossil', 'Chestnut']
  },
  {
    sku: 'ASH-SOF-0008',
    ashleyCode: '3310438',
    name: 'Vayda Sofa',
    colors: ['Cream']
  },
  {
    sku: 'ASH-SOF-0009',
    ashleyCode: '5950518',
    name: 'Stonemeade Sofa Chaise',
    colors: ['Taupe', 'Nutmeg']
  },
  {
    sku: 'ASH-SOF-0010',
    ashleyCode: '9230538',
    name: 'Belvoir Sofa',
    colors: ['Denim', 'Snow']
  },
  {
    sku: 'ASH-SOF-0011',
    ashleyCode: '2430338',
    name: 'Aviemore Sofa',
    colors: ['Ink', 'Spice', 'Stone']
  },
  {
    sku: 'ASH-SOF-0012',
    ashleyCode: '30901S2',
    name: 'Emilia 3-Piece Modular Sofa',
    colors: ['Caramel', 'Black']
  },
  {
    sku: 'ASH-SOF-0013',
    ashleyCode: '2420338',
    name: 'SimpleJoy Sofa',
    colors: ['Sand', 'Onyx', 'Navy']
  },
  {
    sku: 'ASH-SOF-0014',
    ashleyCode: '98103S2',
    name: 'Midnight-Madness 2-Piece Sofa',
    colors: ['Onyx', 'Chocolate']
  },
  {
    sku: 'ASH-SOF-0015',
    ashleyCode: '5510418',
    name: 'Greaves Sofa Chaise',
    colors: ['Pewter']
  },
  {
    sku: 'ASH-SOF-0016',
    ashleyCode: '5200338',
    name: 'Maggie Sofa',
    colors: ['Birch', 'Flax']
  },
  {
    sku: 'ASH-SOF-0017',
    ashleyCode: '4060638',
    name: 'Cashton Sofa',
    colors: ['Blue', 'Ice']
  },
  {
    sku: 'ASH-SOF-0018',
    ashleyCode: '5950538',
    name: 'Stonemeade Sofa',
    colors: ['Taupe', 'Nutmeg']
  },
  {
    sku: 'ASH-SOF-0019',
    ashleyCode: 'U4380887',
    name: 'Leesworth Power Reclining Sofa',
    colors: ['Dark Brown', 'Ocean']
  },
  {
    sku: 'ASH-SOF-0020',
    ashleyCode: '9250418',
    name: 'Tasselton Sofa Chaise',
    colors: ['Graphite']
  },
  {
    sku: 'ASH-SOF-0021',
    ashleyCode: '3010338',
    name: 'Adlai Sofa',
    colors: ['Walnut']
  },
  {
    sku: 'ASH-SOF-0022',
    ashleyCode: '92102S18',
    name: 'Modmax 3-Piece Modular Sofa Chaise',
    colors: ['Ink', 'Granite', 'Spice', 'Oyster']
  },
  {
    sku: 'ASH-SOF-0023',
    ashleyCode: '7970238',
    name: 'Belcaro Place Sofa',
    colors: ['Ash']
  },
  {
    sku: 'ASH-SOF-0024',
    ashleyCode: '2610638',
    name: 'Bixler Sofa',
    colors: ['Navy']
  },
  {
    sku: 'ASH-SOF-0025',
    ashleyCode: '5210738',
    name: 'Colleton Leather Sofa',
    colors: ['Espresso']
  },
  {
    sku: 'ASH-SOF-0026',
    ashleyCode: '5050438',
    name: 'Lonoke Sofa',
    colors: ['Mocha']
  },
  {
    sku: 'ASH-SOF-0027',
    ashleyCode: '39402S2',
    name: 'Elissa Court 3-Piece Modular Sofa',
    colors: ['Khaki']
  },
  {
    sku: 'ASH-SOF-0028',
    ashleyCode: '5560338',
    name: 'Bolsena Leather Sofa',
    colors: ['Caramel']
  },
  {
    sku: 'ASH-SOF-0029',
    ashleyCode: '3990588',
    name: 'Stoneland Manual Reclining Sofa',
    colors: ['Chocolate', 'Fossil']
  },
  {
    sku: 'ASH-SOF-0030',
    ashleyCode: '5730338',
    name: 'Lombardia Leather Sofa',
    colors: ['Fossil', 'Tumbleweed']
  }
];

function generateAshleyImageUrls(ashleyCode) {
  const baseUrl = 'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture';

  const angles = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  const imageUrls = [];

  for (const angle of angles) {
    imageUrls.push(`${baseUrl}/${ashleyCode}_${angle}?$AFHS-PDP-Main$`);
  }

  return imageUrls;
}

async function updateProductImages() {
  console.log('Updating Ashley products with real Scene7 image URLs...\n');

  let totalUpdated = 0;
  let totalImages = 0;

  for (const product of ashleyProducts) {
    console.log(`\n${product.sku} - ${product.name}`);

    const { data: dbProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .maybeSingle();

    if (!dbProduct) {
      console.log(`  ✗ Not found in database`);
      continue;
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', dbProduct.id)
      .is('color_variant', null);

    const imageUrls = generateAshleyImageUrls(product.ashleyCode);

    for (let i = 0; i < imageUrls.length; i++) {
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: dbProduct.id,
          image_url: imageUrls[i],
          display_order: i + 1,
          alt_text: `${product.name} - View ${i + 1}`
        });

      if (!error) {
        totalImages++;
      }
    }

    console.log(`  ✓ Added ${imageUrls.length} main product images`);

    if (product.colors.length > 1) {
      for (let colorIdx = 0; colorIdx < product.colors.length; colorIdx++) {
        const colorName = product.colors[colorIdx];

        const colorImageUrl = `${imageUrls[0]}`;

        const { error: colorImgError } = await supabase
          .from('product_images')
          .insert({
            product_id: dbProduct.id,
            image_url: colorImageUrl,
            display_order: 100 + colorIdx,
            alt_text: `${product.name} - ${colorName}`,
            color_variant: colorName
          });

        if (!colorImgError) {
          totalImages++;
        }
      }
      console.log(`  ✓ Added ${product.colors.length} color variant references`);
    }

    totalUpdated++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Update Complete!');
  console.log('='.repeat(60));
  console.log(`Products updated: ${totalUpdated}`);
  console.log(`Total images added: ${totalImages}`);
  console.log('='.repeat(60));
}

updateProductImages().catch(console.error);
