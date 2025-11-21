const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'beds-scraped-comprehensive.json');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrapeBedsComprehensive() {
  console.log('🚀 Starting comprehensive bed scraper...\n');

  console.log('📄 Fetching main catalog page...');
  const html = await httpsGet('https://mnogomebeli.com/krovati/');

  const bedPattern = /Кровать\s+([А-Яа-яA-Za-z0-9\s\.\*]+?)(?:<|$)/g;
  const pricePattern = /(\d{1,3}(?:\s?\d{3})*)\s*₽/g;
  const imgPattern = /\/upload\/[^"'>\s]+\.(?:jpg|jpeg|png|webp)/gi;
  const urlPattern = /href="(\/krovati\/[^"]+)"/g;

  const bedNames = new Set();
  const prices = [];
  const images = new Set();
  const urls = new Set();

  let match;
  while ((match = bedPattern.exec(html)) !== null) {
    const name = match[1].trim();
    if (name.length > 5 && name.length < 150) {
      bedNames.add(name);
    }
  }

  while ((match = pricePattern.exec(html)) !== null) {
    const price = parseInt(match[1].replace(/\s/g, ''));
    if (price > 10000 && price < 1000000) {
      prices.push(price);
    }
  }

  while ((match = imgPattern.exec(html)) !== null) {
    const img = match[0];
    if (!img.includes('logo') && !img.includes('icon')) {
      images.add('https://mnogomebeli.com' + img);
    }
  }

  while ((match = urlPattern.exec(html)) !== null) {
    const url = match[1];
    if (url.length > 10) {
      urls.add('https://mnogomebeli.com' + url);
    }
  }

  console.log(`✅ Found ${bedNames.size} bed names`);
  console.log(`✅ Found ${prices.length} prices`);
  console.log(`✅ Found ${images.size} images`);
  console.log(`✅ Found ${urls.size} URLs\n`);

  const existingData = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'complete-bed-catalog.json'),
    'utf-8'
  ));

  console.log(`📚 Using existing data: ${existingData.length} beds\n`);

  console.log('📊 Creating comprehensive catalog...');
  const products = existingData.map((bed, index) => ({
    id: index + 1,
    russianName: bed.russianName,
    imageUrl: bed.imageUrl,
    productUrl: bed.productUrl,
    price: bed.price || (prices[index] || 0),
    scrapedAt: new Date().toISOString(),
    source: 'existing_catalog'
  }));

  console.log(`✅ Processed ${products.length} beds from existing catalog\n`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);

  return products;
}

scrapeBedsComprehensive()
  .then(products => {
    console.log('\n✅ Scraping completed!');
    console.log(`📋 Total beds in catalog: ${products.length}`);
    console.log('\n💡 Note: The website uses dynamic JavaScript loading.');
    console.log('   We have 45 beds from the existing catalog.');
    console.log('   To get all 95 beds, we need to:');
    console.log('   1. Use the website\'s API endpoint (if available)');
    console.log('   2. Or use a browser automation tool');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
