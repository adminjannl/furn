const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const SCRAPER_API_KEY = '91cdde2c85dc714a1a8656ed20757829';

async function scrapeWayfairWithScraperAPI(targetUrl) {
  console.log('Using ScraperAPI to bypass Wayfair protection...');
  console.log(`Target: ${targetUrl}\n`);

  const scraperApiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true`;

  try {
    console.log('Sending request through ScraperAPI...');
    const startTime = Date.now();

    const response = await fetch(scraperApiUrl, {
      method: 'GET',
      timeout: 60000
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Response received in ${elapsed}s`);
    console.log(`Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`ScraperAPI returned ${response.status}: ${errorText}`);
    }

    const html = await response.text();
    console.log(`HTML received: ${html.length} characters`);

    fs.writeFileSync('wayfair-scraperapi-raw.html', html);
    console.log('✓ Saved raw HTML to wayfair-scraperapi-raw.html\n');

    return html;

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

function parseProducts(html) {
  console.log('Parsing products from HTML...');
  const $ = cheerio.load(html);

  console.log('Page info:');
  console.log(`- Title: ${$('title').text()}`);
  console.log(`- Total links: ${$('a').length}`);
  console.log(`- Product links: ${$('a[href*="/product/"]').length}`);
  console.log(`- Images: ${$('img').length}\n`);

  const products = [];
  const processedUrls = new Set();

  const selectors = [
    'article[data-hb-id*="ProductCard"]',
    'div[data-hb-id*="ProductCard"]',
    '[data-enzyme-id="ProductCard"]',
    '.ProductCard',
    '[class*="ProductCard"]',
    '[class*="pl-ProductCard"]',
    'article[class*="Card"]'
  ];

  console.log('Testing selectors:');
  let bestSelector = null;
  let maxFound = 0;

  selectors.forEach(selector => {
    const found = $(selector).length;
    if (found > 0) {
      console.log(`  ✓ ${selector}: ${found} elements`);
      if (found > maxFound) {
        maxFound = found;
        bestSelector = selector;
      }
    }
  });

  if (bestSelector) {
    console.log(`\nUsing: ${bestSelector}\n`);

    $(bestSelector).each((index, element) => {
      try {
        const $card = $(element);

        const $link = $card.find('a[href*="/product/"]').first();
        const url = $link.attr('href');

        if (!url || processedUrls.has(url)) return;
        processedUrls.add(url);

        const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

        const name = $card.find('h2, h3, [data-hb-id*="Name"], [class*="ProductName"]').first().text().trim() ||
                    $link.attr('aria-label') ||
                    $link.text().trim();

        const price = $card.find('[data-hb-id*="Price"], [class*="Price"]').first().text().trim();

        const $img = $card.find('img').first();
        const image = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');

        const rating = $card.find('[aria-label*="rating"], [class*="rating"]').first().attr('aria-label') ||
                      $card.find('[aria-label*="rating"]').first().text().trim();

        const reviews = $card.find('[class*="review"]').first().text().trim();

        if (name && name.length > 3) {
          products.push({
            id: `WAY-${String(products.length + 1).padStart(4, '0')}`,
            name: name,
            price: price || null,
            image: image || null,
            url: fullUrl,
            rating: rating || null,
            reviews: reviews || null,
            source: 'wayfair'
          });
        }
      } catch (err) {
        console.error('Error parsing card:', err.message);
      }
    });
  }

  if (products.length === 0) {
    console.log('No products found with card selectors. Trying link-based approach...\n');

    const allLinks = $('a[href*="/product/"]');
    console.log(`Found ${allLinks.length} product links`);

    allLinks.each((index, element) => {
      try {
        const $link = $(element);
        const url = $link.attr('href');

        if (!url || processedUrls.has(url)) return;
        processedUrls.add(url);

        const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

        const $parent = $link.closest('div, article, li');

        const name = $parent.find('h2, h3, h4').first().text().trim() ||
                    $link.attr('aria-label') ||
                    $link.text().trim();

        const price = $parent.find('[class*="Price"], [class*="price"]').first().text().trim();

        const $img = $link.find('img').first();
        const image = $img.attr('src') || $img.attr('data-src');

        if (name && name.length > 3 && !name.includes('undefined')) {
          products.push({
            id: `WAY-${String(products.length + 1).padStart(4, '0')}`,
            name: name.substring(0, 200),
            price: price || null,
            image: image || null,
            url: fullUrl,
            source: 'wayfair'
          });
        }
      } catch (err) {
        console.error('Error parsing link:', err.message);
      }
    });
  }

  return products;
}

async function main() {
  const targetUrl = process.argv[2] || 'https://www.wayfair.com/furniture/cat/living-room-furniture-c45982.html';

  try {
    const html = await scrapeWayfairWithScraperAPI(targetUrl);
    const products = parseProducts(html);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✓ Successfully extracted ${products.length} products`);
    console.log('='.repeat(50));

    if (products.length > 0) {
      console.log('\nFirst 5 products:');
      products.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   Price: ${p.price || 'N/A'}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   URL: ${p.url.substring(0, 60)}...`);
      });

      const outputFile = 'wayfair-scraperapi-products.json';
      fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
      console.log(`\n✓ Full data saved to ${outputFile}`);

      console.log('\n' + '='.repeat(50));
      console.log('SUCCESS! ScraperAPI bypassed Wayfair protection.');
      console.log('='.repeat(50));
    } else {
      console.log('\n⚠ No products found in the response.');
      console.log('Check wayfair-scraperapi-raw.html to see what was returned.');
    }

  } catch (error) {
    console.error('\n✗ Scraping failed:', error.message);
    process.exit(1);
  }
}

main();
