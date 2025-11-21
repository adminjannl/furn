const https = require('https');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractBedsFromHTML(html) {
  const beds = [];

  const productRegex = /<div class="product product\d+"[^>]*data-impression-name="(Кровать[^"]+)"[^>]*>([\s\S]*?)(?=<div class="product product\d+"|$)/g;

  let match;
  while ((match = productRegex.exec(html)) !== null) {
    const russianName = match[1];
    const productHTML = match[2];

    const imgRegex = /src="([^"]+resize_cache[^"]+\.jpg)"/i;
    const imgMatch = productHTML.match(imgRegex);

    const urlRegex = /href="([^"]+)">Кровать/i;
    const urlMatch = productHTML.match(urlRegex);

    if (imgMatch) {
      let imageUrl = imgMatch[1];
      if (!imageUrl.startsWith('http')) {
        imageUrl = 'https://mnogomebeli.com' + imageUrl;
      }

      imageUrl = imageUrl.replace('/resize_cache/', '/').replace(/\/\d+_\d+_\d+\//, '/');

      beds.push({
        russianName: russianName.trim(),
        imageUrl,
        productUrl: urlMatch ? `https://mnogomebeli.com${urlMatch[1]}` : null
      });
    }
  }

  return beds;
}

async function scrapeAllBeds() {
  console.log('Fetching bed catalog from mnogomebeli.com...\n');

  const html = await fetchPage('https://mnogomebeli.com/krovati/');

  const beds = extractBedsFromHTML(html);

  console.log(`Found ${beds.length} beds\n`);

  beds.forEach((bed, i) => {
    console.log(`${i + 1}. ${bed.russianName}`);
    console.log(`   Image: ${bed.imageUrl}`);
    console.log(`   URL: ${bed.productUrl}\n`);
  });

  fs.writeFileSync('complete-bed-catalog.json', JSON.stringify(beds, null, 2));
  console.log('\n✓ Saved to complete-bed-catalog.json');

  return beds;
}

scrapeAllBeds().catch(console.error);
