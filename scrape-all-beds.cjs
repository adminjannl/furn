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
  'Размер': 'Size',
  'см': 'cm',
  'Механизм': 'Mechanism',
  'Материал': 'Material',
  'Цвет': 'Color',
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

function parseProducts(html) {
  const products = [];

  const itemRegex = /<div[^>]*class="[^"]*catalog-item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;

  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const itemHtml = match[0];

    const nameMatch = itemHtml.match(/<a[^>]*class="[^"]*catalog-item__title[^"]*"[^>]*>([^<]+)</i) ||
                     itemHtml.match(/data-name="([^"]+)"/i) ||
                     itemHtml.match(/<h3[^>]*>([^<]+)<\/h3>/i);

    const priceMatch = itemHtml.match(/data-price="(\d+)"/i) ||
                      itemHtml.match(/(\d+[\s,]?\d*)\s*₽/);

    const urlMatch = itemHtml.match(/<a[^>]*href="([^"]+)"[^>]*class="[^"]*catalog-item__title/i) ||
                    itemHtml.match(/<a[^>]*class="[^"]*catalog-item__title[^"]*"[^>]*href="([^"]+)"/i);

    const imageMatch = itemHtml.match(/data-src="([^"]+\.jpg|[^"]+\.png|[^"]+\.webp)"/i) ||
                      itemHtml.match(/src="([^"]+\.jpg|[^"]+\.png|[^"]+\.webp)"/i);

    if (nameMatch && priceMatch) {
      const originalName = nameMatch[1].trim();
      const price = parseInt(priceMatch[1].replace(/[\s,]/g, ''));

      const sizeMatch = originalName.match(/(\d{3})[x×*](\d{3})/i);
      const mechanismMatch = originalName.match(/(подъемн|механизм|ПМ)/i);
      const fabricMatch = originalName.match(/(велюр|монолит|ткань|рояль|MONOLIT|CORD|Вельвет)/i);

      const product = {
        name: translateText(originalName),
        originalName,
        price: convertRubToUsd(price),
        originalPrice: price,
        originalCurrency: 'RUB',
        description: translateText(`Elegant ${originalName} bed with premium upholstery`),
        originalDescription: `Элегантная кровать ${originalName} с премиальной обивкой`,
        imageUrls: imageMatch ? [imageMatch[1].startsWith('http') ? imageMatch[1] : `https://mnogomebeli.com${imageMatch[1]}`] : [],
        bedSize: sizeMatch ? `${sizeMatch[1]}x${sizeMatch[2]}` : undefined,
        mechanismType: mechanismMatch ? 'lifting' : 'standard',
        fabricType: fabricMatch ? translateText(fabricMatch[1]) : undefined,
        sourceUrl: urlMatch ? (urlMatch[1].startsWith('http') ? urlMatch[1] : `https://mnogomebeli.com${urlMatch[1]}`) : 'https://mnogomebeli.com/krovati/',
      };

      products.push(product);
    }
  }

  return products;
}

async function scrapeAllBeds() {
  console.log('Fetching bed products from mnogomebeli.com...\n');

  const url = 'https://mnogomebeli.com/krovati/?PAGEN_1=1';
  const html = await fetchPage(url);

  const products = parseProducts(html);

  console.log(`Found ${products.length} products\n`);

  fs.writeFileSync('all-beds-scraped.json', JSON.stringify(products, null, 2));
  console.log('✓ Saved to all-beds-scraped.json\n');

  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.originalName} - ${p.originalPrice} RUB ($${p.price})`);
  });

  return products;
}

scrapeAllBeds().catch(console.error);
