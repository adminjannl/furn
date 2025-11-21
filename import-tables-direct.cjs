const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importTables() {
  try {
    const tablesData = JSON.parse(fs.readFileSync('all-tables-scraped.json', 'utf8'));

    console.log('Step 1: Creating Tables category...');
    const { error: catError } = await supabase
      .from('categories')
      .upsert({
        name: 'Tables',
        slug: 'tables',
        description: 'Premium tables for every room - dining, coffee, writing desks, and transformers',
        display_order: 5
      }, { onConflict: 'slug' });

    if (catError) console.error('Category error:', catError);
    else console.log('✓ Category created');

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'tables')
      .single();

    if (!category) {
      console.error('Failed to get category');
      return;
    }

    console.log('\nStep 2: Importing products...');
    let imported = 0;

    for (let i = 0; i < tablesData.length; i++) {
      const table = tablesData[i];
      const sku = `TBL-MNM-${String(i + 200).padStart(4, '0')}`;
      const dimensions = table.dimensions || getDefaultDimensions(table.name);
      const [length, width, height] = dimensions.split('x').map(d => parseInt(d) || 0);

      const { error: prodError } = await supabase
        .from('products')
        .upsert({
          sku,
          name: table.name,
          slug: generateSlug(table.name),
          description: `Premium table ${table.name}. High-quality European furniture with exceptional design and durability. Dimensions: ${dimensions} cm (LxWxH)`,
          price: table.price,
          category_id: category.id,
          stock_quantity: 10,
          width_cm: width,
          height_cm: height,
          length_cm: length,
          status: 'active'
        }, { onConflict: 'sku' });

      if (prodError) {
        console.error(`Error importing ${table.name}:`, prodError.message);
      } else {
        imported++;
        console.log(`✓ ${imported}/${tablesData.length}: ${table.name}`);
      }
    }

    console.log(`\n✓ Successfully imported ${imported} tables`);

    console.log('\nStep 3: Importing images...');
    let imageCount = 0;

    for (let i = 0; i < tablesData.length; i++) {
      const table = tablesData[i];
      const sku = `TBL-MNM-${String(i + 200).padStart(4, '0')}`;

      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('sku', sku)
        .single();

      if (!product) continue;

      if (table.images && table.images.length > 0) {
        for (let j = 0; j < Math.min(table.images.length, 5); j++) {
          const { error: imgError } = await supabase
            .from('product_images')
            .upsert({
              product_id: product.id,
              image_url: table.images[j],
              alt_text: `${table.name} - View ${j + 1}`,
              display_order: j + 1,
              is_primary: j === 0
            }, { onConflict: 'product_id,display_order' });

          if (!imgError) imageCount++;
        }
      }
    }

    console.log(`✓ Imported ${imageCount} images`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

function getDefaultDimensions(name) {
  if (name.includes('трансформер') || name.includes('Transformer')) return '162x80x79';
  if (name.includes('журнальный') || name.includes('Журнальный')) return '100x60x45';
  if (name.includes('письменный') || name.includes('Письменный')) return '120x60x75';
  if (name.includes('обеденный') || name.includes('Обеденный') || name.includes('ЛОФТ') || name.includes('Boss One')) return '140x80x75';
  if (name.includes('приставка')) return '80x40x75';
  return '120x70x75';
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[а-я]/g, (char) => {
      const map = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i',
        'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
        'у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'',
        'э':'e','ю':'yu','я':'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

importTables();
