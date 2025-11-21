const fetch = require('node-fetch');
const cheerio = require('cheerio');

(async () => {
  const url = 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-kashemir/';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const name = $('h1').first().text().trim();
  console.log('Product:', name);
  
  // Find dimensions
  let found = false;
  $('td').each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes('Габариты') || text.includes('ШхГхВ')) {
      const nextTd = $(el).next('td');
      if (nextTd.length) {
        console.log('Dimensions:', nextTd.text().trim());
        found = true;
      }
    }
  });
  
  if (!found) {
    console.log('Dimensions not found');
  }
})();
