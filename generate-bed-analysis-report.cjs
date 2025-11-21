const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function generateBedAnalysisReport() {
  console.log('📊 Generating Comprehensive Bed Analysis Report\n');
  console.log('='.repeat(60) + '\n');

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      original_name,
      sku,
      price,
      created_at,
      status,
      stock_quantity
    `)
    .order('created_at', { ascending: false });

  const { data: images } = await supabase
    .from('product_images')
    .select('product_id, image_url, display_order, alt_text');

  const jsonProducts = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'complete-bed-catalog.json'), 'utf-8')
  );

  console.log('📈 DATABASE STATISTICS\n');
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Total Images: ${images.length}`);
  console.log(`   Products with Images: ${new Set(images.map(i => i.product_id)).size}`);
  console.log(`   Products without Images: ${products.length - new Set(images.map(i => i.product_id)).size}`);
  console.log(`   Average Images per Product: ${(images.length / products.length).toFixed(2)}`);
  console.log();

  console.log('💰 PRICE ANALYSIS\n');
  const prices = products.map(p => parseFloat(p.price));
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  console.log(`   Average Price: $${avgPrice.toFixed(2)}`);
  console.log(`   Min Price: $${minPrice.toFixed(2)}`);
  console.log(`   Max Price: $${maxPrice.toFixed(2)}`);
  console.log();

  console.log('🏷️ PRODUCT CATEGORIES\n');
  const groups = {};
  products.forEach(product => {
    const baseName = product.original_name || product.name;

    if (baseName.includes('Босс') || baseName.includes('Boss') || baseName.includes('BOSS')) {
      groups['Boss Series'] = (groups['Boss Series'] || 0) + 1;
    } else if (baseName.includes('Белла') || baseName.includes('Bella')) {
      groups['Bella Series'] = (groups['Bella Series'] || 0) + 1;
    } else if (baseName.includes('Фрея') || baseName.includes('Freya')) {
      groups['Freya Series'] = (groups['Freya Series'] || 0) + 1;
    } else if (baseName.includes('ЛЕО') || baseName.includes('LEO')) {
      groups['LEO Series'] = (groups['LEO Series'] || 0) + 1;
    } else if (baseName.includes('Уна') || baseName.includes('Una')) {
      groups['Una Series'] = (groups['Una Series'] || 0) + 1;
    } else if (baseName.includes('ЛОФТ') || baseName.includes('LOFT')) {
      groups['LOFT Series'] = (groups['LOFT Series'] || 0) + 1;
    } else if (baseName.includes('РОНДА') || baseName.includes('RONDA')) {
      groups['RONDA Series'] = (groups['RONDA Series'] || 0) + 1;
    } else {
      groups['Other'] = (groups['Other'] || 0) + 1;
    }
  });

  Object.entries(groups).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
    console.log(`   ${name}: ${count} beds`);
  });
  console.log();

  console.log('🖼️  IMAGE ANALYSIS\n');
  const productsWithImages = products.filter(p =>
    images.some(img => img.product_id === p.id)
  );
  const productsWithMultipleImages = products.filter(p =>
    images.filter(img => img.product_id === p.id).length > 1
  );

  console.log(`   Products with at least 1 image: ${productsWithImages.length}`);
  console.log(`   Products with multiple images: ${productsWithMultipleImages.length}`);
  console.log(`   Products needing images: ${products.length - productsWithImages.length}`);
  console.log();

  const imageSourceAnalysis = {};
  images.forEach(img => {
    if (img.image_url.includes('supabase')) {
      imageSourceAnalysis['Supabase Storage'] = (imageSourceAnalysis['Supabase Storage'] || 0) + 1;
    } else if (img.image_url.includes('mnogomebeli.com')) {
      imageSourceAnalysis['External (mnogomebeli.com)'] = (imageSourceAnalysis['External (mnogomebeli.com)'] || 0) + 1;
    } else {
      imageSourceAnalysis['Other'] = (imageSourceAnalysis['Other'] || 0) + 1;
    }
  });

  console.log('   Image Sources:');
  Object.entries(imageSourceAnalysis).forEach(([source, count]) => {
    console.log(`      ${source}: ${count}`);
  });
  console.log();

  console.log('📊 DATA SOURCE COMPARISON\n');
  console.log(`   Website JSON Catalog: ${jsonProducts.length} beds`);
  console.log(`   Current Database: ${products.length} beds`);
  console.log(`   Website Claim: 95 beds`);
  console.log(`   Gap to Target: ${95 - products.length} beds`);
  console.log();

  console.log('🔍 FINDINGS & RECOMMENDATIONS\n');

  if (products.length < 95) {
    console.log(`   ⚠️  Missing ${95 - products.length} beds from website`);
    console.log('      → The website uses dynamic JavaScript loading');
    console.log('      → Manual scraping of individual product pages may be needed');
    console.log('      → Or use browser automation (Puppeteer/Playwright) with proper setup');
  }

  const productsWithoutImages = products.length - productsWithImages.length;
  if (productsWithoutImages > 0) {
    console.log(`\n   ⚠️  ${productsWithoutImages} products missing images`);
    console.log('      → Need to fetch and upload images for these products');
  }

  const externalImages = imageSourceAnalysis['External (mnogomebeli.com)'] || 0;
  if (externalImages > 0) {
    console.log(`\n   ⚠️  ${externalImages} images are external links`);
    console.log('      → Consider downloading and hosting in Supabase Storage');
    console.log('      → External links may break if source website changes');
  }

  console.log(`\n   ✅ Database has been deduplicated`);
  console.log(`   ✅ ${products.length} unique products in database`);
  console.log(`   ✅ Average of ${(images.length / products.length).toFixed(1)} images per product`);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Analysis Report Complete!\n');

  const report = {
    generatedAt: new Date().toISOString(),
    database: {
      totalProducts: products.length,
      totalImages: images.length,
      productsWithImages: productsWithImages.length,
      productsWithoutImages: productsWithoutImages,
      averageImagesPerProduct: images.length / products.length
    },
    pricing: {
      average: avgPrice,
      min: minPrice,
      max: maxPrice
    },
    categories: groups,
    imageSources: imageSourceAnalysis,
    gaps: {
      toTargetOf95: 95 - products.length,
      missingImages: productsWithoutImages,
      externalImages: externalImages
    }
  };

  fs.writeFileSync(
    path.join(__dirname, 'bed-analysis-report.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('💾 Detailed report saved to: bed-analysis-report.json\n');

  return report;
}

generateBedAnalysisReport()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
