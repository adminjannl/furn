const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://clwqwdeamfjzamulteui.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsd3F3ZGVhbWZqemFtdWx0ZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjQ0ODQsImV4cCI6MjA3NjcwMDQ4NH0.BtGKSE__zCKZBpwE9Gy4cwYS9x5ePJm5_xH01w1j13Y';
const BASE_URL = 'https://mnogomebeli.com';
const CATEGORY_URL = 'https://mnogomebeli.com/krovati/';
const CATEGORY_ID = '77f049ae-bdeb-480e-98f7-de551fb13907';

const translations = {
  'Кровать': 'Bed', 'Фрея': 'Freya', 'ФРЕЯ': 'FREYA', 'ЛЕО': 'LEO', 'Босс': 'Boss', 'БОСС': 'BOSS',
  'Белла': 'Bella', 'NORD': 'NORD', 'Уна': 'Una', 'ЛОФТ': 'LOFT', 'РОНДА': 'RONDA',
  'с подъемным механизмом': 'with Lifting Mechanism', 'с ПМ': 'with Lifting Mechanism',
  'Про': 'Pro', 'Дрим': 'Dream', 'Велюр': 'Velvet', 'велюр': 'velvet', 'Вельвет': 'Velvet',
  'Монолит': 'Monolit', 'Monolit': 'Monolit', 'MONOLIT': 'Monolit', 'Роял': 'Royal',
  'Royal': 'Royal', 'рогожка': 'burlap', 'Шенилл': 'Chenille', 'Слим': 'Slim',
  'мини': 'mini', 'Мини': 'Mini', 'серый': 'gray', 'серая': 'gray', 'Серая': 'Gray',
  'бежевый': 'beige', 'бежевая': 'beige', 'графит': 'graphite', 'синяя': 'blue',
  'аква': 'aqua', 'сталь': 'steel', 'латте': 'latte', 'Латте': 'Latte', 'мокко': 'mocha',
  'роуз': 'rose', 'шампань': 'champagne', 'агат': 'agate', 'платина': 'platinum',
  'черная': 'black', 'Чёрная': 'Black', 'Орех': 'Walnut', 'Селект': 'Select',
  'Сонома': 'Sonoma', 'индиго': 'indigo',
};

function translateText(text) {
  let translated = text;
  for (const [russian, english] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(russian, 'g'), english);
  }
  return translated;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function supabaseRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + path);
    const postData = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(data ? JSON.parse(data) : null);
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function extractProductLinks(html) {
  const linkRegex = /<a[^>]+href="(\/krovati\/[^"#]+)"/gi;
  const links = new Set();
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const link = match[1].split('#')[0].split('?')[0];
    if (link.includes('!') && link.split('/').length > 3) {
      links.add(BASE_URL + link);
    }
  }

  return Array.from(links);
}

function extractProductDetails(html, productUrl) {
  const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

  const priceMatch = html.match(/data-price="(\d+)"/i) ||
                     html.match(/data-product-price="(\d+)"/i) ||
                     html.match(/"price":\s*"?(\d+)"?/i) ||
                     html.match(/(\d{4,})\s*₽/i);

  const imageMatches = html.matchAll(/upload\/iblock\/[a-z0-9\/]+\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)/gi);
  const images = [];
  const seenImages = new Set();

  for (const match of imageMatches) {
    const imgPath = match[0];
    if (!imgPath.includes('resize_cache') && !imgPath.includes('_small')) {
      const fullUrl = BASE_URL + '/' + imgPath;
      if (!seenImages.has(fullUrl)) {
        seenImages.add(fullUrl);
        images.push(fullUrl);
      }
    }
  }

  const sizeMatch = html.match(/(\d{2,3})\*(\d{3})/i) || html.match(/(\d{2,3})x(\d{3})/i);
  const bedSize = sizeMatch ? `${sizeMatch[1]}x${sizeMatch[2]}` : null;

  const mechanismMatch = html.match(/подъемн|с ПМ/i);
  const mechanismType = mechanismMatch ? 'lifting' : 'standard';

  const fabricMatch = html.match(/(велюр|монолит|ткань|рояль|CORD|MONOLIT|рогожка|шенилл)/i);
  const fabricType = fabricMatch ? fabricMatch[1] : null;

  return {
    originalName: nameMatch ? nameMatch[1].trim() : null,
    price: priceMatch ? parseInt(priceMatch[1].replace(/[\s,]/g, '')) : null,
    images: images.slice(0, 5),
    bedSize,
    mechanismType,
    fabricType,
    sourceUrl: productUrl
  };
}

async function importProduct(product, index, total) {
  try {
    const name = translateText(product.originalName);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80) + '-' + Date.now();
    const sku = `BED-${Date.now()}-${index.toString().padStart(4, '0')}`;
    const priceUsd = Math.round(product.price * 0.011 * 100) / 100;
    const description = `Premium ${name}`;

    console.log(`\n[${index}/${total}] ${product.originalName.slice(0, 60)}...`);
    console.log(`  Price: ${product.price} RUB → $${priceUsd} USD`);
    console.log(`  Size: ${product.bedSize || 'N/A'}, Images: ${product.images.length}`);

    const insertedProducts = await supabaseRequest('/rest/v1/products', 'POST', {
      category_id: CATEGORY_ID,
      name: name,
      slug: slug,
      description: description,
      price: priceUsd,
      sku: sku,
      original_name: product.originalName,
      source_url: product.sourceUrl,
      mechanism_type: product.mechanismType,
      fabric_type: product.fabricType,
      bed_size: product.bedSize,
      original_price: product.price,
      original_currency: 'RUB',
      stock_quantity: 10,
      status: 'active',
      materials: product.fabricType || 'Premium upholstery'
    });

    const productId = Array.isArray(insertedProducts) ? insertedProducts[0]?.id : insertedProducts?.id;

    if (productId && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        await supabaseRequest('/rest/v1/product_images', 'POST', {
          product_id: productId,
          image_url: product.images[i],
          display_order: i,
          alt_text: name
        });
      }
      console.log(`  ✓ Imported with ${product.images.length} images`);
    } else {
      console.log(`  ✓ Imported (no images)`);
    }

    return true;
  } catch (error) {
    console.log(`  ✗ Error: ${error.message.slice(0, 100)}`);
    return false;
  }
}

async function main() {
  console.log('=== Importing All Beds from mnogomebeli.com ===\n');
  console.log('Step 1: Fetching category page...');

  const categoryHtml = await httpsGet(CATEGORY_URL);
  const productLinks = extractProductLinks(categoryHtml);

  console.log(`Found ${productLinks.length} product URLs\n`);
  console.log('Step 2: Scraping and importing each product...');

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < productLinks.length; i++) {
    const link = productLinks[i];

    try {
      const html = await httpsGet(link);
      const details = extractProductDetails(html, link);

      if (details.originalName && details.price && details.images.length > 0) {
        const success = await importProduct(details, i + 1, productLinks.length);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
      } else {
        console.log(`\n[${i + 1}/${productLinks.length}] ${link.split('/').pop()}`);
        console.log(`  ✗ Skipped: Missing data (name: ${!!details.originalName}, price: ${!!details.price}, images: ${details.images.length})`);
        failedCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`\n[${i + 1}/${productLinks.length}] ${link}`);
      console.log(`  ✗ Error: ${error.message}`);
      failedCount++;
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`Total URLs: ${productLinks.length}`);
  console.log(`Successfully imported: ${successCount}`);
  console.log(`Failed: ${failedCount}`);
}

main().catch(console.error);
