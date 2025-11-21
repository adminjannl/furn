const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function extractBedNameFromUrl(url) {
  if (!url) return '';

  const match = url.match(/krovat[_-]([a-zA-Z0-9_-]+)/i);
  if (match) {
    return match[1]
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .trim();
  }

  const filenameMatch = url.match(/\/([^\/]+)\.(jpg|jpeg|png|webp)/i);
  if (filenameMatch) {
    return filenameMatch[1]
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .trim();
  }

  return '';
}

function extractProductKeywords(productName) {
  const name = (productName || '').toLowerCase();

  const keywords = [];

  if (name.includes('boss') || name.includes('босс')) keywords.push('boss');
  if (name.includes('bella') || name.includes('белла')) keywords.push('bella');
  if (name.includes('freya') || name.includes('фрея')) keywords.push('freya');
  if (name.includes('leo') || name.includes('лео')) keywords.push('leo');
  if (name.includes('una') || name.includes('уна')) keywords.push('una');
  if (name.includes('loft') || name.includes('лофт')) keywords.push('loft');
  if (name.includes('ronda') || name.includes('ронда')) keywords.push('ronda');
  if (name.includes('nord') || name.includes('норд')) keywords.push('nord');
  if (name.includes('dream') || name.includes('дрим')) keywords.push('dream');

  if (name.includes('160')) keywords.push('160');
  if (name.includes('180')) keywords.push('180');
  if (name.includes('140')) keywords.push('140');

  if (name.includes('monolit') || name.includes('монолит')) keywords.push('monolit');
  if (name.includes('malmo') || name.includes('мальмо')) keywords.push('malmo');
  if (name.includes('royal') || name.includes('роял')) keywords.push('royal');

  if (name.includes('latte') || name.includes('латте')) keywords.push('latte');
  if (name.includes('gray') || name.includes('grey') || name.includes('серый') || name.includes('серая')) keywords.push('gray');
  if (name.includes('steel') || name.includes('сталь')) keywords.push('steel');
  if (name.includes('mocha') || name.includes('мокко')) keywords.push('mocha');

  return keywords;
}

function checkImageProductMatch(productName, originalName, imageUrl) {
  const productKeywords = extractProductKeywords(productName + ' ' + (originalName || ''));
  const imageName = extractBedNameFromUrl(imageUrl);

  let matchedKeywords = 0;
  let totalKeywords = productKeywords.length;

  productKeywords.forEach(keyword => {
    if (imageName.includes(keyword)) {
      matchedKeywords++;
    }
  });

  const matchScore = totalKeywords > 0 ? (matchedKeywords / totalKeywords) * 100 : 0;

  return {
    matches: matchedKeywords > 0,
    matchScore: matchScore.toFixed(1),
    matchedKeywords,
    totalKeywords,
    imageName
  };
}

function analyzeImageType(url, displayOrder) {
  const urlLower = url.toLowerCase();

  let likelyType = 'unknown';

  if (urlLower.includes('frame') && displayOrder === 0) {
    likelyType = 'front-view';
  } else if (urlLower.includes('int_') || urlLower.includes('interior')) {
    likelyType = 'lifestyle';
  } else if (displayOrder === 0) {
    likelyType = 'primary-front';
  } else if (displayOrder === 1) {
    likelyType = 'side-view';
  } else if (displayOrder > 1) {
    likelyType = 'detail';
  }

  return likelyType;
}

async function verifyAllImages() {
  console.log('🔍 COMPREHENSIVE IMAGE VERIFICATION\n');
  console.log('='.repeat(70) + '\n');

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      original_name,
      sku
    `)
    .order('name');

  if (error) throw error;

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .order('product_id')
    .order('display_order');

  console.log(`📊 Loaded ${products.length} products with ${images.length} images\n`);

  const productImageMap = {};
  images.forEach(img => {
    if (!productImageMap[img.product_id]) {
      productImageMap[img.product_id] = [];
    }
    productImageMap[img.product_id].push(img);
  });

  const issues = {
    missingPrimaryImage: [],
    lowMatchScore: [],
    externalImages: [],
    duplicateImages: [],
    incorrectDisplayOrder: [],
    suspiciousImages: []
  };

  const analysis = [];

  console.log('🔎 Analyzing each product...\n');

  for (const product of products) {
    const productImages = productImageMap[product.id] || [];

    if (productImages.length === 0) {
      issues.missingPrimaryImage.push({
        product: product.name,
        sku: product.sku,
        reason: 'No images at all'
      });
      continue;
    }

    const primaryImage = productImages.find(img => img.display_order === 0);

    if (!primaryImage) {
      issues.incorrectDisplayOrder.push({
        product: product.name,
        sku: product.sku,
        imageCount: productImages.length,
        reason: 'No image with display_order=0'
      });
    }

    productImages.forEach((img, idx) => {
      const matchResult = checkImageProductMatch(
        product.name,
        product.original_name,
        img.image_url
      );

      const imageType = analyzeImageType(img.image_url, img.display_order);

      const imageAnalysis = {
        productId: product.id,
        productName: product.name,
        originalName: product.original_name,
        sku: product.sku,
        imageUrl: img.image_url,
        displayOrder: img.display_order,
        altText: img.alt_text,
        matchScore: matchResult.matchScore,
        matchedKeywords: matchResult.matchedKeywords,
        totalKeywords: matchResult.totalKeywords,
        imageName: matchResult.imageName,
        imageType: imageType,
        isExternal: img.image_url.includes('mnogomebeli.com'),
        isPrimary: img.display_order === 0
      };

      analysis.push(imageAnalysis);

      if (parseFloat(matchResult.matchScore) < 30 && matchResult.totalKeywords > 0) {
        issues.lowMatchScore.push({
          product: product.name,
          sku: product.sku,
          imageUrl: img.image_url,
          matchScore: matchResult.matchScore,
          displayOrder: img.display_order
        });
      }

      if (img.image_url.includes('mnogomebeli.com')) {
        issues.externalImages.push({
          product: product.name,
          sku: product.sku,
          imageUrl: img.image_url,
          displayOrder: img.display_order
        });
      }
    });

    const imageUrls = productImages.map(img => img.image_url);
    const uniqueUrls = new Set(imageUrls);
    if (imageUrls.length !== uniqueUrls.size) {
      issues.duplicateImages.push({
        product: product.name,
        sku: product.sku,
        totalImages: imageUrls.length,
        uniqueImages: uniqueUrls.size
      });
    }
  }

  console.log('📋 VERIFICATION RESULTS\n');
  console.log('='.repeat(70) + '\n');

  console.log(`✅ Products analyzed: ${products.length}`);
  console.log(`✅ Total images: ${images.length}`);
  console.log(`✅ Average images per product: ${(images.length / products.length).toFixed(2)}\n`);

  console.log('⚠️  ISSUES FOUND:\n');

  console.log(`1. Missing Primary Images (display_order=0): ${issues.incorrectDisplayOrder.length}`);
  if (issues.incorrectDisplayOrder.length > 0) {
    issues.incorrectDisplayOrder.slice(0, 5).forEach(issue => {
      console.log(`   • ${issue.product} (${issue.sku})`);
      console.log(`     Has ${issue.imageCount} images but no primary (display_order=0)`);
    });
    if (issues.incorrectDisplayOrder.length > 5) {
      console.log(`   ... and ${issues.incorrectDisplayOrder.length - 5} more`);
    }
    console.log();
  }

  console.log(`2. Low Image-Product Match Score (<30%): ${issues.lowMatchScore.length}`);
  if (issues.lowMatchScore.length > 0) {
    issues.lowMatchScore.slice(0, 5).forEach(issue => {
      console.log(`   • ${issue.product} (${issue.sku})`);
      console.log(`     Match: ${issue.matchScore}% - Order: ${issue.displayOrder}`);
      console.log(`     ${issue.imageUrl.substring(0, 80)}...`);
    });
    if (issues.lowMatchScore.length > 5) {
      console.log(`   ... and ${issues.lowMatchScore.length - 5} more`);
    }
    console.log();
  }

  console.log(`3. External Images (need migration): ${issues.externalImages.length}`);
  if (issues.externalImages.length > 0) {
    console.log(`   First 3 examples:`);
    issues.externalImages.slice(0, 3).forEach(issue => {
      console.log(`   • ${issue.product}`);
      console.log(`     ${issue.imageUrl}`);
    });
    console.log();
  }

  console.log(`4. Duplicate Images (same URL): ${issues.duplicateImages.length}`);
  if (issues.duplicateImages.length > 0) {
    issues.duplicateImages.forEach(issue => {
      console.log(`   • ${issue.product}: ${issue.totalImages} images, ${issue.uniqueImages} unique`);
    });
    console.log();
  }

  console.log('='.repeat(70) + '\n');

  console.log('📊 PRIMARY IMAGE ANALYSIS:\n');
  const primaryImages = analysis.filter(a => a.isPrimary);
  const primaryExternal = primaryImages.filter(a => a.isExternal);
  const primaryLowMatch = primaryImages.filter(a => parseFloat(a.matchScore) < 50);

  console.log(`   Total primary images: ${primaryImages.length}`);
  console.log(`   External (mnogomebeli): ${primaryExternal.length} (${(primaryExternal.length/primaryImages.length*100).toFixed(1)}%)`);
  console.log(`   Low match score: ${primaryLowMatch.length}`);
  console.log();

  console.log('💡 RECOMMENDATIONS:\n');

  if (issues.incorrectDisplayOrder.length > 0) {
    console.log(`   ⚠️  FIX: ${issues.incorrectDisplayOrder.length} products need display_order correction`);
    console.log('      → Set the best front-view image to display_order=0\n');
  }

  if (issues.externalImages.length > 0) {
    console.log(`   ⚠️  MIGRATE: ${issues.externalImages.length} external images`);
    console.log('      → Download and upload to Supabase Storage\n');
  }

  if (issues.lowMatchScore.length > 0) {
    console.log(`   ⚠️  REVIEW: ${issues.lowMatchScore.length} images with low match scores`);
    console.log('      → Verify these are correct product images\n');
  }

  if (issues.duplicateImages.length > 0) {
    console.log(`   ⚠️  CLEAN: ${issues.duplicateImages.length} products with duplicate images\n`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalProducts: products.length,
      totalImages: images.length,
      averageImagesPerProduct: images.length / products.length
    },
    issues,
    analysis: analysis.slice(0, 100),
    recommendations: [
      issues.incorrectDisplayOrder.length > 0 ? `Fix ${issues.incorrectDisplayOrder.length} products with no primary image` : null,
      issues.externalImages.length > 0 ? `Migrate ${issues.externalImages.length} external images` : null,
      issues.lowMatchScore.length > 0 ? `Review ${issues.lowMatchScore.length} low-match images` : null,
      issues.duplicateImages.length > 0 ? `Remove ${issues.duplicateImages.length} duplicate images` : null
    ].filter(Boolean)
  };

  const reportPath = path.join(__dirname, 'image-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`💾 Full report saved to: image-verification-report.json\n`);
  console.log('='.repeat(70) + '\n');

  return report;
}

verifyAllImages()
  .then(() => {
    console.log('✅ Image verification complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
