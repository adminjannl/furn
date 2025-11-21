const puppeteer = require('puppeteer');
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
        if (text) price = parseInt(text);
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

async function scrapeAll() {
  console.log('🗄️ Scraping ALL 107 cabinets with Puppeteer...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('📄 Loading page...');
  await page.goto('https://mnogomebeli.com/shkafy/', { waitUntil: 'networkidle0', timeout: 60000 });
  
  console.log('⏳ Waiting for content...');
  await page.waitForTimeout(3000);
  
  console.log('🔄 Clicking Show More buttons...\n');
  
  let clicks = 0;
  while (clicks < 15) {
    const clicked = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button, a, div')];
      const showMore = buttons.find(b => 
        (b.textContent || '').toLowerCase().match(/(показать|еще|more|load|больше)/)
      );
      if (showMore) {
        showMore.click();
        return true;
      }
      return false;
    });
    
    if (!clicked) break;
    console.log(`  Click ${clicks + 1}: Waiting for new products...`);
    await page.waitForTimeout(2500);
    clicks++;
  }
  
  console.log(`\n✅ Clicked Show More ${clicks} times\n`);
  console.log('📊 Extracting all products...\n');
  
  const products = await page.evaluate(() => {
    const map = new Map();
    document.querySelectorAll('a[href*="!"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || !href.includes('/shkafy/') || href.includes('#')) return;
      
      const url = href.startsWith('http') ? href : 'https://mnogomebeli.com' + href;
      if (map.has(url)) return;
      
      const title = a.getAttribute('title') || '';
      const img = a.querySelector('img');
      const imgAlt = img ? img.getAttribute('alt') : '';
      const imgSrc = img ? (img.getAttribute('src') || img.getAttribute('data-src')) : '';
      
      let name = (title || imgAlt || a.textContent).replace(/\s+/g, ' ').trim();
      if (name && name.length > 5 && name.length < 200) {
        map.set(url, {
          russianName: name,
          url: url,
          imageUrl: imgSrc ? (imgSrc.startsWith('http') ? imgSrc : 'https://mnogomebeli.com' + imgSrc) : null
        });
      }
    });
    return [...map.values()];
  });
  
  await browser.close();
  
  console.log(`✅ Found ${products.length} unique products!\n`);
  console.log('🔍 Fetching details...\n');
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`${i + 1}/${products.length}: ${p.russianName.substring(0, 45)}...`);
    const details = await fetchDetails(p.url);
    p.price = details.price;
    p.allImages = details.images.length > 0 ? details.images : (p.imageUrl ? [p.imageUrl] : []);
    await new Promise(r => setTimeout(r, 400));
  }
  
  fs.writeFileSync('./all-107-cabinets-complete.json', JSON.stringify(products, null, 2));
  
  const existing = JSON.parse(fs.readFileSync('./cabinets-final-with-prices.json', 'utf8'));
  const existingUrls = new Set(existing.map(c => c.url));
  const newOnes = products.filter(p => !existingUrls.has(p.url));
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n✅ COMPLETE: ${products.length} products`);
  console.log(`   With prices: ${products.filter(p => p.price).length}`);
  console.log(`   With images: ${products.filter(p => p.allImages.length > 0).length}`);
  console.log(`\n   In database: ${existing.length}`);
  console.log(`   New products: ${newOnes.length}\n`);
  
  if (newOnes.length > 0) {
    fs.writeFileSync('./new-products-to-add.json', JSON.stringify(newOnes, null, 2));
    console.log('🆕 NEW PRODUCTS:\n');
    newOnes.forEach((p, i) => console.log(`${i+1}. ${p.russianName} - ${p.price || 'N/A'}₽`));
  }
}

scrapeAll().catch(console.error);
