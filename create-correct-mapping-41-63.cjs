const fs = require('fs');

const catalogBeds = require('./complete-bed-catalog.json');

const dbBeds = [
  { sku: "BED-MNM-0041", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal агат" },
  { sku: "BED-MNM-0042", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal топаз NEW" },
  { sku: "BED-MNM-0043", original_name: "Кровать Босс Дрим 160*200 Про Велюр Роял тауп" },
  { sku: "BED-MNM-0044", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal пион NEW" },
  { sku: "BED-MNM-0045", original_name: "Кровать Босс Дрим 160*200 Про Велюр Royal шампань NEW" },
  { sku: "BED-MNM-0046", original_name: "Кровать Фрея 160*200 Слим MONOLIT Латте" },
  { sku: "BED-MNM-0047", original_name: "Кровать Фрея 160*200 Слим MONOLIT Сталь" },
  { sku: "BED-MNM-0048", original_name: "Кровать Фрея 160*200 с ПМ MONOLIT Серая" },
  { sku: "BED-MNM-0049", original_name: "Кровать Фрея 160*200 с ПМ MONOLIT Сталь" },
  { sku: "BED-MNM-0050", original_name: "Кровать Белла 160*200 велюр Monolit мокко" },
  { sku: "BED-MNM-0051", original_name: "Кровать Белла 140*200 велюр Monolit мокко" },
  { sku: "BED-MNM-0052", original_name: "Кровать Белла 140*200 с ПМ велюр Monolit мокко" },
  { sku: "BED-MNM-0053", original_name: "Кровать Босс 140*200 Про велюр Monolit латте" },
  { sku: "BED-MNM-0054", original_name: "Кровать Босс 140*200 Про велюр Monolit серая" },
  { sku: "BED-MNM-0055", original_name: "Кровать Босс 140*200 Про велюр Monolit сталь" },
  { sku: "BED-MNM-0056", original_name: "Кровать Босс 160*200 Про велюр Monolit серая" },
  { sku: "BED-MNM-0057", original_name: "Кровать Босс 180*200 Про велюр Monolit мокко" },
  { sku: "BED-MNM-0058", original_name: "Кровать Босс 180*200 Про велюр Monolit сталь" },
  { sku: "BED-MNM-0059", original_name: "Кровать BOSS mini NEW велюр Monolit лаванда" },
  { sku: "BED-MNM-0060", original_name: "Кровать BOSS mini NEW велюр Monolit серая" },
  { sku: "BED-MNM-0061", original_name: "Кровать BOSS mini NEW велюр Monolit латте" },
  { sku: "BED-MNM-0062", original_name: "Кровать РОНДА 160*200 велюр MONOLIT серая" },
  { sku: "BED-MNM-0063", original_name: "Кровать РОНДА 160*200 велюр MONOLIT сталь" }
];

function normalizeRussianName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/ё/g, 'е')
    .trim();
}

const mapping = [];
const unmatchedBeds = [];

for (const dbBed of dbBeds) {
  const normalizedDbName = normalizeRussianName(dbBed.original_name);

  const catalogBed = catalogBeds.find(cb => {
    const normalizedCatalogName = normalizeRussianName(cb.russianName);
    return normalizedCatalogName === normalizedDbName;
  });

  if (catalogBed) {
    console.log(`✓ Matched ${dbBed.sku}: ${dbBed.original_name}`);
    console.log(`  Image: ${catalogBed.imageUrl}\n`);

    mapping.push({
      sku: dbBed.sku,
      images: [catalogBed.imageUrl]
    });
  } else {
    console.log(`✗ No match for ${dbBed.sku}: ${dbBed.original_name}\n`);
    unmatchedBeds.push(dbBed);
  }
}

fs.writeFileSync('corrected-mapping-41-63.json', JSON.stringify(mapping, null, 2));
console.log(`\n✓ Created mapping for ${mapping.length} beds`);
console.log(`✗ Unmatched beds: ${unmatchedBeds.length}`);

if (unmatchedBeds.length > 0) {
  console.log('\nUnmatched beds:');
  unmatchedBeds.forEach(bed => {
    console.log(`  - ${bed.sku}: ${bed.original_name}`);
  });

  console.log('\nAttempting fuzzy matching for unmatched beds...\n');

  for (const unmatchedBed of unmatchedBeds) {
    const keywords = unmatchedBed.original_name
      .toLowerCase()
      .match(/(?:босс|белла|лофт|ронда|фрея|уна|лео)|(?:\d+\*\d+)|(?:латте|серая|сталь|мокко|лаванда)/gi);

    if (keywords) {
      console.log(`Searching for ${unmatchedBed.sku} using keywords: ${keywords.join(', ')}`);

      const candidates = catalogBeds.filter(cb => {
        const lowerName = cb.russianName.toLowerCase();
        return keywords.every(kw => lowerName.includes(kw.toLowerCase()));
      });

      if (candidates.length > 0) {
        console.log(`  Found ${candidates.length} candidates:`);
        candidates.forEach((c, i) => {
          console.log(`    ${i + 1}. ${c.russianName}`);
          console.log(`       ${c.imageUrl}`);
        });
        console.log('');
      }
    }
  }
}
