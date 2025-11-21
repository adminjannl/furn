const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BATCH_SIZE = 50;
const PROGRESS_FILE = '.scraper-progress/sofas-batch-progress.json';
const PRODUCTS_FILE = '.scraper-progress/sofas-all-products.json';

async function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return null;
}

async function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function loadAllProducts() {
  if (fs.existsSync(PRODUCTS_FILE)) {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  }
  return null;
}

async function importNextBatch() {
  const progress = await loadProgress();
  const allProducts = await loadAllProducts();

  if (!progress || !allProducts) {
    console.log('\n❌ No scraped data found. Please run scrape-all-811-sofas.cjs first.\n');
    return;
  }

  if (progress.currentBatch >= progress.totalBatches) {
    console.log('\n✅ All batches already completed!');
    console.log(`   Total products: ${progress.totalProducts}`);
    console.log(`   Completed: ${progress.completedProducts}\n`);
    return;
  }

  const batchNumber = progress.currentBatch + 1;
  const startIdx = (batchNumber - 1) * BATCH_SIZE;
  const endIdx = Math.min(startIdx + BATCH_SIZE, allProducts.length);
  const batch = allProducts.slice(startIdx, endIdx);

  console.log(`\n📦 Importing Batch ${batchNumber}/${progress.totalBatches}`);
  console.log(`   Products: ${startIdx + 1}-${endIdx} of ${allProducts.length}`);
  console.log(`   Batch size: ${batch.length}\n`);

  // Get or create sofas category
  let { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sofas')
    .maybeSingle();

  if (!category) {
    const { data: newCategory } = await supabase
      .from('categories')
      .insert({
        name: 'Sofas',
        slug: 'sofas',
        description: 'Premium sofas collection'
      })
      .select()
      .single();
    category = newCategory;
    console.log('✅ Created Sofas category\n');
  }

  const categoryId = category.id;

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < batch.length; i++) {
    const product = batch[i];
    const progress = `${i + 1}/${batch.length}`;

    process.stdout.write(`\r[${progress}] ${product.title.substring(0, 60).padEnd(60)}`);

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('source_url', product.url)
      .maybeSingle();

    if (existing) {
      // Update image
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', existing.id);

      await supabase
        .from('product_images')
        .insert({
          product_id: existing.id,
          image_url: product.imageUrl,
          display_order: 0,
          alt_text: product.title
        });

      updated++;
    } else {
      // Extract clean product name
      let name = product.title
        .replace(/^(Диван|Угловой диван|Sofa)\s*/i, '')
        .trim();

      if (!name) name = product.title;

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);

      // Generate unique SKU from URL + timestamp
      const urlPart = product.url.split('/').pop().replace(/[^a-z0-9-]/gi, '').substring(0, 40);
      const sku = `${urlPart}-${Date.now().toString(36)}`;

      // Insert new product
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          name: name,
          slug: slug,
          sku: sku,
          source_name_russian: product.title,
          source_url: product.url,
          category_id: categoryId,
          price: 0
        })
        .select()
        .single();

      if (newProduct) {
        // Insert image
        await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: product.imageUrl,
            display_order: 0,
            alt_text: product.title
          });

        imported++;
      } else {
        if (error) console.error(`\n   Error: ${error.message}`);
        skipped++;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Update progress
  progress.currentBatch = batchNumber;
  progress.completedProducts = endIdx;
  await saveProgress(progress);

  console.log(`\n\n✅ Batch ${batchNumber}/${progress.totalBatches} complete!`);
  console.log(`   New products imported: ${imported}`);
  console.log(`   Existing products updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Overall progress: ${endIdx}/${allProducts.length} (${Math.round(endIdx/allProducts.length*100)}%)\n`);

  if (batchNumber < progress.totalBatches) {
    console.log(`📝 Next: Batch ${batchNumber + 1}/${progress.totalBatches}`);
    console.log(`   Run this script again or type "continue" to import the next batch\n`);
  } else {
    console.log('🎉 All batches completed! All 754 sofas have been imported!\n');
  }
}

importNextBatch().catch(console.error);
