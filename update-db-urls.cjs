const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateDatabaseUrls() {
  try {
    console.log('Fetching all storage objects...');
    const { data: storageObjects, error: storageError } = await supabase
      .storage
      .from('product-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (storageError) {
      throw storageError;
    }

    console.log(`Found ${storageObjects.length} storage folders`);

    let totalUpdated = 0;
    let totalFailed = 0;

    for (const folder of storageObjects) {
      if (folder.id) {
        const { data: files, error: filesError } = await supabase
          .storage
          .from('product-images')
          .list(folder.name, {
            limit: 100
          });

        if (filesError) {
          console.error(`Error listing files in ${folder.name}:`, filesError);
          continue;
        }

        for (const file of files) {
          if (file.name.endsWith('.png')) {
            const imageId = file.name.replace('.png', '');
            const storageFileName = `${folder.name}/${file.name}`;

            const { data: publicUrlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(storageFileName);

            const newUrl = publicUrlData.publicUrl;

            console.log(`Updating ${imageId}...`);

            const { error: updateError } = await supabase
              .from('product_images')
              .update({ image_url: newUrl })
              .eq('id', imageId);

            if (updateError) {
              console.error(`  ❌ Failed: ${updateError.message}`);
              totalFailed++;
            } else {
              console.log(`  ✓ Updated`);
              totalUpdated++;
            }
          }
        }
      }
    }

    console.log(`\n✓ Complete! Updated: ${totalUpdated}, Failed: ${totalFailed}`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

updateDatabaseUrls();
