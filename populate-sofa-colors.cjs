const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function populateSofaColors() {
  console.log('\n🎨 Populating sofa color variants...\n');

  const variantGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  let totalInserted = 0;
  let groupsProcessed = 0;

  for (const [baseName, products] of Object.entries(variantGroups)) {
    groupsProcessed++;
    process.stdout.write(`\r[${groupsProcessed}/${Object.keys(variantGroups).length}] ${baseName.substring(0, 50).padEnd(50)}`);

    // For each product in the group, add all other products as color variants
    for (const product of products) {
      // Delete existing colors for this product
      await supabase
        .from('product_colors')
        .delete()
        .eq('product_id', product.id);

      // Add all variants (including itself)
      const colorEntries = products
        .filter(p => p.color) // Only include products with detected colors
        .map(variant => ({
          product_id: product.id,
          color_name: variant.color.colorName,
          color_code: variant.color.colorCode,
          variant_slug: variant.slug
        }));

      if (colorEntries.length > 0) {
        const { error } = await supabase
          .from('product_colors')
          .insert(colorEntries);

        if (!error) {
          totalInserted += colorEntries.length;
        } else {
          console.error(`\nError inserting colors for ${product.name}:`, error.message);
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n\n✅ Complete!');
  console.log(`Processed ${groupsProcessed} product groups`);
  console.log(`Inserted ${totalInserted} color variant links`);
}

populateSofaColors().catch(console.error);
