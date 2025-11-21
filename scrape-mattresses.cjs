const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeMattresses() {
  console.log('🛏️  Scraping all mattresses from mnogomebeli.com...\n');

  const url = 'https://mnogomebeli.com/matrasy/';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      }
    });

    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}`);
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const mattresses = [];
    const seenUrls = new Set();

    // Find all product links (those with ! are actual product pages)
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      // Product URLs have ! in them and contain matrasy
      if (href.includes('!') && href.includes('/matrasy/')) {
        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        if (!seenUrls.has(fullUrl)) {
          seenUrls.add(fullUrl);

          // Get name from title, alt, or link text
          const title = $(elem).attr('title');
          const img = $(elem).find('img');
          const imgAlt = img.attr('alt');
          const imgSrc = img.attr('src') || img.attr('data-src');
          const linkText = $(elem).text().trim();

          let name = title || imgAlt || linkText;

          // Clean up the name
          name = name
            .replace(/\s+/g, ' ')
            .replace(/Новинки|Живое фото|📸/g, '')
            .trim();

          if (name && name.length > 5 && name.length < 200) {
            const imageUrl = imgSrc ?
              (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) :
              null;

            mattresses.push({
              russianName: name,
              url: fullUrl,
              imageUrl: imageUrl
            });
          }
        }
      }
    });

    console.log(`✅ Found ${mattresses.length} mattresses\n`);

    // Save to file
    fs.writeFileSync('./mattresses-scraped.json', JSON.stringify(mattresses, null, 2));
    console.log('💾 Saved to mattresses-scraped.json\n');

    // Display all mattresses
    console.log('📋 All mattresses found:\n');
    mattresses.forEach((mattress, i) => {
      console.log(`${i + 1}. ${mattress.russianName}`);
      console.log(`   URL: ${mattress.url}`);
      console.log(`   Image: ${mattress.imageUrl || 'N/A'}\n`);
    });

    console.log(`\n📊 Total: ${mattresses.length} mattresses`);
    console.log(`Target: 14 mattresses`);
    console.log(mattresses.length >= 14 ? '✅ Target reached!' : `⚠️  ${14 - mattresses.length} short`);

    return mattresses;

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

scrapeMattresses().catch(console.error);
