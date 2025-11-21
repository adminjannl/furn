const fetch = require('node-fetch');

async function debugPage() {
  const url = 'https://mnogomebeli.com/stoly/zhurnalnyy/stol-lux/!stol-lux-new-venge/';

  console.log(`Fetching: ${url}\n`);

  const response = await fetch(url);
  const html = await response.text();

  console.log(`Response status: ${response.status}`);
  console.log(`HTML length: ${html.length} chars\n`);

  const imageMatches = html.match(/https:\/\/mnogomebeli\.com\/upload\/[^"'\s]+\.(jpg|png|webp)[^"'\s]*/gi);

  if (imageMatches) {
    console.log(`Found ${imageMatches.length} total image URLs:`);
    const unique = [...new Set(imageMatches)];
    unique.forEach((img, i) => {
      const hasBed = img.toLowerCase().includes('bed') || img.toLowerCase().includes('krov');
      console.log(`${i + 1}. ${hasBed ? '[BED] ' : ''}${img}`);
    });
  } else {
    console.log('No image URLs found in HTML');

    if (html.includes('404') || html.includes('Not Found')) {
      console.log('\n⚠️  Page appears to be 404');
    }

    console.log('\nSearching for any image tags...');
    const imgTags = html.match(/<img[^>]+>/gi);
    if (imgTags) {
      console.log(`Found ${imgTags.length} <img> tags`);
      imgTags.slice(0, 3).forEach((tag, i) => console.log(`${i + 1}. ${tag}`));
    }
  }
}

debugPage().catch(console.error);
