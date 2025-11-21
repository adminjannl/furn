require('dotenv').config();
const cheerio = require('cheerio');
const fs = require('fs');

async function debugScrape() {
  console.log('🔍 Debugging scraper...\n');

  const url = 'https://mnogomebeli.com/krovati/';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('✅ Page loaded successfully\n');

    // Debug: Find what product elements exist
    console.log('🔍 Looking for product containers...\n');

    const selectors = [
      '.product',
      '.product-card',
      '.product-item',
      '[class*="product"]',
      'article'
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`${selector}: ${elements.length} elements`);

      if (elements.length > 0) {
        // Show structure of first element
        console.log(`\n📦 First ${selector} structure:`);
        const first = elements.first();
        console.log('HTML snippet:', first.html().substring(0, 500));

        // Look for name
        const h3 = first.find('h3');
        const h2 = first.find('h2');
        const span = first.find('span');
        const div = first.find('div[class*="name"], div[class*="title"]');

        console.log('\n🏷️  Text elements found:');
        console.log('h3:', h3.length, '-', h3.first().text().trim().substring(0, 100));
        console.log('h2:', h2.length, '-', h2.first().text().trim().substring(0, 100));
        console.log('span:', span.length, '-', span.first().text().trim().substring(0, 100));
        console.log('div with name/title:', div.length, '-', div.first().text().trim().substring(0, 100));

        // Look for links
        const links = first.find('a');
        console.log('\n🔗 Links found:', links.length);
        links.each((i, elem) => {
          if (i < 3) {
            const href = $(elem).attr('href');
            console.log(`  Link ${i + 1}: ${href}`);
          }
        });

        console.log('\n' + '='.repeat(60) + '\n');
      }
    }

    // Save a snippet of HTML for manual inspection
    fs.writeFileSync('./debug-page-structure.html', html.substring(0, 50000));
    console.log('💾 Saved first 50KB of HTML to debug-page-structure.html');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugScrape();
