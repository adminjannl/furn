const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllCabinets() {
  console.log('🗄️  Scraping ALL cabinets from mnogomebeli.com with pagination...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('📄 Loading cabinet catalog page...');
    await page.goto('https://mnogomebeli.com/shkafy/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('✅ Page loaded, looking for "View More" button...\n');

    // Keep clicking "View More" until all products are loaded
    let clickCount = 0;
    while (true) {
      // Wait a bit for content to load
      await page.waitForTimeout(2000);

      // Check if "View More" button exists and is visible
      const showMoreButton = await page.$('a.show-more, button.show-more, .show-more, [data-use="show-more-list"]');

      if (!showMoreButton) {
        console.log('📋 No more "View More" button found. All products loaded.\n');
        break;
      }

      // Check if button is visible
      const isVisible = await showMoreButton.isIntersectingViewport();
      if (!isVisible) {
        console.log('📋 "View More" button not visible. All products loaded.\n');
        break;
      }

      clickCount++;
      console.log(`🔄 Clicking "View More" button (${clickCount})...`);

      try {
        await showMoreButton.click();
        await page.waitForTimeout(3000); // Wait for new content to load
      } catch (error) {
        console.log('📋 Could not click button anymore. All products loaded.\n');
        break;
      }
    }

    console.log(`✅ Finished loading products after ${clickCount} clicks\n`);
    console.log('🔍 Extracting all cabinet data...\n');

    // Extract all product links
    const cabinets = await page.evaluate(() => {
      const products = [];
      const seenUrls = new Set();

      // Find all links
      const links = document.querySelectorAll('a');

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Product URLs have ! in them and contain shkafy
        if (href.includes('!') && href.includes('/shkafy/') && !href.includes('#review')) {
          const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

          if (!seenUrls.has(fullUrl)) {
            seenUrls.add(fullUrl);

            // Get name from various sources
            const title = link.getAttribute('title');
            const img = link.querySelector('img');
            const imgAlt = img ? img.getAttribute('alt') : null;
            const imgSrc = img ? (img.getAttribute('src') || img.getAttribute('data-src')) : null;
            const linkText = link.textContent.trim();

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

              products.push({
                russianName: name,
                url: fullUrl,
                imageUrl: imageUrl
              });
            }
          }
        }
      });

      return products;
    });

    // Remove duplicates
    const uniqueCabinets = Array.from(new Map(cabinets.map(c => [c.url, c])).values());

    console.log(`✅ Found ${uniqueCabinets.length} unique cabinets\n`);

    // Save to file
    fs.writeFileSync('./cabinets-scraped-complete.json', JSON.stringify(uniqueCabinets, null, 2));
    console.log('💾 Saved to cabinets-scraped-complete.json\n');

    // Display summary
    console.log('📋 Cabinet Summary:\n');
    uniqueCabinets.forEach((cabinet, i) => {
      console.log(`${i + 1}. ${cabinet.russianName}`);
    });

    console.log(`\n📊 Total: ${uniqueCabinets.length} cabinets found`);
    console.log(`Target: 107 cabinets`);
    console.log(uniqueCabinets.length >= 107 ? '✅ Target reached!' : `⚠️  ${107 - uniqueCabinets.length} short of target`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

scrapeAllCabinets().catch(console.error);
