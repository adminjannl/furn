import puppeteer, { Browser, Page } from 'puppeteer';
import scraperSettings from '../../../config/scraper-settings.json';

export interface BatchLoadResult {
  html: string;
  productsLoaded: number;
  clicksPerformed: number;
  hasMore: boolean;
}

export class PuppeteerLoader {
  private browser: Browser | null = null;
  private currentPage: Page | null = null;

  async initialize(): Promise<void> {
    if (this.browser) {
      return;
    }

    this.browser = await puppeteer.launch({
      headless: scraperSettings.puppeteer.headless as boolean | 'new',
      args: scraperSettings.puppeteer.args
    });
  }

  async close(): Promise<void> {
    if (this.currentPage) {
      await this.currentPage.close();
      this.currentPage = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadPageWithShowMore(url: string): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    const page: Page = await this.browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(scraperSettings.scraping.userAgent);

      console.log(`Loading page: ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: scraperSettings.puppeteer.timeout
      });

      console.log(`Page loaded, waiting for initial content...`);
      await this.delay(scraperSettings.delays.initialPageLoad);

      let clickCount = 0;
      const maxClicks = scraperSettings.puppeteer.maxShowMoreClicks;
      let previousProductCount = 0;
      let noChangeCount = 0;

      while (clickCount < maxClicks) {
        const currentProductCount = await page.evaluate(() => {
          return document.querySelectorAll('a[href*="!"]').length;
        });

        console.log(`Products loaded: ${currentProductCount}`);

        if (currentProductCount > 0 && currentProductCount === previousProductCount) {
          noChangeCount++;
          if (noChangeCount >= 2) {
            console.log('No new products loaded for 2 attempts, stopping...');
            break;
          }
        } else {
          noChangeCount = 0;
        }

        previousProductCount = currentProductCount;

        const buttonClicked = await page.evaluate(() => {
          const buttons = [...document.querySelectorAll('button, a, div')];
          const showMore = buttons.find(b => {
            const text = (b.textContent || '').toLowerCase();
            return text.includes('показать') ||
                   text.includes('еще') ||
                   text.includes('ещё') ||
                   text.includes('more') ||
                   text.includes('load') ||
                   text.includes('больше');
          });

          if (showMore) {
            (showMore as HTMLElement).click();
            return true;
          }
          return false;
        });

        if (!buttonClicked) {
          console.log('No "Show More" button found, stopping...');
          break;
        }

        console.log(`Click ${clickCount + 1}/${maxClicks}: Waiting for new products...`);
        await this.delay(2500);

        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        await this.delay(500);

        clickCount++;
      }

      const finalCount = await page.evaluate(() => {
        return document.querySelectorAll('a[href*="!"]').length;
      });

      console.log(`Finished loading page. Total clicks: ${clickCount}, Final products: ${finalCount}`);

      const html = await page.content();
      await page.close();

      return html;
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async initializeBatchMode(url: string): Promise<void> {
    if (!this.browser) {
      await this.initialize();
    }

    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    if (this.currentPage) {
      await this.currentPage.close();
    }

    this.currentPage = await this.browser.newPage();
    await this.currentPage.setViewport({ width: 1920, height: 1080 });
    await this.currentPage.setUserAgent(scraperSettings.scraping.userAgent);

    console.log(`\n🌐 Loading page in batch mode: ${url}`);
    await this.currentPage.goto(url, {
      waitUntil: 'networkidle2',
      timeout: scraperSettings.puppeteer.timeout
    });

    console.log(`✅ Page loaded, waiting for initial content...`);
    await this.delay(scraperSettings.delays.initialPageLoad);
  }

  async loadNextBatch(targetProductCount: number): Promise<BatchLoadResult> {
    if (!this.currentPage) {
      throw new Error('Batch mode not initialized. Call initializeBatchMode first.');
    }

    const initialCount = await this.currentPage.evaluate(() => {
      return document.querySelectorAll('a[href*="!"]').length;
    });

    console.log(`\n📦 Starting batch load from ${initialCount} products...`);

    let clicksPerformed = 0;
    let previousCount = initialCount;
    let noChangeCount = 0;
    const maxAttempts = 10;

    while (clicksPerformed < maxAttempts) {
      const currentCount = await this.currentPage.evaluate(() => {
        return document.querySelectorAll('a[href*="!"]').length;
      });

      const productsLoadedSoFar = currentCount - initialCount;

      console.log(`   Products in current batch: ${productsLoadedSoFar} (Total on page: ${currentCount})`);

      if (productsLoadedSoFar >= targetProductCount) {
        console.log(`✅ Target reached: ${productsLoadedSoFar} products loaded`);
        break;
      }

      if (currentCount === previousCount) {
        noChangeCount++;
        if (noChangeCount >= 2) {
          console.log(`⚠️  No new products after ${noChangeCount} clicks, stopping batch...`);
          break;
        }
      } else {
        noChangeCount = 0;
      }

      previousCount = currentCount;

      const buttonClicked = await this.currentPage.evaluate(() => {
        const buttons = [...document.querySelectorAll('button, a, div')];
        const showMore = buttons.find(b => {
          const text = (b.textContent || '').toLowerCase();
          return text.includes('показать') ||
                 text.includes('еще') ||
                 text.includes('ещё') ||
                 text.includes('more') ||
                 text.includes('load') ||
                 text.includes('больше');
        });

        if (showMore) {
          (showMore as HTMLElement).click();
          return true;
        }
        return false;
      });

      if (!buttonClicked) {
        console.log('⚠️  No "Show More" button found, might be at end of list');
        break;
      }

      clicksPerformed++;
      console.log(`   🖱️  Click ${clicksPerformed}: Waiting for products to load...`);

      await this.delay(2500);

      await this.currentPage.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await this.delay(500);
    }

    const finalCount = await this.currentPage.evaluate(() => {
      return document.querySelectorAll('a[href*="!"]').length;
    });

    const productsLoaded = finalCount - initialCount;

    const hasMoreButton = await this.currentPage.evaluate(() => {
      const buttons = [...document.querySelectorAll('button, a, div')];
      return buttons.some(b => {
        const text = (b.textContent || '').toLowerCase();
        return text.includes('показать') ||
               text.includes('еще') ||
               text.includes('ещё') ||
               text.includes('more') ||
               text.includes('load') ||
               text.includes('больше');
      });
    });

    const html = await this.currentPage.content();

    return {
      html,
      productsLoaded,
      clicksPerformed,
      hasMore: hasMoreButton && productsLoaded > 0
    };
  }

  async closeBatchMode(): Promise<void> {
    if (this.currentPage) {
      await this.currentPage.close();
      this.currentPage = null;
    }
  }
}
