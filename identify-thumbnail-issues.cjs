require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function identifyThumbnailIssues() {
  try {
    console.log('Analyzing thumbnail display order issues...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        product_images (
          id,
          image_url,
          display_order
        )
      `)
      .eq('status', 'active')
      .order('sku', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    const issues = [];

    console.log('Products with display order issues:\n');
    console.log('='.repeat(100));

    products.forEach(product => {
      if (!product.product_images || product.product_images.length === 0) {
        return;
      }

      const sortedImages = product.product_images.sort((a, b) => a.display_order - b.display_order);
      const minDisplayOrder = sortedImages[0].display_order;

      if (minDisplayOrder !== 0) {
        issues.push({
          sku: product.sku,
          name: product.name,
          productId: product.id,
          currentMinOrder: minDisplayOrder,
          totalImages: sortedImages.length,
          images: sortedImages
        });

        console.log(`\n${product.sku}: ${product.name}`);
        console.log(`  ⚠️  Primary image starts at display_order ${minDisplayOrder} (should be 0)`);
        console.log(`  Total images: ${sortedImages.length}`);
        sortedImages.forEach(img => {
          console.log(`    [${img.display_order}] ${img.id.substring(0, 8)}... - ${img.image_url.substring(img.image_url.lastIndexOf('/') + 1, img.image_url.lastIndexOf('/') + 30)}...`);
        });
      }

      if (sortedImages.length > 1) {
        const orders = sortedImages.map(img => img.display_order);
        const hasGaps = orders.some((order, idx) => {
          if (idx === 0) return false;
          return order !== orders[idx - 1] + 1;
        });

        if (hasGaps && minDisplayOrder === 0) {
          console.log(`\n${product.sku}: ${product.name}`);
          console.log(`  ⚠️  Display order has gaps: [${orders.join(', ')}]`);
        }
      }
    });

    console.log('\n' + '='.repeat(100));
    console.log(`\nTotal products with display order issues: ${issues.length}\n`);

    if (issues.length > 0) {
      console.log('Migration fixes needed:\n');
      issues.forEach(issue => {
        console.log(`-- Fix ${issue.sku}`);
        issue.images.forEach((img, idx) => {
          if (img.display_order !== idx) {
            console.log(`UPDATE product_images SET display_order = ${idx} WHERE id = '${img.id}';`);
          }
        });
        console.log('');
      });
    }

    const fs = require('fs');
    fs.writeFileSync(
      'thumbnail-issues-report.json',
      JSON.stringify({ issues, totalIssues: issues.length }, null, 2)
    );
    console.log('✓ Detailed report saved to thumbnail-issues-report.json\n');

  } catch (error) {
    console.error('Error analyzing thumbnails:', error);
  }
}

identifyThumbnailIssues();
