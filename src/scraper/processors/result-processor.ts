import { ProductLink } from '../core/base-scraper';
import { ProductDetails } from '../core/product-detail-scraper';
import { translateProductName, generateSlug } from '../services/translation-service';

export interface ProcessedProduct {
  name: string;
  nameRussian: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  sourceUrl: string;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  materials: string | null;
  images: string[];
  tags: any[];
  validationIssues: string[];
}

export class ResultProcessor {
  private skuCounter: Map<string, number> = new Map();
  private slugCounter: Map<string, number> = new Map();

  processResults(
    rawProducts: Array<ProductLink & { details: ProductDetails; tags: any[] }>,
    skuPrefix: string
  ): ProcessedProduct[] {
    const processed: ProcessedProduct[] = [];

    for (const product of rawProducts) {
      try {
        const processedProduct = this.processProduct(product, skuPrefix);
        processed.push(processedProduct);
      } catch (error) {
        console.error(`Error processing product: ${product.russianName}`, error);
      }
    }

    return processed;
  }

  private processProduct(
    product: ProductLink & { details: ProductDetails; tags: any[] },
    skuPrefix: string
  ): ProcessedProduct {
    const translatedName = translateProductName(product.russianName);
    const baseSlug = generateSlug(translatedName);
    const slug = this.makeUniqueSlug(baseSlug);
    const sku = this.generateSKU(skuPrefix);

    const validationIssues: string[] = [];

    if (!product.details.price || product.details.price === 0) {
      validationIssues.push('Missing or invalid price');
    }

    if (!product.details.description) {
      validationIssues.push('Missing description');
    }

    if (product.details.images.length === 0) {
      validationIssues.push('No images found');
    }

    return {
      name: translatedName,
      nameRussian: product.russianName,
      slug,
      sku,
      description: product.details.description,
      price: product.details.price || 0,
      sourceUrl: product.url,
      length_cm: product.details.dimensions?.length || null,
      width_cm: product.details.dimensions?.width || null,
      height_cm: product.details.dimensions?.height || null,
      materials: product.details.materials,
      images: product.details.images,
      tags: product.tags,
      validationIssues
    };
  }

  private makeUniqueSlug(baseSlug: string): string {
    const currentCount = this.slugCounter.get(baseSlug) || 0;
    this.slugCounter.set(baseSlug, currentCount + 1);

    if (currentCount === 0) {
      return baseSlug;
    }
    return `${baseSlug}-${currentCount}`;
  }

  private generateSKU(prefix: string): string {
    const currentCount = this.skuCounter.get(prefix) || 0;
    const nextCount = currentCount + 1;
    this.skuCounter.set(prefix, nextCount);

    const paddedNumber = nextCount.toString().padStart(4, '0');
    return `${prefix}-${paddedNumber}`;
  }
}
