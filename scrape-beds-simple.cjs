require('dotenv').config();
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeBedsPage(pageNum = 1) {
  console.log(`📄 Fetching page ${pageNum}...`);

  // The website likely uses AJAX to load more, so we'll try different approaches
  const url = pageNum === 1
    ? 'https://mnogomebeli.com/krovati/'
    : `https://mnogomebeli.com/krovati/?page=${pageNum}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    if (!response.ok) {
      console.log(`⚠️  Page ${pageNum} returned status ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const beds = [];

    // Try multiple selectors to find products
    const productSelectors = [
      '.product-card',
      '.product-item',
      '.product',
      '[class*="product-"]',
      'article',
      '[itemtype*="Product"]'
    ];

    let foundProducts = false;
    for (const selector of productSelectors) {
      const products = $(selector);
      if (products.length > 0) {
        console.log(`✅ Found ${products.length} products with selector: ${selector}`);

        products.each((i, elem) => {
          const $elem = $(elem);

          // Try to find the product name
          const nameSelectors = ['h3', 'h2', '.product-name', '.product-title', '[class*="title"]'];
          let name = '';
          for (const ns of nameSelectors) {
            const nameEl = $elem.find(ns).first();
            if (nameEl.length) {
              name = nameEl.text().trim();
              break;
            }
          }

          // Try to find the product link
          const link = $elem.find('a[href*="/product/"], a[href*="/krovat"]').first();
          const url = link.length ? link.attr('href') : '';

          // Try to find the image
          const img = $elem.find('img').first();
          const imageUrl = img.length ? (img.attr('src') || img.attr('data-src')) : '';

          if (name && url) {
            const fullUrl = url.startsWith('http') ? url : `https://mnogomebeli.com${url}`;
            beds.push({
              name: name,
              url: fullUrl,
              imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://mnogomebeli.com${imageUrl}`) : null
            });
          }
        });

        foundProducts = true;
        break;
      }
    }

    if (!foundProducts) {
      console.log('⚠️  No products found with any selector, trying link-based approach...');

      // Alternative: find all links that look like product links
      $('a[href*="/product/"], a[href*="/krovat"]').each((i, elem) => {
        const $link = $(elem);
        const url = $link.attr('href');
        const name = $link.text().trim() || $link.find('img').attr('alt') || '';

        if (name && url && !url.includes('#') && !url.includes('javascript')) {
          const fullUrl = url.startsWith('http') ? url : `https://mnogomebeli.com${url}`;

          // Avoid duplicates
          if (!beds.find(b => b.url === fullUrl)) {
            beds.push({
              name: name,
              url: fullUrl,
              imageUrl: null
            });
          }
        }
      });
    }

    console.log(`📦 Scraped ${beds.length} beds from page ${pageNum}`);
    return beds;

  } catch (error) {
    console.error(`❌ Error scraping page ${pageNum}:`, error.message);
    return [];
  }
}

async function scrapeAllBeds() {
  console.log('🚀 Starting to scrape all beds from mnogomebeli.com...\n');

  const allBeds = [];
  const maxPages = 10; // Try up to 10 pages

  // Try scraping multiple pages
  for (let page = 1; page <= maxPages; page++) {
    const beds = await scrapeBedsPage(page);

    if (beds.length === 0) {
      console.log(`\n⚠️  No beds found on page ${page}, stopping pagination.\n`);
      break;
    }

    // Add beds, avoiding duplicates by URL
    beds.forEach(bed => {
      if (!allBeds.find(b => b.url === bed.url)) {
        allBeds.push(bed);
      }
    });

    console.log(`✅ Total unique beds so far: ${allBeds.length}\n`);

    // If we've reached 95+ beds, we're done
    if (allBeds.length >= 95) {
      console.log('🎯 Reached target of 95 beds!\n');
      break;
    }

    // Small delay between pages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✅ Scraping complete! Found ${allBeds.length} total beds`);

  // Save to file
  fs.writeFileSync(
    './all-95-beds-scraped.json',
    JSON.stringify(allBeds, null, 2)
  );

  console.log('💾 Saved to all-95-beds-scraped.json');

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`Total beds found: ${allBeds.length}`);
  console.log(`Expected: 95`);
  console.log(`Status: ${allBeds.length >= 95 ? '✅ Complete' : `⚠️  Missing ${95 - allBeds.length} beds`}`);

  // Show first few examples
  console.log('\n📋 First 5 beds:');
  allBeds.slice(0, 5).forEach((bed, i) => {
    console.log(`${i + 1}. ${bed.name}`);
  });

  return allBeds;
}

scrapeAllBeds().catch(console.error);
