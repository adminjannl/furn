const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllTables() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.goto('https://mnogomebeli.com/stoly/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Loading tables page...');

    await page.evaluate(() => {
      return new Promise((resolve) => {
        let lastHeight = document.body.scrollHeight;
        const scroll = setInterval(() => {
          window.scrollTo(0, document.body.scrollHeight);
          const newHeight = document.body.scrollHeight;
          if (newHeight === lastHeight) {
            clearInterval(scroll);
            resolve();
          }
          lastHeight = newHeight;
        }, 500);

        setTimeout(() => {
          clearInterval(scroll);
          resolve();
        }, 10000);
      });
    });

    const productLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a').forEach(a => {
        const href = a.href;
        if (href && href.includes('/stoly/') && href.includes('!') && !href.includes('#')) {
          links.push(href);
        }
      });
      return [...new Set(links)];
    });

    console.log(`Found ${productLinks.length} product links`);

    const products = [];

    for (let i = 0; i < productLinks.length; i++) {
      const url = productLinks[i];
      console.log(`\nScraping ${i + 1}/${productLinks.length}: ${url}`);

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {});

        const productData = await page.evaluate(() => {
          const name = document.querySelector('h1')?.innerText?.trim() || '';

          let price = 999;
          document.querySelectorAll('[class*="price"], .price').forEach(el => {
            const text = el.innerText;
            const match = text.match(/(\d[\d\s,\.]+)/);
            if (match) {
              const p = parseFloat(match[1].replace(/[\s,]/g, ''));
              if (p > 100 && p < 10000) price = p;
            }
          });

          let dimensions = '';
          document.querySelectorAll('*').forEach(el => {
            const text = el.innerText || el.textContent;
            if (text && (text.includes('Габариты') || text.includes('ДхШхВ'))) {
              const match = text.match(/(\d+)\s*х\s*(\d+)\s*х\s*(\d+)/);
              if (match) {
                dimensions = `${match[1]}x${match[2]}x${match[3]}`;
              }
            }
          });

          let description = '';
          const descEl = document.querySelector('.description, [class*="description"]');
          if (descEl) {
            description = descEl.innerText.trim();
          }

          const images = [];
          document.querySelectorAll('img').forEach(img => {
            const src = img.src || img.dataset.src;
            if (src && !src.includes('logo') && !src.includes('icon')) {
              images.push(src);
            }
          });

          return { name, price, dimensions, description, images: [...new Set(images)] };
        });

        if (productData.name && productData.images.length > 0) {
          products.push({
            ...productData,
            url,
            images: productData.images.slice(0, 5),
            description: productData.description.substring(0, 500) || `Premium table ${productData.name}`
          });

          console.log(`  ✓ ${productData.name}`);
          console.log(`    Price: ${productData.price} BYN`);
          console.log(`    Dimensions: ${productData.dimensions || 'Not found'}`);
          console.log(`    Images: ${productData.images.length}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`  ✗ Error: ${error.message}`);
      }
    }

    console.log(`\n\nTotal tables scraped: ${products.length}`);

    fs.writeFileSync('all-tables-complete.json', JSON.stringify(products, null, 2));
    console.log('Saved to all-tables-complete.json');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

scrapeAllTables();
