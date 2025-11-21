const fs = require('fs');

const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped.json', 'utf8'));

// Group cabinets by base model (removing color/finish from name)
const groups = {};

cabinets.forEach(cabinet => {
  // Extract base model name by removing color finishes
  let baseName = cabinet.russianName
    .replace(/Кашемир.*$/i, '')
    .replace(/Белый.*$/i, '')
    .replace(/Орех Селект.*$/i, '')
    .replace(/Шиншилла.*$/i, '')
    .trim();

  // Extract English name from URL
  const urlParts = cabinet.url.split('/');
  const slug = urlParts[urlParts.length - 2].replace(/^!/, '');

  // Extract color/finish
  let finish = 'Unknown';
  if (cabinet.russianName.match(/Кашемир/i)) finish = 'Cashmere';
  else if (cabinet.russianName.match(/Белый/i)) finish = 'White';
  else if (cabinet.russianName.match(/Орех Селект/i)) finish = 'Walnut Select';
  else if (cabinet.russianName.match(/Шиншилла/i)) finish = 'Chinchilla';

  if (!groups[baseName]) {
    groups[baseName] = {
      baseName: baseName,
      variants: []
    };
  }

  groups[baseName].variants.push({
    finish: finish,
    fullName: cabinet.russianName,
    url: cabinet.url,
    imageUrl: cabinet.imageUrl
  });
});

// Print analysis
console.log('📊 Cabinet Groups Analysis:\n');
console.log(`Total unique items: ${cabinets.length}`);
console.log(`Base models: ${Object.keys(groups).length}\n`);

Object.keys(groups).sort().forEach(key => {
  const group = groups[key];
  console.log(`${group.baseName}`);
  console.log(`  Variants: ${group.variants.length}`);
  group.variants.forEach(v => {
    console.log(`    - ${v.finish}`);
  });
  console.log('');
});

// Save organized data
fs.writeFileSync('./cabinets-organized.json', JSON.stringify(groups, null, 2));
console.log('💾 Saved organized data to cabinets-organized.json');
