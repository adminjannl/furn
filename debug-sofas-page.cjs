const puppeteer = require('puppeteer');

async function debugSofasPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Loading https://mnogomebeli.com/divany/...\n');
  await page.goto('https://mnogomebeli.com/divany/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Check initial state
  const initial = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/divany/"]');
    const uniqueUrls = new Set();
    links.forEach(l => {
      const href = l.getAttribute('href');
      if (href && href.includes('!') && !href.includes('#')) uniqueUrls.add(href);
    });
    
    // Find show more button
    const buttons = [...document.querySelectorAll('*')];
    const showMore = buttons.filter(b => {
      const text = (b.textContent || '').toLowerCase();
      return text.includes('показать') && (text.includes('еще') || text.includes('ещё'));
    });
    
    return {
      totalLinks: links.length,
      uniqueProducts: uniqueUrls.size,
      showMoreButtons: showMore.length,
      showMoreText: showMore.slice(0, 3).map(b => b.textContent.trim())
    };
  });

  console.log('Initial state:');
  console.log('  Total links:', initial.totalLinks);
  console.log('  Unique products:', initial.uniqueProducts);
  console.log('  Show More buttons found:', initial.showMoreButtons);
  console.log('  Button text:', initial.showMoreText);

  // Try clicking show more
  console.log('\nClicking Show More 5 times...\n');
  for (let i = 0; i < 5; i++) {
    const clicked = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('*')];
      const showMore = buttons.find(b => {
        const text = (b.textContent || '').toLowerCase().trim();
        return text.includes('показать') && (text.includes('еще') || text.includes('ещё'));
      });
      if (showMore) {
        showMore.click();
        return showMore.textContent.trim();
      }
      return null;
    });

    if (clicked) {
      console.log(`  Click ${i + 1}: Clicked "${clicked}"`);
      await new Promise(r => setTimeout(r, 2500));
      
      const count = await page.evaluate(() => {
        const uniqueUrls = new Set();
        document.querySelectorAll('a[href*="/divany/"]').forEach(l => {
          const href = l.getAttribute('href');
          if (href && href.includes('!') && !href.includes('#')) uniqueUrls.add(href);
        });
        return uniqueUrls.size;
      });
      console.log(`           Now have ${count} products`);
    } else {
      console.log(`  Click ${i + 1}: No button found`);
      break;
    }
  }

  await browser.close();
}

debugSofasPage().catch(console.error);
