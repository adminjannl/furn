const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function scrapeListingPage() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('SCRAPING SOFA THUMBNAILS FROM LISTING PAGE');
  console.log('═══════════════════════════════════════════════════════════\n');

  const allSofas = [];
  let pageNum = 1;
  const maxPages = 35; // Adjust based on how many pages exist

  while (pageNum <= maxPages) {
    const url = pageNum === 1
      ? 'https://mnogomebeli.com/divany/'
      : `https://mnogomebeli.com/divany/?PAGEN_1=${pageNum}`;

    console.log(`Fetching page ${pageNum}...`);

    const html = await fetchPage(url);
    if (!html) {
      console.log(`Failed to fetch page ${pageNum}, stopping`);
      break;
    }

    const $ = cheerio.load(html);

    // Debug: Save first page HTML
    if (pageNum === 1) {
      fs.writeFileSync('listing-page-debug.html', html);
      console.log('Saved first page HTML for debugging');
    }

    // Try multiple possible selectors for product items
    let productCards = [];
    const possibleSelectors = [
      '.catalog-section .item',
      '.catalog-list .item',
      '.products-list .product',
      '.catalog-item',
      'article.product',
      '[data-product-id]',
      '.bx-catalog-element'
    ];

    for (const selector of possibleSelectors) {
      productCards = $(selector);
      if (productCards.length > 0) {
        console.log(`  Found ${productCards.length} products using selector: ${selector}`);
        break;
      }
    }

    if (productCards.length === 0) {
      console.log(`  No products found on page ${pageNum}`);

      // Try to find any images with product-like structure
      const allImages = $('img[src*="upload/iblock"]');
      console.log(`  Found ${allImages.length} total images on page`);

      if (pageNum === 1 && allImages.length === 0) {
        console.log('  ERROR: No images found on first page! The page structure may require JavaScript.');
        break;
      }

      if (allImages.length === 0) {
        break;
      }
    }

    // Extract product data
    productCards.each((i, elem) => {
      const $elem = $(elem);

      // Get product name from various possible locations
      let name = '';
      const nameSelectors = [
        '.item-title',
        '.product-title',
        '.name',
        'h3',
        'h4',
        'a.title',
        '[itemprop="name"]'
      ];

      for (const selector of nameSelectors) {
        const nameElem = $elem.find(selector).first();
        if (nameElem.length) {
          name = nameElem.text().trim() || nameElem.attr('title') || '';
          if (name) break;
        }
      }

      // If still no name, try link title
      if (!name) {
        const link = $elem.find('a[title]').first();
        name = link.attr('title') || '';
      }

      // Get image
      const img = $elem.find('img').first();
      let thumbnailUrl = '';

      if (img.length) {
        thumbnailUrl = img.attr('src') ||
                      img.attr('data-src') ||
                      img.attr('data-lazy') ||
                      img.attr('data-original') || '';

        if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
          thumbnailUrl = `https://mnogomebeli.com${thumbnailUrl}`;
        }

        // Clean URL
        thumbnailUrl = thumbnailUrl.split('?')[0];
      }

      if (name && thumbnailUrl && thumbnailUrl.includes('upload/iblock')) {
        allSofas.push({
          name: name.trim(),
          thumbnailUrl,
          page: pageNum
        });
      }
    });

    console.log(`  Scraped ${allSofas.length} total sofas so far`);

    pageNum++;
    await delay(1500); // Be respectful with delays
  }

  console.log(`\n✓ Total scraped: ${allSofas.length} sofa thumbnails`);

  // Save to file for inspection
  fs.writeFileSync('scraped-listing-thumbnails.json', JSON.stringify(allSofas, null, 2));
  console.log('✓ Saved to scraped-listing-thumbnails.json\n');

  return allSofas;
}

async function main() {
  const scrapedSofas = await scrapeListingPage();

  if (scrapedSofas.length === 0) {
    console.log('\n❌ No sofas scraped. Check listing-page-debug.html to understand the page structure.');
    return;
  }

  console.log('\n📊 Sample of scraped data:');
  console.log(scrapedSofas.slice(0, 5).map(s => `  - ${s.name}\n    ${s.thumbnailUrl}`).join('\n\n'));
}

main().catch(console.error);
