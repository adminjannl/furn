const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Color translations Russian -> English
const colorTranslations = {
  'серый': { en: 'Gray', code: '#808080' },
  'сталь': { en: 'Steel', code: '#6B7280' },
  'синий': { en: 'Blue', code: '#3B82F6' },
  'зеленый': { en: 'Green', code: '#10B981' },
  'аква': { en: 'Aqua', code: '#06B6D4' },
  'латте': { en: 'Latte', code: '#D2B48C' },
  'мокко': { en: 'Mocha', code: '#8B4513' },
  'шампань': { en: 'Champagne', code: '#F7E7CE' },
  'пепел': { en: 'Ash', code: '#B0B0B0' },
  'агат': { en: 'Agate', code: '#4B5563' },
  'топаз': { en: 'Topaz', code: '#FBBF24' },
  'пион': { en: 'Peony', code: '#EC4899' },
  'тауп': { en: 'Taupe', code: '#9CA3AF' },
  'оранж': { en: 'Orange', code: '#F97316' },
  'кварц': { en: 'Quartz', code: '#E5E7EB' },
  'графит': { en: 'Graphite', code: '#374151' },
  'бежевый': { en: 'Beige', code: '#F5DEB3' },
  'грей': { en: 'Gray', code: '#9CA3AF' },
  'милк': { en: 'Milk', code: '#FAFAFA' },
  'минт': { en: 'Mint', code: '#86EFAC' },
  'беж': { en: 'Beige', code: '#F5DEB3' },
  'карбон': { en: 'Carbon', code: '#1F2937' }
};

function extractColorFromName(name) {
  const lowerName = name.toLowerCase();
  for (const [colorRu, data] of Object.entries(colorTranslations)) {
    if (lowerName.includes(colorRu)) {
      return { colorRu, colorEn: data.en, colorCode: data.code };
    }
  }
  return null;
}

function getBaseName(name) {
  return name
    .replace(/(велюр|Велюр|шенилл|Шенилл|Вельвет|рогожка)\s+[A-Za-z]+\s+[а-яА-Я]+$/i, '')
    .replace(/(велюр|Велюр|шенилл|Шенилл|Вельвет|рогожка)\s+[а-яА-Я]+$/i, '')
    .trim();
}

async function fixSofaColors() {
  console.log('\n🎨 Fixing sofa color variants...\n');

  // Get all sofas
  const { data: sofas } = await supabase
    .from('products')
    .select('id, name, slug, source_url')
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
      color: color
    });
  });

  // Filter to groups with multiple variants AND colors detected
  const variantGroups = Object.entries(groups)
    .filter(([_, products]) => {
      return products.length > 1 && products.some(p => p.color);
    })
    .reduce((acc, [baseName, products]) => {
      acc[baseName] = products.filter(p => p.color); // Only keep products with detected colors
      return acc;
    }, {});

  console.log(`Found ${Object.keys(variantGroups).length} products with color variants`);

  // Delete all existing sofa color entries
  console.log('\nDeleting existing color entries...');
  const sofaIds = sofas.map(p => p.id);

  for (let i = 0; i < sofaIds.length; i += 100) {
    const batch = sofaIds.slice(i, i + 100);
    await supabase
      .from('product_colors')
      .delete()
      .in('product_id', batch);
  }

  // Collect all UNIQUE color entries
  const allColorEntries = [];
  const seenEntries = new Set();

  for (const [baseName, products] of Object.entries(variantGroups)) {
    // Get unique colors in this group
    const uniqueColors = new Map();

    products.forEach(p => {
      if (p.color && !uniqueColors.has(p.color.colorEn)) {
        uniqueColors.set(p.color.colorEn, {
          colorEn: p.color.colorEn,
          colorCode: p.color.colorCode,
          slug: p.slug
        });
      }
    });

    // Add colors for each product in the group
    for (const product of products) {
      for (const [colorName, colorData] of uniqueColors.entries()) {
        const entryKey = `${product.id}:${colorName}`;

        if (!seenEntries.has(entryKey)) {
          allColorEntries.push({
            product_id: product.id,
            color_name: colorData.colorEn, // English name
            color_code: colorData.colorCode,
            variant_slug: colorData.slug
          });
          seenEntries.add(entryKey);
        }
      }
    }
  }

  console.log(`\nInserting ${allColorEntries.length} unique color entries...\n`);

  // Insert in batches
  let inserted = 0;

  for (let i = 0; i < allColorEntries.length; i += 500) {
    const batch = allColorEntries.slice(i, i + 500);
    const progress = Math.min(i + 500, allColorEntries.length);

    process.stdout.write(`\r[${progress}/${allColorEntries.length}] Inserting...`);

    const { error } = await supabase
      .from('product_colors')
      .insert(batch);

    if (!error) {
      inserted += batch.length;
    } else {
      console.error(`\nError:`, error.message);
    }
  }

  console.log('\n\n✅ Complete!');
  console.log(`Inserted ${inserted} unique color variant links`);
  console.log(`Colors are now in English and deduplicated`);
}

fixSofaColors().catch(console.error);
