const https = require('https');
const fs = require('fs');

const russianToEnglishTranslations = {
  'Кровать': 'Bed',
  'с подъемным механизмом': 'with lifting mechanism',
  'без подъемного механизма': 'without lifting mechanism',
  'Велюр': 'Velvet',
  'Монолит': 'Monolit',
  'Рояль': 'Royal',
  'ткань': 'fabric',
  'Серый': 'Gray',
  'Бежевый': 'Beige',
  'Графит': 'Graphite',
  'Синий': 'Blue',
  'Зеленый': 'Green',
  'Коричневый': 'Brown',
};

const commonBedNames = {
  'ФРЕЯ': 'FREYA',
  'ЛЕО': 'LEO',
  'БОСС': 'BOSS',
  'МИЛАН': 'MILAN',
  'РОМА': 'ROMA',
  'ПАРИЖ': 'PARIS',
  'ЛОНДОН': 'LONDON',
  'УНА': 'UNA',
  'БЕЛЛА': 'BELLA',
  'РОНДА': 'RONDA',
  'ДРИМ': 'DREAM',
};

function translateText(text) {
  let translated = text;
  Object.entries(commonBedNames).forEach(([russian, english]) => {
    const regex = new RegExp(russian, 'gi');
    translated = translated.replace(regex, english);
  });
  Object.entries(russianToEnglishTranslations).forEach(([russian, english]) => {
    const regex = new RegExp(russian, 'gi');
    translated = translated.replace(regex, english);
  });
  return translated;
}

function convertRubToUsd(rubPrice) {
  const exchangeRate = 0.011;
  return Math.round(rubPrice * exchangeRate * 100) / 100;
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractProductsFromHtml(html) {
  const products = [];

  const titleRegex = /<a[^>]+class="catalog-item__title"[^>]+>([^<]+)<\/a>/gi;
  const priceRegex = /data-price="(\d+)"/gi;
  const urlRegex = /<a[^>]+class="catalog-item__title"[^>]+href="([^"]+)"/gi;
  const imageRegex = /<img[^>]+data-src="([^"]+)"/gi;

  const titles = [];
  const prices = [];
  const urls = [];
  const images = [];

  let match;
  while ((match = titleRegex.exec(html)) !== null) {
    titles.push(match[1].trim());
  }

  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(parseInt(match[1]));
  }

  while ((match = urlRegex.exec(html)) !== null) {
    urls.push(match[1].startsWith('http') ? match[1] : `https://mnogomebeli.com${match[1]}`);
  }

  while ((match = imageRegex.exec(html)) !== null) {
    const imgUrl = match[1].startsWith('http') ? match[1] : `https://mnogomebeli.com${match[1]}`;
    if (imgUrl.includes('krovat') || imgUrl.includes('bed') || imgUrl.includes('Frame')) {
      images.push(imgUrl);
    }
  }

  const minLength = Math.min(titles.length, prices.length);

  for (let i = 0; i < minLength; i++) {
    const originalName = titles[i];
    const price = prices[i];

    const sizeMatch = originalName.match(/(\d{3})[x×*](\d{3})/i);
    const mechanismMatch = originalName.match(/(подъемн|механизм|ПМ)/i);
    const fabricMatch = originalName.match(/(велюр|монолит|ткань|рояль|MONOLIT|CORD|Вельвет)/i);

    products.push({
      name: translateText(originalName),
      originalName,
      price: convertRubToUsd(price),
      originalPrice: price,
      originalCurrency: 'RUB',
      description: translateText(`Premium ${originalName} bed with quality craftsmanship`),
      originalDescription: `Премиум кровать ${originalName} с качественным исполнением`,
      imageUrls: images[i] ? [images[i]] : [],
      bedSize: sizeMatch ? `${sizeMatch[1]}x${sizeMatch[2]}` : undefined,
      mechanismType: mechanismMatch ? 'lifting' : 'standard',
      fabricType: fabricMatch ? translateText(fabricMatch[1]) : undefined,
      sourceUrl: urls[i] || 'https://mnogomebeli.com/krovati/',
    });
  }

  return products;
}

async function scrapeAllPages() {
  console.log('Fetching all bed products from mnogomebeli.com...\n');

  const allProducts = [];
  let pageNum = 1;
  let hasMore = true;

  while (hasMore && pageNum <= 10) {
    console.log(`Fetching page ${pageNum}...`);

    const url = `https://mnogomebeli.com/krovati/?PAGEN_1=${pageNum}`;
    const html = await fetchPage(url);

    const products = extractProductsFromHtml(html);

    console.log(`  Found ${products.length} products on page ${pageNum}`);

    if (products.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...products);
      pageNum++;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✓ Total products found: ${allProducts.length}\n`);

  fs.writeFileSync('all-beds-scraped.json', JSON.stringify(allProducts, null, 2));
  console.log('✓ Saved to all-beds-scraped.json\n');

  console.log('Products:');
  allProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.originalName} - ${p.originalPrice} RUB ($${p.price})`);
  });

  return allProducts;
}

scrapeAllPages().catch(console.error);
