const cheerio = require('cheerio');
const fs = require('fs');

async function fetchDetails(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    let price = null;
    $('.ty-price-num').each((i, el) => {
      if (!price) {
        const text = $(el).text().replace(/[^\d]/g, '');
        if (text) {
          const parsed = parseInt(text);
          if (parsed > 100 && parsed < 100000) price = parsed;
        }
      }
    });

    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.includes('/upload/')) {
        const url = src.startsWith('//') ? 'https:' + src : (src.startsWith('/') ? 'https://mnogomebeli.com' + src : src);
        if (!images.includes(url)) images.push(url);
      }
    });

    return { price, images };
  } catch {
    return { price: null, images: [] };
  }
}

async function scrapeCategory(url, name) {
  console.log(`\n📂 ${name}: ${url}`);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const products = [];
    const seen = new Set();

    $('a[href*="!"]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href || !href.includes('/shkafy/') || href.includes('#')) return;

      const fullUrl = href.startsWith('http') ? href : 'https://mnogomebeli.com' + href;
      if (seen.has(fullUrl)) return;
      seen.add(fullUrl);

      const title = $(el).attr('title') || '';
      const img = $(el).find('img').first();
      const imgAlt = img.attr('alt') || '';
      const imgSrc = img.attr('src') || img.attr('data-src') || '';

      let productName = (title || imgAlt || $(el).text()).replace(/\s+/g, ' ').trim();
      if (productName && productName.length > 5 && productName.length < 200) {
        products.push({
          russianName: productName,
          url: fullUrl,
          imageUrl: imgSrc ? (imgSrc.startsWith('http') ? imgSrc : 'https://mnogomebeli.com' + imgSrc) : null
        });
      }
    });

    console.log(`   ✅ Found ${products.length} products`);
    return products;

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return [];
  }
}

async function scrapeAll() {
  console.log('🗄️ SCRAPING ALL SUBCATEGORIES FOR 107 CABINETS\n');
  console.log('='.repeat(60) + '\n');

  const categories = [
    { name: 'Main Shkafy', url: 'https://mnogomebeli.com/shkafy/' },
    { name: 'Raspashnye (Hinged)', url: 'https://mnogomebeli.com/shkafy/raspashnye/' },
    { name: 'Shkafy-kupe (Sliding)', url: 'https://mnogomebeli.com/shkafy/shkafy-kupe/' },
    { name: 'Pryamye (Straight)', url: 'https://mnogomebeli.com/shkafy/pryamye/' },
    { name: 'Uglovye (Corner)', url: 'https://mnogomebeli.com/shkafy/uglovye/' },
    { name: 'S-zerkalom (With Mirror)', url: 'https://mnogomebeli.com/shkafy/s-zerkalom/' },
    { name: 'Prihozhaya (Hallway)', url: 'https://mnogomebeli.com/shkafy/prihozhaya/' },
    { name: 'Boss Standart', url: 'https://mnogomebeli.com/shkafy/shkaf-boss-standart/' },
    { name: 'Boss Standart 220', url: 'https://mnogomebeli.com/shkafy/boss-standart-220/' },
    { name: 'Shkafy Ideya', url: 'https://mnogomebeli.com/shkafy/shkafy-ideya/' },
    { name: 'Shkafy Rim', url: 'https://mnogomebeli.com/shkafy/shkafy-rim/' },
  ];

  const allProducts = new Map();

  for (const cat of categories) {
    const products = await scrapeCategory(cat.url, cat.name);
    products.forEach(p => {
      if (!allProducts.has(p.url)) {
        allProducts.set(p.url, p);
      }
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  const productsArray = Array.from(allProducts.values());

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Found ${productsArray.length} unique products across all categories!\n`);
  console.log('🔍 Fetching prices and images...\n');

  for (let i = 0; i < productsArray.length; i++) {
    const p = productsArray[i];
    console.log(`${i + 1}/${productsArray.length}: ${p.russianName.substring(0, 45)}...`);
    const details = await fetchDetails(p.url);
    p.price = details.price;
    p.allImages = details.images.length > 0 ? details.images : (p.imageUrl ? [p.imageUrl] : []);
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync('./all-107-cabinets-complete.json', JSON.stringify(productsArray, null, 2));

  const existing = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));
  const existingUrls = new Set(existing.map(c => c.url));
  const newOnes = productsArray.filter(p => !existingUrls.has(p.url));

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ COMPLETE: ${productsArray.length} total products`);
  console.log(`   With prices: ${productsArray.filter(p => p.price).length}`);
  console.log(`   With images: ${productsArray.filter(p => p.allImages.length > 0).length}`);
  console.log(`\n   In database: ${existing.length}`);
  console.log(`   New products: ${newOnes.length}\n`);

  if (newOnes.length > 0) {
    fs.writeFileSync('./new-products-to-add.json', JSON.stringify(newOnes, null, 2));
    console.log('🆕 NEW PRODUCTS TO ADD:\n');
    newOnes.forEach((p, i) => {
      console.log(`${i + 1}. ${p.russianName}`);
      console.log(`   Price: ${p.price || 'N/A'}₽`);
      console.log(`   URL: ${p.url.substring(0, 80)}...\n`);
    });
  } else {
    console.log('ℹ️  All scraped products are already in the database.\n');
  }

  console.log(`📊 ANALYSIS:`);
  console.log(`   Target: 107 cabinets (per website)`);
  console.log(`   Scraped: ${productsArray.length} cabinets`);
  console.log(`   Database after import: ${existing.length + newOnes.length}\n`);

  return productsArray;
}

scrapeAll().catch(console.error);
