const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function analyzeImageConsistency() {
  console.log('🖼️  Analyzing Image Consistency for Front-View Display\n');
  console.log('='.repeat(60) + '\n');

  const { data: images } = await supabase
    .from('product_images')
    .select(`
      id,
      product_id,
      image_url,
      display_order,
      alt_text,
      products (
        name,
        original_name
      )
    `)
    .order('product_id')
    .order('display_order');

  console.log(`📊 Total Images: ${images.length}\n`);

  const productImageMap = {};
  images.forEach(img => {
    if (!productImageMap[img.product_id]) {
      productImageMap[img.product_id] = [];
    }
    productImageMap[img.product_id].push(img);
  });

  const products = Object.keys(productImageMap);

  console.log('📋 IMAGE DISTRIBUTION:\n');
  const distribution = {};
  products.forEach(productId => {
    const count = productImageMap[productId].length;
    distribution[count] = (distribution[count] || 0) + 1;
  });

  Object.entries(distribution).sort((a, b) => a[0] - b[0]).forEach(([count, products]) => {
    console.log(`   Products with ${count} image(s): ${products}`);
  });
  console.log();

  console.log('🎯 PRIMARY IMAGE ANALYSIS (display_order = 0):\n');

  const primaryImages = images.filter(img => img.display_order === 0);
  console.log(`   Total primary images: ${primaryImages.length}`);
  console.log(`   Total products: ${products.length}`);
  console.log(`   Products with primary image: ${primaryImages.length}`);
  console.log(`   Products missing primary image: ${products.length - primaryImages.length}\n`);

  console.log('🌐 IMAGE SOURCE ANALYSIS:\n');
  const sources = {
    supabaseStorage: 0,
    externalMnogomebeli: 0,
    other: 0
  };

  images.forEach(img => {
    if (img.image_url.includes('supabase.co/storage')) {
      sources.supabaseStorage++;
    } else if (img.image_url.includes('mnogomebeli.com')) {
      sources.externalMnogomebeli++;
    } else {
      sources.other++;
    }
  });

  console.log(`   Supabase Storage: ${sources.supabaseStorage} (${(sources.supabaseStorage / images.length * 100).toFixed(1)}%)`);
  console.log(`   External (mnogomebeli.com): ${sources.externalMnogomebeli} (${(sources.externalMnogomebeli / images.length * 100).toFixed(1)}%)`);
  console.log(`   Other: ${sources.other} (${(sources.other / images.length * 100).toFixed(1)}%)\n`);

  console.log('⚠️  EXTERNAL IMAGE DEPENDENCIES:\n');
  if (sources.externalMnogomebeli > 0) {
    console.log(`   ${sources.externalMnogomebeli} images are hosted externally`);
    console.log('   → These links may break if source website changes');
    console.log('   → Consider downloading and hosting in Supabase Storage');
    console.log('   → This ensures long-term availability and faster load times\n');

    console.log('   Sample external images:');
    const externalSamples = images
      .filter(img => img.image_url.includes('mnogomebeli.com'))
      .slice(0, 5);

    externalSamples.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.products.name}`);
      console.log(`      ${img.image_url}\n`);
    });
  }

  console.log('=' + '='.repeat(59) + '\n');
  console.log('📝 RECOMMENDATIONS FOR FRONT-VIEW CONSISTENCY:\n');

  console.log('1. IMAGE NAMING CONVENTION:');
  console.log('   → Use consistent naming: {product-name}-front-view.jpg');
  console.log('   → Example: "bed-boss-160x200-latte-front-view.jpg"\n');

  console.log('2. PRIMARY IMAGE (display_order = 0):');
  console.log('   → MUST always be a front-facing view');
  console.log('   → Should show the bed headboard prominently');
  console.log('   → Consistent angle: straight-on or slight 3/4 view');
  console.log('   → Neutral background for product focus\n');

  console.log('3. ADDITIONAL IMAGES (display_order > 0):');
  console.log('   → Side view (display_order = 1)');
  console.log('   → Detail shots: fabric, mechanism, etc. (display_order = 2+)');
  console.log('   → Lifestyle/in-room shots (display_order = 3+)\n');

  console.log('4. IMAGE QUALITY STANDARDS:');
  console.log('   → Minimum resolution: 1200x800px');
  console.log('   → Format: JPEG (for photos), PNG (for graphics)');
  console.log('   → File size: Optimized < 200KB per image');
  console.log('   → Consistent lighting across all products\n');

  console.log('5. MIGRATION TO SUPABASE STORAGE:');
  console.log('   → Download all external images');
  console.log('   → Optimize and process images');
  console.log('   → Upload to Supabase Storage bucket');
  console.log('   → Update database image_url references');
  console.log('   → Verify all images load correctly\n');

  console.log('6. ALT TEXT FOR ACCESSIBILITY:');
  console.log('   → Format: "{Product Name} - Front View"');
  console.log('   → Example: "Bed Boss 160x200 Monolit Latte - Front View"');
  console.log('   → Ensures SEO and accessibility compliance\n');

  const report = {
    timestamp: new Date().toISOString(),
    totals: {
      images: images.length,
      products: products.length,
      primaryImages: primaryImages.length
    },
    distribution,
    sources,
    externalDependencies: {
      count: sources.externalMnogomebeli,
      percentage: (sources.externalMnogomebeli / images.length * 100).toFixed(1),
      samples: images
        .filter(img => img.image_url.includes('mnogomebeli.com'))
        .slice(0, 10)
        .map(img => ({
          product: img.products.name,
          url: img.image_url
        }))
    },
    recommendations: [
      'Migrate external images to Supabase Storage',
      'Ensure primary image (display_order=0) is always front-view',
      'Standardize image naming convention',
      'Optimize all images for web (< 200KB)',
      'Add consistent alt text for SEO',
      'Maintain consistent lighting and angle across products'
    ]
  };

  fs.writeFileSync(
    path.join(__dirname, 'image-consistency-report.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('💾 Detailed report saved to: image-consistency-report.json\n');
  console.log('=' + '='.repeat(59) + '\n');

  return report;
}

analyzeImageConsistency()
  .then(() => {
    console.log('✅ Image consistency analysis complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
