const fetch = require('node-fetch');

async function testImageUrl(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.ashleyfurniture.com/'
      }
    });

    return {
      url,
      status: response.status,
      works: response.status === 200
    };
  } catch (error) {
    return {
      url,
      status: 0,
      works: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('Finding Working Ashley Scene7 Image Patterns...\n');
  console.log('='.repeat(60));

  const productCode = '3100438';
  const formatted = '31004-38';

  const patterns = [
    `${formatted}-HEAD-ON-SW-P1-KO?$AFHS-Grid-1X$`,
    `${formatted}-SW?$AFHS-PDP-Main$`,
    `${formatted}-SW?$AFHS-Grid-1X$`,
    `${formatted}-P1-KO?$AFHS-PDP-Main$`,
    `${formatted}-P2-KO?$AFHS-PDP-Main$`,
    `${formatted}-ANGLE-SW?$AFHS-Grid-1X$`,
    `${formatted}-DETAIL?$AFHS-Grid-1X$`,
    `${formatted}-LIFESTYLE?$AFHS-Grid-1X$`,
    `${productCode}-SW?$AFHS-PDP-Main$`,
    `${productCode}_SW?$AFHS-PDP-Main$`,
    `${productCode}-HEAD-ON?$AFHS-PDP-Main$`,
    `${formatted}-HEAD-ON-SW-P2-KO?$AFHS-Grid-1X$`,
    `${formatted}-HEAD-ON-SW-P3-KO?$AFHS-Grid-1X$`,
    `${formatted}-ANGLE-SW-P1-KO?$AFHS-Grid-1X$`,
    `${formatted}-DETAIL-SW-P1-KO?$AFHS-Grid-1X$`,
    `${formatted}-LIFESTYLE-SW-P1-KO?$AFHS-Grid-1X$`
  ];

  console.log(`Testing ${patterns.length} URL patterns for product ${productCode}...\n`);

  const results = [];

  for (const pattern of patterns) {
    const url = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${pattern}`;
    const result = await testImageUrl(url);
    results.push(result);

    const icon = result.works ? '✓' : '✗';
    console.log(`${icon} [${result.status}] ${pattern}`);

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Working Patterns:');
  console.log('='.repeat(60));

  const working = results.filter(r => r.works);
  if (working.length === 0) {
    console.log('No additional working patterns found.');
  } else {
    working.forEach(r => {
      const pattern = r.url.split('/AshleyFurniture/')[1];
      console.log(`✓ ${pattern}`);
    });
  }

  console.log('='.repeat(60));
}

main();
