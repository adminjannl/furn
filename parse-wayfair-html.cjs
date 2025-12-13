const cheerio = require('cheerio');
const fs = require('fs');

function parseWayfairHTML(htmlFile) {
  console.log(`Reading HTML from ${htmlFile}...`);

  if (!fs.existsSync(htmlFile)) {
    console.error(`File not found: ${htmlFile}`);
    console.log('\nTo get the HTML:');
    console.log('1. Open https://www.wayfair.com/furniture/cat/living-room-furniture-c45982.html in your browser');
    console.log('2. Scroll down to load all products');
    console.log('3. Right-click > "Save Page As" > Save as "wayfair-page.html"');
    console.log('4. Run: node parse-wayfair-html.cjs wayfair-page.html');
    process.exit(1);
  }

  const html = fs.readFileSync(htmlFile, 'utf-8');
  console.log(`HTML loaded, length: ${html.length} characters`);

  const $ = cheerio.load(html);

  console.log('\nPage analysis:');
  console.log(`Title: ${$('title').text()}`);
  console.log(`Total links: ${$('a').length}`);
  console.log(`Product links: ${$('a[href*="/product/"]').length}`);
  console.log(`Images: ${$('img').length}`);
  console.log(`Scripts: ${$('script').length}`);

  const products = [];
  const processedUrls = new Set();

  const possibleSelectors = [
    'article[data-hb-id*="ProductCard"]',
    'div[data-hb-id*="ProductCard"]',
    '[data-enzyme-id="ProductCard"]',
    '.ProductCard',
    '[class*="ProductCard"]',
    '[class*="pl-ProductCard"]',
    'article[class*="Card"]',
    '[data-test-id*="product"]',
    '[data-cy*="product"]'
  ];

  console.log('\nSearching with selectors:');
  let bestSelector = null;
  let maxFound = 0;

  possibleSelectors.forEach(selector => {
    const found = $(selector).length;
    if (found > 0) {
      console.log(`  ${selector}: ${found} elements`);
      if (found > maxFound) {
        maxFound = found;
        bestSelector = selector;
      }
    }
  });

  if (bestSelector) {
    console.log(`\nUsing best selector: ${bestSelector} (${maxFound} elements)`);

    $(bestSelector).each((index, element) => {
      try {
        const $card = $(element);

        const $link = $card.find('a[href*="/product/"]').first();
        const url = $link.attr('href');

        if (!url || processedUrls.has(url)) return;
        processedUrls.add(url);

        const fullUrl = url.startsWith('http') ? url : `https://www.wayfair.com${url}`;

        const name = $card.find('h2, h3, [data-hb-id*="Name"], [class*="Name"]').first().text().trim() ||
                    $link.attr('aria-label') ||
                    $link.text().trim();

        const price = $card.find('[data-hb-id*="Price"], [class*="Price"], [class*="price"]').first().text().trim();

        const $img = $card.find('img').first();
        const image = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');

        const rating = $card.find('[data-hb-id*="Rating"], [aria-label*="rating"], [class*="rating"]').first().text().trim() ||
                      $card.find('[data-hb-id*="Rating"], [aria-label*="rating"]').first().attr('aria-label');

        const reviews = $card.find('[data-hb-id*="Reviews"], [class*="review"]').first().text().trim();

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
    console.log('\nNo products found with card selectors. Trying link-based extraction...');

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

        const name = $parent.find('h2, h3, h4, [class*="Name"]').first().text().trim() ||
                    $link.attr('aria-label') ||
                    $link.text().trim();

        const price = $parent.find('[data-hb-id*="Price"], [class*="Price"], [class*="price"]').first().text().trim();

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

  console.log(`\n✓ Extracted ${products.length} products`);

  if (products.length > 0) {
    console.log('\nFirst 5 products:');
    products.slice(0, 5).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name}`);
      console.log(`   Price: ${p.price || 'N/A'}`);
      console.log(`   ID: ${p.id}`);
    });

    const outputFile = 'wayfair-products-parsed.json';
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
    console.log(`\n✓ Data saved to ${outputFile}`);
  } else {
    console.log('\n⚠ No products found.');
    console.log('The HTML might not contain product data, or the page structure is different.');
    console.log('Make sure you:');
    console.log('  1. Scrolled down to load products before saving');
    console.log('  2. Saved the complete HTML (not just a snippet)');
    console.log('  3. Are on the correct Wayfair category page');

    const sample = html.substring(0, 1000);
    fs.writeFileSync('html-sample.txt', sample);
    console.log('\nFirst 1000 characters saved to html-sample.txt for debugging');
  }

  return products;
}

const htmlFile = process.argv[2] || 'wayfair-page.html';
parseWayfairHTML(htmlFile);
