const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const SCRAPER_API_KEY = '91cdde2c85dc714a1a8656ed20757829';

async function scrapeWayfair(targetUrl) {
  console.log('\n' + '='.repeat(60));
  console.log('WAYFAIR SCRAPER - ScraperAPI');
  console.log('='.repeat(60) + '\n');
  console.log(`Target: ${targetUrl}\n`);

  const params = new URLSearchParams({
    api_key: SCRAPER_API_KEY,
    url: targetUrl,
    render: 'true',
    wait_for: '5000',
    premium: 'true',
    session_number: String(Math.floor(Math.random() * 10000)),
    country_code: 'us'
  });

  const scraperApiUrl = `http://api.scraperapi.com?${params.toString()}`;

  console.log('Request settings:');
  console.log('- JavaScript: Enabled');
  console.log('- Wait: 5 seconds');
  console.log('- Premium: Enabled\n');

  try {
    console.log('Fetching page (60-90 sec)...\n');
    const startTime = Date.now();

    const response = await fetch(scraperApiUrl, {
      method: 'GET',
      timeout: 180000
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    if (!response.ok) {
      throw new Error(`ScraperAPI error: ${response.status}`);
    }

    const html = await response.text();
    console.log(`✓ Success in ${elapsed}s`);
    console.log(`✓ HTML: ${(html.length / 1024).toFixed(2)} KB\n`);

    fs.writeFileSync('wayfair-complete.html', html);
    console.log('✓ Saved to wayfair-complete.html\n');

    return html;

  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
}

function extractAllProducts(html) {
  console.log('='.repeat(60));
  console.log('EXTRACTING PRODUCTS');
  console.log('='.repeat(60) + '\n');

  const $ = cheerio.load(html);

  const products = [];
  const seen = new Set();

  const productCards = $('[data-name-id="ListingCard"]');
  console.log(`Found ${productCards.length} product cards\n`);

  productCards.each((idx, card) => {
    try {
      const $card = $(card);

      const $link = $card.find('a[href*="/pdp/"], a[href*="/product/"]').first();
      const href = $link.attr('href');

      if (!href || seen.has(href)) return;
      seen.add(href);

      const url = href.startsWith('http') ? href : `https://www.wayfair.com${href}`;

      const name = $card.find('[data-name-id="ListingCardName"]').text().trim();

      const $primaryPrice = $card.find('[data-test-id="StandardPricingPrice-PRIMARY"] [data-test-id="PriceDisplay"]');
      const price = $primaryPrice.text().trim();

      const $previousPrice = $card.find('[data-test-id="StandardPricingPrice-PREVIOUS"] [data-test-id="PriceDisplay"]');
      const originalPrice = $previousPrice.text().trim();

      const $img = $card.find('[data-name-id="ListingCardImageCarouselLeadImage"]').first();
      const image = $img.attr('src') || $img.attr('data-src') || $img.attr('srcset')?.split(',')[0]?.split(' ')[0];

      const manufacturer = $card.find('[data-name-id="ListingCardManufacturer"]').text().trim().replace(/^By\s+/, '');

      const $rating = $card.find('[data-name-id="ListingCardReviewStars-rating"]');
      const ratingWidth = $rating.attr('style')?.match(/width:\s*(\d+)%/)?.[1];
      const ratingValue = ratingWidth ? (parseInt(ratingWidth) / 20).toFixed(1) : null;

      const reviewCount = $card.find('[data-name-id="ListingCardReviewStars-reviewCount"]')
                              .text().trim().replace(/[()]/g, '');

      const availability = $card.find('[data-name-id="ListingCardAvailableChoices-PreviewMessage"]').text().trim();

      const $badge = $card.find('[data-name-id="ListingCardFlag"]');
      const badge = $badge.text().trim();

      if (name && name.length > 3) {
        const product = {
          id: `WAY-${String(products.length + 1).padStart(4, '0')}`,
          sku: url.match(/\/(\w+)\.html/)?.[1] || null,
          name: name.trim(),
          manufacturer: manufacturer || null,
          price: price || null,
          original_price: originalPrice || null,
          image: image || null,
          url: url,
          rating: ratingValue || null,
          review_count: reviewCount || null,
          availability: availability || null,
          badge: badge || null,
          source: 'wayfair',
          scraped_at: new Date().toISOString()
        };

        products.push(product);

        if (products.length % 20 === 0) {
          process.stdout.write(`\r✓ Extracted: ${products.length} products`);
        }
      }

    } catch (err) {
      console.error(`Error parsing card ${idx}:`, err.message);
    }
  });

  console.log(`\r✓ Extracted: ${products.length} products - Complete\n`);

  return products;
}

function displayResults(products) {
  console.log('='.repeat(60));
  console.log(`RESULTS: ${products.length} PRODUCTS`);
  console.log('='.repeat(60) + '\n');

  if (products.length === 0) {
    console.log('⚠ No products found\n');
    return;
  }

  const stats = {
    total: products.length,
    withPrice: products.filter(p => p.price).length,
    withOriginalPrice: products.filter(p => p.original_price).length,
    withImage: products.filter(p => p.image).length,
    withRating: products.filter(p => p.rating).length,
    withBadge: products.filter(p => p.badge).length
  };

  console.log('Statistics:');
  console.log(`- Total: ${stats.total}`);
  console.log(`- With price: ${stats.withPrice} (${(stats.withPrice / stats.total * 100).toFixed(1)}%)`);
  console.log(`- On sale: ${stats.withOriginalPrice} (${(stats.withOriginalPrice / stats.total * 100).toFixed(1)}%)`);
  console.log(`- With image: ${stats.withImage} (${(stats.withImage / stats.total * 100).toFixed(1)}%)`);
  console.log(`- With rating: ${stats.withRating} (${(stats.withRating / stats.total * 100).toFixed(1)}%)`);
  console.log(`- With badge: ${stats.withBadge} (${(stats.withBadge / stats.total * 100).toFixed(1)}%)\n`);

  console.log('Sample (first 5):\n');
  products.slice(0, 5).forEach((p, i) => {
    console.log(`${i + 1}. ${p.name.substring(0, 70)}${p.name.length > 70 ? '...' : ''}`);
    console.log(`   Price: ${p.price || 'N/A'}${p.original_price ? ` (was ${p.original_price})` : ''}`);
    console.log(`   Rating: ${p.rating ? `${p.rating}/5.0` : 'N/A'}${p.review_count ? ` (${p.review_count} reviews)` : ''}`);
    console.log(`   Manufacturer: ${p.manufacturer || 'N/A'}`);
    console.log(`   ID: ${p.id}`);
    if (p.badge) console.log(`   Badge: ${p.badge}`);
    console.log('');
  });

  const outputFile = 'wayfair-products-complete.json';
  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
  console.log(`✓ Saved to ${outputFile}\n`);

  console.log('='.repeat(60));
  console.log('✓ SCRAPING SUCCESSFUL');
  console.log('='.repeat(60) + '\n');
}

async function main() {
  const targetUrl = process.argv[2] || 'https://www.wayfair.com/furniture/cat/sofas-c413902.html';

  try {
    const html = await scrapeWayfair(targetUrl);
    const products = extractAllProducts(html);
    displayResults(products);

    return products;

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ FAILED');
    console.error('='.repeat(60));
    console.error(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scrapeWayfair, extractAllProducts };
