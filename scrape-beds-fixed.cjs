require('dotenv').config();
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeBeds() {
  console.log('🚀 Scraping beds from mnogomebeli.com...\n');

  const url = 'https://mnogomebeli.com/krovati/';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('✅ Page loaded\n');

    const beds = [];

    // Find all .product elements
    $('.product').each((i, elem) => {
      const $elem = $(elem);

      // Find the product link (should be in the <a> tags)
      const link = $elem.find('a[href*="/krovati/"]').first();
      const href = link.attr('href');

      if (!href) return;

      const fullUrl = href.startsWith('http') ? href : `https://mnogomebeli.com${href}`;

      // Try to find product name from:
      // 1. Link title
      // 2. Image alt text
      // 3. Any text in the link
      const linkTitle = link.attr('title');
      const img = link.find('img');
      const imgAlt = img.attr('alt');
      const linkText = link.text().trim();

      // Extract from URL path if name not found
      const urlParts = href.split('/').filter(p => p && p !== '!');
      const lastPart = urlParts[urlParts.length - 1];

      const name = linkTitle || imgAlt || linkText || lastPart;

      // Get image URL
      const imageUrl = img.attr('src') || img.attr('data-src');
      const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://mnogomebeli.com${imageUrl}`) : null;

      if (name && !name.includes('Новинки') && !name.includes('Живое фото')) {
        beds.push({
          name: name,
          url: fullUrl,
          imageUrl: fullImageUrl,
          rawHref: href
        });
      }
    });

    // Remove duplicates by URL
    const uniqueBeds = [];
    const seenUrls = new Set();

    beds.forEach(bed => {
      if (!seenUrls.has(bed.url)) {
        seenUrls.add(bed.url);
        uniqueBeds.push(bed);
      }
    });

    console.log(`📦 Found ${uniqueBeds.length} unique beds\n`);

    // Save to file
    fs.writeFileSync(
      './all-beds-scraped-from-page.json',
      JSON.stringify(uniqueBeds, null, 2)
    );

    console.log('💾 Saved to all-beds-scraped-from-page.json');

    // Show first few examples
    console.log('\n📋 First 10 beds:');
    uniqueBeds.slice(0, 10).forEach((bed, i) => {
      console.log(`${i + 1}. ${bed.name}`);
    });

    console.log(`\n📊 Summary:`);
    console.log(`Found: ${uniqueBeds.length} beds`);
    console.log(`Expected: 95 beds`);
    console.log(`Note: Website shows limited beds without JavaScript. Need to fetch individual product data.`);

    return uniqueBeds;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

scrapeBeds().catch(console.error);
