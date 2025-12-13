const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const SCRAPER_API_KEY = '91cdde2c85dc714a1a8656ed20757829';

async function scrapeWayfairFullPage(targetUrl) {
  console.log('ScraperAPI - Full Page Scraping with Scrolling');
  console.log('='.repeat(50));
  console.log(`Target: ${targetUrl}\n`);

  const params = new URLSearchParams({
    api_key: SCRAPER_API_KEY,
    url: targetUrl,
    render: 'true',
    wait_for: '5000',
    autoparse: 'false',
    premium: 'true',
    session_number: String(Math.floor(Math.random() * 10000)),
    country_code: 'us'
  });

  const scraperApiUrl = `http://api.scraperapi.com?${params.toString()}`;

  try {
    console.log('Configuration:');
    console.log('✓ JavaScript rendering enabled');
    console.log('✓ Wait time: 5 seconds');
    console.log('✓ Premium mode enabled');
    console.log('✓ US proxy\n');

    console.log('Requesting page (60-90 seconds)...\n');
    const startTime = Date.now();

    const response = await fetch(scraperApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 180000
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n✗ Error ${response.status}:`, errorText.substring(0, 300));
      throw new Error(`ScraperAPI failed with status ${response.status}`);
    }

    console.log(`✓ Response received in ${elapsed}s`);
    const html = await response.text();
    console.log(`✓ HTML size: ${(html.length / 1024).toFixed(2)} KB\n`);

    const filename = 'wayfair-full-scraped.html';
    fs.writeFileSync(filename, html);
    console.log(`✓ Saved to ${filename}\n`);

    return html;

  } catch (error) {
    console.error('\n✗ Request failed:', error.message);
    throw error;
  }
}

function extractProducts(html) {
  console.log('='.repeat(50));
  console.log('EXTRACTING PRODUCTS');
  console.log('='.repeat(50) + '\n');

  const $ = cheerio.load(html);

  console.log('Page stats:');
  console.log(`- Title: ${$('title').text().substring(0, 60)}...`);
  console.log(`- Links: ${$('a').length}`);
  console.log(`- Images: ${$('img').length}`);
  console.log(`- Product links (/product/): ${$('a[href*="/product/"]').length}`);
  console.log(`- PDPlinks (/pdp/): ${$('a[href*="/pdp/"]').length}`);
  console.log(`- Articles: ${$('article').length}`);
  console.log(`- Scripts: ${$('script').length}\n`);

  const products = [];
  const seen = new Set();

  const productLinks = $('a[href*="/product/"], a[href*="/pdp/"]');
  console.log(`Processing ${productLinks.length} product links...\n`);

  productLinks.each((idx, elem) => {
    try {
      const $link = $(elem);
      const href = $link.attr('href');

      if (!href || seen.has(href)) return;
      seen.add(href);

      const url = href.startsWith('http') ? href : `https://www.wayfair.com${href}`;

      const $container = $link.closest('article, div[class*="Card"], li, [class*="product"]');

      const $name = $container.find('h2, h3, h4, [data-hb-id*="Name"], [class*="Name"], [aria-label]');
      const name = $name.first().text().trim() ||
                  $link.attr('aria-label') ||
                  $link.attr('title') ||
                  $link.text().trim();

      const $price = $container.find('[data-hb-id*="Price"], [class*="Price"], [class*="price"], [data-test*="price"]');
      const price = $price.first().text().trim() ||
                   $container.find('span:contains("$"), div:contains("$")').first().text().trim();

      const $img = $link.find('img').first().length ? $link.find('img').first() : $container.find('img').first();
      const image = $img.attr('data-src') ||
                   $img.attr('src') ||
                   $img.attr('data-lazy-src') ||
                   $img.attr('srcset')?.split(',')[0]?.split(' ')[0];

      const $rating = $container.find('[aria-label*="rating"], [aria-label*="star"], [data-hb-id*="Rating"]');
      const rating = $rating.first().attr('aria-label') || $rating.first().text().trim();

      const $reviews = $container.find('[class*="review"], [class*="Review"]');
      const reviews = $reviews.first().text().trim();

      if (name && name.length > 5 && !name.toLowerCase().includes('wayfair')) {
        const product = {
          id: `WAY-${String(products.length + 1).padStart(4, '0')}`,
          name: name.trim().substring(0, 250),
          price: price || null,
          image: image || null,
          url: url,
          rating: rating || null,
          reviews: reviews || null,
          source: 'wayfair',
          scraped_at: new Date().toISOString()
        };

        products.push(product);

        if (products.length % 10 === 0) {
          process.stdout.write(`\rExtracted: ${products.length} products`);
        }
      }

    } catch (err) {
      if (products.length < 5) {
        console.error('Parse error:', err.message);
      }
    }
  });

  console.log(`\rExtracted: ${products.length} products - Complete\n`);

  if (products.length === 0) {
    console.log('\n⚠ Warning: No products found');
    console.log('Saving page sample for debugging...\n');

    const sample = {
      firstScript: $('script').first().html()?.substring(0, 500),
      firstArticle: $('article').first().html()?.substring(0, 500),
      firstLink: $('a[href*="/product/"]').first().html(),
      structuredData: []
    };

    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        sample.structuredData.push(JSON.parse($(elem).html()));
      } catch (e) {}
    });

    fs.writeFileSync('debug-sample.json', JSON.stringify(sample, null, 2));
    console.log('Debug info saved to debug-sample.json');
  }

  return products;
}

async function main() {
  const targetUrl = process.argv[2] || 'https://www.wayfair.com/furniture/cat/sofas-c413902.html';

  console.log('\n' + '='.repeat(50));
  console.log('WAYFAIR SCRAPER - ScraperAPI');
  console.log('='.repeat(50) + '\n');

  try {
    const html = await scrapeWayfairFullPage(targetUrl);
    const products = extractProducts(html);

    console.log('='.repeat(50));
    console.log(`RESULT: ${products.length} PRODUCTS EXTRACTED`);
    console.log('='.repeat(50) + '\n');

    if (products.length > 0) {
      console.log('Sample (first 5):');
      products.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name.substring(0, 70)}${p.name.length > 70 ? '...' : ''}`);
        console.log(`   Price: ${p.price || 'Not found'}`);
        console.log(`   Image: ${p.image ? 'YES' : 'NO'}`);
        console.log(`   ID: ${p.id}`);
      });

      const stats = {
        total: products.length,
        withPrice: products.filter(p => p.price).length,
        withImage: products.filter(p => p.image).length,
        withRating: products.filter(p => p.rating).length
      };

      console.log('\n' + '-'.repeat(50));
      console.log('Statistics:');
      console.log(`Total products: ${stats.total}`);
      console.log(`With price: ${stats.withPrice} (${(stats.withPrice / stats.total * 100).toFixed(1)}%)`);
      console.log(`With image: ${stats.withImage} (${(stats.withImage / stats.total * 100).toFixed(1)}%)`);
      console.log(`With rating: ${stats.withRating} (${(stats.withRating / stats.total * 100).toFixed(1)}%)`);

      const outputFile = 'wayfair-products-final.json';
      fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
      console.log(`\n✓ Saved to ${outputFile}`);

      console.log('\n' + '='.repeat(50));
      console.log('✓ SUCCESS!');
      console.log('='.repeat(50) + '\n');

      return products;

    } else {
      console.log('⚠ No products extracted');
      console.log('\nPossible reasons:');
      console.log('- Page structure changed');
      console.log('- Content requires more wait time');
      console.log('- Different URL format needed');
      console.log('\nCheck wayfair-full-scraped.html manually');
    }

  } catch (error) {
    console.error('\n' + '='.repeat(50));
    console.error('✗ FAILED');
    console.error('='.repeat(50));
    console.error(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scrapeWayfairFullPage, extractProducts };
