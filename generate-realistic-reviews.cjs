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

const personalContexts = [
  "Bought this for my daughter's new apartment and she absolutely loves it!",
  "We're replacing our 10-year-old furniture and this is such an upgrade.",
  "Just moved into our new home and needed quality furniture.",
  "Got this for our guest bedroom and couldn't be happier.",
  "Perfect addition to our home office renovation.",
  "My wife picked this out and I have to admit she was right!",
  "Bought this as a gift for my son who just graduated.",
  "We downsized to a smaller place and this fits perfectly.",
  "Replacing furniture from our old apartment, much better quality.",
  "First major furniture purchase for our new house."
];

const roomMentions = [
  "living room", "bedroom", "master bedroom", "guest room", "home office",
  "dining room", "kids room", "apartment", "studio", "family room"
];

const sizeMentions = [
  "fits perfectly in our small apartment",
  "larger than expected but in a good way",
  "perfect size for our space",
  "exactly the dimensions we needed",
  "bigger than it looked online",
  "compact enough for our room",
  "spacious without being too bulky",
  "ideal for small spaces"
];

const seasonalMentions = [
  "Perfect timing for our spring renovation",
  "Arrived just before Christmas, great timing",
  "Part of our summer home makeover",
  "Got it during the sale, excellent deal",
  "Bought during Black Friday",
  "New year, new furniture!",
  "Spring cleaning led us to this purchase"
];

const comparisonMentions = [
  "Much better than our IKEA piece",
  "Real upgrade from our old furniture",
  "Way better quality than what we had before",
  "Comparable to much more expensive brands",
  "Better than furniture from other stores we checked",
  "Reminds me of furniture I saw in high-end stores",
  "Similar to pieces that cost twice as much elsewhere"
];

function addTypos(text) {
  if (Math.random() < 0.15) {
    const typoVariations = [
      { from: "can't", to: "cant" },
      { from: "would have", to: "would of" },
      { from: "could have", to: "could of" },
      { from: "definitely", to: "definately" },
      { from: "really", to: "realy" },
      { from: "recommend", to: "recomend" }
    ];

    const variation = typoVariations[Math.floor(Math.random() * typoVariations.length)];
    text = text.replace(variation.from, variation.to);
  }
  return text;
}

function enhanceReview(text, rating, productData) {
  let enhanced = text;

  const shouldAddContext = Math.random() < 0.6;
  if (shouldAddContext) {
    if (Math.random() < 0.3 && personalContexts.length > 0) {
      const context = personalContexts[Math.floor(Math.random() * personalContexts.length)];
      enhanced = context + " " + enhanced;
    }

    if (Math.random() < 0.4) {
      const room = roomMentions[Math.floor(Math.random() * roomMentions.length)];
      enhanced = enhanced.replace(/in our (home|room|space)/, `in our ${room}`);
      if (!enhanced.includes(room)) {
        enhanced = enhanced + ` Looks great in our ${room}.`;
      }
    }

    if (Math.random() < 0.25) {
      const size = sizeMentions[Math.floor(Math.random() * sizeMentions.length)];
      enhanced = enhanced + ` ${size.charAt(0).toUpperCase() + size.slice(1)}.`;
    }
  }

  if (Math.random() < 0.2) {
    const seasonal = seasonalMentions[Math.floor(Math.random() * seasonalMentions.length)];
    enhanced = enhanced + ` ${seasonal}.`;
  }

  if (rating >= 4 && Math.random() < 0.3) {
    const comparison = comparisonMentions[Math.floor(Math.random() * comparisonMentions.length)];
    enhanced = enhanced + ` ${comparison}.`;
  }

  if (productData) {
    const categoryFeatures = getCategoryFeatures(productData.category_name);
    if (categoryFeatures.length > 0 && Math.random() < 0.5) {
      const feature = categoryFeatures[Math.floor(Math.random() * categoryFeatures.length)];
      enhanced = enhanced + ` ${feature}.`;
    }

    if (productData.name && Math.random() < 0.4) {
      const materials = ['oak', 'walnut', 'beech', 'pine'];
      const foundMaterial = materials.find(m => productData.name.toLowerCase().includes(m));
      if (foundMaterial) {
        enhanced = enhanced.replace(/The quality/i, `The ${foundMaterial} finish is beautiful and the quality`);
      }
    }
  }

  enhanced = addTypos(enhanced);

  return enhanced;
}

function getCategoryFeatures(categoryName) {
  if (!categoryName) return [];

  const category = categoryName.toLowerCase();

  if (category.includes('sofa') || category.includes('couch')) {
    return [
      "The cushions are comfortable and supportive",
      "Love how firm the seating is",
      "The fabric feels premium",
      "Plenty of seating space",
      "The arms are the perfect height",
      "Really comfortable for long sitting"
    ];
  }

  if (category.includes('bed')) {
    return [
      "The headboard is sturdy",
      "Assembly was straightforward",
      "Very solid frame, no squeaking",
      "The storage space underneath is useful",
      "Looks elegant in the bedroom",
      "Mattress fits perfectly"
    ];
  }

  if (category.includes('cabinet') || category.includes('wardrobe') || category.includes('shkaf')) {
    return [
      "The doors close smoothly",
      "Plenty of storage space inside",
      "Shelves are adjustable which is great",
      "Very sturdy construction",
      "The finish is beautiful",
      "Drawers slide smoothly"
    ];
  }

  if (category.includes('table')) {
    return [
      "The surface is smooth and easy to clean",
      "Very stable, no wobbling",
      "Perfect height for our chairs",
      "The legs are solid and well-made",
      "Great size for our needs"
    ];
  }

  if (category.includes('chair')) {
    return [
      "Very comfortable to sit in",
      "Good back support",
      "The padding is just right",
      "Sturdy construction",
      "Easy to move around"
    ];
  }

  return [];
}

const companyResponses = {
  1: {
    en: [
      "We sincerely apologize for your experience. This is not the standard we hold ourselves to. Please contact our customer service team immediately at service@hartsfurniture.com so we can make this right. We'd like to offer a full refund or replacement.",
      "We're truly sorry to hear about these issues. Your satisfaction is our priority, and we failed to meet that. Please reach out to us directly so we can resolve this immediately. We want to turn this around for you."
    ],
    nl: [
      "Onze oprechte excuses voor uw ervaring. Dit is niet de standaard die wij nastreven. Neem direct contact op met onze klantenservice zodat we dit kunnen rechtzetten.",
      "Het spijt ons zeer dit te horen. Uw tevredenheid is onze prioriteit. Neem direct contact met ons op zodat we dit kunnen oplossen."
    ],
    de: [
      "Wir entschuldigen uns aufrichtig für Ihre Erfahrung. Das entspricht nicht unserem Standard. Bitte kontaktieren Sie sofort unseren Kundenservice, damit wir dies korrigieren können.",
      "Es tut uns sehr leid, dies zu hören. Ihre Zufriedenheit ist unsere Priorität. Bitte kontaktieren Sie uns direkt, damit wir dies sofort lösen können."
    ],
    fr: [
      "Nous nous excusons sincèrement pour votre expérience. Ce n'est pas la norme que nous nous fixons. Veuillez contacter immédiatement notre service client pour que nous puissions arranger cela.",
      "Nous sommes vraiment désolés d'entendre cela. Votre satisfaction est notre priorité. Veuillez nous contacter directement pour que nous puissions résoudre cela immédiatement."
    ]
  },
  2: {
    en: [
      "Thank you for your feedback. We're disappointed we didn't meet your expectations. Please contact us at service@hartsfurniture.com so we can discuss how to improve your experience with us.",
      "We appreciate your honest review and apologize for the issues you've encountered. We'd like to speak with you directly to find a solution. Please reach out to our customer service team."
    ],
    nl: [
      "Bedankt voor uw feedback. We zijn teleurgesteld dat we uw verwachtingen niet hebben waargemaakt. Neem contact met ons op zodat we uw ervaring kunnen verbeteren.",
      "We waarderen uw eerlijke review en bieden onze excuses aan voor de problemen. We willen graag direct met u in gesprek om een oplossing te vinden."
    ],
    de: [
      "Danke für Ihr Feedback. Es tut uns leid, dass wir Ihre Erwartungen nicht erfüllt haben. Bitte kontaktieren Sie uns, damit wir Ihre Erfahrung verbessern können.",
      "Wir schätzen Ihre ehrliche Bewertung und entschuldigen uns für die Probleme. Wir möchten direkt mit Ihnen sprechen, um eine Lösung zu finden."
    ],
    fr: [
      "Merci pour votre retour. Nous sommes déçus de ne pas avoir répondu à vos attentes. Contactez-nous pour que nous puissions améliorer votre expérience.",
      "Nous apprécions votre avis honnête et nous excusons pour les problèmes rencontrés. Nous aimerions vous parler directement pour trouver une solution."
    ]
  },
  3: {
    en: [
      "Thank you for your honest feedback! We're sorry about the delivery delay. We've been working hard to improve our scheduling process. If you have any concerns, please contact our customer service team.",
      "We appreciate you sharing your experience. We're glad the furniture is working well for you, and we apologize for the inconvenience. We're continuously improving our service."
    ],
    nl: [
      "Bedankt voor uw eerlijke feedback! Het spijt ons van de vertraging. We werken hard aan het verbeteren van ons proces. Neem gerust contact op als u vragen heeft.",
      "We waarderen dat u uw ervaring deelt. Fijn dat het meubel goed bevalt, en onze excuses voor het ongemak. We blijven onze service verbeteren."
    ],
    de: [
      "Danke für Ihr ehrliches Feedback! Die Lieferverzögerung tut uns leid. Wir arbeiten hart daran, unseren Prozess zu verbessern. Bei Fragen kontaktieren Sie uns gerne.",
      "Wir schätzen, dass Sie Ihre Erfahrung teilen. Schön, dass das Möbel gut passt, und Entschuldigung für die Unannehmlichkeiten."
    ],
    fr: [
      "Merci pour votre retour honnête ! Nous sommes désolés du retard de livraison. Nous travaillons dur pour améliorer notre processus. N'hésitez pas à nous contacter.",
      "Nous apprécions que vous partagiez votre expérience. Nous sommes heureux que le meuble vous convienne et nous excusons pour le désagrément."
    ]
  },
  4: {
    en: [
      "Thank you for your positive review! We're thrilled you're happy with your purchase. If you need anything, our team is always here to help!",
      "We really appreciate your feedback! It's wonderful to hear you're enjoying your new furniture. Thank you for choosing Harts Furniture!"
    ],
    nl: [
      "Bedankt voor uw positieve review! We zijn blij dat u tevreden bent. Als u iets nodig heeft, staat ons team altijd voor u klaar!",
      "We waarderen uw feedback enorm! Fijn om te horen dat u van uw nieuwe meubel geniet. Bedankt voor het kiezen van Harts Furniture!"
    ],
    de: [
      "Vielen Dank für Ihre positive Bewertung! Wir freuen uns, dass Sie zufrieden sind. Bei Fragen steht unser Team immer zur Verfügung!",
      "Wir schätzen Ihr Feedback sehr! Schön zu hören, dass Sie Ihre neuen Möbel genießen. Danke, dass Sie Harts Furniture gewählt haben!"
    ],
    fr: [
      "Merci pour votre avis positif ! Nous sommes ravis que vous soyez satisfait. Si vous avez besoin de quoi que ce soit, notre équipe est là !",
      "Nous apprécions vraiment votre retour ! C'est merveilleux d'entendre que vous appréciez vos nouveaux meubles. Merci d'avoir choisi Harts Furniture !"
    ]
  },
  5: {
    en: [
      "Wow, thank you for this amazing review! We're thrilled that you love your new furniture. Your kind words mean the world to our team!",
      "Thank you for choosing Harts Furniture! We're delighted everything exceeded your expectations. Reviews like yours make our day!"
    ],
    nl: [
      "Wow, bedankt voor deze geweldige review! We zijn zo blij dat u van uw nieuwe meubel houdt. Uw mooie woorden betekenen veel voor ons team!",
      "Bedankt dat u voor Harts Furniture koos! We zijn verheugd dat alles uw verwachtingen overtrof. Reviews zoals deze maken onze dag!"
    ],
    de: [
      "Wow, vielen Dank für diese großartige Bewertung! Wir freuen uns sehr, dass Sie Ihre neuen Möbel lieben. Ihre netten Worte bedeuten unserem Team die Welt!",
      "Danke, dass Sie Harts Furniture gewählt haben! Wir freuen uns, dass alles Ihre Erwartungen übertroffen hat. Bewertungen wie Ihre machen unseren Tag!"
    ],
    fr: [
      "Wow, merci pour cet avis incroyable ! Nous sommes ravis que vous aimiez vos nouveaux meubles. Vos mots gentils signifient beaucoup pour notre équipe !",
      "Merci d'avoir choisi Harts Furniture ! Nous sommes ravis que tout ait dépassé vos attentes. Des avis comme le vôtre illuminent notre journée !"
    ]
  }
};

const reviewTemplates = {
  5: {
    short: [
      { title: 'Perfect!', text: 'Absolutely love it!' },
      { title: 'Excellent!', text: 'Best furniture I\'ve ever purchased.' },
      { title: 'Amazing quality', text: 'Exceeded my expectations completely.' },
      { title: 'So happy!', text: 'This is exactly what I was looking for.' },
      { title: 'Beautiful', text: 'Looks stunning in our home!' },
      { title: 'Love it!', text: 'Can\'t believe how good this is.' },
      { title: 'Highly recommend', text: 'Great quality for the price.' },
      { title: 'Great purchase!', text: 'Love it, though delivery took a bit longer than expected.' },
      { title: 'Very happy overall', text: 'Beautiful furniture! Wish the assembly instructions were clearer but figured it out.' }
    ],
    medium: [
      {
        title: 'Excellent quality!',
        text: 'Absolutely love this furniture! The quality is outstanding and it looks even better than in the pictures. Very happy with my purchase.'
      },
      {
        title: 'Perfect addition to our home',
        text: 'This piece fits perfectly. The craftsmanship is superb and the delivery was smooth. Highly recommend!'
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
        title: 'Great value',
        text: 'Really impressed with the quality. Delivery was on time and everything arrived well packaged. Couldn\'t be happier.'
      },
      {
        title: 'Love it but...',
        text: 'The furniture is absolutely beautiful and the quality is top-notch. Only minor complaint is the delivery took 3 weeks instead of 2, but totally worth the wait. I saw similar pieces at other stores for twice the price!'
      },
      {
        title: 'Nearly perfect',
        text: 'Gorgeous furniture that exceeded my expectations. The only reason it\'s not completely perfect is the assembly took longer than expected. But the end result is stunning and the price was better than competitors.'
      }
    ],
    long: [
      {
        title: 'Worth every euro',
        text: 'Premium quality furniture that justifies the price. The materials are top-notch and the finish is flawless. We spent weeks researching different furniture stores and brands, and I\'m so glad we chose Harts Furniture. The customer service team was incredibly helpful in answering all our questions before purchase. When the furniture arrived, it was packaged so well that there wasn\'t a single scratch. Assembly was straightforward with clear instructions. Now that it\'s in our home, we receive compliments from every guest who visits.'
      },
      {
        title: 'Exceeded all expectations',
        text: 'I was already excited about this purchase, but it exceeded all my expectations. The quality and design are simply perfect. We\'ve been looking for quality furniture for months and visited many showrooms. The moment I saw this piece on the website, I knew it was the one. The ordering process was smooth, and the delivery team was professional and careful. The furniture looks even more beautiful in person than in the photos. The craftsmanship is exceptional - you can see the attention to detail in every joint and finish.'
      },
      {
        title: 'Outstanding in every way',
        text: 'This furniture piece has completely transformed our space. The quality is exceptional and it\'s incredibly comfortable. From the initial browsing experience on the website to the final delivery, everything was handled professionally. The photos on the website are accurate, but seeing it in person is even better. The color is rich and beautiful, the materials feel premium, and the construction is solid. We had a few questions during the ordering process, and the customer service team was patient and knowledgeable.'
      }
    ]
  },
  4: {
    short: [
      { title: 'Good quality', text: 'Happy with my purchase.' },
      { title: 'Nice furniture', text: 'Good value for money.' },
      { title: 'Satisfied', text: 'Looks nice, assembly was easy.' },
      { title: 'Pretty good', text: 'Would recommend to others.' },
      { title: 'Good purchase', text: 'Does what it should.' }
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
        text: 'Nice piece of furniture that fits well in our space. The quality is good, though assembly took some time.'
      },
      {
        title: 'Solid purchase',
        text: 'Very pleased with the quality and design. It\'s comfortable and looks great. Delivery was slightly delayed but they kept me informed.'
      },
      {
        title: 'Good overall',
        text: 'Nice furniture for the price. The delivery window was a bit vague which was inconvenient but the product itself is great.'
      }
    ],
    long: [
      {
        title: 'Good value overall',
        text: 'Quality product for the price. Looks good in our home and seems durable. Assembly instructions could have been clearer, but we managed to figure it out. The furniture itself is well-made and looks nice. The color matches the website photos accurately. Delivery was on schedule, though the delivery team was a bit rushed. Overall, we\'re satisfied with the purchase and would consider buying from Harts Furniture again. It fits well in our space and serves its purpose perfectly.'
      },
      {
        title: 'Nice addition to our home',
        text: 'Happy with this furniture piece. It\'s well-made and looks good. The ordering process was straightforward, and customer service answered my questions quickly. Delivery took about two weeks, which was within the estimated timeframe though I wish it had been sooner. Assembly took a couple of hours - it would have been faster with two people. The quality is good for the price point. It\'s comfortable and functional, and we use it daily. Overall, a solid purchase that we\'re happy with.'
      },
      {
        title: 'Satisfied with purchase',
        text: 'Good quality furniture that meets our needs. The website photos were accurate and the product arrived as described. Had a small issue with the delivery scheduling - they called the day before to confirm but the time window was quite wide which meant waiting around. However, the delivery team was professional when they arrived. The furniture is solid and looks nice. Assembly wasn\'t too complicated though some parts were heavier than expected. Would recommend having two people for assembly. Overall happy with the purchase.'
      }
    ]
  },
  3: {
    short: [
      { title: 'Okay', text: 'It\'s fine, nothing special.' },
      { title: 'Average', text: 'Does the job but expected better quality.' },
      { title: 'Mixed feelings', text: 'Some good points, some not so good.' },
      { title: 'Decent', text: 'Acceptable for the price I guess.' }
    ],
    medium: [
      {
        title: 'Decent but not perfect',
        text: 'The furniture looks nice but the quality isn\'t quite what I expected for the price. It serves its purpose but I\'m not wowed by it. Delivery took longer than originally quoted.'
      },
      {
        title: 'Average quality',
        text: 'It\'s okay for the price. The color is slightly different from the photos online. Took longer to assemble than expected. It works fine but I probably would have chosen something else if I could do it again.'
      },
      {
        title: 'Could be better',
        text: 'The furniture is functional but the materials feel cheaper than I expected. Customer service was helpful when I had questions. Delivery was delayed by a week which was frustrating.'
      },
      {
        title: 'Not what I expected',
        text: 'It\'s alright but doesn\'t feel as premium as the price suggested. The delivery communication could have been better - I had to call to find out when it would arrive. Product itself works but feels a bit lightweight.'
      }
    ],
    long: [
      {
        title: 'Mixed experience',
        text: 'I have mixed feelings about this purchase. On the positive side, the furniture looks nice and fits well in our space. The color is pretty close to what was shown online. However, the quality isn\'t quite what I expected based on the price and description. The delivery experience wasn\'t great - the original delivery date was postponed and the communication about the delay could have been better. I had to call customer service to find out what was happening, though they were helpful once I got through. Assembly wasn\'t as straightforward as it could have been. After using it for a few weeks, it\'s holding up okay and serves its purpose. It looks acceptable and does the job, but I think there might be better options available for the same price range.'
      },
      {
        title: 'Acceptable but not amazing',
        text: 'This furniture is okay overall. The design looks nice in photos and it fits our space well. However, there were some issues with the delivery process - the delivery window was quite vague and they arrived later than expected. The packaging was a bit damaged when it arrived which was concerning, though the furniture inside was fine. Customer service was responsive when I contacted them about the delay. The quality is decent for everyday use but doesn\'t feel as premium as I hoped. Assembly was more time-consuming than anticipated and the instructions weren\'t the clearest. It\'s functional and looks alright, so it serves its purpose, but my expectations were higher based on the website description and price point.'
      }
    ]
  }
};

const fs = require('fs');
const multilingualTemplates = JSON.parse(fs.readFileSync('./multilingual-review-templates.json', 'utf8'));

async function generateReviews() {
  console.log('Starting enhanced multilingual review generation...');

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, categories(name)')
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

  console.log(`Generating ${reviewDates.length} enhanced reviews...`);

  const languages = ['en', 'nl', 'de', 'fr'];
  const languageWeights = { en: 0.40, nl: 0.35, de: 0.15, fr: 0.10 };

  for (let i = 0; i < reviewDates.length; i++) {
    const rand = Math.random();
    let rating;
    if (rand < 0.58) {
      rating = 5;
    } else if (rand < 0.82) {
      rating = 4;
    } else if (rand < 0.94) {
      rating = 3;
    } else if (rand < 0.98) {
      rating = 2;
    } else {
      rating = 1;
    }

    const langRand = Math.random();
    let language;
    if (langRand < 0.40) {
      language = 'en';
    } else if (langRand < 0.75) {
      language = 'nl';
    } else if (langRand < 0.90) {
      language = 'de';
    } else {
      language = 'fr';
    }

    const ratingKey = `${rating}_star`;
    const multilingualOptions = multilingualTemplates[ratingKey][language];
    const template = multilingualOptions[Math.floor(Math.random() * multilingualOptions.length)];

    const product = products[Math.floor(Math.random() * products.length)];

    const productData = {
      name: product.name,
      category_name: product.categories?.name
    };

    const enhancedText = template.text;

    const daysSinceReview = Math.floor((now - reviewDates[i]) / (1000 * 60 * 60 * 24));
    let helpfulCount = 0;

    if (daysSinceReview > 30) {
      if (rating === 5 || rating === 3 || rating === 1) {
        helpfulCount = Math.floor(Math.random() * 20) + 5;
      } else {
        helpfulCount = Math.floor(Math.random() * 10) + 2;
      }

      if (template.text.length > 200) {
        helpfulCount = Math.floor(helpfulCount * 1.5);
      }
    } else if (daysSinceReview > 7) {
      helpfulCount = Math.floor(Math.random() * 8);
    } else {
      helpfulCount = Math.floor(Math.random() * 3);
    }

    let companyResponse = null;
    let companyResponseDate = null;

    const shouldHaveResponse =
      (rating === 1 && Math.random() < 0.95) ||
      (rating === 2 && Math.random() < 0.85) ||
      (rating === 3 && Math.random() < 0.70) ||
      (rating === 4 && Math.random() < 0.15) ||
      (rating === 5 && Math.random() < 0.05);

    if (shouldHaveResponse && daysSinceReview > 3) {
      const responses = companyResponses[rating][language];
      companyResponse = responses[Math.floor(Math.random() * responses.length)];

      const responseDate = new Date(reviewDates[i]);
      responseDate.setDate(responseDate.getDate() + Math.floor(Math.random() * 5) + 1);
      companyResponseDate = responseDate.toISOString();
    }

    reviews.push({
      product_id: product.id,
      order_id: null,
      order_number: generateOrderNumber(),
      user_id: null,
      rating,
      title: template.title,
      review_text: enhancedText,
      helpful_count: helpfulCount,
      is_verified_purchase: false,
      is_approved: true,
      company_response: companyResponse,
      company_response_date: companyResponseDate,
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
    short: reviews.filter(r => r.review_text.length < 150).length,
    medium: reviews.filter(r => r.review_text.length >= 150 && r.review_text.length < 500).length,
    long: reviews.filter(r => r.review_text.length >= 500).length
  };

  const helpfulStats = {
    total: reviews.reduce((sum, r) => sum + r.helpful_count, 0),
    avg: reviews.reduce((sum, r) => sum + r.helpful_count, 0) / reviews.length,
    max: Math.max(...reviews.map(r => r.helpful_count))
  };

  console.log(`\nRating distribution:`);
  console.log(`- 5 stars: ${ratingCounts[5]} (${((ratingCounts[5]/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- 4 stars: ${ratingCounts[4]} (${((ratingCounts[4]/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- 3 stars: ${ratingCounts[3]} (${((ratingCounts[3]/reviews.length)*100).toFixed(1)}%)`);
  console.log(`\nLength distribution:`);
  console.log(`- Short: ${lengthCounts.short} (${((lengthCounts.short/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- Medium: ${lengthCounts.medium} (${((lengthCounts.medium/reviews.length)*100).toFixed(1)}%)`);
  console.log(`- Long: ${lengthCounts.long} (${((lengthCounts.long/reviews.length)*100).toFixed(1)}%)`);
  console.log(`\nHelpful votes:`);
  console.log(`- Total: ${helpfulStats.total}`);
  console.log(`- Average per review: ${helpfulStats.avg.toFixed(1)}`);
  console.log(`- Maximum: ${helpfulStats.max}`);
}

generateReviews().catch(console.error);
