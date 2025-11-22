import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';
import { ProcessedProduct } from '../processors/result-processor';
import { ProductImporter } from './product-importer';
import { ImagesImporter } from './images-importer';
import { TagsImporter } from './tags-importer';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export interface ImportSummary {
  products: {
    inserted: number;
    failed: number;
  };
  images: {
    totalImported: number;
  };
  tags: {
    totalImported: number;
  };
  errors: string[];
}

export class ImportCoordinator {
  private productImporter: ProductImporter;
  private imagesImporter: ImagesImporter;
  private tagsImporter: TagsImporter;

  constructor() {
    this.productImporter = new ProductImporter();
    this.imagesImporter = new ImagesImporter();
    this.tagsImporter = new TagsImporter();
  }

  async importCompleteCategory(
    products: ProcessedProduct[],
    categorySlug: string
  ): Promise<ImportSummary> {
    console.log(`\n🚀 Starting complete import for ${products.length} products...`);

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    const productResult = await this.productImporter.importProducts(
      products,
      category.id
    );

    let totalImagesImported = 0;
    let totalTagsImported = 0;

    console.log(`\n📸 Importing images and tags...`);

    for (const product of products) {
      const { data: dbProduct } = await supabase
        .from('products')
        .select('id')
        .eq('sku', product.sku)
        .single();

      if (dbProduct) {
        const imagesImported = await this.imagesImporter.importImages(
          dbProduct.id,
          product.name,
          product.images
        );
        totalImagesImported += imagesImported;

        const tagsImported = await this.tagsImporter.importTags(
          dbProduct.id,
          product.tags
        );
        totalTagsImported += tagsImported;
      }
    }

    const summary: ImportSummary = {
      products: {
        inserted: productResult.inserted,
        failed: productResult.failed
      },
      images: {
        totalImported: totalImagesImported
      },
      tags: {
        totalImported: totalTagsImported
      },
      errors: productResult.errors
    };

    console.log(`\n✅ Import Complete:`);
    console.log(`   Products inserted: ${summary.products.inserted}`);
    console.log(`   Products failed: ${summary.products.failed}`);
    console.log(`   Images imported: ${summary.images.totalImported}`);
    console.log(`   Tags imported: ${summary.tags.totalImported}`);

    return summary;
  }
}
