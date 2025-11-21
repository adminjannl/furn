const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateColorThumbnails() {
  console.log('\n🖼️  Updating color variant thumbnails...\n');

  // Get all color entries
  const { data: colorEntries } = await supabase
    .from('product_colors')
    .select('id, variant_slug');

  console.log(`Found ${colorEntries.length} color entries to update\n`);

  let updated = 0;
  let notFound = 0;

  for (let i = 0; i < colorEntries.length; i++) {
    const entry = colorEntries[i];

    if (i % 100 === 0) {
      process.stdout.write(`\r[${i}/${colorEntries.length}] Processing...`);
    }

    // Get the variant product's first image
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        product_images!inner(image_url)
      `)
      .eq('slug', entry.variant_slug)
      .eq('product_images.display_order', 0)
      .maybeSingle();

    if (product && product.product_images?.[0]?.image_url) {
      await supabase
        .from('product_colors')
        .update({ variant_thumbnail_url: product.product_images[0].image_url })
        .eq('id', entry.id);

      updated++;
    } else {
      notFound++;
    }
  }

  console.log(`\n\n✅ Complete!`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);
}

updateColorThumbnails().catch(console.error);
