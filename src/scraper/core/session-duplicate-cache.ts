import { DuplicateDetector } from '../services/duplicate-detector';

export interface CacheStats {
  sessionCacheHits: number;
  databaseCacheHits: number;
  totalChecks: number;
  uniqueProducts: number;
}

export class SessionDuplicateCache {
  private sessionUrls: Set<string>;
  private sessionNames: Set<string>;
  private duplicateDetector: DuplicateDetector;
  private stats: CacheStats;

  constructor() {
    this.sessionUrls = new Set();
    this.sessionNames = new Set();
    this.duplicateDetector = new DuplicateDetector();
    this.stats = {
      sessionCacheHits: 0,
      databaseCacheHits: 0,
      totalChecks: 0,
      uniqueProducts: 0
    };
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.hash = '';
      urlObj.search = '';
      return urlObj.href.toLowerCase().trim();
    } catch {
      return url.toLowerCase().trim();
    }
  }

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  addToSession(url: string, name: string): void {
    const normalizedUrl = this.normalizeUrl(url);
    const normalizedName = this.normalizeName(name);

    this.sessionUrls.add(normalizedUrl);
    this.sessionNames.add(normalizedName);
    this.stats.uniqueProducts++;
  }

  isInSessionCache(url: string, name: string): boolean {
    const normalizedUrl = this.normalizeUrl(url);
    const normalizedName = this.normalizeName(name);

    return this.sessionUrls.has(normalizedUrl) || this.sessionNames.has(normalizedName);
  }

  async isDuplicate(productData: {
    url: string;
    name: string;
    russianName: string;
    sku?: string;
  }): Promise<{ isDuplicate: boolean; reason: string; source: 'session' | 'database' | 'none' }> {
    this.stats.totalChecks++;

    if (this.isInSessionCache(productData.url, productData.russianName)) {
      this.stats.sessionCacheHits++;
      return {
        isDuplicate: true,
        reason: 'Found in current session cache',
        source: 'session'
      };
    }

    const dbCheck = await this.duplicateDetector.shouldSkip(productData);

    if (dbCheck.skip) {
      this.stats.databaseCacheHits++;
      return {
        isDuplicate: true,
        reason: dbCheck.reason,
        source: 'database'
      };
    }

    this.addToSession(productData.url, productData.russianName);

    return {
      isDuplicate: false,
      reason: 'Unique product',
      source: 'none'
    };
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getSessionSize(): number {
    return this.sessionUrls.size;
  }

  clearSession(): void {
    this.sessionUrls.clear();
    this.sessionNames.clear();
    this.stats = {
      sessionCacheHits: 0,
      databaseCacheHits: 0,
      totalChecks: 0,
      uniqueProducts: 0
    };
  }

  loadFromProgress(urls: string[]): void {
    urls.forEach(url => {
      this.sessionUrls.add(this.normalizeUrl(url));
    });
  }

  exportSessionData(): string[] {
    return Array.from(this.sessionUrls);
  }

  printStats(): void {
    const stats = this.getStats();
    const duplicateRate = stats.totalChecks > 0
      ? ((stats.sessionCacheHits + stats.databaseCacheHits) / stats.totalChecks * 100).toFixed(1)
      : '0.0';

    console.log('\n┌─ Duplicate Detection Stats ─────────────────────────────┐');
    console.log(`│ Total Checks:         ${String(stats.totalChecks).padStart(6)} products             │`);
    console.log(`│ Session Cache Hits:   ${String(stats.sessionCacheHits).padStart(6)} (already scraped)   │`);
    console.log(`│ Database Cache Hits:  ${String(stats.databaseCacheHits).padStart(6)} (in database)      │`);
    console.log(`│ Unique Products:      ${String(stats.uniqueProducts).padStart(6)} (new)               │`);
    console.log(`│ Duplicate Rate:       ${String(duplicateRate).padStart(6)}%                     │`);
    console.log('└──────────────────────────────────────────────────────────┘\n');
  }
}
