const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAllCabinetsPages() {
  console.log('🗄️  Scraping all cabinet pages from mnogomebeli.com...\n');

  const allCabinets = [];
  const seenUrls = new Set();

  // The catalog uses AJAX pagination with PAGEN parameter
  // Let's try multiple pages until we get no new results
  const maxPages = 10; // Safety limit

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const url = pageNum === 1
      ? 'https://mnogomebeli.com/shkafy/'
      : `https://mnogomebeli.com/shkafy/?PAGEN_1=${pageNum}`;

    console.log(`\n📄 Fetching page ${pageNum}: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
        }
      });

      if (!response.ok) {
        console.log(`❌ HTTP ${response.status} - stopping pagination`);
        break;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      let newProductsOnPage = 0;

      // Find all product links
      $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        if (!href) return;

        // Product URLs have ! in them and contain shkafy
        if (href.includes('!') && href.includes('/shkafy/') && !href.includes('#review')) {
          const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

          if (!seenUrls.has(fullUrl)) {
            seenUrls.add(fullUrl);
            newProductsOnPage++;

            // Get name from various sources
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

            // Filter out non-product names
            if (name &&
                name.length > 5 &&
                name.length < 200 &&
                !name.match(/^\d+$/) &&
                !name.includes('отзыв')) {

              const imageUrl = imgSrc ?
                (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`) :
                null;

              allCabinets.push({
                russianName: name,
                url: fullUrl,
                imageUrl: imageUrl
              });
            }
          }
        }
      });

      console.log(`   ✅ Found ${newProductsOnPage} new products on this page`);
      console.log(`   📊 Total unique products so far: ${allCabinets.length}`);

      // If we found no new products on this page, we've reached the end
      if (newProductsOnPage === 0) {
        console.log(`\n📋 No new products found on page ${pageNum}. Pagination complete.`);
        break;
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error(`❌ Error on page ${pageNum}: ${error.message}`);
      break;
    }
  }

  console.log(`\n✅ Scraping complete! Found ${allCabinets.length} unique cabinets\n`);

  // Save to file
  fs.writeFileSync('./cabinets-scraped-complete.json', JSON.stringify(allCabinets, null, 2));
  console.log('💾 Saved to cabinets-scraped-complete.json\n');

  // Display summary
  console.log('📋 Cabinet Summary (first 20):\n');
  allCabinets.slice(0, 20).forEach((cabinet, i) => {
    console.log(`${i + 1}. ${cabinet.russianName}`);
  });

  if (allCabinets.length > 20) {
    console.log(`... and ${allCabinets.length - 20} more\n`);
  }

  console.log(`\n📊 Total: ${allCabinets.length} cabinets found`);
  console.log(`Target: 107 cabinets`);

  if (allCabinets.length >= 100) {
    console.log('✅ Target approximately reached!');
  } else {
    console.log(`⚠️  ${107 - allCabinets.length} short of target (may need more pages or different approach)`);
  }

  return allCabinets;
}

scrapeAllCabinetsPages().catch(console.error);
