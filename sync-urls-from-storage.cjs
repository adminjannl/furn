const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function syncUrls() {
  try {
    console.log('Fetching all product images from database...');

    const { data: objects, error } = await supabase
      .from('product_images')
      .select('id, product_id');

    if (error) {
      throw error;
    }

    console.log(`Found ${objects.length} product images in database`);

    let updated = 0;
    let failed = 0;

    for (const obj of objects) {
      const storageFileName = `${obj.product_id}/${obj.id}.png`;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(storageFileName);

      const newUrl = publicUrlData.publicUrl;

      const { data: currentImage } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('id', obj.id)
        .single();

      if (currentImage && currentImage.image_url.includes('supabase')) {
        console.log(`Skipping ${obj.id} (already updated)`);
        continue;
      }

      console.log(`Updating ${obj.id}...`);

      const { error: updateError } = await supabase
        .from('product_images')
        .update({ image_url: newUrl })
        .eq('id', obj.id);

      if (updateError) {
        console.error(`  ❌ Error: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  ✓ Success`);
        updated++;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✓ Complete! Updated: ${updated}, Failed: ${failed}`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

syncUrls();
