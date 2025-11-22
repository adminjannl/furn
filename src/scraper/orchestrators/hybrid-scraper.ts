import { CategoryConfig, SubcategoryScraper } from '../methods/subcategory-scraper';
import { PuppeteerScraper } from '../methods/puppeteer-scraper';
import { GapDetector } from '../methods/gap-detector';
import { ProductDetailScraper } from '../core/product-detail-scraper';
import { TagAssigner } from '../services/tag-assigner';
import { DuplicateDetector } from '../services/duplicate-detector';
import { ProductLink } from '../core/base-scraper';
import { ProductDetails } from '../core/product-detail-scraper';
import { translateProductName } from '../services/translation-service';
import scraperSettings from '../../../config/scraper-settings.json';

export interface ScrapingResult {
  products: Array<ProductLink & { details: ProductDetails; tags: any[] }>;
  stats: {
    subcategoryCount: number;
    puppeteerCount: number;
    gapsFilled: number;
    totalProducts: number;
    duplicatesSkipped: number;
    detailsScraped: number;
  };
}

export class HybridScraper {
  private subcategoryScraper: SubcategoryScraper;
  private puppeteerScraper: PuppeteerScraper;
  private gapDetector: GapDetector;
  private detailScraper: ProductDetailScraper;
  private tagAssigner: TagAssigner;
  private duplicateDetector: DuplicateDetector;

  constructor() {
    this.subcategoryScraper = new SubcategoryScraper();
    this.puppeteerScraper = new PuppeteerScraper();
    this.gapDetector = new GapDetector();
    this.detailScraper = new ProductDetailScraper();
    this.tagAssigner = new TagAssigner();
    this.duplicateDetector = new DuplicateDetector();
  }

  async scrapeCategory(category: CategoryConfig): Promise<ScrapingResult> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 Starting Hybrid Scraping for: ${category.name}`);
    console.log(`${'='.repeat(60)}\n`);

    const result = await this.subcategoryScraper.scrapeSubcategories(category);

    let allProducts = result.products;
    let puppeteerCount = 0;
    let gapsFilled = 0;

    const shouldUsePuppeteer =
      category.alwaysUsePuppeteer ||
      result.stats.totalUniqueProducts < category.expectedCount - 10;

    if (shouldUsePuppeteer) {
      console.log(`\n🤖 Running Puppeteer scraping (subcategory count: ${result.stats.totalUniqueProducts}, expected: ${category.expectedCount})...`);

      const puppeteerProducts = await this.puppeteerScraper.scrapeWithPuppeteer(
        category.mainUrl,
        category.categoryPath
      );

      puppeteerCount = puppeteerProducts.length;

      const gaps = this.gapDetector.findGaps(allProducts, puppeteerProducts);
      gapsFilled = gaps.gapCount;

      allProducts = [...allProducts, ...gaps.missingProducts];
    }

    console.log(`\n📦 Scraping product details for ${allProducts.length} products...`);

    const productsWithDetails: Array<ProductLink & { details: ProductDetails; tags: any[] }> = [];
    let duplicatesSkipped = 0;
    let detailsScraped = 0;

    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      const progress = `${i + 1}/${allProducts.length}`;

      process.stdout.write(`\r   [${progress}] ${product.russianName.substring(0, 50)}...`);

      const duplicateCheck = await this.duplicateDetector.shouldSkip({
        url: product.url,
        name: product.russianName,
        russianName: product.russianName
      });

      if (duplicateCheck.skip) {
        duplicatesSkipped++;
        continue;
      }

      const details = await this.detailScraper.scrapeProductDetails(product.url);
      detailsScraped++;

      const subcategoryInfo = category.subcategories.find(
        sub => sub.english === product.subcategory
      );

      const tags = this.tagAssigner.assignTags(product, subcategoryInfo);

      const translatedName = translateProductName(product.russianName);

      productsWithDetails.push({
        ...product,
        name: translatedName,
        details,
        tags
      });

      await this.detailScraper.delay(scraperSettings.delays.betweenDetailScrapes);
    }

    console.log('\n');

    const stats = {
      subcategoryCount: result.stats.totalUniqueProducts,
      puppeteerCount,
      gapsFilled,
      totalProducts: productsWithDetails.length,
      duplicatesSkipped,
      detailsScraped
    };

    console.log(`\n✅ Hybrid Scraping Complete for ${category.name}:`);
    console.log(`   Subcategory products: ${stats.subcategoryCount}`);
    console.log(`   Puppeteer products: ${stats.puppeteerCount}`);
    console.log(`   Gaps filled: ${stats.gapsFilled}`);
    console.log(`   Duplicates skipped: ${stats.duplicatesSkipped}`);
    console.log(`   Details scraped: ${stats.detailsScraped}`);
    console.log(`   Total products: ${stats.totalProducts}\n`);

    return {
      products: productsWithDetails,
      stats
    };
  }

  async close(): Promise<void> {
    await this.puppeteerScraper.close();
  }
}
