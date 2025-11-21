const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const dutchNames = [
  'Jan de Vries', 'Emma van den Berg', 'Lars Jansen', 'Sophie Bakker', 'Daan Visser',
  'Lisa de Jong', 'Thomas Hendriks', 'Eva van Dijk', 'Luuk Mulder', 'Anna Smit',
  'Ruben Bos', 'Sara Peters', 'Finn de Groot', 'Julia de Boer', 'Max van Leeuwen',
  'Mila Dijkstra', 'Sem Vermeulen', 'Lotte van den Heuvel', 'Lucas de Wit', 'Fleur Jacobs',
  'Noah van der Linden', 'Evi Willems', 'Bram Janssen', 'Nina Maas', 'Thijs van Vliet',
  'Roos Kuiper', 'Sven Meijer', 'Noor Dekker', 'Tim Brouwer', 'Sanne de Graaf',
  'Jesse van der Berg', 'Lynn Scholten', 'Stijn Hoekstra', 'Iris van Dam', 'Jasper Vos',
  'Anouk Prins', 'Milan Koster', 'Charlotte Huisman', 'Gijs Vermeer', 'Fenna Bosch',
  'Olivier van Wijk', 'Zoey Kuijpers', 'Koen Schouten', 'Maud Kramer', 'Twan Verhoeven',
  'Lieke van der Meer', 'Teun Blom', 'Yara de Wilde', 'Jelle Driessen', 'Noa van Es'
];

const reviewTemplates = {
  5: [
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
    },
    {
      title: 'Worth every euro',
      text: 'Premium quality furniture that justifies the price. The materials are top-notch and the finish is flawless.'
    },
    {
      title: 'Exceeded expectations',
      text: 'I was already excited about this purchase, but it exceeded all my expectations. The quality and design are simply perfect.'
    },
    {
      title: 'Love it!',
      text: 'This furniture piece has transformed our room. The quality is exceptional and it\'s incredibly comfortable. Couldn\'t be happier!'
    },
    {
      title: 'Perfect!',
      text: 'Everything about this purchase was perfect - from the product quality to the delivery service. Highly satisfied customer here!'
    },
    {
      title: 'Fantastic quality',
      text: 'The build quality is exceptional. You can tell this is made to last. Very pleased with our new furniture.'
    },
    {
      title: 'Brilliant purchase',
      text: 'Ordered this for our new home and it\'s absolutely perfect. The quality and finish are outstanding.'
    },
    {
      title: 'Amazing furniture',
      text: 'Best furniture purchase we\'ve made. The quality is superb and it fits our space perfectly. Five stars!'
    },
    {
      title: 'Superb quality',
      text: 'The craftsmanship is evident in every detail. This is furniture that will be treasured for generations.'
    },
    {
      title: 'Couldn\'t be better',
      text: 'From start to finish, this was a wonderful buying experience. The furniture is beautiful and built to last.'
    }
  ],
  4: [
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
    },
    {
      title: 'Good value for money',
      text: 'Quality furniture at a reasonable price. Happy with the purchase overall, though delivery could have been faster.'
    },
    {
      title: 'Pleased with quality',
      text: 'The furniture is well-made and looks good. It took some effort to assemble but the end result is worth it.'
    },
    {
      title: 'Nice addition',
      text: 'Good quality piece that fits our interior nicely. The color is slightly different from the photo but still looks great.'
    },
    {
      title: 'Satisfied customer',
      text: 'Overall a good experience. The furniture quality is solid and it serves its purpose well. Would buy again.'
    },
    {
      title: 'Good purchase',
      text: 'Happy with the quality and design. The delivery was professional and the furniture looks great in our home.'
    },
    {
      title: 'Recommended',
      text: 'Good quality furniture that meets our expectations. A few minor issues during assembly but nothing serious.'
    },
    {
      title: 'Well made',
      text: 'Solid construction and nice finish. The furniture is comfortable and looks good. Delivery was on time.'
    },
    {
      title: 'Nice furniture',
      text: 'Good quality piece that fits our needs. The assembly instructions could be clearer but overall happy.'
    },
    {
      title: 'Good choice',
      text: 'Pleased with this purchase. The furniture is sturdy and looks nice. Minor delay in delivery but worth the wait.'
    },
    {
      title: 'Pretty good',
      text: 'The quality is good and it looks nice in our room. Some small imperfections but nothing that bothers us.'
    },
    {
      title: 'Satisfied',
      text: 'Good furniture at a fair price. The quality meets our expectations and it fits our space well.'
    }
  ]
};

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateReviewDate(index, totalReviews) {
  const now = new Date();
  const daysToSpread = 365;
  const maxReviewsPerDay = 2;

  const dayIndex = Math.floor(index / maxReviewsPerDay);
  const daysAgo = Math.min(dayIndex, daysToSpread);
  const reviewDate = new Date(now);
  reviewDate.setDate(reviewDate.getDate() - daysAgo);
  reviewDate.setHours(Math.floor(Math.random() * 24));
  reviewDate.setMinutes(Math.floor(Math.random() * 60));

  return reviewDate.toISOString();
}

async function generateReviews() {
  console.log('Fetching active products...');

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name')
    .eq('status', 'active')
    .limit(200);

  if (productsError || !products || products.length === 0) {
    console.error('Error fetching products:', productsError);
    return;
  }

  console.log(`Found ${products.length} active products`);

  const targetReviews = 450;
  const reviews = [];

  console.log(`Generating ${targetReviews} reviews...`);

  for (let i = 0; i < targetReviews; i++) {
    const rating = Math.random() < 0.7 ? 5 : 4;
    const template = getRandomElement(reviewTemplates[rating]);
    const product = getRandomElement(products);
    const reviewer = getRandomElement(dutchNames);
    const reviewDate = generateReviewDate(i, targetReviews);

    const variations = [
      template.text,
      `${template.text} The product arrived well-packaged and in perfect condition.`,
      `${template.text} Customer service was also very helpful.`,
      `${template.text} The quality really stands out.`,
      template.text + ' Great value for money.',
      template.text + ' Fast delivery too!',
      template.text
    ];

    reviews.push({
      product_id: product.id,
      reviewer_name: reviewer,
      rating: rating,
      title: template.title,
      review_text: getRandomElement(variations),
      is_verified_purchase: Math.random() < 0.8,
      is_approved: true,
      helpful_count: Math.floor(Math.random() * 15),
      created_at: reviewDate
    });

    if ((i + 1) % 50 === 0) {
      console.log(`Generated ${i + 1}/${targetReviews} reviews...`);
    }
  }

  reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  console.log('Inserting reviews into database...');

  const batchSize = 50;
  for (let i = 0; i < reviews.length; i += batchSize) {
    const batch = reviews.slice(i, i + batchSize);
    const { error } = await supabase
      .from('product_reviews')
      .insert(batch);

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
    } else {
      console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(reviews.length / batchSize)}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nSuccessfully generated ${reviews.length} reviews!`);

  const { data: stats } = await supabase
    .from('product_reviews')
    .select('rating', { count: 'exact' });

  if (stats) {
    const fiveStars = stats.filter(r => r.rating === 5).length;
    const fourStars = stats.filter(r => r.rating === 4).length;
    console.log(`\nReview distribution:`);
    console.log(`5 stars: ${fiveStars}`);
    console.log(`4 stars: ${fourStars}`);
  }
}

generateReviews()
  .then(() => {
    console.log('\nReview generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
