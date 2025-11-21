const fetch = require('node-fetch');
const cheerio = require('cheerio');

(async () => {
  const url = 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-kashemir/';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  console.log('Searching for dimensions...\n');
  
  // Method 1: Look in all text for dimension patterns
  const bodyText = $('body').text();
  const patterns = [
    /Габариты[^:]*:\s*(\d+x\d+x\d+)/i,
    /ШхГхВ[^:]*:\s*(\d+x\d+x\d+)/i,
    /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*см/gi
  ];
  
  for (const pattern of patterns) {
    const match = bodyText.match(pattern);
    if (match) {
      console.log('Found with pattern:', pattern);
      console.log('Match:', match[0]);
    }
  }
  
  // Method 2: Look at table structure
  console.log('\nChecking tables...');
  $('table tr').each((i, tr) => {
    const cells = $(tr).find('td');
    if (cells.length >= 2) {
      const label = $(cells[0]).text().trim();
      const value = $(cells[1]).text().trim();
      if (label.includes('абарит') || label.includes('Размер')) {
        console.log(`${label}: ${value}`);
      }
    }
  });
})();
