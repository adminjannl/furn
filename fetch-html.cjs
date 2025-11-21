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

fetchPage('https://mnogomebeli.com/krovati/')
  .then(html => {
    fs.writeFileSync('page-source.html', html);
    console.log('✓ Saved HTML to page-source.html');

    const productMatches = html.match(/class="[^"]*catalog-item[^"]*"/gi);
    console.log(`\nFound ${productMatches ? productMatches.length : 0} potential product items`);

    const firstProduct = html.match(/<div[^>]*class="[^"]*catalog-item[^"]*"[^>]*>[\s\S]{0,1000}/);
    if (firstProduct) {
      console.log('\nFirst product HTML sample:');
      console.log(firstProduct[0].substring(0, 500));
    }
  })
  .catch(console.error);
