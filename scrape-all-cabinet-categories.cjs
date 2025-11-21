const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAllCabinetCategories() {
  console.log('🗄️  Scraping ALL cabinet categories to get 107 products...\n');

  const allCabinets = new Map();

  const categories = [
    '/shkafy/',                    // Main category
    '/shkafy/raspashnye/',         // Hinged wardrobes
    '/shkafy/shkafy-kupe/',        // Sliding door
    '/shkafy/uglovye/',            // Corner
    '/shkafy/s-zerkalom/',         // With mirror
    '/shkafy/prihozhaya/',         // Hallway
    '/shkafy/pryamye/',            // Straight
    '/shkafy/boss-standart-220/',  // Boss Standart 220
  ];

  for (const category of categories) {
    const url = `https://mnogomebeli.com${category}`;
    console.log(`\n📂 Scraping: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/html',
        }
      });

      if (!response.ok) {
        console.log(`   ❌ HTTP ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      let newProducts = 0;

      // Find all product links
      $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && href.includes('/shkafy/') && href.includes('!') && !href.includes('#review')) {
          const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

          if (!allCabinets.has(fullUrl)) {
            const title = $(elem).attr('title') || '';
            const img = $(elem).find('img');
            const imgAlt = img.attr('alt') || '';
            const imgSrc = img.attr('src') || img.attr('data-src') || '';

            let name = (title || imgAlt || $(elem).text()).trim();
            name = name.replace(/\s+/g, ' ')
              .replace(/Новинки|Живое фото|📸|★|отзыв(ов)?/gi, '')
              .trim();

            if (name && name.length > 5 && name.length < 200 && !name.match(/^\d+$/)) {
              allCabinets.set(fullUrl, {
                russianName: name,
                url: fullUrl,
                imageUrl: imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) : null,
                category: category
              });
              newProducts++;
            }
          }
        }
      });

      console.log(`   ✅ Found ${newProducts} new products (Total: ${allCabinets.size})`);

      await new Promise(r => setTimeout(r, 1500));

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  const cabinets = Array.from(allCabinets.values());

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 FINAL RESULTS:`);
  console.log(`   Total unique cabinets: ${cabinets.length}`);
  console.log(`   Target from website: 107`);

  if (cabinets.length >= 100) {
    console.log(`   ✅ SUCCESS! We have ${cabinets.length} products!`);
  } else if (cabinets.length >= 90) {
    console.log(`   ⚠️  Close! ${107 - cabinets.length} short of target`);
  } else {
    console.log(`   ⚠️  ${107 - cabinets.length} products still missing (likely behind JS load)`);
  }
  console.log(`${'='.repeat(60)}\n`);

  fs.writeFileSync('./cabinets-scraped-complete.json', JSON.stringify(cabinets, null, 2));
  console.log(`💾 Saved to cabinets-scraped-complete.json`);

  // Show breakdown by category
  const byCategory = {};
  cabinets.forEach(c => {
    const cat = c.category || 'unknown';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  console.log(`\n📋 Breakdown by category:`);
  Object.entries(byCategory).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} products`);
  });

  console.log(`\n📋 First 15 cabinets:`);
  cabinets.slice(0, 15).forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.russianName}`);
  });

  return cabinets;
}

scrapeAllCabinetCategories().catch(console.error);
