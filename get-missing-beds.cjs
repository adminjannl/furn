require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const allExpectedBeds = [
  "Кровать Фрея 160*200 с ПМ MONOLIT Латте",
  "Кровать ЛЕО 160 Вельвет CORD серая",
  "Кровать ЛЕО 160 Вельвет CORD бежевая",
  "Кровать ЛЕО 160 Вельвет CORD графит",
  "Кровать Фрея 160*200 Слим MONOLIT Серая",
  "Кровать NORD Шенилл IQ серая",
  "Кровать Белла 160*200 велюр Monolit серая",
  "Кровать Белла 160*200 велюр Monolit латте",
  "Кровать Белла 160*200 велюр Monolit сталь",
  "Кровать Белла 160*200 велюр Monolit аква",
  "Кровать Босс 160*200 Про велюр Monolit латте",
  "Кровать Босс 160*200 Про велюр Monolit мокко",
  "Кровать Босс 160*200 Про велюр Monolit сталь",
  "Кровать Босс 160*200 Про велюр Monolit синяя",
  "Кровать Босс 180*200 Про велюр Monolit латте",
  "Кровать Босс 180*200 Про велюр Monolit серая",
  "Кровать Босс 140*200 Про велюр Monolit мокко",
  "Кровать BOSS mini NEW велюр Monolit роуз",
  "Кровать Белла 140*200 с ПМ велюр Monolit латте",
  "Кровать Белла 140*200 с ПМ велюр Monolit серая",
  "Кровать Белла 140*200 с ПМ велюр Monolit сталь",
  "Кровать Белла 140*200 с ПМ велюр Monolit аква",
  "Кровать Белла 140*200 велюр Monolit серая",
  "Кровать Белла 140*200 велюр Monolit латте",
  "Кровать Белла 140*200 велюр Monolit сталь",
  "Кровать Белла 140*200 велюр Monolit аква",
  "Кровать Белла 160*200 рогожка Malmo серая",
  "Кровать Белла 140*200 рогожка Malmo серая",
  "Кровать Уна мини рогожка Malmo серая, Чёрная",
  "Кровать Уна мини рогожка Malmo платина, Чёрная",
  "Кровать Уна 160*200 рогожка Malmo серая, черная",
  "Кровать Уна 160*200 рогожка Malmo платина, черная",
  "Кровать ЛОФТ Мини Орех Селект, MONOLIT Латте",
  "Кровать ЛОФТ Мини Орех Селект, MONOLIT Серый",
  "Кровать ЛОФТ Мини Сонома, MONOLIT аква",
  "Кровать РОНДА 160*200 велюр MONOLIT латте",
  "Кровать BOSS.XO 180*200 велюр Monolit сталь",
  "Кровать Босс Дрим 180*200 Про Велюр Royal шампань NEW",
  "Кровать Босс Дрим 180*200 Про Велюр Роял агат",
  "Кровать Босс 180*200 Про Велюр Royal шампань NEW",
 // Add more as we discover them
];

async function findMissingBeds() {
  console.log('Querying database for existing beds...\n');

  const { data: existingBeds, error } = await supabase
    .from('products')
    .select('original_name')
    .not('original_name', 'is', null);

  if (error) {
    console.error('Error:', error);
    return;
  }

  const existingNames = new Set(existingBeds.map(b => b.original_name));

  console.log(`✓ Found ${existingBeds.length} beds in database\n`);
  console.log('Existing beds:');
  existingBeds.forEach((b, i) => {
    console.log(`  ${i + 1}. ${b.original_name}`);
  });

  console.log('\n\nMissing beds:');
  const missing = allExpectedBeds.filter(name => !existingNames.has(name));
  missing.forEach((name, i) => {
    console.log(`  ${i + 1}. ${name}`);
  });

  console.log(`\n✓ Total expected: ${allExpectedBeds.length}`);
  console.log(`✓ Total existing: ${existingBeds.length}`);
  console.log(`✗ Total missing: ${missing.length}`);
}

findMissingBeds().catch(console.error);
