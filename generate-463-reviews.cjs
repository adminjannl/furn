require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const reviewData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'natural-reviews-data.json'), 'utf8')
);

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

async function generateReviews() {
  const distribution = {
    5: 340,
    4: 85,
    3: 25,
    2: 10,
    1: 3
  };

  console.log('Generating 463 natural human-like reviews...\n');

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  const totalStars = Object.entries(distribution).reduce((sum, [rating, count]) => sum + (rating * count), 0);
  const avgRating = totalStars / total;

  console.log('Distribution:');
  console.log(`5 stars: ${distribution[5]} (${((distribution[5]/total)*100).toFixed(1)}%)`);
  console.log(`4 stars: ${distribution[4]} (${((distribution[4]/total)*100).toFixed(1)}%)`);
  console.log(`3 stars: ${distribution[3]} (${((distribution[3]/total)*100).toFixed(1)}%)`);
  console.log(`2 stars: ${distribution[2]} (${((distribution[2]/total)*100).toFixed(1)}%)`);
  console.log(`1 star:  ${distribution[1]} (${((distribution[1]/total)*100).toFixed(1)}%)`);
  console.log(`\nTotal: ${total} reviews`);
  console.log(`Average rating: ${avgRating.toFixed(2)}\n`);

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name')
    .limit(100);

  if (productsError) {
    console.error('Error fetching products:', productsError);
    return;
  }

  console.log(`Generating reviews for ${products.length} products...\n`);

  const reviews = [];

  for (const [rating, count] of Object.entries(distribution)) {
    const ratingNum = parseInt(rating);
    const templates = reviewData[rating];

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const product = getRandomElement(products);

      reviews.push({
        product_id: product.id,
        rating: ratingNum,
        title: template.title,
        review_text: template.text,
        order_number: `ORD-${Math.floor(new Date(getRandomDate()).getTime())}`,
        is_verified_purchase: true,
        is_approved: true,
        helpful_count: Math.floor(Math.random() * 20),
        created_at: getRandomDate()
      });
    }
  }

  reviews.sort(() => Math.random() - 0.5);

  console.log(`Generated ${reviews.length} reviews. Inserting into database...\n`);

  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < reviews.length; i += batchSize) {
    const batch = reviews.slice(i, i + batchSize);

    const { error: insertError } = await supabase
      .from('product_reviews')
      .insert(batch);

    if (insertError) {
      console.error('Error inserting batch:', insertError);
      return;
    }

    inserted += batch.length;
    console.log(`Inserted ${inserted}/${reviews.length} reviews...`);
  }

  console.log(`\n✅ Done! Generated ${reviews.length} natural reviews with ${avgRating.toFixed(2)} average rating`);
}

generateReviews().catch(console.error);
