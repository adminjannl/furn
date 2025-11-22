import { BaseScraper, ProductLink } from '../core/base-scraper';
import { PuppeteerLoader } from '../core/puppeteer-loader';

export class PuppeteerScraper extends BaseScraper {
  private puppeteerLoader: PuppeteerLoader;

  constructor() {
    super();
    this.puppeteerLoader = new PuppeteerLoader();
  }

  async scrapeWithPuppeteer(categoryUrl: string, categoryPath: string): Promise<ProductLink[]> {
    this.logProgress(`Starting Puppeteer scraping for: ${categoryUrl}`);

    try {
      await this.puppeteerLoader.initialize();

      const html = await this.puppeteerLoader.loadPageWithShowMore(categoryUrl);
      const $ = this.parseHTML(html);

      const products = this.extractProductLinks($, categoryPath);

      this.logProgress(`Puppeteer scraping complete: ${products.length} products found`);

      return products;
    } catch (error) {
      console.error('Error during Puppeteer scraping:', error);
      return [];
    } finally {
      await this.puppeteerLoader.close();
    }
  }

  async close(): Promise<void> {
    await this.puppeteerLoader.close();
  }
}
