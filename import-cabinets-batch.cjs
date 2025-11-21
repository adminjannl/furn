const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function importCabinets() {
  const cabinets = JSON.parse(fs.readFileSync('./cabinets-scraped-no-idea.json', 'utf8'));

  console.log(`🗄️  Importing ${cabinets.length} cabinets in batches...\n`);

  // Get category ID
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'cabinets')
    .single();

  if (!category) {
    console.error('❌ Cabinet category not found!');
    return;
  }

  let skuCounter = 90;
  let successCount = 0;
  let errorCount = 0;

  for (const cabinet of cabinets) {
    const sku = `CAB-MNM-${String(skuCounter).padStart(4, '0')}`;

    // Translate name
    let name = cabinet.russianName
      .replace(/Шкаф/gi, 'Cabinet')
      .replace(/шкаф/gi, 'Cabinet')
      .replace(/распашной/gi, '')
      .replace(/Рим/gi, 'Rim')
      .replace(/Кашемир/gi, 'Cashmere')
      .replace(/Белый/gi, 'White')
      .replace(/Орех Селект/gi, 'Walnut Select')
      .replace(/Шиншилла серая/gi, 'Chinchilla Gray')
      .replace(/Кашемир серый/gi, 'Cashmere')
      .replace(/ящики/gi, 'with Drawers')
      .replace(/Стеллаж/gi, 'Shelving Unit')
      .replace(/зеркал/gi, 'Mirror')
      .replace(/\+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-') + `-${skuCounter}`;

    // Extract color
    let color = 'Natural';
    if (cabinet.russianName.includes('Кашемир')) color = 'Cashmere';
    else if (cabinet.russianName.includes('Белый')) color = 'White';
    else if (cabinet.russianName.includes('Орех Селект')) color = 'Walnut Select';
    else if (cabinet.russianName.includes('Шиншилла')) color = 'Chinchilla';

    try {
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          sku,
          name,
          slug,
          description: `Premium ${name}`,
          price: 999.99,
          category_id: category.id,
          stock_quantity: 15,
          status: 'active',
          source_url: cabinet.url,
          original_name: cabinet.russianName
        })
        .select()
        .single();

      if (productError) {
        if (productError.code === '23505') {
          console.log(`⚠️  ${sku}: Already exists (skipping)`);
        } else {
          console.error(`❌ ${sku}: ${productError.message}`);
          errorCount++;
        }
        skuCounter++;
        continue;
      }

      // Insert image if available
      if (cabinet.imageUrl && cabinet.imageUrl.includes('http')) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: cabinet.imageUrl,
          alt_text: name,
          display_order: 1,
          is_primary: true
        });
      }

      // Insert color variant
      await supabase.from('product_colors').insert({
        product_id: product.id,
        color_name: color,
        color_code: color === 'White' ? '#FFFFFF' :
                    color === 'Cashmere' ? '#E8DCC4' :
                    color === 'Walnut Select' ? '#8B4513' : '#D3D3D3',
        stock_quantity: 15
      });

      successCount++;
      console.log(`✅ ${sku}: ${name}`);

    } catch (error) {
      console.error(`❌ ${sku}: ${error.message}`);
      errorCount++;
    }

    skuCounter++;

    // Small delay to avoid rate limiting
    if (skuCounter % 10 === 0) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 IMPORT COMPLETE`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${cabinets.length}`);
  console.log(`${'='.repeat(60)}`);
}

importCabinets().catch(console.error);
