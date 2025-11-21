const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const individualTables = [
  'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-new-beton-chernyy/',
  'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-derevo/',
  'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-mramor/',
  'https://mnogomebeli.com/stoly/obedennye/stol-loft-125/!stol-loft-125-kraft-tabachnyy/',
  'https://mnogomebeli.com/stoly/obedennye/stol-loft-slide/!stol-loft-slide-new-orekh-selekt-chyernyy/',
  'https://mnogomebeli.com/stoly/obedennye/stol-loft-slide/!stol-loft-slide-kraft/',
  'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-venge/',
  'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-kraft/',
  'https://mnogomebeli.com/stoly/zhurnalnyy/stol-transformer-lux/!stol-transformer-sonoma/',
  'https://mnogomebeli.com/stoly/zhurnalnyy/stol-zhurnalnyy-lux/!stol-zhurnalnyy-lux-venge/',
  'https://mnogomebeli.com/stoly/zhurnalnyy/stol-zhurnalnyy-lux/!stol-zhurnalnyy-lux-kraft/',
  'https://mnogomebeli.com/stoly/zhurnalnyy/stol-zhurnalnyy-lux/!stol-zhurnalnyy-lux-sonoma/',
  'https://mnogomebeli.com/stoly/stol-zhurnalnyy-boss-42-sm/stol-zhurnalnyy-boss-42-sm/!stol-zhurnalnyy-boss-42-sm-wood-brown/',
  'https://mnogomebeli.com/stoly/stol-zhurnalnyy-boss-42-sm/stol-zhurnalnyy-boss-42-sm/!stol-zhurnalnyy-boss-42-sm-wood-beige/',
  'https://mnogomebeli.com/stoly/stol-zhurnalnyy-boss-42-sm/stol-zhurnalnyy-boss-42-sm/!stol-zhurnalnyy-boss-42-sm-wood-grafit/',
  'https://mnogomebeli.com/stoly/stoly-boss-xo/stol-pristavka-boss-xo/!stol-pristavka-boss-xo-wood-real/',
  'https://mnogomebeli.com/stoly/stoly-boss-xo/stol-pristavka-boss-xo/!stol-pristavka-boss-xo-wood-dark/',
  'https://mnogomebeli.com/stoly/stoly-boss-xo/stol-pristavka-boss-xo/!stol-pristavka-boss-xo-wood-snow/',
  'https://mnogomebeli.com/stoly/stoly-boss-xo/stol-pristavka-boss-xo/!stol-pristavka-boss-xo-wood-smok/',
  'https://mnogomebeli.com/stoly/stoly-boss-xo/stol-pristavka-boss-xo/!stol-pristavka-boss-xo-wood-rock/',
  'https://mnogomebeli.com/stoly/pismennye/pismennyy-stol-lux/!pismennyy-stol-lux/',
  'https://mnogomebeli.com/stoly/pismennye/stol-pismennyy-simpl/!stol-pismennyy-simpl-belyy-sneg/'
];

async function deepScrapeTable(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $('h1').first().text().trim();

    let price = 999;
    $('.price, [class*="price"]').each((i, el) => {
      const text = $(el).text();
      const match = text.match(/(\d[\d\s,]+)/);
      if (match) {
        const p = parseFloat(match[1].replace(/[\s,]/g, ''));
        if (p > 100 && p < 20000) {
          price = p;
        }
      }
    });

    let dimensions = '';
    $('*').each((i, el) => {
      const text = $(el).text();
      if ((text.includes('Габариты') || text.includes('ДхШхВ')) && !dimensions) {
        const match = text.match(/(\d+)\s*х\s*(\d+)\s*х\s*(\d+)/);
        if (match) {
          dimensions = `${match[1]}x${match[2]}x${match[3]}`;
        }
      }
    });

    let description = '';
    $('p, div[class*="description"], .description').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 100 && text.length < 1000 && !text.includes('©') && !description) {
        description = text;
      }
    });

    const images = [];
    $('img').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('banner')) {
        if (!src.startsWith('http')) {
          src = `https://mnogomebeli.com${src}`;
        }
        if (!images.includes(src)) {
          images.push(src);
        }
      }
    });

    return {
      name,
      price,
      dimensions,
      description: description.substring(0, 500) || `Premium table ${name}`,
      url,
      images: images.slice(0, 5)
    };

  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    return null;
  }
}

async function scrapeAllTables() {
  console.log(`Scraping ${individualTables.length} tables...\n`);

  const products = [];

  for (let i = 0; i < individualTables.length; i++) {
    const url = individualTables[i];
    console.log(`${i + 1}/${individualTables.length}: ${url}`);

    const product = await deepScrapeTable(url);

    if (product && product.name && product.images.length > 0) {
      products.push(product);
      console.log(`  ✓ ${product.name}`);
      console.log(`    Price: ${product.price} BYN`);
      console.log(`    Dimensions: ${product.dimensions || 'Not specified'}`);
      console.log(`    Images: ${product.images.length}`);
    } else {
      console.log(`  ✗ Failed to scrape`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n\nSuccessfully scraped: ${products.length} tables`);

  fs.writeFileSync('all-tables-scraped.json', JSON.stringify(products, null, 2));
  console.log('Saved to all-tables-scraped.json');

  return products;
}

scrapeAllTables();
