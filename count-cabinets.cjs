const fs = require('fs');

const complete = JSON.parse(fs.readFileSync('./cabinets-scraped-complete.json', 'utf8'));
const noIdea = complete.filter(p => !p.russianName.includes('Идея'));

console.log('📊 Cabinet Scrape Analysis:');
console.log(`   Total scraped: ${complete.length}`);
console.log(`   Idea series: ${complete.length - noIdea.length}`);
console.log(`   Without Idea: ${noIdea.length}`);
console.log(`   Target from website: 107\n`);

// Analyze unique products
const uniqueNames = new Set(noIdea.map(p => p.russianName));
console.log(`✨ Unique product names: ${uniqueNames.size}\n`);

// Show first 10
console.log('📋 First 10 cabinets (no Idea):');
noIdea.slice(0, 10).forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.russianName}`);
});
