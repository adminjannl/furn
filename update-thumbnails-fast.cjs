const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateColorThumbnails() {
  console.log('\n🖼️  Updating color variant thumbnails (fast mode)...\n');

  // Get all products with their first image in one query
  const { data: products } = await supabase
    .from('products')
    .select('slug, product_images!inner(image_url)')
    .eq('product_images.display_order', 0);

  console.log(`Loaded ${products.length} products with images`);

  // Create a map of slug -> thumbnail
  const thumbnailMap = new Map();
  products.forEach(p => {
    if (p.product_images?.[0]?.image_url) {
      thumbnailMap.set(p.slug, p.product_images[0].image_url);
    }
  });

  console.log(`Created thumbnail map with ${thumbnailMap.size} entries\n`);

  // Get all color entries that need updating
  const { data: colorEntries } = await supabase
    .from('product_colors')
    .select('id, variant_slug')
    .is('variant_thumbnail_url', null);

  console.log(`Found ${colorEntries.length} color entries to update\n`);

  // Batch update
  const updates = [];
  for (const entry of colorEntries) {
    const thumbnail = thumbnailMap.get(entry.variant_slug);
    if (thumbnail) {
      updates.push({
        id: entry.id,
        variant_thumbnail_url: thumbnail
      });
    }
  }

  console.log(`Prepared ${updates.length} updates\n`);

  // Update in batches of 500
  for (let i = 0; i < updates.length; i += 500) {
    const batch = updates.slice(i, i + 500);
    process.stdout.write(`\r[${Math.min(i + 500, updates.length)}/${updates.length}] Updating...`);

    for (const update of batch) {
      await supabase
        .from('product_colors')
        .update({ variant_thumbnail_url: update.variant_thumbnail_url })
        .eq('id', update.id);
    }
  }

  console.log('\n\n✅ Complete!');
  console.log(`Updated ${updates.length} color thumbnails`);
}

updateColorThumbnails().catch(console.error);
