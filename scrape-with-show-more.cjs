/**
 * WORKING METHOD FOR SCRAPING PAGES WITH "SHOW MORE" BUTTONS
 *
 * This scraper works by:
 * 1. Fetching the main page multiple times with different pagination parameters
 * 2. Using AJAX-style requests that simulate clicking "Show More"
 * 3. Trying multiple URL patterns that websites use for lazy loading
 *
 * KEY INSIGHT: Russian e-commerce sites often use Bitrix framework which has
 * specific URL patterns for AJAX pagination:
 * - ?PAGEN_1=X for page numbers
 * - ?AJAX=Y or ajax=Y for AJAX requests
 * - ?show_all=Y to bypass pagination
 * - Combinations of the above
 *
 * IMPORTANT: Always try ALL these patterns as different pages use different methods
 */

const cheerio = require('cheerio');
const fs = require('fs');

async function fetchWithShowMore(baseUrl, maxPages = 20) {
  console.log(`🔍 Fetching ${baseUrl} with all pagination methods...\n`);

  const allProducts = new Map(); // Use Map to deduplicate by URL

  // Generate all possible URL variations to try
  const urlsToTry = [
    baseUrl, // Base URL
    `${baseUrl}?show_all=Y`, // Show all parameter
    `${baseUrl}?AJAX=Y`, // AJAX mode
    `${baseUrl}?ajax=Y`, // Lowercase ajax
    ...Array.from({ length: maxPages }, (_, i) => `${baseUrl}?PAGEN_1=${i + 1}`), // Standard pagination
    ...Array.from({ length: maxPages }, (_, i) => `${baseUrl}?PAGEN_1=${i + 1}&AJAX=Y`), // AJAX pagination
    ...Array.from({ length: 5 }, (_, i) => `${baseUrl}?PAGEN_2=${i + 1}`), // Alternative pagination
    ...Array.from({ length: 5 }, (_, i) => `${baseUrl}?SIZEN_1=${(i + 1) * 20}`), // Size-based pagination
  ];

  console.log(`📋 Will try ${urlsToTry.length} different URL patterns\n`);

  for (let i = 0; i < urlsToTry.length; i++) {
    const url = urlsToTry[i];
    console.log(`${i + 1}/${urlsToTry.length}: ${url.substring(baseUrl.length) || 'base'}`);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
          'X-Requested-With': 'XMLHttpRequest', // Important for AJAX requests
        }
      });

      if (!response.ok) {
        console.log(`   ❌ HTTP ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      let newProductsOnThisPage = 0;

      // Find all product links (adjust selector based on your site)
      $('a[href*="!"]').each((idx, elem) => {
        const href = $(elem).attr('href');

        // Filter for product links (adjust based on your site's URL structure)
        if (!href || !href.includes('/shkafy/') || href.includes('#review')) {
          return;
        }

        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        if (!allProducts.has(fullUrl)) {
          newProductsOnThisPage++;

          // Extract product info
          const title = $(elem).attr('title') || '';
          const img = $(elem).find('img').first();
          const imgAlt = img.attr('alt') || '';
          const imgSrc = img.attr('src') || img.attr('data-src') || '';
          const linkText = $(elem).text().trim();

          let name = (title || imgAlt || linkText)
            .replace(/\s+/g, ' ')
            .replace(/Новинки|Живое фото|📸|★|отзыв(ов)?/gi, '')
            .trim();

          if (name && name.length > 5 && name.length < 200 && !name.match(/^\d+$/)) {
            const imageUrl = imgSrc ?
              (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) :
              null;

            allProducts.set(fullUrl, {
              russianName: name,
              url: fullUrl,
              imageUrl,
            });
          }
        }
      });

      console.log(`   ✅ ${newProductsOnThisPage} new (Total: ${allProducts.size})`);

      // Small delay to be polite
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  return Array.from(allProducts.values());
}

async function fetchProductDetails(url, name) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract price
    let price = null;
    $('.ty-price-num, .price-num, [class*="price"]').each((i, el) => {
      if (!price) {
        const text = $(el).text().trim().replace(/[^\d]/g, '');
        if (text && text.length > 0) {
          const parsed = parseInt(text);
          if (parsed > 100 && parsed < 100000) { // Sanity check
            price = parsed;
          }
        }
      }
    });

    // Extract images
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.includes('/upload/') && src.includes('mnogomebeli.com')) {
        let imgUrl = src.startsWith('//') ? 'https:' + src :
          (src.startsWith('/') ? 'https://mnogomebeli.com' + src : src);

        if (!images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      }
    });

    return { price, images };
  } catch (error) {
    return { price: null, images: [] };
  }
}

async function scrapeAllCabinets() {
  console.log('🗄️  SCRAPING ALL CABINETS WITH SHOW MORE METHOD\n');
  console.log('=' .repeat(60) + '\n');

  const baseUrl = 'https://mnogomebeli.com/shkafy/';

  // Step 1: Fetch all product URLs
  const products = await fetchWithShowMore(baseUrl, 20);

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Found ${products.length} unique product URLs\n`);

  // Step 2: Fetch details for each product
  console.log('🔍 Fetching prices and images for all products...\n');

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`${i + 1}/${products.length}: ${product.russianName.substring(0, 50)}...`);

    const details = await fetchProductDetails(product.url, product.russianName);
    product.price = details.price;
    product.allImages = details.images.length > 0 ? details.images :
      (product.imageUrl ? [product.imageUrl] : []);

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 3: Save results
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ SCRAPING COMPLETE!\n`);
  console.log(`   Total products: ${products.length}`);
  console.log(`   With prices: ${products.filter(p => p.price).length}`);
  console.log(`   With images: ${products.filter(p => p.allImages.length > 0).length}\n`);

  fs.writeFileSync('./all-107-cabinets-complete.json', JSON.stringify(products, null, 2));
  console.log('💾 Saved to: all-107-cabinets-complete.json\n');

  // Step 4: Compare with existing database
  const existing = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));
  const existingUrls = new Set(existing.map(c => c.url));
  const newProducts = products.filter(p => !existingUrls.has(p.url));

  console.log('📊 COMPARISON WITH DATABASE:\n');
  console.log(`   In database: ${existing.length}`);
  console.log(`   Just scraped: ${products.length}`);
  console.log(`   New products: ${newProducts.length}\n`);

  if (newProducts.length > 0) {
    console.log('🆕 NEW PRODUCTS FOUND:\n');
    newProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.russianName}`);
      console.log(`   Price: ${p.price || 'N/A'}₽`);
      console.log(`   URL: ${p.url}\n`);
    });

    fs.writeFileSync('./new-products-to-add.json', JSON.stringify(newProducts, null, 2));
    console.log('💾 New products saved to: new-products-to-add.json\n');
  } else {
    console.log('✅ All scraped products already in database!\n');
  }

  return products;
}

// Run the scraper
scrapeAllCabinets().catch(console.error);
