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
      works: false
    };
  }
}

async function main() {
  console.log('Testing All View Types for Ashley Products...\n');
  console.log('='.repeat(60));

  const productCode = '31004-38';

  const viewTypes = [
    'HEAD-ON-SW',
    'HEAD-ON-SW-P1-KO',
    'ANGLE-SW',
    'ANGLE-SW-P1-KO',
    'DETAIL-SW',
    'DETAIL-SW-P1-KO',
    'LIFESTYLE-SW',
    'LIFESTYLE-SW-P1-KO',
    'SIDE-SW',
    'SIDE-SW-P1-KO',
    'CLOSE-UP-SW',
    'CLOSE-UP-SW-P1-KO',
    'ALT1-SW',
    'ALT2-SW',
    'ALT3-SW',
    'ALT4-SW',
    'ALT5-SW'
  ];

  console.log(`Testing ${viewTypes.length} view types...\n`);

  const workingViews = [];

  for (const view of viewTypes) {
    const url = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${productCode}-${view}?$AFHS-Grid-1X$`;
    const result = await testImageUrl(url);

    const icon = result.works ? '✓' : '✗';
    console.log(`${icon} [${result.status}] ${view}`);

    if (result.works) {
      workingViews.push(view);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Working View Types: ${workingViews.length}`);
  console.log('='.repeat(60));

  workingViews.forEach(view => {
    console.log(`✓ ${view}`);
  });

  console.log('='.repeat(60));
}

main();
