const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeTables() {
  try {
    console.log('Fetching tables category page...');
    const response = await fetch('https://mnogomebeli.com/stoly/');
    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('Page loaded successfully');

    const products = [];
    const productLinks = new Set();

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/stoly/') && href !== '/stoly/' && !href.includes('#')) {
        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;
        productLinks.add(fullUrl);
      }
    });

    console.log(`Found ${productLinks.size} unique product links`);

    let index = 0;
    for (const url of Array.from(productLinks)) {
      index++;
      try {
        console.log(`\nScraping ${index}/${productLinks.size}: ${url}`);

        const productResponse = await fetch(url);
        const productHtml = await productResponse.text();
        const $product = cheerio.load(productHtml);

        const name = $product('h1').first().text().trim();
        const priceText = $product('[class*="price"]').first().text().trim();
        const price = priceText.match(/[\d\s]+/)?.[0]?.replace(/\s/g, '') || '999';

        const description = $product('[class*="description"], .product-description, p').first().text().trim();

        let dimensions = '';
        $product('p, div, span').each((i, el) => {
          const text = $product(el).text();
          if (text.includes('Габариты') || text.includes('ДхШхВ')) {
            const match = text.match(/(\d+)\s*х\s*(\d+)\s*х\s*(\d+)/);
            if (match) {
              dimensions = `${match[1]}x${match[2]}x${match[3]}`;
            }
          }
        });

        const images = [];
        $product('img').each((i, el) => {
          let src = $product(el).attr('src') || $product(el).attr('data-src');
          if (src && !src.includes('logo') && !src.includes('icon')) {
            if (!src.startsWith('http')) {
              src = `https://mnogomebeli.com${src}`;
            }
            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });

        if (name && images.length > 0) {
          products.push({
            name,
            price: parseFloat(price),
            description: description.substring(0, 500),
            dimensions,
            url,
            images: images.slice(0, 5)
          });

          console.log(`  ✓ ${name}`);
          console.log(`    Price: ${price} BYN`);
          console.log(`    Dimensions: ${dimensions || 'Not found'}`);
          console.log(`    Images: ${images.length}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`  ✗ Error scraping product: ${error.message}`);
      }
    }

    console.log(`\n\nTotal tables scraped: ${products.length}`);

    fs.writeFileSync(
      'tables-scraped.json',
      JSON.stringify(products, null, 2)
    );

    console.log('\nData saved to tables-scraped.json');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeTables();
