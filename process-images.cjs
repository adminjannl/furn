const sharp = require('sharp');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const TEMP_DIR = path.join(__dirname, 'temp-images');
const PROCESSED_DIR = path.join(__dirname, 'processed-images');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function removeWhiteBackground(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        const pixels = new Uint8ClampedArray(data);
        const threshold = 240;

        for (let i = 0; i < pixels.length; i += info.channels) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          if (r > threshold && g > threshold && b > threshold) {
            pixels[i + 3] = 0;
          }
        }

        return sharp(Buffer.from(pixels), {
          raw: {
            width: info.width,
            height: info.height,
            channels: info.channels
          }
        })
        .png()
        .toFile(outputPath);
      });

    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

async function uploadToSupabase(filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
}

async function processAllImages() {
  try {
    console.log('Fetching all product images...');
    const { data: images, error } = await supabase
      .from('product_images')
      .select('*')
      .order('product_id', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Found ${images.length} images to process`);

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      console.log(`\nProcessing ${i + 1}/${images.length}: ${image.image_url}`);

      try {
        const tempFileName = `temp-${image.id}.jpg`;
        const processedFileName = `processed-${image.id}.png`;
        const tempPath = path.join(TEMP_DIR, tempFileName);
        const processedPath = path.join(PROCESSED_DIR, processedFileName);

        console.log('  Downloading...');
        await downloadImage(image.image_url, tempPath);

        console.log('  Removing white background...');
        await removeWhiteBackground(tempPath, processedPath);

        console.log('  Uploading to Supabase Storage...');
        const storageFileName = `${image.product_id}/${image.id}.png`;
        const newUrl = await uploadToSupabase(processedPath, storageFileName);

        console.log('  Updating database...');
        const { error: updateError } = await supabase
          .from('product_images')
          .update({ image_url: newUrl })
          .eq('id', image.id);

        if (updateError) {
          console.error('  Error updating database:', updateError);
        } else {
          console.log('  ✓ Success!');
        }

        fs.unlinkSync(tempPath);
        fs.unlinkSync(processedPath);

      } catch (error) {
        console.error(`  Error processing image ${image.id}:`, error.message);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✓ All images processed!');

    fs.rmdirSync(TEMP_DIR, { recursive: true });
    fs.rmdirSync(PROCESSED_DIR, { recursive: true });

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

processAllImages();
