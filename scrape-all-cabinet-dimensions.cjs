const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAllDimensions() {
  const productsData = JSON.parse(fs.readFileSync('./all-shkafy-complete-with-prices.json', 'utf8'));
  
  console.log(`📏 Scraping dimensions for ${productsData.length} cabinets...\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < productsData.length; i++) {
    const product = productsData[i];
    
    try {
      const response = await fetch(product.url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract dimensions using regex pattern
      const bodyText = $('body').text();
      const match = bodyText.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*см/i);
      
      if (match) {
        const [, dim1, dim2, dim3] = match;
        // Format is usually ШxГxВ (Width x Depth x Height)
        results.push({
          russianName: product.russianName,
          url: product.url,
          width_cm: parseInt(dim1),
          depth_cm: parseInt(dim2),
          height_cm: parseInt(dim3),
          dimensions_raw: match[0]
        });
        successCount++;
        console.log(`✅ [${i+1}/${productsData.length}] ${product.russianName}: ${match[0]}`);
      } else {
        results.push({
          russianName: product.russianName,
          url: product.url,
          width_cm: null,
          depth_cm: null,
          height_cm: null,
          dimensions_raw: null
        });
        failCount++;
        console.log(`❌ [${i+1}/${productsData.length}] ${product.russianName}: NOT FOUND`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error scraping ${product.url}:`, error.message);
      results.push({
        russianName: product.russianName,
        url: product.url,
        width_cm: null,
        depth_cm: null,
        height_cm: null,
        dimensions_raw: null,
        error: error.message
      });
      failCount++;
    }
  }
  
  fs.writeFileSync('./cabinet-dimensions-complete.json', JSON.stringify(results, null, 2));
  console.log(`\n📝 Complete! Success: ${successCount}, Failed: ${failCount}`);
  console.log('Saved to cabinet-dimensions-complete.json');
}

scrapeAllDimensions();
