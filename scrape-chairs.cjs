require('dotenv').config();
const fetch = require('node-fetch');

async function scrapeChairsPage() {
  console.log('Fetching chairs catalog page...');
  const url = 'https://mnogomebeli.com/stulya/';

  try {
    const response = await fetch(url);
    const html = await response.text();

    console.log('HTML length:', html.length);

    // Extract product URLs using regex
    const productUrlPattern = /href="(\/stulya\/[^"]+)"/g;
    const matches = [...html.matchAll(productUrlPattern)];
    const uniqueUrls = [...new Set(matches.map(m => m[1]))];

    console.log(`Found ${uniqueUrls.length} unique chair product URLs`);

    // Filter out non-product URLs
    console.log('\nAll unique URLs:');
    uniqueUrls.forEach(url => console.log(`  ${url}`));

    const productUrls = uniqueUrls.filter(url =>
      url.includes('/stulya/') &&
      !url.includes('?') &&
      url !== '/stulya/' &&
      !url.endsWith('/stulya/') &&
      url.length > '/stulya/'.length
    );

    console.log(`\nFiltered to ${productUrls.length} actual product URLs`);
    console.log('\nSample product URLs:');
    productUrls.slice(0, 10).forEach(url => console.log(`  https://mnogomebeli.com${url}`));

    return productUrls;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

scrapeChairsPage().catch(console.error);
