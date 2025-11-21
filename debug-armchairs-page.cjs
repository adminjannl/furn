const puppeteer = require('puppeteer');

async function debugArmchairsPage() {
  console.log('\n🔍 Debugging Armchairs Category Page...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Loading page...');
    await page.goto('https://mnogomebeli.com/kresla/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n🖱️  Clicking "Show More" button...\n');
    for (let i = 0; i < 3; i++) {
      const clicked = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button, a, div, span')];
        const showMore = buttons.find(b => {
          const text = (b.textContent || '').toLowerCase().trim();
          return (text.includes('показать') && text.includes('еще')) || (text.includes('показать') && text.includes('ещё'));
        });
        if (showMore && showMore.offsetParent !== null) { showMore.click(); return true; }
        return false;
      });
      if (clicked) { console.log(`   Click ${i + 1} successful`); await new Promise(resolve => setTimeout(resolve, 2500)); } 
      else { console.log('   No more buttons'); break; }
    }

    const analysis = await page.evaluate(() => {
      const productLinks = new Set();
      document.querySelectorAll('a[href*="/kresla/"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('!') && !href.includes('#')) productLinks.add(href);
      });
      return { count: Array.from(productLinks).length, urls: Array.from(productLinks) };
    });

    console.log(`\n✅ Total unique products: ${analysis.count}\n`);
    analysis.urls.forEach((url, idx) => console.log(`   ${idx + 1}. ${url}`));

  } finally { await browser.close(); }
}

debugArmchairsPage().catch(console.error);
