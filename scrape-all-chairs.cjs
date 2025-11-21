require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

async function scrapeAllChairs() {
  console.log('Step 1: Fetching chairs catalog page...');
  const catalogUrl = 'https://mnogomebeli.com/stulya/';

  try {
    const response = await fetch(catalogUrl);
    const html = await response.text();

    // Extract product URLs
    const productUrlPattern = /href="(\/stulya\/[^"]+!stul-[^"#]+?)(?:#[^"]*)?"/g;
    const matches = [...html.matchAll(productUrlPattern)];
    const uniqueUrls = [...new Set(matches.map(m => m[1]))];

    console.log(`Found ${uniqueUrls.length} unique chair products\n`);

    const chairs = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < uniqueUrls.length; i++) {
      const relativeUrl = uniqueUrls[i];
      const fullUrl = `https://mnogomebeli.com${relativeUrl}`;

      console.log(`[${i + 1}/${uniqueUrls.length}] Scraping: ${fullUrl}`);

      try {
        const productResponse = await fetch(fullUrl);
        const productHtml = await productResponse.text();

        // Extract product name
        const nameMatch = productHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const name = nameMatch ? nameMatch[1].trim() : '';

        // Extract price
        const priceMatch = productHtml.match(/data-product-price="(\d+)"/);
        const price = priceMatch ? parseInt(priceMatch[1]) : null;

        // Extract description
        const descMatch = productHtml.match(/<div[^>]*class="[^"]*product-detail-text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
        let description = '';
        if (descMatch) {
          description = descMatch[1]
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim()
            .substring(0, 500);
        }

        // Extract images
        const imagePattern = /https:\/\/mnogomebeli\.com\/upload\/[^"'\s]+\.(jpg|png|webp)[^"'\s]*/gi;
        const imageMatches = [...productHtml.matchAll(imagePattern)];
        const images = [...new Set(imageMatches.map(m => m[0]))]
          .filter(url => !url.includes('resize_cache') || url.includes('1310_610'));

        // Extract dimensions (looking for patterns like "Высота: 85 см")
        const dimensions = {};
        const heightMatch = productHtml.match(/Высота[:\s]+(\d+)\s*см/i);
        const widthMatch = productHtml.match(/Ширина[:\s]+(\d+)\s*см/i);
        const depthMatch = productHtml.match(/Глубина[:\s]+(\d+)\s*см/i);

        if (heightMatch) dimensions.height_cm = parseInt(heightMatch[1]);
        if (widthMatch) dimensions.width_cm = parseInt(widthMatch[1]);
        if (depthMatch) dimensions.depth_cm = parseInt(depthMatch[1]);

        // Generate SKU
        const sku = `CHR-MNM-${String(i).padStart(4, '0')}`;

        const chair = {
          sku,
          name,
          description,
          price,
          images: images.slice(0, 5),
          dimensions,
          source_url: fullUrl
        };

        chairs.push(chair);
        successCount++;
        console.log(`  ✓ ${name} - ${price} руб - ${chair.images.length} images`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        errorCount++;
        console.log(`  ✗ Error: ${error.message}`);
      }
    }

    console.log(`\n=== Scraping Complete ===`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total chairs: ${chairs.length}`);

    // Save to file
    const filename = 'all-chairs-scraped.json';
    fs.writeFileSync(filename, JSON.stringify(chairs, null, 2));
    console.log(`\nSaved to ${filename}`);

    return chairs;

  } catch (error) {
    console.error('Fatal error:', error.message);
    throw error;
  }
}

scrapeAllChairs().catch(console.error);
