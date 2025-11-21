const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsd3F3ZGVhbWZqemFtdWx0ZXVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEyNDQ4NCwiZXhwIjoyMDc2NzAwNDg0fQ.6qBGPwPcD8y1S04D71A0YqkqOBu1T5jx1PW3O_wqMXI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const beds = [
  { sku: 'BED-MNM-0041', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-agat/' },
  { sku: 'BED-MNM-0042', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/krovat-boss-drim-160-velyur-royal-belyy/' },
  { sku: 'BED-MNM-0043', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/krovat-boss-drim-160-velyur-royal-grafit/' },
  { sku: 'BED-MNM-0044', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/krovat-boss-drim-160-velyur-royal-kofe/' },
  { sku: 'BED-MNM-0045', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-korichnevyy/' },
  { sku: 'BED-MNM-0046', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-mokko/' },
  { sku: 'BED-MNM-0047', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-olivkovyy/' },
  { sku: 'BED-MNM-0048', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-orekhovo-korichnevyy/' },
  { sku: 'BED-MNM-0049', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-rozovyy/' },
  { sku: 'BED-MNM-0050', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-seryy/' },
  { sku: 'BED-MNM-0051', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-siniy/' },
  { sku: 'BED-MNM-0052', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-temno-seryy/' },
  { sku: 'BED-MNM-0053', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-fioletovyy/' },
  { sku: 'BED-MNM-0054', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-khoraki/' },
  { sku: 'BED-MNM-0055', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-chyernyy/' },
  { sku: 'BED-MNM-0056', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-agat/' },
  { sku: 'BED-MNM-0057', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-belyy/' },
  { sku: 'BED-MNM-0058', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-grafit/' },
  { sku: 'BED-MNM-0059', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-kofe/' },
  { sku: 'BED-MNM-0060', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-korichnevyy/' },
  { sku: 'BED-MNM-0061', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-mokko/' },
  { sku: 'BED-MNM-0062', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-olivkovyy/' },
  { sku: 'BED-MNM-0063', url: 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-orekhovo-korichnevyy/' }
];

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

function extractImagesFromHTML(html) {
  const imageUrls = [];
  const imageRegex = /https:\/\/mnogomebeli\.com\/upload\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi;
  const matches = html.matchAll(imageRegex);

  for (const match of matches) {
    const url = match[0];
    if (!url.includes('resize_cache') && !imageUrls.includes(url)) {
      imageUrls.push(url);
    }
  }

  return imageUrls.slice(0, 3);
}

async function fetchPageHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function processAllBeds() {
  console.log('Starting image fetch and upload process...\n');

  const tempDir = path.join(__dirname, 'temp-bed-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  for (const bed of beds) {
    try {
      console.log(`Processing ${bed.sku}...`);

      const { data: product } = await supabase
        .from('products')
        .select('id, name')
        .eq('sku', bed.sku)
        .maybeSingle();

      if (!product) {
        console.log(`  ❌ Product not found in database`);
        continue;
      }

      console.log(`  Fetching page: ${bed.url}`);
      const html = await fetchPageHTML(bed.url);
      const imageUrls = extractImagesFromHTML(html);

      if (imageUrls.length === 0) {
        console.log(`  ⚠️  No images found on page`);
        continue;
      }

      console.log(`  Found ${imageUrls.length} images`);

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const ext = path.extname(imageUrl).split('?')[0];
        const filename = `${bed.sku}-${i}${ext}`;
        const filepath = path.join(tempDir, filename);

        try {
          console.log(`  Downloading image ${i + 1}/${imageUrls.length}...`);
          await downloadImage(imageUrl, filepath);

          const fileBuffer = fs.readFileSync(filepath);
          const storagePath = `products/${filename}`;

          console.log(`  Uploading to Supabase storage...`);
          const { data: uploadData, error: uploadError } = await supabase.storage
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
          }

          fs.unlinkSync(filepath);
        } catch (err) {
          console.log(`  ❌ Error processing image: ${err.message}`);
        }
      }

      console.log(`  ✓ Completed ${bed.sku}\n`);
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}\n`);
    }
  }

  fs.rmdirSync(tempDir, { recursive: true });
  console.log('All done!');
}

processAllBeds().catch(console.error);
