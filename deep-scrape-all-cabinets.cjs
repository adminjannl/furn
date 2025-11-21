const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return await response.text();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function scrapeProductDetails(url) {
  try {
    console.log(`  Fetching: ${url}`);
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Extract price
    let price = null;
    const priceText = $('.ty-price-num').first().text().trim();
    if (priceText) {
      price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
    }

    // Extract all images
    const images = [];
    $('.cm-image-previewer').each((i, el) => {
      let imgUrl = $(el).attr('href') || $(el).find('img').attr('src');
      if (imgUrl && imgUrl.startsWith('//')) {
        imgUrl = 'https:' + imgUrl;
      } else if (imgUrl && !imgUrl.startsWith('http')) {
        imgUrl = 'https://mnogomebeli.com' + imgUrl;
      }
      if (imgUrl && !images.includes(imgUrl)) {
        images.push(imgUrl);
      }
    });

    // Extract description
    const description = $('.ty-product-block__description').text().trim() || '';

    // Extract dimensions/features
    const features = [];
    $('.ty-product-feature').each((i, el) => {
      const name = $(el).find('.ty-product-feature__label').text().trim();
      const value = $(el).find('.ty-product-feature__value').text().trim();
      if (name && value) {
        features.push({ name, value });
      }
    });

    return { price, images, description, features };
  } catch (error) {
    console.log(`  ⚠️  Error fetching ${url}: ${error.message}`);
    return { price: null, images: [], description: '', features: [] };
  }
}

async function scrapeAllCabinets() {
  console.log('🚀 Deep scraping ALL cabinets with prices and images...\n');

  const allCabinets = [];
  const baseUrl = 'https://mnogomebeli.com/shkafy/';

  // Try multiple pages with pagination
  for (let page = 1; page <= 10; page++) {
    const url = page === 1 ? baseUrl : `${baseUrl}?PAGEN_1=${page}`;

    console.log(`\n📄 Page ${page}: ${url}`);

    try {
      const html = await fetchWithRetry(url);
      const $ = cheerio.load(html);

      const items = $('.ty-grid-list__item');
      console.log(`   Found ${items.length} products`);

      if (items.length === 0) break;

      let newProducts = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items.eq(i);
        const linkEl = item.find('.product-title a');
        const imgEl = item.find('.ty-pict img');

        const russianName = linkEl.text().trim();
        const productUrl = linkEl.attr('href');

        if (!russianName || !productUrl) continue;

        // Skip if already added
        if (allCabinets.find(c => c.url === productUrl)) continue;

        let imageUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';
        if (imageUrl && imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = 'https://mnogomebeli.com' + imageUrl;
        }

        // Get detailed info
        const details = await scrapeProductDetails(productUrl);

        allCabinets.push({
          russianName,
          url: productUrl,
          imageUrl,
          price: details.price,
          allImages: details.images.length > 0 ? details.images : [imageUrl],
          description: details.description,
          features: details.features
        });

        newProducts++;

        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`   ✅ Added ${newProducts} new products (total: ${allCabinets.length})`);

      // If we got fewer than expected, try next page
      if (items.length < 20) break;

    } catch (error) {
      console.log(`   ⚠️  Error on page ${page}: ${error.message}`);
      break;
    }
  }

  // Filter out Idea series
  const filtered = allCabinets.filter(c => !c.russianName.includes('Идея'));

  console.log(`\n📊 Final Results:`);
  console.log(`   Total scraped: ${allCabinets.length}`);
  console.log(`   Idea series removed: ${allCabinets.length - filtered.length}`);
  console.log(`   Final count: ${filtered.length}\n`);

  // Count products with prices
  const withPrices = filtered.filter(c => c.price && c.price > 0).length;
  const withImages = filtered.filter(c => c.allImages && c.allImages.length > 0).length;

  console.log(`   ✅ With prices: ${withPrices}`);
  console.log(`   ✅ With images: ${withImages}\n`);

  // Save
  fs.writeFileSync('./all-107-cabinets-complete.json', JSON.stringify(filtered, null, 2));
  console.log('💾 Saved to: all-107-cabinets-complete.json\n');

  // Show first 5 with prices
  console.log('📋 First 5 cabinets:');
  filtered.slice(0, 5).forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.russianName}`);
    console.log(`      Price: ${c.price || 'N/A'} ₽`);
    console.log(`      Images: ${c.allImages.length}`);
  });

  return filtered;
}

scrapeAllCabinets().catch(console.error);
