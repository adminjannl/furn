const https = require('https');
const fs = require('fs');

const dbBeds = [
  { sku: "BED-MNM-0041", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal агат", url: "https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-agat/" },
  { sku: "BED-MNM-0042", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal топаз NEW", url: "https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-topaz/" },
  { sku: "BED-MNM-0043", original_name: "Кровать Босс Дрим 160*200 Про Велюр Роял тауп", url: "https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-taup/" },
  { sku: "BED-MNM-0044", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal пион NEW", url: "https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-pion/" },
  { sku: "BED-MNM-0045", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal шампань NEW", url: "https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-shampan/" },
  { sku: "BED-MNM-0046", original_name: "Кровать Фрея 160*200 Слим MONOLIT Латте", url: null },
  { sku: "BED-MNM-0047", original_name: "Кровать Фрея 160*200 Слим MONOLIT Сталь", url: null },
  { sku: "BED-MNM-0048", original_name: "Кровать Фрея 160*200 с ПМ MONOLIT Серая", url: null },
  { sku: "BED-MNM-0049", original_name: "Кровать Фрея 160*200 с ПМ MONOLIT Сталь", url: null },
  { sku: "BED-MNM-0050", original_name: "Кровать Белла 160*200 велюр Monolit мокко", url: null },
  { sku: "BED-MNM-0051", original_name: "Кровать Белла 140*200 велюр Monolit мокко", url: null },
  { sku: "BED-MNM-0052", original_name: "Кровать Белла 140*200 с ПМ велюр Monolit мокко", url: null },
  { sku: "BED-MNM-0053", original_name: "Кровать Босс 140*200 Про велюр Monolit латте", url: null },
  { sku: "BED-MNM-0054", original_name: "Кровать Босс 140*200 Про велюр Monolit серая", url: null },
  { sku: "BED-MNM-0055", original_name: "Кровать Босс 140*200 Про велюр Monolit сталь", url: null },
  { sku: "BED-MNM-0056", original_name: "Кровать Босс 160*200 Про велюр Monolit серая", url: null },
  { sku: "BED-MNM-0057", original_name: "Кровать Босс 180*200 Про велюр Monolit мокко", url: null },
  { sku: "BED-MNM-0058", original_name: "Кровать Босс 180*200 Про велюр Monolit сталь", url: null },
  { sku: "BED-MNM-0059", original_name: "Кровать BOSS mini NEW велюр Monolit лаванда", url: null },
  { sku: "BED-MNM-0060", original_name: "Кровать BOSS mini NEW велюр Monolit серая", url: null },
  { sku: "BED-MNM-0061", original_name: "Кровать BOSS mini NEW велюр Monolit латте", url: null },
  { sku: "BED-MNM-0062", original_name: "Кровать РОНДА 160*200 велюр MONOLIT серая", url: null },
  { sku: "BED-MNM-0063", original_name: "Кровать РОНДА 160*200 велюр MONOLIT сталь", url: null }
];

const catalogBeds = require('./complete-bed-catalog.json');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractImagesFromProductPage(html) {
  const images = [];

  const imageRegex = /<img[^>]+src="([^"]+upload\/iblock\/[^"]+\.jpg)"[^>]*>/gi;

  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    let imageUrl = match[1];
    if (!imageUrl.startsWith('http')) {
      imageUrl = 'https://mnogomebeli.com' + imageUrl;
    }

    imageUrl = imageUrl.replace('/resize_cache/', '/').replace(/\/\d+_\d+_\d+\//, '/');

    if (!images.includes(imageUrl)) {
      images.push(imageUrl);
    }
  }

  return images;
}

async function scrapeIndividualProducts() {
  console.log('Scraping individual product pages...\n');

  const finalMapping = [];

  for (const bed of dbBeds) {
    console.log(`Processing ${bed.sku}: ${bed.original_name}`);

    const catalogBed = catalogBeds.find(cb =>
      cb.russianName.toLowerCase() === bed.original_name.toLowerCase()
    );

    if (catalogBed) {
      console.log(`  ✓ Found in catalog: ${catalogBed.imageUrl}\n`);
      finalMapping.push({
        sku: bed.sku,
        images: [catalogBed.imageUrl]
      });
      continue;
    }

    if (!bed.url) {
      console.log(`  ✗ No URL available, skipping\n`);
      continue;
    }

    try {
      const html = await fetchPage(bed.url);
      const images = extractImagesFromProductPage(html);

      if (images.length > 0) {
        console.log(`  ✓ Found ${images.length} images:`);
        images.forEach(img => console.log(`    - ${img}`));
        finalMapping.push({
          sku: bed.sku,
          images: images.slice(0, 3)
        });
      } else {
        console.log(`  ✗ No images found`);
      }
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }

    console.log('');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  fs.writeFileSync('final-correct-mapping-41-63.json', JSON.stringify(finalMapping, null, 2));
  console.log(`\n✓ Created mapping for ${finalMapping.length}/23 beds`);
}

scrapeIndividualProducts().catch(console.error);
