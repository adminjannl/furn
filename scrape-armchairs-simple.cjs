const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapeArmchairs() {
  console.log('\n🚀 Starting Armchairs scraping...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Loading page: https://mnogomebeli.com/kresla/');
    await page.goto('https://mnogomebeli.com/kresla/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('⏳ Waiting for initial content...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Click "Show More" button until all products are loaded
    let clickCount = 0;
    let previousCount = 0;
    let noChangeCount = 0;

    while (clickCount < 10) {
      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('a[href*="!"]').length;
      });

      console.log(`📦 Products loaded: ${currentCount}`);

      if (currentCount >= 64) {
        console.log('✅ Target reached: 64+ products loaded');
        break;
      }

      if (currentCount === previousCount) {
        noChangeCount++;
        if (noChangeCount >= 2) {
          console.log('⚠️  No new products loading, stopping...');
          break;
        }
      } else {
        noChangeCount = 0;
      }

      previousCount = currentCount;

      const buttonClicked = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button, a, div')];
        const showMore = buttons.find(b => {
          const text = (b.textContent || '').toLowerCase();
          return text.includes('показать') || text.includes('еще') || text.includes('ещё');
        });

        if (showMore) {
          showMore.click();
          return true;
        }
        return false;
      });

      if (!buttonClicked) {
        console.log('⚠️  No "Show More" button found');
        break;
      }

      console.log(`🖱️  Click ${clickCount + 1}: Waiting for products...`);
      await new Promise(resolve => setTimeout(resolve, 2500));
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(resolve => setTimeout(resolve, 500));

      clickCount++;
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    console.log('\n🔍 Extracting product links...');
    const products = [];
    const seen = new Set();

    $('a[href*="!"]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href || !href.includes('/kresla/') || href.includes('#')) {
        return;
      }

      const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

      if (seen.has(fullUrl)) return;
      seen.add(fullUrl);

      const title = $(el).attr('title') || '';
      const img = $(el).find('img').first();
      const imgAlt = img.attr('alt') || '';
      const imgSrc = img.attr('src') || img.attr('data-src') || '';

      let productName = (title || imgAlt || $(el).text()).replace(/\s+/g, ' ').trim();

      if (productName && productName.length > 5 && productName.length < 200) {
        products.push({
          url: fullUrl,
          russianName: productName,
          imageUrl: imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) : null
        });
      }
    });

    console.log(`\n✅ Found ${products.length} products\n`);

    // Check for duplicates in database
    console.log('🔍 Checking for existing products in database...');
    const { data: existing } = await supabase
      .from('products')
      .select('source_url')
      .in('source_url', products.map(p => p.url));

    const existingUrls = new Set((existing || []).map(p => p.source_url));
    const newProducts = products.filter(p => !existingUrls.has(p.url));

    console.log(`   Existing: ${existingUrls.size}`);
    console.log(`   New: ${newProducts.length}\n`);

    if (newProducts.length === 0) {
      console.log('✅ No new products to scrape!');
      return;
    }

    console.log(`📋 Scraping details for ${newProducts.length} new products...\n`);

    // Scrape details for each new product
    for (let i = 0; i < newProducts.length; i++) {
      const product = newProducts[i];
      const progress = `${i + 1}/${newProducts.length}`;

      process.stdout.write(`\r[${progress}] ${product.russianName.substring(0, 50).padEnd(50)}`);

      try {
        await page.goto(product.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 500));

        const details = await page.evaluate(() => {
          const priceEl = document.querySelector('.price, [class*="price"]');
          const priceText = priceEl ? priceEl.textContent.trim() : '';
          const priceMatch = priceText.match(/(\d[\d\s]*)/);
          const price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 0;

          const images = [];
          document.querySelectorAll('img[src], img[data-src]').forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (src && src.includes('mnogomebeli.com') && !src.includes('logo')) {
              images.push(src);
            }
          });

          const desc = document.querySelector('[class*="description"], .descr, .text')?.textContent || '';

          return {
            price,
            images: [...new Set(images)].slice(0, 5),
            description: desc.trim().substring(0, 500)
          };
        });

        product.details = details;
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`\n❌ Error scraping ${product.url}:`, error.message);
        product.details = { price: 0, images: [], description: '' };
      }
    }

    console.log('\n\n💾 Importing to database...\n');

    // Get armchairs category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'armchairs')
      .single();

    if (!category) {
      console.error('❌ Category "armchairs" not found');
      return;
    }

    let imported = 0;
    let errors = 0;

    for (const product of newProducts) {
      if (!product.details) continue;

      try {
        const sku = `ARM-MNM-${Date.now()}-${String(imported + 1).padStart(4, '0')}`;
        const slug = product.russianName
          .toLowerCase()
          .replace(/[^a-z0-9а-я]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const { error } = await supabase.from('products').insert({
          name: product.russianName,
          slug,
          sku,
          category_id: category.id,
          price: (product.details.price * 0.011).toFixed(2),
          source_price: product.details.price,
          source_currency: 'RUB',
          description: product.details.description || `${product.russianName} - premium armchair or pouf`,
          source_name_russian: product.russianName,
          source_url: product.url,
          is_active: true,
          stock_quantity: 100
        });

        if (error) {
          console.error(`\n❌ Error importing ${product.russianName}:`, error.message);
          errors++;
        } else {
          imported++;
          process.stdout.write(`\r✅ Imported: ${imported}/${newProducts.length}`);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`\n❌ Error:`, error.message);
        errors++;
      }
    }

    console.log(`\n\n✅ Import complete!`);
    console.log(`   Imported: ${imported}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Total in DB: ${existingUrls.size + imported}\n`);

  } finally {
    await browser.close();
  }
}

scrapeArmchairs().catch(console.error);
