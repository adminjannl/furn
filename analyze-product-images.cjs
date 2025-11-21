require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeProductImages() {
  try {
    console.log('Fetching all products with their images...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        slug,
        status,
        product_images (
          id,
          image_url,
          display_order,
          alt_text
        )
      `)
      .eq('status', 'active')
      .order('sku', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    console.log(`Found ${products.length} active products\n`);
    console.log('='.repeat(100));

    const productsWithImages = products.filter(p => p.product_images && p.product_images.length > 0);
    const productsWithoutImages = products.filter(p => !p.product_images || p.product_images.length === 0);

    console.log(`\nProducts with images: ${productsWithImages.length}`);
    console.log(`Products without images: ${productsWithoutImages.length}\n`);

    if (productsWithoutImages.length > 0) {
      console.log('Products WITHOUT images:');
      productsWithoutImages.forEach(p => {
        console.log(`  - ${p.sku}: ${p.name}`);
      });
      console.log('');
    }

    console.log('Analyzing image display order for each product:\n');
    console.log('='.repeat(100));

    const imageAnalysis = [];

    productsWithImages.forEach(product => {
      const sortedImages = product.product_images.sort((a, b) => a.display_order - b.display_order);
      const primaryImage = sortedImages[0];

      const imageInfo = {
        sku: product.sku,
        name: product.name,
        totalImages: sortedImages.length,
        primaryImageUrl: primaryImage.image_url,
        primaryDisplayOrder: primaryImage.display_order,
        allImages: sortedImages.map((img, idx) => ({
          currentOrder: img.display_order,
          imageId: img.id,
          url: img.image_url,
          isShared: false
        }))
      };

      const sharedPromoImage = 'https://mnogomebeli.com/upload/iblock/623/5q0cn3vu2khocx3hhhu7eck3lae1cogu/krovat-boss-160-v-podarok_1284x1000.jpg';
      const commonInteriorImage = 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg';

      imageInfo.allImages.forEach(img => {
        if (img.url === sharedPromoImage || img.url === commonInteriorImage) {
          img.isShared = true;
        }
      });

      imageInfo.hasSharedPrimary = imageInfo.allImages[0].isShared;
      imageInfo.hasNonSharedImages = imageInfo.allImages.some(img => !img.isShared);

      imageAnalysis.push(imageInfo);

      console.log(`\n${product.sku}: ${product.name}`);
      console.log(`  Total images: ${sortedImages.length}`);
      console.log(`  Primary image (display_order ${primaryImage.display_order}):`);
      console.log(`    ${primaryImage.image_url.substring(0, 80)}${primaryImage.image_url.length > 80 ? '...' : ''}`);

      if (imageInfo.hasSharedPrimary) {
        console.log(`    ⚠️  WARNING: Using shared promotional/interior image as primary`);
        if (imageInfo.hasNonSharedImages) {
          const firstNonShared = imageInfo.allImages.find(img => !img.isShared);
          if (firstNonShared) {
            console.log(`    ✓  Has product-specific image at position ${firstNonShared.currentOrder}`);
          }
        }
      }

      if (sortedImages.length > 1) {
        console.log(`  Other images:`);
        sortedImages.slice(1).forEach((img, idx) => {
          const isShared = img.image_url === sharedPromoImage || img.image_url === commonInteriorImage;
          console.log(`    [${img.display_order}] ${img.image_url.substring(0, 70)}${img.image_url.length > 70 ? '...' : ''}${isShared ? ' (shared)' : ''}`);
        });
      }
    });

    console.log('\n' + '='.repeat(100));
    console.log('\nSUMMARY:\n');

    const productsWithSharedPrimary = imageAnalysis.filter(p => p.hasSharedPrimary);
    const productsNeedingReorder = productsWithSharedPrimary.filter(p => p.hasNonSharedImages);

    console.log(`Total products analyzed: ${imageAnalysis.length}`);
    console.log(`Products using shared image as primary: ${productsWithSharedPrimary.length}`);
    console.log(`Products that can be fixed (have product-specific images): ${productsNeedingReorder.length}`);
    console.log(`Products that need product-specific images: ${productsWithSharedPrimary.length - productsNeedingReorder.length}`);

    if (productsNeedingReorder.length > 0) {
      console.log('\n\nProducts that need image reordering:');
      productsNeedingReorder.forEach(p => {
        const firstNonShared = p.allImages.find(img => !img.isShared);
        console.log(`  ${p.sku}: Move image at position ${firstNonShared.currentOrder} to position 0`);
      });
    }

    const fs = require('fs');
    fs.writeFileSync(
      'product-image-analysis.json',
      JSON.stringify({ productsWithImages: imageAnalysis, productsWithoutImages }, null, 2)
    );
    console.log('\n✓ Detailed analysis saved to product-image-analysis.json');

  } catch (error) {
    console.error('Error analyzing products:', error);
  }
}

analyzeProductImages();
