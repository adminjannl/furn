const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeCabinets() {
  console.log('🗄️  Scraping all cabinets from mnogomebeli.com...\n');

  const url = 'https://mnogomebeli.com/shkafy/';

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

    const cabinets = [];
    const seenUrls = new Set();

    // Find all product links (those with ! are actual product pages)
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      // Product URLs have ! in them and contain shkafy
      if (href.includes('!') && href.includes('/shkafy/')) {
        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        // Skip review links
        if (fullUrl.includes('#review')) return;

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
            .replace(/Новинки|Живое фото|📸|★/g, '')
            .replace(/отзыв(ов)?/gi, '')
            .trim();

          // Filter out non-product names (ratings, reviews, etc)
          if (name &&
              name.length > 5 &&
              name.length < 200 &&
              !name.match(/^\d+$/) &&
              !name.includes('отзыв')) {

            const imageUrl = imgSrc ?
              (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) :
              null;

            cabinets.push({
              russianName: name,
              url: fullUrl,
              imageUrl: imageUrl
            });
          }
        }
      }
    });

    // Remove duplicates by URL
    const uniqueCabinets = Array.from(new Map(cabinets.map(c => [c.url, c])).values());

    console.log(`✅ Found ${uniqueCabinets.length} unique cabinets\n`);

    // Save to file
    fs.writeFileSync('./cabinets-scraped.json', JSON.stringify(uniqueCabinets, null, 2));
    console.log('💾 Saved to cabinets-scraped.json\n');

    // Display all cabinets
    console.log('📋 All cabinets found:\n');
    uniqueCabinets.forEach((cabinet, i) => {
      console.log(`${i + 1}. ${cabinet.russianName}`);
      console.log(`   URL: ${cabinet.url}`);
      console.log(`   Image: ${cabinet.imageUrl || 'N/A'}\n`);
    });

    console.log(`\n📊 Total: ${uniqueCabinets.length} cabinets found`);

    return uniqueCabinets;

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

scrapeCabinets().catch(console.error);
