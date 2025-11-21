const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

async function fetchProductPrice(url) {
  try {
    console.log(`   Fetching: ${url.substring(30, 80)}...`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try multiple price selectors
    let price = null;

    // Look for price in various formats
    const priceSelectors = [
      '.ty-price-num',
      '.cm-price-value',
      '.ty-price',
      '[id*="price"]',
      '[class*="price"]'
    ];

    for (const selector of priceSelectors) {
      const priceEl = $(selector).first();
      if (priceEl.length) {
        const text = priceEl.text().trim();
        const cleaned = text.replace(/[^\d]/g, '');
        if (cleaned && cleaned.length >= 4) {
          price = parseInt(cleaned);
          break;
        }
      }
    }

    // Extract images from product page
    const images = [];
    $('.cm-image-previewer, .ty-product-thumbnails img, .cm-preview-wrapper img').each((i, el) => {
      let imgUrl = $(el).attr('href') || $(el).attr('src') || $(el).attr('data-src');
      if (imgUrl) {
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        else if (!imgUrl.startsWith('http')) imgUrl = 'https://mnogomebeli.com' + imgUrl;

        // Remove resize parameters to get full image
        imgUrl = imgUrl.replace('/resize_cache/', '/').replace(/\/\d+_\d+_\d+\//, '/');

        if (!images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      }
    });

    return { price, images };
  } catch (error) {
    console.log(`   ⚠️ Error: ${error.message}`);
    return { price: null, images: [] };
  }
}

async function enhanceCabinets() {
  console.log('🔧 Enhancing 83 cabinets with real prices and images...\n');

  // Load existing data
  const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped-no-idea.json', 'utf8'));
  console.log(`📦 Loaded ${cabinets.length} cabinets\n`);

  let successCount = 0;
  let pricesFound = 0;

  // Fetch price and images for each
  for (let i = 0; i < cabinets.length; i++) {
    const cabinet = cabinets[i];
    console.log(`\n${i + 1}/${cabinets.length}: ${cabinet.russianName.substring(0, 60)}`);

    const details = await fetchProductPrice(cabinet.url);

    if (details.price) {
      cabinet.price = details.price;
      pricesFound++;
      console.log(`   ✅ Price: ${details.price} ₽`);
    } else {
      cabinet.price = null;
      console.log(`   ⚠️  No price found`);
    }

    cabinet.allImages = details.images.length > 0 ? details.images : (cabinet.imageUrl ? [cabinet.imageUrl] : []);
    console.log(`   📸 Images: ${cabinet.allImages.length}`);

    successCount++;

    // Small delay
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n✅ FINAL RESULTS:`);
  console.log(`   Total cabinets: ${cabinets.length}`);
  console.log(`   Prices found: ${pricesFound}`);
  console.log(`   With images: ${cabinets.filter(c => c.allImages && c.allImages.length > 0).length}\n`);

  // Save
  fs.writeFileSync('./cabinets-final-with-prices.json', JSON.stringify(cabinets, null, 2));
  console.log('💾 Saved to: cabinets-final-with-prices.json\n');

  // Show sample with prices
  const withPrices = cabinets.filter(c => c.price);
  console.log('📋 Sample cabinets WITH prices:');
  withPrices.slice(0, 5).forEach((c, i) => {
    console.log(`\n${i + 1}. ${c.russianName}`);
    console.log(`   Price: ${c.price} ₽`);
    console.log(`   Images: ${c.allImages.length}`);
  });

  return cabinets;
}

enhanceCabinets().catch(console.error);
