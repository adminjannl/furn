const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function debugArmchairs() {
  console.log('\n🔍 Debugging Armchairs page...\n');

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

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Click "Show More" button until all products are loaded
    let clickCount = 0;

    while (clickCount < 10) {
      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('a[href*="!"]').length;
      });

      console.log(`📦 Products on page: ${currentCount}`);

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
        console.log('✅ No more "Show More" button');
        break;
      }

      console.log(`🖱️  Click ${clickCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 2500));
      clickCount++;
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    console.log('\n🔍 Analyzing all links with "!"...\n');

    const allLinks = [];
    $('a[href*="!"]').each((i, el) => {
      const href = $(el).attr('href');
      const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;
      allLinks.push({
        url: fullUrl,
        hasKresla: href.includes('/kresla/'),
        hasHash: href.includes('#'),
        title: $(el).attr('title') || '',
        text: $(el).text().trim().substring(0, 50)
      });
    });

    console.log(`Total links with "!": ${allLinks.length}`);
    console.log(`Links with /kresla/: ${allLinks.filter(l => l.hasKresla).length}`);
    console.log(`Links with #: ${allLinks.filter(l => l.hasHash).length}`);
    console.log(`Links without #: ${allLinks.filter(l => !l.hasHash).length}`);
    console.log(`Links with /kresla/ and no #: ${allLinks.filter(l => l.hasKresla && !l.hasHash).length}\n`);

    // Show unique product URLs
    const uniqueKreslaLinks = new Set();
    allLinks.forEach(link => {
      if (link.hasKresla && !link.hasHash) {
        uniqueKreslaLinks.add(link.url);
      }
    });

    console.log(`Unique armchairs URLs: ${uniqueKreslaLinks.size}\n`);

    // Show first 10 URLs
    console.log('First 10 product URLs:');
    Array.from(uniqueKreslaLinks).slice(0, 10).forEach((url, i) => {
      console.log(`  ${i + 1}. ${url}`);
    });

    console.log('\nLast 10 product URLs:');
    Array.from(uniqueKreslaLinks).slice(-10).forEach((url, i) => {
      console.log(`  ${uniqueKreslaLinks.size - 9 + i}. ${url}`);
    });

  } finally {
    await browser.close();
  }
}

debugArmchairs().catch(console.error);
