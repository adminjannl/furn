const fs = require('fs');

function extractProductsFromHTML(htmlFile) {
  console.log(`Reading ${htmlFile}...`);

  const html = fs.readFileSync(htmlFile, 'utf-8');
  console.log(`File size: ${(html.length / 1024).toFixed(2)} KB\n`);

  const products = [];

  const jsonPatterns = [
    /"browsePage":\s*(\{[^}]+\})/,
    /"categoryProducts":\s*(\[[^\]]+\])/,
    /"products":\s*(\[[^\]]+\])/,
    /window\.__NEXT_DATA__\s*=\s*({.+?});/s,
    /window\.__INITIAL_STATE__\s*=\s*({.+?});/s,
  ];

  console.log('Searching for JSON data...\n');

  let foundData = false;

  const scriptMatches = html.match(/<script[^>]*>([^<]+)<\/script>/g);

  if (scriptMatches) {
    console.log(`Found ${scriptMatches.length} script tags\n`);

    for (const script of scriptMatches) {
      const scriptContent = script.replace(/<\/?script[^>]*>/g, '');

      if (scriptContent.includes('sku') ||
          scriptContent.includes('product') ||
          scriptContent.includes('categoryProducts') ||
          scriptContent.includes('browsePage')) {

        try {
          const jsonMatch = scriptContent.match(/({[\s\S]*})/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[1];

            if (jsonStr.length > 1000 && jsonStr.length < 10000000) {
              fs.writeFileSync('wayfair-data-extract.json', jsonStr);
              console.log('Found large JSON object, saved to wayfair-data-extract.json');
              console.log(`Size: ${(jsonStr.length / 1024).toFixed(2)} KB`);

              try {
                const data = JSON.parse(jsonStr);
                console.log('\nJSON structure:');
                console.log(Object.keys(data));

                const searchKeys = ['products', 'items', 'results', 'browsePage', 'categoryProducts'];
                for (const key of searchKeys) {
                  if (data[key]) {
                    console.log(`\n✓ Found key: ${key}`);
                    console.log(`Type: ${typeof data[key]}`);
                    if (Array.isArray(data[key])) {
                      console.log(`Array length: ${data[key].length}`);
                    }
                  }
                }

                const extracted = extractProductsFromObject(data);
                products.push(...extracted);
                foundData = true;

              } catch (parseErr) {
                console.log('Could not parse JSON:', parseErr.message);
              }
            }
          }
        } catch (err) {
          continue;
        }
      }
    }
  }

  if (!foundData) {
    console.log('\n⚠ No product JSON found. Trying alternative extraction...\n');

    const altPattern = /"sku":\s*"([^"]+)"[\s\S]{0,500}?"name":\s*"([^"]+)"[\s\S]{0,500}?"pricing":\s*\{[^}]*"salePrice":\s*"([^"]+)"/g;

    let match;
    while ((match = altPattern.exec(html)) !== null) {
      products.push({
        id: match[1],
        name: match[2],
        price: match[3],
        source: 'wayfair'
      });
    }

    if (products.length > 0) {
      console.log(`✓ Extracted ${products.length} products using pattern matching`);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total products extracted: ${products.length}`);
  console.log('='.repeat(50));

  if (products.length > 0) {
    console.log('\nFirst 5 products:');
    products.slice(0, 5).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name || p.title || 'Unknown'}`);
      console.log(`   Price: ${p.price || p.salePrice || 'N/A'}`);
      console.log(`   SKU: ${p.id || p.sku || 'N/A'}`);
    });

    const outputFile = 'wayfair-products-extracted.json';
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
    console.log(`\n✓ Saved to ${outputFile}`);
  } else {
    console.log('\n⚠ No products found');
    console.log('\nSaving first 5000 chars for manual inspection...');
    fs.writeFileSync('wayfair-sample.txt', html.substring(0, 5000));
  }

  return products;
}

function extractProductsFromObject(obj, products = []) {
  if (!obj || typeof obj !== 'object') return products;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object') {
        if (item.sku || item.productId || (item.name && item.price)) {
          products.push({
            id: item.sku || item.productId || item.id || `PROD-${products.length + 1}`,
            name: item.name || item.title || item.displayName,
            price: item.price || item.salePrice || item.pricing?.salePrice,
            image: item.image || item.imageUrl || item.thumbnail,
            url: item.url || item.productUrl,
            rating: item.rating || item.averageRating,
            reviews: item.reviewCount || item.numberOfReviews,
            source: 'wayfair'
          });
        } else {
          extractProductsFromObject(item, products);
        }
      }
    }
  } else {
    for (const key in obj) {
      if (key === 'products' || key === 'items' || key === 'results') {
        if (Array.isArray(obj[key])) {
          extractProductsFromObject(obj[key], products);
        }
      } else if (typeof obj[key] === 'object') {
        extractProductsFromObject(obj[key], products);
      }
    }
  }

  return products;
}

const htmlFile = process.argv[2] || 'wayfair-scraperapi-raw.html';
extractProductsFromHTML(htmlFile);
