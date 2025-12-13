const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeWayfairSofas() {
  console.log('Fetching Wayfair page...');

  try {
    const response = await fetch('https://www.wayfair.com/furniture/cat/living-room-furniture-c45982.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('Page fetched, length:', html.length);

    fs.writeFileSync('wayfair-page-source.html', html);
    console.log('HTML saved to wayfair-page-source.html');

    const $ = cheerio.load(html);

    const products = [];

    const selectors = [
      '[data-enzyme-id="ProductCard"]',
      '.ProductCard',
      '[class*="ProductCard"]',
      'article',
      '[data-hb-id*="ProductCard"]',
      '.pl-ProductCard',
      '[class*="pl-ProductCard"]'
    ];

    console.log('\nSearching for products with multiple selectors...');

    selectors.forEach(selector => {
      const found = $(selector);
      if (found.length > 0) {
        console.log(`Found ${found.length} elements with selector: ${selector}`);
      }
    });

    const allLinks = $('a[href*="/product/"]');
    console.log(`\nFound ${allLinks.length} product links`);

    const processedUrls = new Set();

    allLinks.each((index, element) => {
      try {
        const $el = $(element);
        const url = $el.attr('href');

        if (url && !processedUrls.has(url)) {
          processedUrls.add(url);

          const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

          let name = $el.find('[data-enzyme-id="ProductCardName"]').text().trim() ||
                     $el.find('h2').text().trim() ||
                     $el.text().trim();

          const $card = $el.closest('[data-enzyme-id="ProductCard"], .ProductCard, article, [class*="ProductCard"]');

          let price = $card.find('[data-enzyme-id="ProductCardPrice"], .Price, [class*="Price"]').first().text().trim();

          let image = $el.find('img').first().attr('src') ||
                     $el.find('img').first().attr('data-src') ||
                     $card.find('img').first().attr('src');

          if (name && name.length > 5) {
            products.push({
              name: name.substring(0, 200),
              price: price || 'N/A',
              image: image || null,
              url: fullUrl,
              index: products.length
            });
          }
        }
      } catch (err) {
        console.error('Error parsing product:', err.message);
      }
    });

    console.log(`\nExtracted ${products.length} products`);

    if (products.length > 0) {
      console.log('\nFirst few products:');
      products.slice(0, 3).forEach(p => {
        console.log(`- ${p.name}`);
        console.log(`  Price: ${p.price}`);
        console.log(`  URL: ${p.url}`);
        console.log();
      });
    }

    fs.writeFileSync('wayfair-sofas-scraped.json', JSON.stringify(products, null, 2));
    console.log('Data saved to wayfair-sofas-scraped.json');

    return products;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

scrapeWayfairSofas()
  .then(products => {
    console.log('\n✓ Scraping completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Scraping failed:', error);
    process.exit(1);
  });
