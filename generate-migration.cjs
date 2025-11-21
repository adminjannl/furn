const https = require('https');
const fs = require('fs');

const BASE_URL = 'https://mnogomebeli.com';
const CATEGORY_URL = 'https://mnogomebeli.com/krovati/';

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
  'Сонома': 'Sonoma',
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
      if (!seenImages.has(fullUrl) && images.length < 5) {
        seenImages.add(fullUrl);
        images.push(fullUrl);
      }
    }
  }

  const sizeMatch = html.match(/(\d{2,3})\*(\d{3})/i) || html.match(/(\d{2,3})x(\d{3})/i);
  const bedSize = sizeMatch ? `${sizeMatch[1]}x${sizeMatch[2]}` : '160x200';

  const mechanismMatch = html.match(/подъемн|с ПМ/i);
  const mechanismType = mechanismMatch ? 'lifting' : 'standard';

  const fabricMatch = html.match(/(велюр|монолит|ткань|рояль|CORD|MONOLIT|рогожка|шенилл)/i);
  const fabricType = fabricMatch ? fabricMatch[1] : 'Premium fabric';

  return {
    originalName: nameMatch ? nameMatch[1].trim() : null,
    price: priceMatch ? parseInt(priceMatch[1].replace(/[\s,]/g, '')) : null,
    images,
    bedSize,
    mechanismType,
    fabricType,
    sourceUrl: productUrl
  };
}

async function main() {
  console.log('Fetching category page...');
  const categoryHtml = await httpsGet(CATEGORY_URL);
  const productLinks = extractProductLinks(categoryHtml);

  console.log(`Found ${productLinks.length} products. Scraping details...`);

  const products = [];
  for (let i = 0; i < productLinks.length; i++) {
    try {
      const html = await httpsGet(productLinks[i]);
      const details = extractProductDetails(html, productLinks[i]);

      if (details.originalName && details.price) {
        products.push(details);
        console.log(`  ${i + 1}/${productLinks.length}: ${details.originalName.slice(0, 50)} - ${details.images.length} images`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`  ${i + 1}/${productLinks.length}: Error - ${error.message}`);
    }
  }

  console.log(`\nGenerating SQL migration for ${products.length} products...`);

  const esc = (str) => str ? str.replace(/'/g, "''") : '';

  let sql = `/*
  # Import All Beds from mnogomebeli.com

  Importing ${products.length} bed products with high-quality images
*/

DO $$
DECLARE
  v_category_id uuid;
  v_product_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'beds' LIMIT 1;

`;

  products.forEach((product, index) => {
    const name = translateText(product.originalName);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 70) + '-' + index;
    const sku = `BED-MNM-${(index + 1).toString().padStart(4, '0')}`;
    const priceUsd = Math.round(product.price * 0.011 * 100) / 100;
    const description = `Premium ${name.slice(0, 100)}`;

    sql += `  -- Product ${index + 1}: ${product.originalName.slice(0, 60)}\n`;
    sql += `  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)\n`;
    sql += `  VALUES (v_category_id, '${esc(name)}', '${esc(slug)}', '${esc(description)}', ${priceUsd}, '${sku}', '${esc(product.originalName)}', '${esc(product.sourceUrl)}', '${product.mechanismType}', '${esc(product.fabricType)}', '${product.bedSize}', ${product.price}, 'RUB', 10, 'active', '${esc(product.fabricType)}')\n`;
    sql += `  RETURNING id INTO v_product_id;\n\n`;

    if (product.images.length > 0) {
      sql += `  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES\n`;
      product.images.forEach((img, imgIdx) => {
        const comma = imgIdx < product.images.length - 1 ? ',' : ';';
        sql += `    (v_product_id, '${esc(img)}', ${imgIdx}, '${esc(name)}')${comma}\n`;
      });
      sql += `\n`;
    }
  });

  sql += `  RAISE NOTICE 'Successfully imported ${products.length} beds';\nEND $$;\n`;

  fs.writeFileSync('all-beds-migration.sql', sql);
  console.log(`\nMigration file created: all-beds-migration.sql`);
  console.log(`Ready to import ${products.length} beds!`);
}

main().catch(console.error);
