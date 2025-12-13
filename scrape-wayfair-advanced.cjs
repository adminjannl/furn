const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeWayfairWithRetry() {
  console.log('Attempting to fetch Wayfair page with enhanced headers...');

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  ];

  const headers = {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'DNT': '1',
    'Referer': 'https://www.google.com/'
  };

  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\nAttempt ${attempt}/${maxRetries}...`);

      if (attempt > 1) {
        const delay = attempt * 2000 + Math.random() * 2000;
        console.log(`Waiting ${Math.round(delay)}ms before retry...`);
        await sleep(delay);
      }

      const response = await fetch('https://www.wayfair.com/furniture/cat/living-room-furniture-c45982.html', {
        headers: headers,
        redirect: 'follow',
        timeout: 30000
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers.raw());

      if (response.status === 403 || response.status === 429) {
        lastError = new Error(`Access denied: ${response.status}`);
        console.log('Rate limited or blocked, will retry...');
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      console.log(`Page fetched successfully, length: ${html.length} characters`);

      fs.writeFileSync('wayfair-page-source.html', html);
      console.log('HTML saved to wayfair-page-source.html');

      return parseProducts(html);

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      lastError = error;
    }
  }

  throw lastError;
}

function parseProducts(html) {
  console.log('\nParsing HTML content...');

  const $ = cheerio.load(html);

  fs.writeFileSync('wayfair-debug-structure.txt',
    `Page title: ${$('title').text()}\n` +
    `Total links: ${$('a').length}\n` +
    `Product links: ${$('a[href*="/product/"]').length}\n` +
    `Images: ${$('img').length}\n` +
    `Articles: ${$('article').length}\n` +
    `Divs: ${$('div').length}\n`
  );

  const products = [];
  const processedUrls = new Set();

  const productSelectors = [
    'article[data-hb-id*="ProductCard"]',
    'div[data-hb-id*="ProductCard"]',
    '[data-enzyme-id="ProductCard"]',
    '.ProductCard',
    'article',
    '[class*="ProductCard"]',
    '[class*="pl-ProductCard"]'
  ];

  console.log('\nTrying different selectors...');
  productSelectors.forEach(selector => {
    const found = $(selector);
    if (found.length > 0) {
      console.log(`✓ Found ${found.length} elements with: ${selector}`);
    }
  });

  const allLinks = $('a[href*="/product/"]');
  console.log(`\nFound ${allLinks.length} product links total`);

  allLinks.each((index, element) => {
    try {
      const $link = $(element);
      const url = $link.attr('href');

      if (!url || processedUrls.has(url)) return;
      processedUrls.add(url);

      const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

      const $card = $link.closest('article, [class*="Card"], [data-hb-id*="Card"]');

      let name = $card.find('[data-hb-id*="ProductCardName"]').text().trim() ||
                 $card.find('h2, h3, [class*="ProductName"]').text().trim() ||
                 $link.find('[data-hb-id*="ProductCardName"]').text().trim() ||
                 $link.text().trim();

      let price = $card.find('[data-hb-id*="Price"], [class*="Price"], .price, [class*="price"]').first().text().trim();

      let image = $link.find('img').first().attr('src') ||
                 $link.find('img').first().attr('data-src') ||
                 $link.find('img').first().attr('data-lazy-src') ||
                 $card.find('img').first().attr('src');

      const rating = $card.find('[data-hb-id*="Rating"], [class*="Rating"], [class*="rating"]').first().text().trim();

      if (name && name.length > 3) {
        products.push({
          name: name.substring(0, 300),
          price: price || null,
          image: image || null,
          url: fullUrl,
          rating: rating || null,
          index: products.length
        });
      }
    } catch (err) {
      console.error('Error parsing product:', err.message);
    }
  });

  console.log(`\n✓ Extracted ${products.length} products`);

  if (products.length > 0) {
    console.log('\nFirst 3 products:');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name}`);
      console.log(`   Price: ${p.price || 'N/A'}`);
      console.log(`   URL: ${p.url}`);
    });
  } else {
    console.log('\n⚠ No products found. The page structure may have changed or contains dynamic content.');
    console.log('Check wayfair-page-source.html to see what was loaded.');
  }

  fs.writeFileSync('wayfair-sofas-scraped.json', JSON.stringify(products, null, 2));
  console.log('\nData saved to wayfair-sofas-scraped.json');

  return products;
}

scrapeWayfairWithRetry()
  .then(products => {
    console.log('\n✓ Scraping completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Scraping failed:', error.message);
    console.log('\nWayfair likely requires a real browser. Options:');
    console.log('1. Manually save the page HTML and provide it for parsing');
    console.log('2. Use a browser automation service');
    console.log('3. Check if Wayfair offers an API');
    process.exit(1);
  });
