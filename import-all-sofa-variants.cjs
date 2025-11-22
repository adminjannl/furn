const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function importSofaVariants() {
  console.log('Importing all sofa color variants...\n');

  const { data: categories } = await supabase.from('categories').select('id, slug');
  const sofaCategoryId = categories.find(c => c.slug === 'sofas').id;

  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  let totalSofas = 0;
  let groupCount = 0;

  for (const [groupName, variants] of Object.entries(sofaGroups)) {
    groupCount++;

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (!variant.name || !variant.url) continue;

      const sku = `SOF-${String(totalSofas + 1).padStart(4, '0')}`;

      // Get image from URL or use placeholder
      const imageUrl = variant.imageUrl || variant.url.replace(/\/$/, '') + '/image.jpg';

      const { error } = await supabase.from('products').insert({
        sku,
        name: variant.name,
        slug: variant.slug || `${groupName.toLowerCase()}-${sku}`,
        description: `Premium modular sofa ${variant.name}`,
        price: 1499.99,
        category_id: sofaCategoryId,
        stock_quantity: 8,
        status: 'active'
      }).select();

      if (!error) {
        const { data: product } = await supabase.from('products').select('id').eq('sku', sku).single();
        if (product) {
          // Add main image
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: imageUrl,
            alt_text: variant.name,
            display_order: 1
          });

          // Add color variant if available
          if (variant.color && variant.color.colorName) {
            await supabase.from('product_colors').insert({
              product_id: product.id,
              color_name: variant.color.colorName,
              color_code: variant.color.colorCode || '#808080',
              image_url: imageUrl,
              is_available: true
            });
          }

          totalSofas++;
          if (totalSofas % 50 === 0) {
            process.stdout.write(`  ${totalSofas}...`);
          }
        }
      }

      // Stop at 624
      if (totalSofas >= 624) break;
    }

    if (totalSofas >= 624) break;
  }

  console.log(`\n✓ Imported ${totalSofas} sofa variants from ${groupCount} groups`);

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', sofaCategoryId);
  console.log(`✓ Total sofas in database: ${count}`);
}

importSofaVariants().catch(console.error);
