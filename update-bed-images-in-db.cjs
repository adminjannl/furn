const https = require('https');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://clwqwdeamfjzamulteui.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsd3F3ZGVhbWZqemFtdWx0ZXVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEyNDQ4NCwiZXhwIjoyMDc2NzAwNDg0fQ.6qBGPwPcD8y1S04D71A0YqkqOBu1T5jx1PW3O_wqMXI';

const mapping = require('./final-correct-mapping-41-63.json');

function supabaseRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'clwqwdeamfjzamulteui.supabase.co',
      path: `/rest/v1/${endpoint}`,
      method: method,
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : null);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function updateBedImages() {
  console.log('Starting database update for beds 41-63...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const bedMapping of mapping) {
    try {
      console.log(`Processing ${bedMapping.sku}...`);

      const products = await supabaseRequest('GET', `products?sku=eq.${bedMapping.sku}&select=id,name`);

      if (!products || products.length === 0) {
        console.log(`  ❌ Product not found in database\n`);
        errorCount++;
        continue;
      }

      const product = products[0];
      console.log(`  Found product: ${product.name}`);

      console.log(`  Deleting old product_images records...`);
      await supabaseRequest('DELETE', `product_images?product_id=eq.${product.id}`);

      console.log(`  Inserting new image: ${bedMapping.images[0]}`);
      await supabaseRequest('POST', 'product_images', {
        product_id: product.id,
        image_url: bedMapping.images[0],
        display_order: 0,
        alt_text: `${product.name} - Product Image`
      });

      console.log(`  Also updating products.image_url field...`);
      await supabaseRequest('PATCH', `products?id=eq.${product.id}`, {
        image_url: bedMapping.images[0]
      });

      console.log(`  ✓ Successfully updated ${bedMapping.sku}\n`);
      successCount++;

    } catch (err) {
      console.log(`  ❌ Error: ${err.message}\n`);
      errorCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total processed: ${mapping.length}`);
}

updateBedImages().catch(console.error);
