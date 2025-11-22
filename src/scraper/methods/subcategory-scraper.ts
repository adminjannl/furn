import { BaseScraper, ProductLink } from '../core/base-scraper';
import scraperSettings from '../../../config/scraper-settings.json';

export interface SubcategoryInfo {
  russian: string;
  english: string;
  url: string;
  tags: Array<{ type: string; value: string }>;
}

export interface CategoryConfig {
  name: string;
  slug: string;
  categoryPath: string;
  mainUrl: string;
  skuPrefix: string;
  expectedCount: number;
  alwaysUsePuppeteer: boolean;
  subcategories: SubcategoryInfo[];
}

export interface SubcategoryScrapingResult {
  products: ProductLink[];
  stats: {
    totalSubcategories: number;
    productsPerSubcategory: Record<string, number>;
    totalUniqueProducts: number;
    duplicatesFound: number;
  };
}

export class SubcategoryScraper extends BaseScraper {
  async scrapeSubcategories(category: CategoryConfig): Promise<SubcategoryScrapingResult> {
    this.logProgress(`Starting subcategory scraping for: ${category.name}`);

    const allProducts = new Map<string, ProductLink>();
    const productsPerSubcategory: Record<string, number> = {};
    let duplicatesCount = 0;

    if (category.subcategories.length === 0) {
      this.logProgress(`No subcategories defined, scraping main category: ${category.mainUrl}`);
      const mainProducts = await this.scrapeSubcategory(
        category.mainUrl,
        category.categoryPath,
        category.name
      );

      mainProducts.forEach(product => {
        if (!allProducts.has(product.url)) {
          allProducts.set(product.url, product);
        } else {
          duplicatesCount++;
        }
      });

      productsPerSubcategory[category.name] = mainProducts.length;
    } else {
      for (const subcategory of category.subcategories) {
        this.logProgress(`Scraping subcategory: ${subcategory.english}`);

        const products = await this.scrapeSubcategory(
          subcategory.url,
          category.categoryPath,
          subcategory.english
        );

        products.forEach(product => {
          product.subcategory = subcategory.english;
          if (!allProducts.has(product.url)) {
            allProducts.set(product.url, product);
          } else {
            duplicatesCount++;
          }
        });

        productsPerSubcategory[subcategory.english] = products.length;

        await this.delay(scraperSettings.delays.betweenRequests);
      }
    }

    const uniqueProducts = Array.from(allProducts.values());

    this.logProgress(`Subcategory scraping complete for ${category.name}`, {
      totalSubcategories: category.subcategories.length || 1,
      uniqueProducts: uniqueProducts.length,
      duplicates: duplicatesCount
    });

    return {
      products: uniqueProducts,
      stats: {
        totalSubcategories: category.subcategories.length || 1,
        productsPerSubcategory,
        totalUniqueProducts: uniqueProducts.length,
        duplicatesFound: duplicatesCount
      }
    };
  }

  private async scrapeSubcategory(
    url: string,
    categoryPath: string,
    subcategoryName: string
  ): Promise<ProductLink[]> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.parseHTML(html);

      const products = this.extractProductLinks($, categoryPath);

      this.logProgress(`  ✅ ${subcategoryName}: ${products.length} products`);

      return products;
    } catch (error) {
      console.error(`  ❌ ${subcategoryName}: Error -`, error);
      return [];
    }
  }
}
