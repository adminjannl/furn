const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeTableDetails() {
  try {
    const existingData = JSON.parse(fs.readFileSync('tables-scraped.json', 'utf8'));

    console.log(`Processing ${existingData.length} tables to get detailed information...`);

    const detailedProducts = [];

    for (let i = 0; i < existingData.length; i++) {
      const product = existingData[i];

      if (product.url.includes('/pismennye/') ||
          product.url.includes('/obedennye/') ||
          product.url.includes('/zhurnalnyy/') ||
          product.url.includes('/transformery/') ||
          product.url.includes('/stoly-boss-xo/')) {
        console.log(`Skipping category page: ${product.name}`);
        continue;
      }

      console.log(`\n${i + 1}/${existingData.length}: ${product.name}`);

      try {
        const response = await fetch(product.url);
        const html = await response.text();
        const $ = cheerio.load(html);

        let price = 999;
        $('.price, [class*="price"], .product-price').each((idx, el) => {
          const text = $(el).text().trim();
          const match = text.match(/(\d[\d\s]*)/);
          if (match) {
            const priceNum = parseFloat(match[1].replace(/\s/g, ''));
            if (priceNum > 100 && priceNum < 10000) {
              price = priceNum;
            }
          }
        });

        let dimensions = product.dimensions || '';
        if (!dimensions) {
          $('*').each((idx, el) => {
            const text = $(el).text();
            if (text.includes('Габариты') || text.includes('ДхШхВ')) {
              const match = text.match(/(\d+)\s*х\s*(\d+)\s*х\s*(\d+)/);
              if (match) {
                dimensions = `${match[1]}x${match[2]}x${match[3]}`;
              }
            }
          });
        }

        let description = '';
        $('.description, [class*="description"], .product-description').each((idx, el) => {
          const text = $(el).text().trim();
          if (text.length > 50 && text.length < 1000) {
            description = text;
          }
        });

        if (!description) {
          $('p').each((idx, el) => {
            const text = $(el).text().trim();
            if (text.length > 50 && text.length < 1000 && !text.includes('©')) {
              description = text;
              return false;
            }
          });
        }

        const cleanImages = [];
        product.images.forEach(img => {
          if (!img.includes('logo') &&
              !img.includes('icon') &&
              !img.includes('banner') &&
              !cleanImages.includes(img)) {
            cleanImages.push(img);
          }
        });

        detailedProducts.push({
          name: product.name,
          price: price,
          description: description.substring(0, 500) || `Premium table ${product.name}`,
          dimensions: dimensions,
          url: product.url,
          images: cleanImages.slice(0, 5)
        });

        console.log(`  Price: ${price} BYN`);
        console.log(`  Dimensions: ${dimensions || 'Not found'}`);
        console.log(`  Images: ${cleanImages.length}`);

      } catch (error) {
        console.error(`  Error: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log(`\n\nTotal valid tables: ${detailedProducts.length}`);

    fs.writeFileSync(
      'tables-complete.json',
      JSON.stringify(detailedProducts, null, 2)
    );

    console.log('Saved to tables-complete.json');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeTableDetails();
