const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapePage(url) {
  console.log(`\n📄 Fetching: ${url}`);
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const products = [];

  $('.product').each((i, el) => {
    const $el = $(el);

    const nameEl = $el.find('.product__name');
    const imageEl = $el.find('.product__img img').first();
    const priceEl = $el.find('.product__price');

    if (nameEl.length) {
      const name = nameEl.text().trim();
      const url = nameEl.attr('href');

      let imageUrl = null;
      if (imageEl.length) {
        imageUrl = imageEl.attr('src') || imageEl.attr('data-src');
      }

      let price = null;
      if (priceEl.length) {
        const priceText = priceEl.text().trim();
        const priceMatch = priceText.match(/[\d\s]+/);
        if (priceMatch) {
          price = parseInt(priceMatch[0].replace(/\s/g, ''));
        }
      }

      // Include ALL products from /shkafy/ including Idea series
      if (url && url.includes('/shkafy/')) {
        products.push({
          russianName: name,
          url: url.startsWith('http') ? url : `https://mnogomebeli.com${url}`,
          imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://mnogomebeli.com${imageUrl}`) : null,
          price: price
        });
      }
    }
  });

  console.log(`   Found: ${products.length} products`);
  return products;
}

async function scrapeAllCategories() {
  console.log('🔍 Scraping ALL cabinet categories from /shkafy/ (INCLUDING Idea series)...\n');

  const categories = [
    { name: 'Main shkafy', url: 'https://mnogomebeli.com/shkafy/' },
    { name: 'Boss Standart 220', url: 'https://mnogomebeli.com/shkafy/boss-standart-220/' },
    { name: 'With Mirror', url: 'https://mnogomebeli.com/shkafy/s-zerkalom/' },
    { name: 'Boss Standart', url: 'https://mnogomebeli.com/shkafy/shkaf-boss-standart/' },
    { name: 'Idea Series', url: 'https://mnogomebeli.com/shkafy/shkafy-ideya/' },
    { name: 'Hinged', url: 'https://mnogomebeli.com/shkafy/raspashnye/' },
    { name: 'Corner', url: 'https://mnogomebeli.com/shkafy/uglovye/' },
    { name: 'Hallway', url: 'https://mnogomebeli.com/shkafy/prihozhaya/' },
    { name: 'Straight', url: 'https://mnogomebeli.com/shkafy/pryamye/' },
    { name: 'Coupe', url: 'https://mnogomebeli.com/shkafy/kupe/' },
    { name: 'Rim', url: 'https://mnogomebeli.com/shkafy/shkafy-rim/' },
  ];

  const allProducts = [];
  const seenUrls = new Set();

  for (const category of categories) {
    try {
      console.log(`\n📁 Category: ${category.name}`);
      const products = await scrapePage(category.url);

      let newProducts = 0;
      for (const product of products) {
        if (!seenUrls.has(product.url)) {
          seenUrls.add(product.url);
          allProducts.push(product);
          newProducts++;
        }
      }

      console.log(`   New products: ${newProducts}`);

      // Be nice to the server
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ SCRAPING COMPLETE\n');
  console.log(`📊 Results:`);
  console.log(`   Total unique products: ${allProducts.length}`);
  console.log(`   With prices: ${allProducts.filter(p => p.price).length}`);
  console.log(`   Without prices: ${allProducts.filter(p => !p.price).length}`);

  // Check Idea series
  const ideya = allProducts.filter(p => p.url.includes('/shkafy-ideya/'));
  console.log(`   Idea series products: ${ideya.length}`);

  // Save results
  fs.writeFileSync('./all-shkafy-complete-with-prices.json', JSON.stringify(allProducts, null, 2));
  console.log(`\n💾 Saved to: all-shkafy-complete-with-prices.json`);

  return allProducts;
}

scrapeAllCategories().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
