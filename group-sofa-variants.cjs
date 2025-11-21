const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Color mappings for extraction
const colorMappings = {
  'серый': '#808080',
  'сталь': '#6B7280',
  'синий': '#3B82F6',
  'зеленый': '#10B981',
  'аква': '#06B6D4',
  'латте': '#D2B48C',
  'мокко': '#8B4513',
  'шампань': '#F7E7CE',
  'пепел': '#B0B0B0',
  'агат': '#4B5563',
  'топаз': '#FBBF24',
  'пион': '#EC4899',
  'тауп': '#9CA3AF',
  'оранж': '#F97316',
  'кварц': '#E5E7EB',
  'графит': '#374151',
  'бежевый': '#F5DEB3',
  'грей': '#9CA3AF',
  'милк': '#FAFAFA',
  'минт': '#86EFAC',
  'беж': '#F5DEB3',
  'карбон': '#1F2937'
};

function extractColorFromName(name) {
  const lowerName = name.toLowerCase();
  for (const [colorName, colorCode] of Object.entries(colorMappings)) {
    if (lowerName.includes(colorName)) {
      return { colorName, colorCode };
    }
  }
  return null;
}

function getBaseName(name) {
  // Remove color and material suffixes
  return name
    .replace(/(велюр|Велюр|шенилл|Шенилл|Вельвет|рогожка)\s+[A-Za-z]+\s+[а-яА-Я]+$/i, '')
    .replace(/(велюр|Велюр|шенилл|Шенилл|Вельвет|рогожка)\s+[а-яА-Я]+$/i, '')
    .trim();
}

async function groupSofaVariants() {
  console.log('\n🎨 Grouping sofa color variants...\n');

  // Get all sofas
  const { data: sofas } = await supabase
    .from('products')
    .select('id, name, slug, source_url, source_name_russian')
    .like('source_url', '%divany%')
    .order('id');

  console.log(`Found ${sofas.length} sofas\n`);

  // Group by base name
  const groups = {};

  sofas.forEach(sofa => {
    const baseName = getBaseName(sofa.name);
    const color = extractColorFromName(sofa.name);

    if (!groups[baseName]) {
      groups[baseName] = [];
    }

    groups[baseName].push({
      id: sofa.id,
      slug: sofa.slug,
      name: sofa.name,
      url: sofa.source_url,
      color: color
    });
  });

  // Filter to only groups with multiple variants
  const variantGroups = Object.entries(groups)
    .filter(([_, products]) => products.length > 1)
    .reduce((acc, [baseName, products]) => {
      acc[baseName] = products;
      return acc;
    }, {});

  console.log(`Found ${Object.keys(variantGroups).length} products with color variants`);

  let totalVariants = 0;
  Object.values(variantGroups).forEach(products => {
    totalVariants += products.length;
  });

  console.log(`Total color variants: ${totalVariants}\n`);

  // Show sample
  console.log('Sample variant groups:');
  Object.entries(variantGroups).slice(0, 5).forEach(([baseName, products]) => {
    console.log(`\n${baseName} (${products.length} colors):`);
    products.slice(0, 3).forEach(p => {
      console.log(`  - ${p.name} ${p.color ? `(${p.color.colorName})` : '(no color)'}`);
    });
  });

  fs.writeFileSync('sofa-variant-groups.json', JSON.stringify(variantGroups, null, 2));
  console.log('\n✅ Saved to sofa-variant-groups.json');

  return variantGroups;
}

groupSofaVariants().catch(console.error);
