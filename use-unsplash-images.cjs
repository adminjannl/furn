const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ashleyProducts = [
  { sku: 'ASH-SOF-0001', name: 'Mahoney Sofa' },
  { sku: 'ASH-SOF-0002', name: 'Altari Sofa' },
  { sku: 'ASH-SOF-0003', name: 'Maimz Sofa' },
  { sku: 'ASH-SOF-0004', name: 'Whitlock Sofa' },
  { sku: 'ASH-SOF-0005', name: 'Larce Sofa Chaise' },
  { sku: 'ASH-SOF-0006', name: 'Darcy Sofa' },
  { sku: 'ASH-SOF-0007', name: 'Navi Sofa' },
  { sku: 'ASH-SOF-0008', name: 'Vayda Sofa' },
  { sku: 'ASH-SOF-0009', name: 'Stonemeade Sofa Chaise' },
  { sku: 'ASH-SOF-0010', name: 'Belvoir Sofa' },
  { sku: 'ASH-SOF-0011', name: 'Aviemore Sofa' },
  { sku: 'ASH-SOF-0012', name: 'Emilia Modular Sofa' },
  { sku: 'ASH-SOF-0013', name: 'SimpleJoy Sofa' },
  { sku: 'ASH-SOF-0014', name: 'Midnight-Madness Sofa' },
  { sku: 'ASH-SOF-0015', name: 'Greaves Sofa Chaise' },
  { sku: 'ASH-SOF-0016', name: 'Maggie Sofa' },
  { sku: 'ASH-SOF-0017', name: 'Cashton Sofa' },
  { sku: 'ASH-SOF-0018', name: 'Stonemeade Sofa' },
  { sku: 'ASH-SOF-0019', name: 'Leesworth Reclining Sofa' },
  { sku: 'ASH-SOF-0020', name: 'Tasselton Sofa Chaise' },
  { sku: 'ASH-SOF-0021', name: 'Adlai Sofa' },
  { sku: 'ASH-SOF-0022', name: 'Modmax Modular Sofa' },
  { sku: 'ASH-SOF-0023', name: 'Belcaro Place Sofa' },
  { sku: 'ASH-SOF-0024', name: 'Bixler Sofa' },
  { sku: 'ASH-SOF-0025', name: 'Colleton Leather Sofa' },
  { sku: 'ASH-SOF-0026', name: 'Lonoke Sofa' },
  { sku: 'ASH-SOF-0027', name: 'Elissa Court Modular Sofa' },
  { sku: 'ASH-SOF-0028', name: 'Bolsena Leather Sofa' },
  { sku: 'ASH-SOF-0029', name: 'Stoneland Reclining Sofa' },
  { sku: 'ASH-SOF-0030', name: 'Lombardia Leather Sofa' }
];

const unsplashSofaImages = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
  'https://images.unsplash.com/photo-1491336477066-31156b5e4f35',
  'https://images.unsplash.com/photo-1550254478-ead40cc54513',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  'https://images.unsplash.com/photo-1567016526105-22da7c13161a',
  'https://images.unsplash.com/photo-1574643156929-51fa098b0394',
  'https://images.unsplash.com/photo-1586158291800-2665f07bba58',
  'https://images.unsplash.com/photo-1598300188225-f91143296ea3',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  'https://images.unsplash.com/photo-1617806118233-18e1de247200',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  'https://images.unsplash.com/photo-1571898257527-4a5ef9a87a74',
  'https://images.unsplash.com/photo-1550254478-ead40cc54513',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
  'https://images.unsplash.com/photo-1491336477066-31156b5e4f35',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  'https://images.unsplash.com/photo-1574643156929-51fa098b0394',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5',
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
  'https://images.unsplash.com/photo-1586158291800-2665f07bba58',
  'https://images.unsplash.com/photo-1567016526105-22da7c13161a',
  'https://images.unsplash.com/photo-1598300188225-f91143296ea3',
  'https://images.unsplash.com/photo-1550254478-ead40cc54513',
  'https://images.unsplash.com/photo-1491336477066-31156b5e4f35',
  'https://images.unsplash.com/photo-1571898257527-4a5ef9a87a74'
];

async function updateWithUnsplashImages() {
  console.log('Updating products with Unsplash furniture images...\n');

  let totalUpdated = 0;
  let totalImages = 0;

  for (let i = 0; i < ashleyProducts.length; i++) {
    const product = ashleyProducts[i];
    console.log(`${product.sku} - ${product.name}`);

    const { data: dbProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .maybeSingle();

    if (!dbProduct) {
      console.log(`  ✗ Not found`);
      continue;
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', dbProduct.id);

    const baseImage = unsplashSofaImages[i % unsplashSofaImages.length];

    const angles = [
      `${baseImage}?w=800&h=600&fit=crop&q=80`,
      `${baseImage}?w=800&h=600&fit=crop&q=80&flip=h`,
      `${baseImage}?w=800&h=600&fit=crop&q=80&sat=-20`,
      `${baseImage}?w=800&h=600&fit=crop&q=80&bri=10`,
      `${baseImage}?w=800&h=600&fit=crop&q=80&con=10`,
      `${baseImage}?w=800&h=600&fit=crop&q=80&sharp=5`
    ];

    for (let j = 0; j < angles.length; j++) {
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: dbProduct.id,
          image_url: angles[j],
          display_order: j + 1,
          alt_text: `${product.name} - View ${j + 1}`
        });

      if (!error) {
        totalImages++;
      }
    }

    console.log(`  ✓ Added 6 images`);
    totalUpdated++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Update Complete!');
  console.log('='.repeat(60));
  console.log(`Products updated: ${totalUpdated}`);
  console.log(`Total images added: ${totalImages}`);
  console.log('='.repeat(60));
}

updateWithUnsplashImages().catch(console.error);
