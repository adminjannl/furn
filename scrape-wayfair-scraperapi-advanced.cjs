const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const SCRAPER_API_KEY = '91cdde2c85dc714a1a8656ed20757829';

async function scrapeWayfairWithScraperAPI(targetUrl, options = {}) {
  console.log('Using ScraperAPI Premium Features...');
  console.log(`Target: ${targetUrl}\n`);

  const params = new URLSearchParams({
    api_key: SCRAPER_API_KEY,
    url: targetUrl,
    render: 'true',
    wait_for_selector: 'article, [data-hb-id*="ProductCard"], img',
    session_number: Math.floor(Math.random() * 1000),
    country_code: 'us',
    ...options
  });

  const scraperApiUrl = `http://api.scraperapi.com?${params.toString()}`;

  try {
    console.log('ScraperAPI Parameters:');
    console.log('- JavaScript Rendering: ENABLED');
    console.log('- Wait for content: article/img elements');
    console.log('- Country: US');
    console.log('- Session: Random\n');

    console.log('Sending request (this may take 30-60 seconds)...');
    const startTime = Date.now();

    const response = await fetch(scraperApiUrl, {
      method: 'GET',
      timeout: 120000
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nResponse received in ${elapsed}s`);
    console.log(`Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText.substring(0, 500));
      throw new Error(`ScraperAPI returned ${response.status}`);
    }

    const html = await response.text();
    console.log(`HTML received: ${(html.length / 1024).toFixed(2)} KB`);

    fs.writeFileSync('wayfair-scraperapi-full.html', html);
    console.log('✓ Saved to wayfair-scraperapi-full.html\n');

    return html;

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

function parseProductsAdvanced(html) {
  console.log('='  * 50);
  console.log('PARSING PRODUCTS');
  console.log('='.repeat(50) + '\n');

  const $ = cheerio.load(html);

  console.log('Page Analysis:');
  const title = $('title').text();
  console.log(`Title: ${title.substring(0, 80)}...`);
  console.log(`Total links: ${$('a').length}`);
  console.log(`Product links: ${$('a[href*="/product/"]').length}`);
  console.log(`Images: ${$('img').length}`);
  console.log(`Articles: ${$('article').length}`);
  console.log(`Divs: ${$('div').length}\n`);

  let embeddedData = null;

  $('script[type="application/json"], script[type="application/ld+json"]').each((i, elem) => {
    try {
      const content = $(elem).html();
      const data = JSON.parse(content);

      if (data && (data.products || data.items || data['@graph'])) {
        console.log(`✓ Found structured data in JSON-LD script ${i + 1}`);
        embeddedData = data;
        return false;
      }
    } catch (e) {
    }
  });

  $('script:not([src])').each((i, elem) => {
    const content = $(elem).html();
    if (content && content.includes('"sku"') && content.includes('"name"')) {
      try {
        const jsonMatch = content.match(/window\.__[A-Z_]+\s*=\s*({[\s\S]+?});?\s*<\/script>/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[1]);
          console.log(`✓ Found window.__DATA__ object in script ${i + 1}`);
          embeddedData = data;
          return false;
        }
      } catch (e) {
      }
    }
  });

  const products = [];
  const processedUrls = new Set();

  const selectors = [
    { sel: 'article[data-hb-id*="ProductCard"]', name: 'Article with ProductCard' },
    { sel: 'div[data-hb-id*="ProductCard"]', name: 'Div with ProductCard' },
    { sel: '[class*="ProductCard"]', name: 'Class contains ProductCard' },
    { sel: 'article', name: 'Generic article' },
    { sel: '[data-enzyme-id*="Product"]', name: 'Enzyme Product' },
    { sel: '[class*="pl-ProductCard"]', name: 'PL ProductCard' }
  ];

  console.log('Testing selectors:');
  let bestSelector = null;
  let maxFound = 0;

  selectors.forEach(({ sel, name }) => {
    const found = $(sel).length;
    if (found > 0) {
      console.log(`  ✓ ${name} (${sel}): ${found} elements`);
      if (found > maxFound && found < 500) {
        maxFound = found;
        bestSelector = sel;
      }
    }
  });

  if (bestSelector && maxFound > 0) {
    console.log(`\nUsing best selector: ${bestSelector} (${maxFound} elements)\n`);

    $(bestSelector).each((index, element) => {
      try {
        const $card = $(element);

        const $link = $card.find('a[href*="/product/"], a[href*="/pdp/"]').first();
        const url = $link.attr('href') || $card.closest('a').attr('href');

        if (!url || processedUrls.has(url)) return;
        processedUrls.add(url);

        const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

        const name = $card.find('h2, h3, [data-hb-id*="Name"], [class*="Name"], [aria-label]').first().text().trim() ||
                    $link.attr('aria-label') ||
                    $link.find('[data-hb-id*="Name"]').text().trim() ||
                    $link.text().trim();

        const price = $card.find('[data-hb-id*="Price"], [class*="Price"], [class*="price"], [data-test*="price"]')
                          .first().text().trim();

        const $img = $card.find('img').first();
        const image = $img.attr('data-src') || $img.attr('src') || $img.attr('data-lazy-src');

        const rating = $card.find('[aria-label*="rating"], [data-hb-id*="Rating"]')
                           .first().attr('aria-label') ||
                      $card.find('[aria-label*="star"]').first().attr('aria-label');

        if (name && name.length > 5 && !name.toLowerCase().includes('wayfair')) {
          products.push({
            id: `WAY-${String(products.length + 1).padStart(4, '0')}`,
            name: name.trim(),
            price: price || null,
            image: image || null,
            url: fullUrl,
            rating: rating || null,
            source: 'wayfair'
          });

          if (products.length <= 3) {
            console.log(`Product ${products.length}:`);
            console.log(`  Name: ${name.substring(0, 60)}...`);
            console.log(`  Price: ${price || 'N/A'}`);
            console.log(`  URL: ${fullUrl.substring(0, 70)}...\n`);
          }
        }
      } catch (err) {
        console.error('Parse error:', err.message);
      }
    });
  }

  if (products.length === 0) {
    console.log('\n⚠ No products from selectors. Trying link-based extraction...\n');

    const links = $('a[href*="/product/"], a[href*="/pdp/"]');
    console.log(`Found ${links.length} product links`);

    links.each((i, elem) => {
      try {
        const $link = $(elem);
        const url = $link.attr('href');

        if (!url || processedUrls.has(url) || i > 100) return;
        processedUrls.add(url);

        const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

        const $container = $link.closest('article, div[class*="Card"], li');

        const name = $container.find('h2, h3, h4').first().text().trim() ||
                    $link.attr('aria-label') ||
                    $link.text().trim();

        const price = $container.find('[class*="Price"], [class*="price"]').first().text().trim();

        const $img = $link.find('img').first();
        const image = $img.attr('data-src') || $img.attr('src');

        if (name && name.length > 5) {
          products.push({
            id: `WAY-${String(products.length + 1).padStart(4, '0')}`,
            name: name.trim().substring(0, 200),
            price: price || null,
            image: image || null,
            url: fullUrl,
            source: 'wayfair'
          });
        }
      } catch (err) {
      }
    });
  }

  return products;
}

async function main() {
  const targetUrl = process.argv[2] || 'https://www.wayfair.com/furniture/cat/sofas-c413902.html';

  try {
    const html = await scrapeWayfairWithScraperAPI(targetUrl);
    const products = parseProductsAdvanced(html);

    console.log('\n' + '='.repeat(50));
    console.log(`✓ SUCCESSFULLY EXTRACTED ${products.length} PRODUCTS`);
    console.log('='.repeat(50));

    if (products.length > 0) {
      console.log('\nSample products:');
      products.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   Price: ${p.price || 'N/A'}`);
        console.log(`   ID: ${p.id}`);
      });

      const outputFile = 'wayfair-scraped-products.json';
      fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
      console.log(`\n✓ Full data saved to ${outputFile}`);

      console.log('\n' + '='.repeat(50));
      console.log('✓ SUCCESS - ScraperAPI WORKS!');
      console.log('='.repeat(50));

      return products;
    } else {
      console.log('\n⚠ No products found');
      console.log('The page structure might require manual inspection.');
      console.log('Check wayfair-scraperapi-full.html');
    }

  } catch (error) {
    console.error('\n✗ Failed:', error.message);
    process.exit(1);
  }
}

main();
