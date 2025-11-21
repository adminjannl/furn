const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('missing-sofas.json', 'utf8'));

// Group by base name (without color/fabric details)
const baseNames = {};
missing.forEach(p => {
  const base = p.title
    .replace(/(велюр|Велюр|шенилл|Шенилл|Вельвет|рогожка)\s+[A-Za-zА-Яа-я]+\s+[а-яА-Я]+$/i, '')
    .trim();

  if (!baseNames[base]) baseNames[base] = [];
  baseNames[base].push(p.title);
});

console.log('Analysis of 140 missing products:\n');
console.log('Total unique base products:', Object.keys(baseNames).length);
console.log('\nProducts with multiple variants:');
Object.entries(baseNames)
  .filter(([_, variants]) => variants.length > 1)
  .slice(0, 10)
  .forEach(([base, variants]) => {
    console.log('\n' + base + ':');
    variants.slice(0, 3).forEach(v => console.log('  -', v));
    if (variants.length > 3) console.log('  ... and', variants.length - 3, 'more');
  });
