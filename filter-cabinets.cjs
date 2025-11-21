const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./cabinets-scraped-complete.json', 'utf8'));

// Remove Idea cabinets
const filtered = data.filter(c => !c.russianName.includes('Идея'));

console.log('Total scraped:', data.length);
console.log('Idea cabinets to remove:', data.length - filtered.length);
console.log('After filtering:', filtered.length);
console.log('\nFiltered cabinets saved to cabinets-scraped-no-idea.json');

fs.writeFileSync('./cabinets-scraped-no-idea.json', JSON.stringify(filtered, null, 2));
