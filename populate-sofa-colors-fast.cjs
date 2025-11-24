const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function populateSofaColors() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('POPULATING SOFA COLOR VARIANTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  const sofaGroups = JSON.parse(fs.readFileSync('sofa-variant-groups.json', 'utf8'));

  const { data: categoryData } = await supabase.from('categories').select('id').eq('slug', 'sofas').single();
  const { data: sofas } = await supabase.from('products').select('id, name, sku').eq('category_id', categoryData.id);

  console.log(`Found ${sofas.length} sofas in database`);

  await supabase.from('product_colors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cleared existing colors\n');

  let totalColors = 0;
  let productsWithColors = 0;

  for (const sofa of sofas) {
    const sofaNameNorm = sofa.name.toLowerCase().replace(/[^a-zа-яё0-9\s]/g, '').trim();

    let matchedVariants = [];
    for (const [groupName, variants] of Object.entries(sofaGroups)) {
      const groupMatches = variants.filter(v => {
        const vName = v.name.toLowerCase().replace(/[^a-zа-яё0-9\s]/g, '').trim();
        return sofaNameNorm === vName || sofaNameNorm.includes(vName) || vName.includes(sofaNameNorm);
      });
      matchedVariants.push(...groupMatches);
    }

    if (matchedVariants.length === 0) {
      const colorPatterns = [
        { pattern: /латте|latte/i, name: 'латте', code: '#D2B48C' },
        { pattern: /сталь|steel/i, name: 'сталь', code: '#708090' },
        { pattern: /серый|серая|grey|gray/i, name: 'серый', code: '#808080' },
        { pattern: /пепел|ash/i, name: 'пепел', code: '#B0B0B0' },
        { pattern: /оранж|orange/i, name: 'оранж', code: '#F97316' },
        { pattern: /синий|blue/i, name: 'синий', code: '#3B82F6' },
        { pattern: /мокко|mocha/i, name: 'мокко', code: '#8B4513' },
        { pattern: /беж|beige/i, name: 'беж', code: '#F5F5DC' },
        { pattern: /минт|mint/i, name: 'минт', code: '#98FF98' },
        { pattern: /карбон|carbon/i, name: 'карбон', code: '#333333' }
      ];

      for (const { pattern, name, code } of colorPatterns) {
        if (pattern.test(sofa.name)) {
          matchedVariants = [{ color: { colorName: name, colorCode: code } }];
          break;
        }
      }
    }

    if (matchedVariants.length === 0) continue;

    const { data: imgs } = await supabase.from('product_images').select('image_url').eq('product_id', sofa.id).order('display_order').limit(1);
    const fallbackImg = imgs?.[0]?.image_url || 'https://mnogomebeli.com/upload/default.jpg';

    const uniqueColors = Array.from(new Map(
      matchedVariants
        .filter(v => v.color)
        .map(v => [v.color.colorName.toLowerCase(), {
          colorName: v.color.colorName,
          colorCode: v.color.colorCode,
          imageUrl: v.imageUrl || fallbackImg
        }])
    ).values());

    for (const color of uniqueColors) {
      const { error } = await supabase.from('product_colors').insert({
        product_id: sofa.id,
        color_name: color.colorName,
        color_code: color.colorCode
      });

      if (!error) {
        totalColors++;
      } else {
        console.error(`Error inserting color for ${sofa.sku}:`, error.message);
      }
    }

    if (uniqueColors.length > 0) {
      productsWithColors++;
      if (productsWithColors % 50 === 0) process.stdout.write(`  ${productsWithColors}...`);
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('COLOR VARIANT POPULATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Products with colors: ${productsWithColors}/${sofas.length}`);
  console.log(`✓ Total color variants: ${totalColors}`);
  console.log('═══════════════════════════════════════════════════════════');
}

populateSofaColors().catch(console.error);
