const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeWayfairSofas() {
  console.log('============================================================');
  console.log('SCRAPING WAYFAIR SOFAS - ALL 48 PRODUCTS FROM PAGE 1');
  console.log('============================================================\n');

  try {
    console.log('Fetching Wayfair sofas page...');

    const response = await fetch('https://www.wayfair.com/furniture/sb0/sofas-c413892.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log(`✓ Fetched HTML (${html.length} bytes)`);

    fs.writeFileSync('./wayfair-page-debug.html', html);
    console.log('✓ Saved HTML to wayfair-page-debug.html for inspection\n');

    const $ = cheerio.load(html);
    const products = [];

    console.log('Parsing product data...');

    $('[data-hb-id]').each((index, element) => {
      try {
        const $card = $(element);

        const name = $card.find('h2, [class*="ProductCard-name"], [class*="ProductCard__name"]').first().text().trim();

        const $img = $card.find('img').first();
        const image = $img.attr('src') || $img.attr('data-src');

        const priceText = $card.find('[class*="ProductCard-price"], [class*="PriceLabel"]').first().text().trim();
        const priceMatch = priceText.match(/\$[\d,]+\.?\d*/);
        const price = priceMatch ? priceMatch[0] : null;

        const originalPriceText = $card.find('[class*="original"], [class*="Original"], [class*="strike"]').first().text().trim();
        const originalPriceMatch = originalPriceText.match(/\$[\d,]+\.?\d*/);
        const original_price = originalPriceMatch ? originalPriceMatch[0] : null;

        const manufacturer = $card.find('[class*="manufacturer"], [class*="Manufacturer"], [class*="brand"], [class*="Brand"]').first().text().trim() || null;

        const ratingEl = $card.find('[class*="rating"], [class*="Rating"], [class*="stars"]').first();
        const ratingText = ratingEl.attr('aria-label') || ratingEl.text();
        const ratingMatch = ratingText?.match(/([\d.]+)\s*(?:out of|\/)\s*5/i);
        const rating = ratingMatch ? ratingMatch[1] : null;

        const reviewText = $card.find('[class*="review"]').first().text().trim();
        const reviewMatch = reviewText.match(/(\d+)/);
        const review_count = reviewMatch ? reviewMatch[1] : null;

        const badge = $card.find('[class*="Badge"], [class*="badge"], [class*="label"]').first().text().trim() || null;

        const $link = $card.find('a[href*="/pdp/"]').first();
        const url = $link.attr('href') ? 'https://www.wayfair.com' + $link.attr('href') : null;

        if (name && price) {
          products.push({
            id: `WAY-${String(index + 1).padStart(4, '0')}`,
            sku: null,
            name,
            manufacturer,
            price,
            original_price,
            image,
            url,
            rating,
            review_count,
            availability: null,
            badge,
            source: 'wayfair',
            scraped_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`Error parsing product ${index}:`, err.message);
      }
    });

    console.log(`\n✓ Successfully scraped ${products.length} products\n`);

    if (products.length > 0) {
      console.log('First 5 products:');
      products.slice(0, 5).forEach((p) => {
        console.log(`  - ${p.name} (${p.price})`);
      });
    }

    const filename = './wayfair-sofas-all-48.json';
    fs.writeFileSync(filename, JSON.stringify(products, null, 2));
    console.log(`\n✓ Saved ${products.length} products to ${filename}`);

    console.log('\n============================================================');
    console.log('SCRAPING COMPLETE');
    console.log('============================================================');

    return products;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
}

scrapeWayfairSofas().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
