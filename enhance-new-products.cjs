const cheerio = require('cheerio');
const fs = require('fs');

async function fetchDetails(url, name) {
  console.log(`  Fetching: ${name}...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Price
    let price = null;
    $('.ty-price-num').each((i, el) => {
      if (!price) {
        const text = $(el).text().trim().replace(/[^\d]/g, '');
        if (text) {
          price = parseInt(text);
        }
      }
    });

    // Images
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.includes('/upload/') && src.includes('mnogomebeli.com')) {
        let url = src.startsWith('//') ? 'https:' + src :
          (src.startsWith('/') ? 'https://mnogomebeli.com' + src : src);

        if (!images.includes(url)) {
          images.push(url);
        }
      }
    });

    console.log(`    ✅ Price: ${price || 'N/A'}, Images: ${images.length}`);

    return { price, allImages: images };
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
    return { price: null, allImages: [] };
  }
}

async function enhanceNewProducts() {
  console.log('🔍 Enhancing new products with prices and images...\n');

  // Load new products
  const newProducts = JSON.parse(fs.readFileSync('./new-products-to-add.json', 'utf8'));

  console.log(`Found ${newProducts.length} new products to enhance\n`);

  // Fetch details for each
  for (let i = 0; i < newProducts.length; i++) {
    const product = newProducts[i];
    console.log(`${i + 1}/${newProducts.length}:`);

    const details = await fetchDetails(product.url, product.russianName);
    product.price = details.price;
    product.allImages = details.allImages.length > 0 ? details.allImages :
      (product.imageUrl ? [product.imageUrl] : []);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save enhanced products
  fs.writeFileSync('./new-products-enhanced.json', JSON.stringify(newProducts, null, 2));

  console.log(`\n✅ Enhanced products saved to: new-products-enhanced.json\n`);

  // Show results
  console.log('📋 NEW PRODUCTS:\n');
  newProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.russianName}`);
    console.log(`   Price: ${p.price || 'N/A'}₽`);
    console.log(`   Images: ${p.allImages.length}`);
    console.log(`   URL: ${p.url.substring(0, 80)}...\n`);
  });

  console.log(`📊 Summary:`);
  console.log(`   Products enhanced: ${newProducts.length}`);
  console.log(`   With prices: ${newProducts.filter(p => p.price).length}`);
  console.log(`   With images: ${newProducts.filter(p => p.allImages.length > 0).length}\n`);

  return newProducts;
}

enhanceNewProducts().catch(console.error);
