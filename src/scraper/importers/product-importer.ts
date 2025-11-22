import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';
import { ProcessedProduct } from '../processors/result-processor';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export class ProductImporter {
  async importProducts(
    products: ProcessedProduct[],
    categoryId: string,
    batchSize: number = 50
  ): Promise<ImportResult> {
    const result: ImportResult = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`\n📦 Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}...`);

      for (const product of batch) {
        try {
          const productData = {
            category_id: categoryId,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            discount_percentage: 0,
            sku: product.sku,
            length_cm: product.length_cm,
            width_cm: product.width_cm,
            height_cm: product.height_cm,
            materials: product.materials,
            stock_quantity: 10,
            status: 'active' as const,
            source_url: product.sourceUrl,
            source_name_russian: product.nameRussian,
            last_scraped_at: new Date().toISOString(),
            scrape_status: 'success' as const
          };

          const { data, error } = await supabase
            .from('products')
            .upsert(productData, { onConflict: 'sku' })
            .select()
            .single();

          if (error) {
            result.failed++;
            result.errors.push(`${product.sku}: ${error.message}`);
            console.error(`   ❌ Failed to import ${product.sku}:`, error.message);
          } else {
            result.inserted++;
            console.log(`   ✅ Imported: ${product.name} (${product.sku})`);
          }
        } catch (error) {
          result.failed++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`${product.sku}: ${errorMsg}`);
          console.error(`   ❌ Exception importing ${product.sku}:`, errorMsg);
        }
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   Inserted: ${result.inserted}`);
    console.log(`   Updated: ${result.updated}`);
    console.log(`   Skipped: ${result.skipped}`);
    console.log(`   Failed: ${result.failed}`);

    return result;
  }
}
