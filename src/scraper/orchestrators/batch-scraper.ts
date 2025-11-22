import { CategoryConfig } from '../methods/subcategory-scraper';
import { PuppeteerLoader, BatchLoadResult } from '../core/puppeteer-loader';
import { ProductDetailScraper } from '../core/product-detail-scraper';
import { TagAssigner } from '../services/tag-assigner';
import { SessionDuplicateCache } from '../core/session-duplicate-cache';
import { BatchProgressTracker, BatchProgress } from '../core/batch-progress-tracker';
import { BaseScraper, ProductLink } from '../core/base-scraper';
import { ProductDetails } from '../core/product-detail-scraper';
import { translateProductName } from '../services/translation-service';
import scraperSettings from '../../../config/scraper-settings.json';

export interface BatchResult {
  products: Array<ProductLink & { details: ProductDetails; tags: any[] }>;
  batchNumber: number;
  productsInBatch: number;
  duplicatesSkipped: number;
  hasMore: boolean;
  clicksPerformed: number;
}

export interface BatchScraperOptions {
  productsPerBatch: number;
  resumeSession?: string;
}

export class BatchScraper {
  private puppeteerLoader: PuppeteerLoader;
  private detailScraper: ProductDetailScraper;
  private tagAssigner: TagAssigner;
  private duplicateCache: SessionDuplicateCache;
  private progressTracker: BatchProgressTracker;
  private baseScraper: BaseScraper;
  private currentProgress: BatchProgress | null = null;

  constructor() {
    this.puppeteerLoader = new PuppeteerLoader();
    this.detailScraper = new ProductDetailScraper();
    this.tagAssigner = new TagAssigner();
    this.duplicateCache = new SessionDuplicateCache();
    this.progressTracker = new BatchProgressTracker();
    this.baseScraper = new BaseScraper();
  }

  async initializeBatchScraping(
    category: CategoryConfig,
    options: BatchScraperOptions
  ): Promise<BatchProgress> {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  🚀 INITIALIZING BATCH SCRAPING`);
    console.log(`${'═'.repeat(70)}`);
    console.log(`\n  Category: ${category.name}`);
    console.log(`  Batch Size: ${options.productsPerBatch} products`);

    if (options.resumeSession) {
      const resumed = this.progressTracker.loadProgress(category.slug, options.resumeSession);

      if (resumed) {
        console.log(`\n  ♻️  Resuming session: ${options.resumeSession}`);
        console.log(`  Last batch: ${resumed.currentBatch}`);
        console.log(`  Total scraped: ${resumed.totalProductsScraped}`);

        this.currentProgress = resumed;
        this.duplicateCache.loadFromProgress(resumed.scrapedUrls);

        await this.puppeteerLoader.initializeBatchMode(category.mainUrl);

        for (let i = 0; i < resumed.totalClicks; i++) {
          await this.puppeteerLoader.loadNextBatch(options.productsPerBatch);
        }

        return resumed;
      } else {
        console.log(`\n  ⚠️  Session not found, starting new session...`);
      }
    }

    const progress = this.progressTracker.initializeSession(
      category.slug,
      category.name,
      options.productsPerBatch
    );

    this.currentProgress = progress;

    await this.puppeteerLoader.initializeBatchMode(category.mainUrl);

    console.log(`\n  ✅ Initialization complete!`);
    console.log(`  Session ID: ${progress.sessionId}`);
    console.log(`${'═'.repeat(70)}\n`);

    return progress;
  }

  async scrapeNextBatch(category: CategoryConfig): Promise<BatchResult> {
    if (!this.currentProgress) {
      throw new Error('Batch scraping not initialized. Call initializeBatchScraping first.');
    }

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  📦 BATCH ${this.currentProgress.currentBatch}`);
    console.log(`${'═'.repeat(70)}\n`);

    const batchLoadResult: BatchLoadResult = await this.puppeteerLoader.loadNextBatch(
      this.currentProgress.productsPerBatch
    );

    console.log(`\n  ✅ Loaded ${batchLoadResult.productsLoaded} products from page`);
    console.log(`  🖱️  Performed ${batchLoadResult.clicksPerformed} clicks\n`);

    const $ = this.baseScraper.parseHTML(batchLoadResult.html);
    const allProductLinks = this.baseScraper.extractProductLinks($, category.categoryPath);

    const sessionCache = this.duplicateCache.exportSessionData();
    const newProductLinks = allProductLinks.filter(
      product => !sessionCache.includes(product.url)
    );

    console.log(`  🔍 Filtering products...`);
    console.log(`     Total on page: ${allProductLinks.length}`);
    console.log(`     New in this batch: ${newProductLinks.length}\n`);

    const uniqueProducts: ProductLink[] = [];
    let duplicatesSkipped = 0;

    for (const product of newProductLinks) {
      const duplicateCheck = await this.duplicateCache.isDuplicate({
        url: product.url,
        name: product.name || '',
        russianName: product.russianName,
        sku: product.sku
      });

      if (duplicateCheck.isDuplicate) {
        duplicatesSkipped++;
        continue;
      }

      uniqueProducts.push(product);
    }

    console.log(`  ✅ Unique products identified: ${uniqueProducts.length}`);
    console.log(`  ⏭️  Duplicates skipped: ${duplicatesSkipped}\n`);

    console.log(`  🔎 Scraping product details...`);

    const productsWithDetails: Array<ProductLink & { details: ProductDetails; tags: any[] }> = [];

    for (let i = 0; i < uniqueProducts.length; i++) {
      const product = uniqueProducts[i];
      const progress = `${i + 1}/${uniqueProducts.length}`;

      process.stdout.write(`\r     [${progress}] ${product.russianName.substring(0, 50).padEnd(50)}`);

      try {
        const details = await this.detailScraper.scrapeProductDetails(product.url);

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
      } catch (error) {
        console.error(`\n     ❌ Error scraping ${product.url}:`, error);
      }
    }

    console.log('\n');

    const scrapedUrls = productsWithDetails.map(p => p.url);

    this.currentProgress = this.progressTracker.updateBatchProgress(
      this.currentProgress,
      scrapedUrls,
      batchLoadResult.clicksPerformed
    );

    return {
      products: productsWithDetails,
      batchNumber: this.currentProgress.currentBatch - 1,
      productsInBatch: productsWithDetails.length,
      duplicatesSkipped,
      hasMore: batchLoadResult.hasMore,
      clicksPerformed: batchLoadResult.clicksPerformed
    };
  }

  getCurrentProgress(): BatchProgress | null {
    return this.currentProgress;
  }

  printBatchSummary(batchResult: BatchResult): void {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  ✅ BATCH ${batchResult.batchNumber} COMPLETE`);
    console.log(`${'═'.repeat(70)}`);
    console.log(`\n  Products scraped: ${batchResult.productsInBatch}`);
    console.log(`  Duplicates skipped: ${batchResult.duplicatesSkipped}`);
    console.log(`  Clicks performed: ${batchResult.clicksPerformed}`);
    console.log(`  More products available: ${batchResult.hasMore ? 'Yes ✅' : 'No ❌'}`);
    console.log(`\n${'═'.repeat(70)}\n`);

    this.duplicateCache.printStats();
  }

  printProgressReport(): void {
    if (this.currentProgress) {
      const report = this.progressTracker.generateReport(this.currentProgress);
      console.log(report);
    }
  }

  listAvailableSessions(categorySlug?: string): void {
    const sessions = this.progressTracker.listSessions(categorySlug);

    if (sessions.length === 0) {
      console.log('\n  No saved sessions found.\n');
      return;
    }

    console.log(`\n${'═'.repeat(70)}`);
    console.log('  AVAILABLE SESSIONS');
    console.log(`${'═'.repeat(70)}\n`);

    sessions.forEach((session, index) => {
      console.log(`  ${index + 1}. Category: ${session.categorySlug}`);
      console.log(`     Session ID: ${session.sessionId}`);
      console.log(`     Last updated: ${new Date(session.timestamp).toLocaleString()}`);
      console.log('');
    });

    console.log(`${'═'.repeat(70)}\n`);
  }

  async close(): Promise<void> {
    await this.puppeteerLoader.closeBatchMode();
    await this.puppeteerLoader.close();
  }
}
