const fs = require('fs');
const catalogBeds = require('./complete-bed-catalog.json');

const mapping = {
  "BED-MNM-0041": "Кровать Босс Дрим 160*200 Про Велюр Роял агат",
  "BED-MNM-0042": "Кровать Босс Дрим 160*200 Про Велюр Royal топаз NEW",
  "BED-MNM-0043": "Кровать Босс Дрим 160*200 Про Велюр Роял тауп",
  "BED-MNM-0044": "Кровать Босс Дрим 160*200 Про Велюр Royal пион NEW",
  "BED-MNM-0045": "Кровать Босс Дрим 160*200 Про Велюр Royal шампань NEW",
  "BED-MNM-0046": "Кровать Фрея 160*200 Слим MONOLIT Латте",
  "BED-MNM-0047": "Кровать Фрея 160*200 Слим MONOLIT Сталь",
  "BED-MNM-0048": "Кровать Фрея 160*200 с ПМ MONOLIT Серая",
  "BED-MNM-0049": "Кровать Фрея 160*200 с ПМ MONOLIT Сталь",
  "BED-MNM-0050": "Кровать Белла 160*200 велюр Monolit мокко",
  "BED-MNM-0051": "Кровать Белла 140*200 велюр Monolit мокко",
  "BED-MNM-0052": "Кровать Белла 140*200 с ПМ велюр Monolit мокко",
  "BED-MNM-0053": "Кровать Босс 140*200 Про велюр Monolit латте",
  "BED-MNM-0054": "Кровать Босс 140*200 Про велюр Monolit серая",
  "BED-MNM-0055": "Кровать Босс 140*200 Про велюр Monolit сталь",
  "BED-MNM-0056": "Кровать Босс 160*200 Про велюр Monolit серая",
  "BED-MNM-0057": "Кровать Босс 180*200 Про велюр Monolit мокко",
  "BED-MNM-0058": "Кровать Босс 180*200 Про велюр Monolit сталь",
  "BED-MNM-0059": "Кровать BOSS mini NEW велюр Monolit лаванда",
  "BED-MNM-0060": "Кровать BOSS mini NEW велюр Monolit серая",
  "BED-MNM-0061": "Кровать BOSS mini NEW велюр Monolit латте",
  "BED-MNM-0062": "Кровать РОНДА 160*200 велюр MONOLIT серая",
  "BED-MNM-0063": "Кровать РОНДА 160*200 велюр MONOLIT сталь"
};

const placeholderImages = {
  "BED-MNM-0046": "https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg",
  "BED-MNM-0047": "https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg",
  "BED-MNM-0048": "https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg",
  "BED-MNM-0049": "https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg",
  "BED-MNM-0050": "https://mnogomebeli.com/upload/iblock/553/hxh39lepql1rcp1275bfu4drnlshwy20/krovat_bella_41.jpg",
  "BED-MNM-0051": "https://mnogomebeli.com/upload/iblock/219/i9c427rqzvnptaleqyi3vmgzc7qlo0wz/krovat_bella_35.jpg",
  "BED-MNM-0052": "https://mnogomebeli.com/upload/iblock/9f3/v1ahqpdhqa0yso0ujg64kgoghqeso547/krovat_bella_140_15.jpg",
  "BED-MNM-0053": "https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg",
  "BED-MNM-0054": "https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg",
  "BED-MNM-0055": "https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg",
  "BED-MNM-0056": "https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg",
  "BED-MNM-0057": "https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg",
  "BED-MNM-0058": "https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg",
  "BED-MNM-0059": "https://mnogomebeli.com/upload/iblock/72a/9nkkl5gafttaii0leg2oirt6wexq4jeu/krovat-BOSS-Kid-_-3.jpg",
  "BED-MNM-0060": "https://mnogomebeli.com/upload/iblock/72a/9nkkl5gafttaii0leg2oirt6wexq4jeu/krovat-BOSS-Kid-_-3.jpg",
  "BED-MNM-0061": "https://mnogomebeli.com/upload/iblock/72a/9nkkl5gafttaii0leg2oirt6wexq4jeu/krovat-BOSS-Kid-_-3.jpg",
  "BED-MNM-0062": "https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg",
  "BED-MNM-0063": "https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg"
};

const finalMapping = [];

for (const [sku, russianName] of Object.entries(mapping)) {
  const catalogBed = catalogBeds.find(cb =>
    cb.russianName.toLowerCase() === russianName.toLowerCase()
  );

  if (catalogBed) {
    console.log(`✓ ${sku}: Found exact match`);
    console.log(`  ${catalogBed.imageUrl}\n`);
    finalMapping.push({
      sku,
      images: [catalogBed.imageUrl]
    });
  } else if (placeholderImages[sku]) {
    console.log(`⚠ ${sku}: Using placeholder image`);
    console.log(`  ${placeholderImages[sku]}\n`);
    finalMapping.push({
      sku,
      images: [placeholderImages[sku]]
    });
  } else {
    console.log(`✗ ${sku}: No image found\n`);
  }
}

fs.writeFileSync('final-correct-mapping-41-63.json', JSON.stringify(finalMapping, null, 2));
console.log(`\n✓ Created mapping for ${finalMapping.length}/23 beds`);
