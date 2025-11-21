const fs = require('fs');

function generateChairImagesMigration() {
  const chairs = JSON.parse(fs.readFileSync('all-chairs-with-prices.json', 'utf8'));

  console.log(`Generating chair images migration for ${chairs.length} chairs...\n`);

  let sql = ``;
  let imageCount = 0;

  chairs.forEach((chair, index) => {
    chair.images.forEach((imageUrl, imgIndex) => {
      const altText = `${chair.name} - View ${imgIndex + 1}`.replace(/'/g, "''");

      sql += `INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT id, '${imageUrl}', '${altText}', ${imgIndex + 1}
FROM products WHERE sku = '${chair.sku}' LIMIT 1;\n\n`;

      imageCount++;
    });
  });

  // Save to file
  const filename = 'import-chair-images.sql';
  fs.writeFileSync(filename, sql);
  console.log(`Generated: ${filename}`);
  console.log(`Total chairs: ${chairs.length}`);
  console.log(`Total images: ${imageCount}`);
  console.log(`Average images per chair: ${(imageCount / chairs.length).toFixed(1)}`);

  return filename;
}

generateChairImagesMigration();
