const fs = require('fs');
const readline = require('readline');

const tablesData = JSON.parse(fs.readFileSync('all-tables-scraped.json', 'utf8'));

async function importImages() {
  let totalImages = 0;

  for (let i = 0; i < tablesData.length; i++) {
    const table = tablesData[i];
    const sku = `TBL-MNM-${String(i + 200).padStart(4, '0')}`;

    if (table.images && table.images.length > 0) {
      console.log(`Table ${i + 1}/22: ${table.name.substring(0, 40)}...`);

      for (let j = 0; j < Math.min(table.images.length, 5); j++) {
        const sql = `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, '${table.images[j]}', '${table.name.replace(/'/g, "''")} - View ${j + 1}', ${j + 1}, ${j === 0 ? 'true' : 'false'}
FROM products WHERE sku = '${sku}';`;

        console.log(sql);
        totalImages++;
      }
    }
  }

  console.log(`\nGenerated ${totalImages} image insert statements`);
}

importImages();
