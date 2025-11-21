require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

async function enhanceChairsWithPrices() {
  const chairs = JSON.parse(fs.readFileSync('all-chairs-scraped.json', 'utf8'));

  console.log(`Enhancing ${chairs.length} chairs with prices...\n`);

  for (let i = 0; i < chairs.length; i++) {
    const chair = chairs[i];
    console.log(`[${i + 1}/${chairs.length}] ${chair.name}`);

    try {
      const response = await fetch(chair.source_url);
      const html = await response.text();

      // Try multiple price patterns
      let price = null;

      // Pattern 1: meta tag with price
      let priceMatch = html.match(/<meta[^>]+property="product:price:amount"[^>]+content="(\d+)"/);
      if (priceMatch) price = parseInt(priceMatch[1]);

      // Pattern 2: data-price attribute
      if (!price) {
        priceMatch = html.match(/data-price="(\d+)"/);
        if (priceMatch) price = parseInt(priceMatch[1]);
      }

      // Pattern 3: class with price
      if (!price) {
        priceMatch = html.match(/class="[^"]*price[^"]*"[^>]*>.*?(\d{3,})\s*(?:руб|₽)/i);
        if (priceMatch) price = parseInt(priceMatch[1].replace(/\s/g, ''));
      }

      // Pattern 4: Look for numbers followed by руб
      if (!price) {
        priceMatch = html.match(/(\d{3,})\s*руб/i);
        if (priceMatch) price = parseInt(priceMatch[1].replace(/\s/g, ''));
      }

      chair.price = price;
      console.log(`  Price: ${price ? price + ' руб' : 'NOT FOUND'}`);

      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }

  fs.writeFileSync('all-chairs-with-prices.json', JSON.stringify(chairs, null, 2));
  console.log(`\nSaved to all-chairs-with-prices.json`);

  const withPrices = chairs.filter(c => c.price).length;
  console.log(`Chairs with prices: ${withPrices}/${chairs.length}`);
}

enhanceChairsWithPrices().catch(console.error);
