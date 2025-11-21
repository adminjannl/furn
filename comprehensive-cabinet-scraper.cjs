const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

async function fetchProductDetails(url) {
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
    const priceEl = $('.ty-price-num, .cm-price, .ty-price').first();
    if (priceEl.length) {
      const priceText = priceEl.text().trim().replace(/[^\d.,]/g, '').replace(',', '.');
      price = parseFloat(priceText);
    }

    // Extract all images
    const images = [];
    $('.cm-image-previewer, .ty-product-thumbnails img, .ty-pict img').each((i, el) => {
      let imgUrl = $(el).attr('href') || $(el).attr('src') || $(el).attr('data-src');
      if (imgUrl) {
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        else if (imgUrl.startsWith('/')) imgUrl = 'https://mnogomebeli.com' + imgUrl;

        // Get full size image (remove resize_cache)
        imgUrl = imgUrl.replace('/resize_cache/', '/');
        imgUrl = imgUrl.replace(/\/\d+_\d+_\d+\//, '/');

        if (!images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      }
    });

    return { price, images };
  } catch (error) {
    console.log(`    ⚠️ Error fetching details: ${error.message}`);
    return { price: null, images: [] };
  }
}

async function scrapeAllCabinets() {
  console.log('🗄️  Comprehensive scraping of ALL cabinets with prices and images...\n');

  const allCabinets = [];
  const seenUrls = new Set();

  // Try different approaches to get all pages
  const attempts = [
    ...Array.from({length: 10}, (_, i) => `https://mnogomebeli.com/shkafy/?PAGEN_1=${i + 1}`),
    'https://mnogomebeli.com/shkafy/?show_all=Y',
  ];

  for (const url of attempts) {
    console.log(`\n📄 Page: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html, application/xhtml+xml',
        }
      });

      if (!response.ok) {
        console.log(`   ❌ HTTP ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      let newProducts = 0;

      // Find all product links with '!' in URL
      $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        if (!href || !href.includes('!') || !href.includes('/shkafy/')) return;

        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        if (!seenUrls.has(fullUrl) && !href.includes('#review')) {
          seenUrls.add(fullUrl);
          newProducts++;

          const title = $(elem).attr('title');
          const img = $(elem).find('img');
          const imgAlt = img.attr('alt');
          const imgSrc = img.attr('src') || img.attr('data-src');
          const linkText = $(elem).text().trim();

          let name = (title || imgAlt || linkText)
            .replace(/\s+/g, ' ')
            .replace(/Новинки|Живое фото|📸|★|отзыв(ов)?/gi, '')
            .trim();

          if (name && name.length > 5 && name.length < 200 && !name.match(/^\d+$/)) {
            let imageUrl = null;
            if (imgSrc) {
              imageUrl = imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`;
            }

            allCabinets.push({
              russianName: name,
              url: fullUrl,
              imageUrl,
              price: null,
              allImages: []
            });
          }
        }
      });

      console.log(`   ✅ Found ${newProducts} new products (total: ${seenUrls.size})`);

      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Scraped ${allCabinets.length} product URLs`);
  console.log('🔍 Now fetching detailed info (prices + images)...\n');

  // Now fetch details for each product
  for (let i = 0; i < allCabinets.length; i++) {
    const cabinet = allCabinets[i];
    console.log(`${i + 1}/${allCabinets.length}: ${cabinet.russianName.substring(0, 50)}...`);

    const details = await fetchProductDetails(cabinet.url);
    cabinet.price = details.price;
    cabinet.allImages = details.images.length > 0 ? details.images : (cabinet.imageUrl ? [cabinet.imageUrl] : []);

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Filter out Idea series
  const filtered = allCabinets.filter(c => !c.russianName.includes('Идея'));

  console.log(`\n✅ FINAL RESULTS:`);
  console.log(`   Total scraped: ${allCabinets.length}`);
  console.log(`   Idea series removed: ${allCabinets.length - filtered.length}`);
  console.log(`   Final count: ${filtered.length}`);
  console.log(`   With prices: ${filtered.filter(c => c.price).length}`);
  console.log(`   With images: ${filtered.filter(c => c.allImages.length > 0).length}\n`);

  // Save
  fs.writeFileSync('./all-cabinets-with-prices.json', JSON.stringify(filtered, null, 2));
  console.log('💾 Saved to: all-cabinets-with-prices.json\n');

  // Show sample
  console.log('📋 Sample (first 5):');
  filtered.slice(0, 5).forEach((c, i) => {
    console.log(`\n${i + 1}. ${c.russianName}`);
    console.log(`   Price: ${c.price ? c.price + ' ₽' : 'N/A'}`);
    console.log(`   Images: ${c.allImages.length}`);
  });

  return filtered;
}

scrapeAllCabinets().catch(console.error);
