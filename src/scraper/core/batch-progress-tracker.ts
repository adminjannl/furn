import * as fs from 'fs';
import * as path from 'path';

export interface BatchProgress {
  categorySlug: string;
  categoryName: string;
  totalClicks: number;
  totalProductsScraped: number;
  currentBatch: number;
  lastBatchTimestamp: string;
  productsPerBatch: number;
  scrapedUrls: string[];
  sessionId: string;
  lastUrl: string;
}

export class BatchProgressTracker {
  private progressDir: string;
  private sessionCache: Map<string, Set<string>>;

  constructor() {
    this.progressDir = path.join(process.cwd(), '.scraper-progress');
    this.sessionCache = new Map();
    this.ensureProgressDir();
  }

  private ensureProgressDir(): void {
    if (!fs.existsSync(this.progressDir)) {
      fs.mkdirSync(this.progressDir, { recursive: true });
    }
  }

  private getProgressFilePath(categorySlug: string, sessionId: string): string {
    return path.join(this.progressDir, `${categorySlug}-${sessionId}.json`);
  }

  initializeSession(categorySlug: string, categoryName: string, productsPerBatch: number): BatchProgress {
    const sessionId = Date.now().toString();

    const progress: BatchProgress = {
      categorySlug,
      categoryName,
      totalClicks: 0,
      totalProductsScraped: 0,
      currentBatch: 1,
      lastBatchTimestamp: new Date().toISOString(),
      productsPerBatch,
      scrapedUrls: [],
      sessionId,
      lastUrl: ''
    };

    this.sessionCache.set(sessionId, new Set<string>());
    this.saveProgress(progress);

    return progress;
  }

  saveProgress(progress: BatchProgress): void {
    const filePath = this.getProgressFilePath(progress.categorySlug, progress.sessionId);
    fs.writeFileSync(filePath, JSON.stringify(progress, null, 2), 'utf-8');
  }

  loadProgress(categorySlug: string, sessionId: string): BatchProgress | null {
    const filePath = this.getProgressFilePath(categorySlug, sessionId);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const progress = JSON.parse(data) as BatchProgress;

      this.sessionCache.set(sessionId, new Set(progress.scrapedUrls));

      return progress;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  listSessions(categorySlug?: string): Array<{ categorySlug: string; sessionId: string; timestamp: string }> {
    const files = fs.readdirSync(this.progressDir);
    const sessions: Array<{ categorySlug: string; sessionId: string; timestamp: string }> = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const [slug, sessionId] = file.replace('.json', '').split('-');

      if (categorySlug && slug !== categorySlug) continue;

      const filePath = path.join(this.progressDir, file);
      const stats = fs.statSync(filePath);

      sessions.push({
        categorySlug: slug,
        sessionId,
        timestamp: stats.mtime.toISOString()
      });
    }

    return sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  updateBatchProgress(progress: BatchProgress, newProducts: string[], clicksPerformed: number): BatchProgress {
    const updatedProgress: BatchProgress = {
      ...progress,
      totalClicks: progress.totalClicks + clicksPerformed,
      totalProductsScraped: progress.totalProductsScraped + newProducts.length,
      currentBatch: progress.currentBatch + 1,
      lastBatchTimestamp: new Date().toISOString(),
      scrapedUrls: [...progress.scrapedUrls, ...newProducts]
    };

    const sessionUrls = this.sessionCache.get(progress.sessionId) || new Set();
    newProducts.forEach(url => sessionUrls.add(url));
    this.sessionCache.set(progress.sessionId, sessionUrls);

    this.saveProgress(updatedProgress);

    return updatedProgress;
  }

  isUrlScrapedInSession(sessionId: string, url: string): boolean {
    const sessionUrls = this.sessionCache.get(sessionId);
    return sessionUrls ? sessionUrls.has(url) : false;
  }

  getSessionCache(sessionId: string): Set<string> {
    return this.sessionCache.get(sessionId) || new Set();
  }

  clearSession(categorySlug: string, sessionId: string): void {
    const filePath = this.getProgressFilePath(categorySlug, sessionId);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    this.sessionCache.delete(sessionId);
  }

  generateReport(progress: BatchProgress): string {
    const report = [
      '',
      '═'.repeat(70),
      `  BATCH SCRAPING PROGRESS REPORT`,
      '═'.repeat(70),
      '',
      `Category: ${progress.categoryName}`,
      `Session ID: ${progress.sessionId}`,
      `Current Batch: ${progress.currentBatch}`,
      `Products per Batch: ${progress.productsPerBatch}`,
      '',
      '─'.repeat(70),
      '',
      `Total Clicks Performed: ${progress.totalClicks}`,
      `Total Products Scraped: ${progress.totalProductsScraped}`,
      `Last Batch Time: ${new Date(progress.lastBatchTimestamp).toLocaleString()}`,
      '',
      '═'.repeat(70),
      ''
    ].join('\n');

    return report;
  }
}
