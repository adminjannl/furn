require('dotenv').config();
const fetch = require('node-fetch');

async function fixGenoaImages() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  console.log('\nFixing Genoa Leather Sofa images...\n');

  const productUrl = 'https://www.ashleyfurniture.com/p/genoa_sofa/4770438.html';
  const sku = '4770438';

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/ashley-scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        mode: 'detail',
        productUrl,
        sku,
        importToDb: true
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`Successfully updated ${result.sku}`);
      console.log(`Found ${result.count} gallery images:\n`);
      result.images.forEach((img, i) => {
        console.log(`   ${i + 1}. ${img}`);
      });
    } else {
      console.error('Failed:', result.error);
    }

    console.log('\nDone! Check the product page to verify images.');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixGenoaImages();
