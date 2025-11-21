const fetch = require('node-fetch');
const fs = require('fs');

async function debugPage() {
  const url = 'https://mnogomebeli.com/stoly/obedennye/stol-nord-razdvizhnoy/!stol-boss-one-new-beton-chernyy/';

  console.log(`Fetching: ${url}\n`);

  const response = await fetch(url);
  const html = await response.text();

  fs.writeFileSync('table-page-debug.html', html);
  console.log('HTML saved to table-page-debug.html');

  const imageMatches = html.match(/https:\/\/mnogomebeli\.com\/upload\/[^"'\s]+\.(jpg|png|webp)[^"'\s]*/gi);

  if (imageMatches) {
    console.log(`\nFound ${imageMatches.length} image URLs in HTML:`);
    const unique = [...new Set(imageMatches)];
    unique.forEach((img, i) => {
      console.log(`${i + 1}. ${img}`);
    });

    const tableImages = unique.filter(img =>
      img.toLowerCase().includes('stol') ||
      img.toLowerCase().includes('table') ||
      !img.toLowerCase().includes('bed') && !img.toLowerCase().includes('krov')
    );

    console.log(`\nFiltered table images (${tableImages.length}):`);
    tableImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img}`);
    });
  } else {
    console.log('No image URLs found');
  }
}

debugPage().catch(console.error);
