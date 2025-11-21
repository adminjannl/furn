const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsd3F3ZGVhbWZqemFtdWx0ZXVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEyNDQ4NCwiZXhwIjoyMDc2NzAwNDg0fQ.6qBGPwPcD8y1S04D71A0YqkqOBu1T5jx1PW3O_wqMXI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const imageMapping = require('./manual-image-mapping.json');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function processAllBeds() {
  console.log('Starting image upload process...\n');

  const tempDir = path.join(__dirname, 'temp-bed-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const bedMapping of imageMapping) {
    try {
      console.log(`Processing ${bedMapping.sku}...`);

      const { data: product } = await supabase
        .from('products')
        .select('id, name')
        .eq('sku', bedMapping.sku)
        .maybeSingle();

      if (!product) {
        console.log(`  ❌ Product not found in database`);
        totalFailed++;
        continue;
      }

      console.log(`  Found ${bedMapping.images.length} images to process`);

      let imageSuccess = 0;
      for (let i = 0; i < bedMapping.images.length; i++) {
        const imageUrl = bedMapping.images[i];
        const ext = path.extname(imageUrl).split('?')[0];
        const filename = `${bedMapping.sku}-${i}${ext}`;
        const filepath = path.join(tempDir, filename);

        try {
          console.log(`  Downloading image ${i + 1}/${bedMapping.images.length}...`);
          await downloadImage(imageUrl, filepath);

          const fileBuffer = fs.readFileSync(filepath);
          const storagePath = `products/${filename}`;

          console.log(`  Uploading to Supabase storage...`);
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(storagePath, fileBuffer, {
              contentType: `image/${ext.replace('.', '')}`,
              upsert: true
            });

          if (uploadError) {
            console.log(`  ❌ Upload error: ${uploadError.message}`);
            continue;
          }

          const { data: publicUrl } = supabase.storage
            .from('product-images')
            .getPublicUrl(storagePath);

          console.log(`  Linking image to product...`);
          const { error: insertError } = await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              image_url: publicUrl.publicUrl,
              display_order: i,
              alt_text: `${product.name} - Image ${i + 1}`
            });

          if (insertError) {
            console.log(`  ❌ Database insert error: ${insertError.message}`);
          } else {
            console.log(`  ✓ Image ${i + 1} uploaded and linked`);
            imageSuccess++;
          }

          fs.unlinkSync(filepath);
        } catch (err) {
          console.log(`  ❌ Error processing image: ${err.message}`);
        }
      }

      if (imageSuccess > 0) {
        console.log(`  ✓ Successfully processed ${imageSuccess}/${bedMapping.images.length} images for ${bedMapping.sku}\n`);
        totalSuccess++;
      } else {
        console.log(`  ❌ Failed to process any images for ${bedMapping.sku}\n`);
        totalFailed++;
      }
      totalProcessed++;
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}\n`);
      totalFailed++;
    }
  }

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }

  console.log('\n=== Summary ===');
  console.log(`Total beds processed: ${totalProcessed}`);
  console.log(`Successfully processed: ${totalSuccess}`);
  console.log(`Failed: ${totalFailed}`);
  console.log('\nAll done!');
}

processAllBeds().catch(console.error);
