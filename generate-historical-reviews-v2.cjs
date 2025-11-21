const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function generateOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${year}${randomPart}`;
}

const reviewTemplates = {
  5: {
    short: [
      { title: 'Perfect!', text: 'Absolutely love it!' },
      { title: 'Excellent!', text: 'Best furniture I\'ve ever purchased.' },
      { title: 'Amazing quality', text: 'Exceeded my expectations completely.' },
      { title: 'So happy!', text: 'This is exactly what I was looking for.' },
      { title: 'Beautiful', text: 'Looks stunning in our home!' }
    ],
    medium: [
      {
        title: 'Excellent quality!',
        text: 'Absolutely love this furniture! The quality is outstanding and it looks even better than in the pictures. Very happy with my purchase.'
      },
      {
        title: 'Perfect addition to our home',
        text: 'This piece fits perfectly in our living room. The craftsmanship is superb and the delivery was smooth. Highly recommend!'
      },
      {
        title: 'Outstanding service',
        text: 'From ordering to delivery, everything was perfect. The furniture is beautiful and exactly what we wanted. Will definitely shop here again.'
      },
      {
        title: 'Best purchase this year',
        text: 'I\'m extremely satisfied with this purchase. The quality exceeds expectations and it complements our interior design perfectly.'
      },
      {
        title: 'Highly recommended',
        text: 'Fantastic furniture and excellent customer service. The product arrived in perfect condition and assembly was straightforward.'
      },
      {
        title: 'Beautiful craftsmanship',
        text: 'The attention to detail is remarkable. This is a high-quality piece that will last for years. Very impressed!'
      }
    ],
    long: [
      {
        title: 'Worth every euro',
        text: 'Premium quality furniture that justifies the price. The materials are top-notch and the finish is flawless. We spent weeks researching different furniture stores and brands, and I\'m so glad we chose Ideal Furniture. The customer service team was incredibly helpful in answering all our questions before purchase. When the furniture arrived, it was packaged so well that there wasn\'t a single scratch. Assembly was straightforward with clear instructions. Now that it\'s in our home, we receive compliments from every guest who visits. It\'s become the centerpiece of our living room and we couldn\'t be happier with our decision.'
      },
      {
        title: 'Exceeded all expectations',
        text: 'I was already excited about this purchase, but it exceeded all my expectations. The quality and design are simply perfect. We\'ve been looking for quality furniture for months and visited many showrooms. The moment I saw this piece on the website, I knew it was the one. The ordering process was smooth, and the delivery team was professional and careful. The furniture looks even more beautiful in person than in the photos. The craftsmanship is exceptional - you can see the attention to detail in every joint and finish. It\'s solid, well-built, and I have no doubt it will last us many years. My family is thrilled with it, and it has transformed our space completely.'
      },
      {
        title: 'Outstanding in every way',
        text: 'This furniture piece has transformed our room completely. The quality is exceptional and it\'s incredibly comfortable. From the initial browsing experience on the website to the final delivery, everything was handled professionally. The photos on the website are accurate, but seeing it in person is even better. The color is rich and beautiful, the materials feel premium, and the construction is solid. We had a few questions during the ordering process, and the customer service team was patient and knowledgeable. The delivery was on time, and the team even helped us position it exactly where we wanted. After several weeks of use, it still looks brand new. Couldn\'t be happier with this purchase!'
      }
    ]
  },
  4: {
    short: [
      { title: 'Good quality', text: 'Happy with my purchase.' },
      { title: 'Nice furniture', text: 'Good value for money.' },
      { title: 'Satisfied', text: 'Looks nice, assembly was easy.' },
      { title: 'Pretty good', text: 'Would recommend to others.' }
    ],
    medium: [
      {
        title: 'Very good quality',
        text: 'Really happy with this purchase. The quality is great and it looks nice in our home. Would recommend.'
      },
      {
        title: 'Great product',
        text: 'Good quality furniture at a fair price. Delivery took a bit longer than expected but overall very satisfied.'
      },
      {
        title: 'Happy with my choice',
        text: 'Nice piece of furniture that fits well in our living space. The quality is good, though assembly took some time.'
      },
      {
        title: 'Solid purchase',
        text: 'Very pleased with the quality and design. It\'s comfortable and looks great. Minor scratches on arrival but nothing major.'
      }
    ],
    long: [
      {
        title: 'Good value overall',
        text: 'Quality product for the price. Looks good in our home and seems durable. Assembly instructions could be clearer, but we managed to figure it out. The furniture itself is well-made and looks nice. The color matches the website photos accurately. Delivery was on schedule, though the delivery team was a bit rushed. Overall, we\'re satisfied with the purchase and would consider buying from Ideal Furniture again. It fits well in our space and serves its purpose perfectly. The only minor complaint is that one of the screws was slightly difficult to tighten, but that\'s a very small issue.'
      },
      {
        title: 'Nice addition to our home',
        text: 'Happy with this furniture piece. It\'s well-made and looks good in our living room. The ordering process was straightforward, and customer service answered my questions quickly. Delivery took about two weeks, which was within the estimated timeframe. Assembly took a couple of hours - it would have been faster with two people. The quality is good for the price point. There were a couple of very small imperfections in the finish, but nothing noticeable unless you look closely. It\'s comfortable and functional, and we use it daily. Overall, a solid purchase that we\'re happy with.'
      }
    ]
  },
  3: {
    short: [
      { title: 'Okay', text: 'It\'s fine, nothing special.' },
      { title: 'Average', text: 'Does the job but expected better quality.' },
      { title: 'Mixed feelings', text: 'Some good points, some not so good.' }
    ],
    medium: [
      {
        title: 'Decent but not perfect',
        text: 'The furniture looks nice but the quality isn\'t quite what I expected for the price. Assembly was more difficult than it should have been. It serves its purpose but I\'m not wowed by it.'
      },
      {
        title: 'Average quality',
        text: 'It\'s okay for the price. The color is slightly different from the photos online. Took longer to assemble than expected. It works fine but I probably would have chosen something else if I could do it again.'
      },
      {
        title: 'Could be better',
        text: 'The furniture is functional but feels a bit flimsy. Customer service was helpful when I had questions. Delivery was delayed by a week. It looks decent in the room but I expected higher quality materials.'
      }
    ],
    long: [
      {
        title: 'Mixed experience',
        text: 'I have mixed feelings about this purchase. On the positive side, the furniture looks nice and fits well in our space. The color is pretty close to what was shown online. However, the quality isn\'t quite what I expected based on the price. Some of the joints feel a bit loose, and there were a few small scratches when it arrived. Assembly was more challenging than anticipated - the instructions weren\'t very clear and some holes didn\'t line up perfectly. Customer service was responsive when I reached out about the issues. The delivery was later than promised, which was inconvenient. After using it for a few weeks, it\'s holding up okay but I worry about long-term durability. It serves its purpose and looks acceptable, but I think there might be better options available for the same price range.'
      }
    ]
  }
};

async function generateReviews() {
  console.log('Starting review generation...');

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .limit(100);

  if (productsError || !products || products.length === 0) {
    console.error('Error fetching products:', productsError);
    return;
  }

  console.log(`Found ${products.length} products`);

  const reviews = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 365);

  const reviewDates = [];
  let currentDate = new Date(startDate);

  while (currentDate < now) {
    const random = Math.random();

    if (random < 0.2) {
      currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 3) + 2);
    } else if (random < 0.5) {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (random < 0.75) {
      const date1 = new Date(currentDate);
      date1.setHours(Math.floor(Math.random() * 12) + 9, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      reviewDates.push(date1);

      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      const date1 = new Date(currentDate);
      date1.setHours(Math.floor(Math.random() * 8) + 9, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      reviewDates.push(date1);

      const date2 = new Date(currentDate);
      date2.setHours(Math.floor(Math.random() * 7) + 17, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      reviewDates.push(date2);

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  console.log(`Generating ${reviewDates.length} reviews...`);

  for (let i = 0; i < reviewDates.length; i++) {
    const rand = Math.random();
    let rating;
    if (rand < 0.65) {
      rating = 5;
    } else if (rand < 0.88) {
      rating = 4;
    } else {
      rating = 3;
    }

    const lengthRand = Math.random();
    let length;
    if (lengthRand < 0.20) {
      length = 'short';
    } else if (lengthRand < 0.70) {
      length = 'medium';
    } else {
      length = 'long';
    }

    const templatesByLength = reviewTemplates[rating][length];
    const template = templatesByLength[Math.floor(Math.random() * templatesByLength.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    reviews.push({
      product_id: product.id,
      order_id: null,
      order_number: generateOrderNumber(),
      user_id: null,
      rating,
      title: template.title,
      review_text: template.text,
      is_verified_purchase: false,
      is_approved: true,
      created_at: reviewDates[i].toISOString()
    });

    if ((i + 1) % 50 === 0) {
      console.log(`Prepared ${i + 1} reviews...`);
    }
  }

  console.log('Inserting reviews into database...');
  const { data, error } = await supabase
    .from('product_reviews')
    .insert(reviews);

  if (error) {
    console.error('Error inserting reviews:', error);
    return;
  }

  console.log(`✅ Successfully generated ${reviews.length} reviews!`);

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length
  };

  const lengthCounts = {
    short: reviews.filter(r => r.review_text.length < 100).length,
    medium: reviews.filter(r => r.review_text.length >= 100 && r.review_text.length < 400).length,
    long: reviews.filter(r => r.review_text.length >= 400).length
  };

  console.log(`Rating distribution:`);
  console.log(`- 5 stars: ${ratingCounts[5]} (${((ratingCounts[5]/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- 4 stars: ${ratingCounts[4]} (${((ratingCounts[4]/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- 3 stars: ${ratingCounts[3]} (${((ratingCounts[3]/reviews.length)*100).toFixed(1)}%)`);
  console.log(`\nLength distribution:`);
  console.log(`- Short: ${lengthCounts.short} (${((lengthCounts.short/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- Medium: ${lengthCounts.medium} (${((lengthCounts.medium/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- Long: ${lengthCounts.long} (${((lengthCounts.long/reviews.length)*100).toFixed(1)}%)`);
}

generateReviews().catch(console.error);
