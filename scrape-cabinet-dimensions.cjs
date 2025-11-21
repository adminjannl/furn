const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeDimensions() {
  const testUrls = [
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-kashemir/',
    'https://mnogomebeli.com/shkafy/!shkaf-boss-standart-120-3d-kashemir-seryy/',
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120/!ideya-120-shkaf-raspashnoy-3d-kashemir/'
  ];
  
  const results = [];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract product name
      const name = $('h1').first().text().trim();
      
      // Look for dimensions in characteristics
      let dimensions = null;
      $('td').each((i, el) => {
        const text = $(el).text().trim();
        if (text.includes('Габариты') || text.includes('ШхГхВ')) {
          const nextTd = $(el).next('td');
          if (nextTd.length) {
            dimensions = nextTd.text().trim();
          }
        }
      });
      
      // Also check for dimensions in any other format
      if (!dimensions) {
        const bodyText = $('body').text();
        const dimMatch = bodyText.match(/(\d+)x(\d+)x(\d+)\s*см/);
        if (dimMatch) {
          dimensions = dimMatch[0];
        }
      }
      
      results.push({
        url,
        name,
        dimensions
      });
      
      console.log(`✅ ${name}: ${dimensions || 'NOT FOUND'}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
    }
  }
  
  fs.writeFileSync('./cabinet-dimensions-sample.json', JSON.stringify(results, null, 2));
  console.log('\n📝 Saved to cabinet-dimensions-sample.json');
}

scrapeDimensions();
