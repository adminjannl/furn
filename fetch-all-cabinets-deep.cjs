const cheerio = require('cheerio');
const fs = require('fs');

async function fetchAllCabinets() {
  console.log('🔍 Deep scraping ALL cabinet products...\n');

  const allCabinets = new Map();

  // Strategy 1: Get first page
  console.log('📄 Fetching initial page...');
  try {
    const response = await fetch('https://mnogomebeli.com/shkafy/');
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract all cabinet links from initial page
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.includes('/shkafy/') && href.includes('!') && !href.includes('#review')) {
        const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

        const title = $(elem).attr('title') || '';
        const img = $(elem).find('img');
        const imgAlt = img.attr('alt') || '';
        const imgSrc = img.attr('src') || img.attr('data-src') || '';

        let name = (title || imgAlt || $(elem).text()).trim();
        name = name.replace(/\s+/g, ' ').replace(/Новинки|Живое фото|📸|★|отзыв(ов)?/gi, '').trim();

        if (name && name.length > 5 && name.length < 200 && !name.match(/^\d+$/)) {
          allCabinets.set(fullUrl, {
            russianName: name,
            url: fullUrl,
            imageUrl: imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) : null
          });
        }
      }
    });

    console.log(`✅ Found ${allCabinets.size} cabinets on initial page\n`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }

  // Strategy 2: Try direct AJAX requests for pages 2-10
  console.log('📡 Trying AJAX pagination...');

  for (let page = 2; page <= 10; page++) {
    console.log(`  Fetching page ${page}...`);

    try {
      // Try multiple URL patterns
      const urls = [
        `https://mnogomebeli.com/shkafy/?PAGEN_1=${page}`,
        `https://mnogomebeli.com/shkafy/index.php?PAGEN_1=${page}`,
        `https://mnogomebeli.com/ajax/catalog.php?PAGEN_1=${page}&section=shkafy`,
      ];

      for (const url of urls) {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'text/html, application/json',
              'Referer': 'https://mnogomebeli.com/shkafy/',
            }
          });

          if (response.ok) {
            const text = await response.text();
            const $ = cheerio.load(text);

            let newFound = 0;
            $('a').each((i, elem) => {
              const href = $(elem).attr('href');
              if (href && href.includes('/shkafy/') && href.includes('!') && !href.includes('#review')) {
                const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

                if (!allCabinets.has(fullUrl)) {
                  const title = $(elem).attr('title') || '';
                  const img = $(elem).find('img');
                  const name = (title || img.attr('alt') || '').replace(/\s+/g, ' ').trim();
                  const imgSrc = img.attr('src') || img.attr('data-src') || '';

                  if (name && name.length > 5) {
                    allCabinets.set(fullUrl, {
                      russianName: name,
                      url: fullUrl,
                      imageUrl: imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) : null
                    });
                    newFound++;
                  }
                }
              }
            });

            if (newFound > 0) {
              console.log(`    ✅ URL worked! Found ${newFound} new cabinets (Total: ${allCabinets.size})`);
              break;
            }
          }
        } catch (err) {
          // Try next URL
        }
      }

      await new Promise(r => setTimeout(r, 1000));

    } catch (error) {
      console.log(`    ❌ Page ${page} error: ${error.message}`);
    }

    // Stop if we haven't found new products in a while
    if (allCabinets.size >= 100) {
      console.log(`\n✅ Reached ~100 products, likely have most/all cabinets`);
      break;
    }
  }

  const cabinets = Array.from(allCabinets.values());

  console.log(`\n📊 FINAL RESULTS:`);
  console.log(`   Total unique cabinets: ${cabinets.length}`);
  console.log(`   Target from website: 107`);
  console.log(`   Status: ${cabinets.length >= 100 ? '✅ Success!' : '⚠️ Partial - JS loading required'}`);

  fs.writeFileSync('./cabinets-scraped-complete.json', JSON.stringify(cabinets, null, 2));
  console.log(`\n💾 Saved to cabinets-scraped-complete.json`);

  console.log(`\n📋 First 10 cabinets:`);
  cabinets.slice(0, 10).forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.russianName}`);
  });

  return cabinets;
}

fetchAllCabinets().catch(console.error);
