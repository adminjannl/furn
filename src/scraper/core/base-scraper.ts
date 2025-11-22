import * as cheerio from 'cheerio';
import scraperSettings from '../../../config/scraper-settings.json';

export interface ProductLink {
  url: string;
  russianName: string;
  name?: string;
  imageUrl: string | null;
  subcategory?: string;
  sku?: string;
}

export class BaseScraper {
  private userAgent: string;
  private maxRetries: number;
  private retryDelayBase: number;

  constructor() {
    this.userAgent = scraperSettings.scraping.userAgent;
    this.maxRetries = scraperSettings.scraping.maxRetries;
    this.retryDelayBase = scraperSettings.scraping.retryDelayBase;
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchHTML(url: string, retryCount = 0): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
        }
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.maxRetries) {
          const delay = this.retryDelayBase * Math.pow(2, retryCount);
          console.log(`Rate limited. Waiting ${delay}ms before retry ${retryCount + 1}/${this.maxRetries}...`);
          await this.delay(delay);
          return this.fetchHTML(url, retryCount + 1);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.retryDelayBase * Math.pow(2, retryCount);
        console.log(`Error fetching ${url}. Retrying in ${delay}ms... (${retryCount + 1}/${this.maxRetries})`);
        await this.delay(delay);
        return this.fetchHTML(url, retryCount + 1);
      }
      throw error;
    }
  }

  parseHTML(html: string): cheerio.CheerioAPI {
    return cheerio.load(html);
  }

  extractProductLinks($: cheerio.CheerioAPI, categoryPath: string): ProductLink[] {
    const products: ProductLink[] = [];
    const seen = new Set<string>();

    $('a[href*="!"]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href || !href.includes(categoryPath) || href.includes('#')) {
        return;
      }

      const fullUrl = href.startsWith('http')
        ? href
        : `https://mnogomebeli.com${href}`;

      if (seen.has(fullUrl)) {
        return;
      }
      seen.add(fullUrl);

      const title = $(el).attr('title') || '';
      const img = $(el).find('img').first();
      const imgAlt = img.attr('alt') || '';
      const imgSrc = img.attr('src') || img.attr('data-src') || '';

      let productName = (title || imgAlt || $(el).text())
        .replace(/\s+/g, ' ')
        .trim();

      if (productName && productName.length > 5 && productName.length < 200) {
        const imageUrl = imgSrc
          ? (imgSrc.startsWith('http') ? imgSrc : `https://mnogomebeli.com${imgSrc}`)
          : null;

        products.push({
          url: fullUrl,
          russianName: productName,
          imageUrl
        });
      }
    });

    return products;
  }

  logProgress(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] ${message}`, data);
    } else {
      console.log(`[${timestamp}] ${message}`);
    }
  }
}
