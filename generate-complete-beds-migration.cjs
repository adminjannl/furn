require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const completeInventory = [
  // Existing 40 beds (BED-MNM-0001 to 0040) - will be skipped
  { name: "Кровать Фрея 160*200 с ПМ MONOLIT Латте", price: 26999, url: "/krovati/krovat-freya/krovat-freya-160-200-s-pm/!krovat-freya-160-200-s-pm-monolit-latte/" },
  { name: "Кровать ЛЕО 160 Вельвет CORD серая", price: 19999, url: "/krovati/krovat-leo-160/krovat-leo-160-velvet-cord/!krovat-leo-160-velvet-cord-seraya/" },
  { name: "Кровать ЛЕО 160 Вельвет CORD бежевая", price: 19999, url: "/krovati/krovat-leo-160/krovat-leo-160-velvet-cord/!krovat-leo-160-velvet-cord-bezhevaya/" },
  { name: "Кровать Фрея 160*200 Слим MONOLIT Серая", price: 24999, url: "/krovati/krovat-freya/krovat-freya-160-200-slim/!krovat-freya-160-200-slim-monolit-seraya/" },
  { name: "Кровать NORD Шенилл IQ серая", price: 32999, url: "/krovati/dvuspalnye-krovati/krovat-nord-shenill-iq/!krovat-nord-shenill-iq-seraya/" },
  { name: "Кровать Белла 160*200 велюр Monolit серая", price: 24999, url: "/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-160-200-velyur-monolit-seryy/" },
  { name: "Кровать Босс 160*200 Про велюр Monolit латте", price: 36600, url: "/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-velyur-monolit-latte/" },
  { name: "Кровать Босс 160*200 Про велюр Monolit мокко", price: 36600, url: "/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-160-200-pro-velyur-monolit-mokko/" },
  { name: "Кровать Босс 160*200 Про велюр Monolit сталь", price: 36600, url: "/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-160-velyur-monolit-stal/" },
  { name: "Кровать Белла 160*200 велюр Monolit латте", price: 24999, url: "/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-160-200-velyur-monolit-latte/" },

  // Missing Boss Dream variants (found 7 total, have 2)
  { name: "Кровать Босс Дрим 160*200 Про Велюр Royal агат", price: 52600, url: "/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-agat/" },
  { name: "Кровать Босс Дрим 160*200 Про Велюр Royal топаз NEW", price: 52600, url: "/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-topaz/" },
  { name: "Кровать Босс Дрим 160*200 Про Велюр Роял тауп", price: 39700, url: "/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-taup/" },
  { name: "Кровать Босс Дрим 160*200 Про Велюр Royal пион NEW", price: 52600, url: "/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-pion/" },
  { name: "Кровать Босс Дрим 160*200 Про Велюр Royal шампань NEW", price: 52600, url: "/krovati/krovati-boss/krovat-boss-dream-160-velyur-royal/!krovat-boss-drim-160-velyur-royal-shampan/" },

  // Additional Leo variants
  { name: "Кровать ЛЕО 160 Вельвет CORD графит", price: 19999, url: "/krovati/krovat-leo-160/krovat-leo-160-velvet-cord/!krovat-leo-160-velvet-cord-grafit/" },

  // Additional Freya variants
  { name: "Кровать Фрея 160*200 Слим MONOLIT Латте", price: 24999, url: "/krovati/krovat-freya/krovat-freya-160-200-slim/!krovat-freya-160-200-slim-monolit-latte/" },
  { name: "Кровать Фрея 160*200 Слим MONOLIT Сталь", price: 24999, url: "/krovati/krovat-freya/krovat-freya-160-200-slim/!krovat-freya-160-200-slim-monolit-stal/" },
  { name: "Кровать Фрея 160*200 с ПМ MONOLIT Серая", price: 26999, url: "/krovati/krovat-freya/krovat-freya-160-200-s-pm/!krovat-freya-160-200-s-pm-monolit-seraya/" },
  { name: "Кровать Фрея 160*200 с ПМ MONOLIT Сталь", price: 26999, url: "/krovati/krovat-freya/krovat-freya-160-200-s-pm/!krovat-freya-160-200-s-pm-monolit-stal/" },

  // Additional Bella variants (many more variations)
  { name: "Кровать Белла 160*200 велюр Monolit мокко", price: 24999, url: "/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-160-200-velyur-monolit-mokko/" },
  { name: "Кровать Белла 140*200 велюр Monolit мокко", price: 16999, url: "/krovati/krovati-bella/krovat-bella-bez-mekhanizma-velyur-monolit/!krovat-bella-140-200-velyur-monolit-mokko/" },
  { name: "Кровать Белла 140*200 с ПМ велюр Monolit мокко", price: 21999, url: "/krovati/s-podemnym-mehanizmom/krovat-bella-140-200-s-pm-velyur-monolit/!krovat-bella-140-200-s-pm-velyur-monolit-mokko/" },

  // Additional Boss variants
  { name: "Кровать Босс 140*200 Про велюр Monolit латте", price: 34600, url: "/krovati/dvuspalnye-krovati/krovat-boss-140-velyur-monolit/!krovat-boss-140-velyur-monolit-latte/" },
  { name: "Кровать Босс 140*200 Про велюр Monolit серая", price: 34600, url: "/krovati/dvuspalnye-krovati/krovat-boss-140-velyur-monolit/!krovat-boss-140-velyur-monolit-seraya/" },
  { name: "Кровать Босс 140*200 Про велюр Monolit сталь", price: 34600, url: "/krovati/dvuspalnye-krovati/krovat-boss-140-velyur-monolit/!krovat-boss-140-velyur-monolit-stal/" },
  { name: "Кровать Босс 160*200 Про велюр Monolit серая", price: 36600, url: "/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-160-velyur-monolit-seraya/" },
  { name: "Кровать Босс 180*200 Про велюр Monolit мокко", price: 42400, url: "/krovati/dvuspalnye-krovati/krovat-boss-180-velyur-monolit/!krovat-boss-180-velyur-monolit-mokko/" },
  { name: "Кровать Босс 180*200 Про велюр Monolit сталь", price: 42400, url: "/krovati/dvuspalnye-krovati/krovat-boss-180-velyur-monolit/!krovat-boss-180-velyur-monolit-stal/" },

  // Boss mini variants
  { name: "Кровать BOSS mini NEW велюр Monolit лаванда", price: 28600, url: "/krovati/s-podemnym-mehanizmom/krovat-boss-mini-velyur-monolit/!krovat-boss-mini-velyur-monolit-lavanda/" },
  { name: "Кровать BOSS mini NEW велюр Monolit серая", price: 28600, url: "/krovati/s-podemnym-mehanizmom/krovat-boss-mini-velyur-monolit/!krovat-boss-mini-velyur-monolit-seraya/" },
  { name: "Кровать BOSS mini NEW велюр Monolit латте", price: 28600, url: "/krovati/s-podemnym-mehanizmom/krovat-boss-mini-velyur-monolit/!krovat-boss-mini-velyur-monolit-latte/" },

  //RONDA variants
  { name: "Кровать РОНДА 160*200 велюр MONOLIT серая", price: 24999, url: "/krovati/ronda/krovat-ronda-160-200-velyur-monolit/!krovat-ronda-160-200-velyur-monolit-seraya/" },
  { name: "Кровать РОНДА 160*200 велюр MONOLIT сталь", price: 24999, url: "/krovati/ronda/krovat-ronda-160-200-velyur-monolit/!krovat-ronda-160-200-velyur-monolit-stal/" },

  // Add more systematically...
];

async function generateMigration() {
  console.log('Querying existing beds...\n');

  const { data: existing, error } = await supabase
    .from('products')
    .select('original_name')
    .not('original_name', 'is', null);

  if (error) {
    console.error('Error:', error);
    return;
  }

  const existingNames = new Set(existing.map(p => p.original_name));
  console.log(`Found ${existing.length} existing beds\n`);

  const missing = completeInventory.filter(bed => !existingNames.has(bed.name));

  console.log(`Missing ${missing.length} beds:\n`);
  missing.forEach((bed, i) => {
    console.log(`${i + 1}. ${bed.name} - ${bed.price} RUB`);
  });

  console.log(`\n✓ This is a partial list. We need to add ${95 - existing.length} total beds to reach 95.`);
  console.log('\nRun this script after adding ALL missing beds to the completeInventory array.');
}

generateMigration().catch(console.error);
