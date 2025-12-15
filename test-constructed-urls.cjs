const fetch = require('node-fetch');

async function testImageUrl(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.ashleyfurniture.com/'
      }
    });

    console.log(`\nURL: ${url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);

    if (response.status === 200) {
      console.log('✓ Image is accessible');
    } else {
      console.log('✗ Image is NOT accessible');
    }

    return response.status === 200;
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Testing Constructed Ashley Scene7 URLs...\n');
  console.log('='.repeat(60));

  const testUrls = [
    'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/31004-38-HEAD-ON-SW-P1-KO?$AFHS-Grid-1X$',
    'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/3100438_P1?$AFHS-PDP-Main$',
    'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/3100438_P2?$AFHS-PDP-Main$',
    'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/5730338_P1?$AFHS-PDP-Main$',
  ];

  for (const url of testUrls) {
    await testImageUrl(url);
  }

  console.log('\n' + '='.repeat(60));
}

main();
