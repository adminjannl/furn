import { useState } from 'react';
import { Download, CheckCircle, XCircle, Loader, ClipboardPaste, ExternalLink, Trash2, AlertTriangle, Search, Clock, Zap, ListChecks, Settings, ImageIcon, FileText } from 'lucide-react';

type TabType = 'batch' | 'single' | 'gap' | 'manual' | 'settings' | 'deep' | 'descriptions';

interface ScrapeStats {
  page: number;
  succeeded: number;
  failed: number;
  total: number;
  status: 'idle' | 'scraping' | 'done' | 'error';
  errorMessage?: string;
  startTime?: number;
  endTime?: number;
  products?: Array<{ name: string; sku: string; price: number }>;
}

interface GalleryResult {
  sku: string;
  images: string[];
  count: number;
}

interface GapAnalysis {
  missingPages: number[];
  incompletePages: { page: number; count: number }[];
  totalInDb: number;
  expectedTotal: number;
}

const PRODUCTS_PER_PAGE = 30;
const TOTAL_PAGES = 9;

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

function EstimatedTime({ fetchFullGallery, validateImages, productCount }: { fetchFullGallery: boolean; validateImages: boolean; productCount: number }) {
  let timePerProduct = 0.5;
  if (fetchFullGallery) timePerProduct = 3;
  if (validateImages) timePerProduct += 2;

  const totalSeconds = productCount * timePerProduct;

  return (
    <div className="flex items-center gap-2 text-sm text-oak-600">
      <Clock className="w-4 h-4" />
      <span>Estimated: {formatTime(totalSeconds)}</span>
    </div>
  );
}

function ProgressBar({ current, total, startTime }: { current: number; total: number; startTime?: number }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const rate = current > 0 ? elapsed / current : 0;
  const remaining = rate > 0 ? (total - current) * rate : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-oak-600">
        <span>{current} / {total} products</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-oak-500 to-oak-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {startTime && current > 0 && current < total && (
        <div className="flex justify-between text-xs text-oak-500">
          <span>Elapsed: {formatTime(elapsed)}</span>
          <span>Remaining: ~{formatTime(remaining)}</span>
        </div>
      )}
    </div>
  );
}

export default function SofaScraper() {
  const [activeTab, setActiveTab] = useState<TabType>('batch');
  const [stats, setStats] = useState<ScrapeStats[]>(
    Array.from({ length: TOTAL_PAGES }, (_, i) => ({
      page: i + 1,
      succeeded: 0,
      failed: 0,
      total: 0,
      status: 'idle',
    }))
  );
  const [manualHtml, setManualHtml] = useState('');
  const [manualStatus, setManualStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [manualResult, setManualResult] = useState<{ succeeded: number; failed: number; total: number } | null>(null);
  const [manualError, setManualError] = useState('');
  const [fetchDetails, setFetchDetails] = useState(false);
  const [validateImages, setValidateImages] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'done' | 'error'>('idle');
  const [deleteResult, setDeleteResult] = useState<{ deleted: number; page?: number } | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const [gallerySku, setGallerySku] = useState('');
  const [galleryStatus, setGalleryStatus] = useState<'idle' | 'fetching' | 'done' | 'error'>('idle');
  const [galleryResult, setGalleryResult] = useState<GalleryResult | null>(null);
  const [galleryError, setGalleryError] = useState('');

  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [gapStatus, setGapStatus] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle');

  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0, startTime: 0 });

  const [deepScrapeStatus, setDeepScrapeStatus] = useState<'idle' | 'scraping' | 'done' | 'error'>('idle');
  const [deepScrapeResults, setDeepScrapeResults] = useState<{ sku: string; imageCount: number; status: string }[]>([]);
  const [deepScrapeProgress, setDeepScrapeProgress] = useState({ current: 0, total: 0 });
  const [skusToScrape, setSkusToScrape] = useState('');

  const [descriptionStatus, setDescriptionStatus] = useState<'idle' | 'updating' | 'done' | 'error'>('idle');
  const [descriptionResults, setDescriptionResults] = useState<{ sku: string; success: boolean; descriptionLength?: number; error?: string }[]>([]);
  const [descriptionProgress, setDescriptionProgress] = useState({ current: 0, total: 0 });
  const [descriptionPageNum, setDescriptionPageNum] = useState<number>(1);

  const scrapeImagesForSkus = async () => {
    const skus = skusToScrape
      .split(/[\n,\s]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length > 0);

    if (skus.length === 0) return;

    setDeepScrapeStatus('scraping');
    setDeepScrapeResults([]);
    setDeepScrapeProgress({ current: 0, total: skus.length });

    const results: { sku: string; imageCount: number; status: string }[] = [];
    const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

    for (let i = 0; i < skus.length; i++) {
      const sku = skus[i];
      setDeepScrapeProgress({ current: i + 1, total: skus.length });

      try {
        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ mode: 'scrape-images', sku, importToDb: true }),
        });

        const result = await response.json();
        results.push({
          sku,
          imageCount: result.count || 0,
          status: result.success ? 'done' : 'error',
        });
      } catch {
        results.push({ sku, imageCount: 0, status: 'error' });
      }

      setDeepScrapeResults([...results]);
    }

    setDeepScrapeStatus('done');
  };

  const updateDescriptions = async (pageNum?: number) => {
    setDescriptionStatus('updating');
    setDescriptionResults([]);
    setDescriptionProgress({ current: 0, total: 0 });

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const body: any = { mode: 'update-descriptions' };
      if (pageNum) {
        body.pageNum = pageNum;
      }

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        setDescriptionResults(result.results || []);
        setDescriptionProgress({ current: result.succeeded + result.failed, total: result.total });
        setDescriptionStatus('done');
      } else {
        setDescriptionStatus('error');
      }
    } catch (error) {
      setDescriptionStatus('error');
      setDescriptionResults([{ sku: 'error', success: false, error: 'Request failed' }]);
    }
  };

  const scrapePage = async (pageNum: number) => {
    const startTime = Date.now();
    setStats((prev) =>
      prev.map((s) =>
        s.page === pageNum ? { ...s, status: 'scraping', succeeded: 0, failed: 0, startTime } : s
      )
    );
    setCurrentProgress({ current: 0, total: PRODUCTS_PER_PAGE, startTime });

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ pageNum, importToDb: true }),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Scraping failed');
      }

      const endTime = Date.now();
      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? {
                ...s,
                status: 'done',
                succeeded: result.succeeded || 0,
                failed: result.failed || 0,
                total: result.total || 0,
                errorMessage: result.errors?.[0],
                endTime,
                products: result.products || []
              }
            : s
        )
      );
      setCurrentProgress({ current: 0, total: 0, startTime: 0 });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? { ...s, status: 'error', failed: 1, errorMessage: errorMsg, endTime: Date.now() }
            : s
        )
      );
      setCurrentProgress({ current: 0, total: 0, startTime: 0 });
    }
  };

  const processManualHtml = async () => {
    if (!manualHtml || manualHtml.length < 500) {
      setManualError('Please paste valid HTML (at least 500 characters)');
      return;
    }

    setManualStatus('processing');
    setManualError('');
    setManualResult(null);

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ rawHtml: manualHtml, importToDb: true, fetchDetails }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Processing failed');
      }

      setManualResult({
        succeeded: result.succeeded || 0,
        failed: result.failed || 0,
        total: result.total || 0,
      });
      setManualStatus('done');
      setManualHtml('');
    } catch (error) {
      setManualError(error instanceof Error ? error.message : 'Unknown error');
      setManualStatus('error');
    }
  };

  const deleteAllSofas = async () => {
    if (!confirmDeleteAll) {
      setConfirmDeleteAll(true);
      return;
    }

    setDeleteStatus('deleting');
    setDeleteResult(null);
    setConfirmDeleteAll(false);

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ mode: 'delete', deleteAll: true }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }

      setDeleteResult({ deleted: result.deleted });
      setDeleteStatus('done');
    } catch (error) {
      setDeleteStatus('error');
    }
  };

  const fetchGallery = async () => {
    if (!gallerySku.trim()) {
      setGalleryError('Please enter a SKU');
      return;
    }

    setGalleryStatus('fetching');
    setGalleryError('');
    setGalleryResult(null);

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          mode: 'gallery',
          sku: gallerySku.trim().toUpperCase(),
          importToDb: true,
          validateImages,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Gallery fetch failed');
      }

      setGalleryResult({
        sku: result.sku,
        images: result.images || [],
        count: result.count || 0,
      });
      setGalleryStatus('done');
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : 'Unknown error');
      setGalleryStatus('error');
    }
  };

  const deletePageSofas = async (pageNum: number) => {
    setDeleteStatus('deleting');
    setDeleteResult(null);

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ mode: 'delete', pageNum }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }

      setDeleteResult({ deleted: result.deleted, page: pageNum });
      setDeleteStatus('done');
    } catch (error) {
      setDeleteStatus('error');
    }
  };

  const analyzeGaps = async () => {
    setGapStatus('analyzing');
    setGapAnalysis(null);

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ mode: 'analyze-gaps' }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Gap analysis failed');
      }

      setGapAnalysis({
        missingPages: result.missingPages || [],
        incompletePages: result.incompletePages || [],
        totalInDb: result.totalInDb || 0,
        expectedTotal: result.expectedTotal || TOTAL_PAGES * PRODUCTS_PER_PAGE,
      });
      setGapStatus('done');
    } catch (error) {
      setGapStatus('error');
    }
  };

  const totalSucceeded = stats.reduce((sum, s) => sum + s.succeeded, 0) + (manualResult?.succeeded || 0);
  const totalFailed = stats.reduce((sum, s) => sum + s.failed, 0) + (manualResult?.failed || 0);
  const isAnyScraping = stats.some(s => s.status === 'scraping');

  const getPageUrl = (page: number) => {
    const start = (page - 1) * 30;
    return page === 1
      ? 'https://www.ashleyfurniture.com/c/furniture/living-room/sofas/'
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${start}&sz=30`;
  };

  const tabs: { id: TabType; label: string; icon: typeof Download }[] = [
    { id: 'batch', label: 'Batch Scrape', icon: Download },
    { id: 'deep', label: 'Deep Images', icon: ImageIcon },
    { id: 'descriptions', label: 'Descriptions', icon: FileText },
    { id: 'single', label: 'Single Product', icon: Search },
    { id: 'gap', label: 'Gap Detection', icon: ListChecks },
    { id: 'manual', label: 'Manual HTML', icon: ClipboardPaste },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-oak-900 mb-2">Sofa Scraper</h1>
        <p className="text-oak-600">Import sofas from Ashley Furniture</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-sm text-oak-600 mb-1">Total Processed</div>
          <div className="text-2xl font-bold text-oak-900">{totalSucceeded + totalFailed}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Succeeded</div>
          <div className="text-2xl font-bold text-green-900">{totalSucceeded}</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">Failed/Duplicates</div>
          <div className="text-2xl font-bold text-red-900">{totalFailed}</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-blue-700 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-blue-900">
            {totalSucceeded + totalFailed > 0
              ? Math.round((totalSucceeded / (totalSucceeded + totalFailed)) * 100)
              : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-oak-600 text-oak-900 bg-oak-50'
                      : 'border-transparent text-oak-500 hover:text-oak-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'batch' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900">Automated Page Scraping</h2>
                <p className="text-sm text-oak-500">Click a page to scrape ~30 products with all gallery images</p>
              </div>

              {isAnyScraping && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Scraping in progress... This may take 2-5 minutes per page.</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {stats.map((stat) => (
                  <button
                    key={stat.page}
                    onClick={() => scrapePage(stat.page)}
                    disabled={stat.status === 'scraping'}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-200
                      ${
                        stat.status === 'idle'
                          ? 'border-slate-300 hover:border-oak-500 hover:bg-oak-50'
                          : stat.status === 'scraping'
                          ? 'border-blue-400 bg-blue-50 cursor-not-allowed'
                          : stat.status === 'done'
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-400 bg-red-50'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold text-oak-900 mb-2">
                        Page {stat.page}
                      </div>
                      {stat.status === 'scraping' && (
                        <Loader className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                      )}
                      {stat.status === 'done' && (
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      )}
                      {stat.status === 'error' && (
                        <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      )}
                      {stat.status === 'idle' && (
                        <Download className="w-6 h-6 text-oak-400 mx-auto mb-2" />
                      )}
                      {(stat.succeeded > 0 || stat.failed > 0 || stat.total > 0) && (
                        <div className="text-xs space-y-1">
                          {stat.total > 0 && (
                            <div className="text-oak-600 font-medium">Found: {stat.total}</div>
                          )}
                          <div className="text-green-600 font-medium">+{stat.succeeded}</div>
                          <div className="text-red-600 font-medium">-{stat.failed}</div>
                        </div>
                      )}
                      {stat.startTime && stat.endTime && (
                        <div className="text-xs text-oak-500 mt-1">
                          {formatTime((stat.endTime - stat.startTime) / 1000)}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {stats.filter(s => s.status === 'done' && s.products && s.products.length > 0).map((stat) => (
                <div key={`products-${stat.page}`} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-oak-900 mb-3">
                    Page {stat.page} Products ({stat.products?.length || 0})
                  </h3>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="grid gap-2">
                      {stat.products?.map((product, idx) => (
                        <div
                          key={`${stat.page}-${product.sku}`}
                          className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 hover:border-oak-300 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-oak-900 text-sm truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-oak-500 font-mono">SKU: {product.sku}</div>
                          </div>
                          <div className="text-sm font-semibold text-oak-700 ml-3">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  <strong>Tip:</strong> Use "Manual HTML" tab for faster, more reliable imports - bypasses bot detection.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'deep' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900 mb-1">Deep Image Scraper</h2>
                <p className="text-sm text-oak-500">
                  Visit each product page to scrape ALL gallery images. Enter SKUs below (one per line or comma-separated).
                </p>
              </div>

              <div className="space-y-3">
                <textarea
                  value={skusToScrape}
                  onChange={(e) => setSkusToScrape(e.target.value)}
                  placeholder="Enter SKUs (e.g., U4380887, U4380888 or one per line)"
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-oak-500 focus:border-oak-500 font-mono text-sm"
                />
                <button
                  onClick={scrapeImagesForSkus}
                  disabled={deepScrapeStatus === 'scraping' || !skusToScrape.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-oak-600 hover:bg-oak-700 text-white rounded-lg disabled:opacity-50"
                >
                  {deepScrapeStatus === 'scraping' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  Scrape Images ({skusToScrape.split(/[\n,\s]+/).filter(s => s.trim()).length} SKUs)
                </button>
              </div>

              {deepScrapeStatus === 'scraping' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Scraping {deepScrapeProgress.current} / {deepScrapeProgress.total}...</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${deepScrapeProgress.total > 0 ? (deepScrapeProgress.current / deepScrapeProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {deepScrapeResults.length > 0 && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-oak-900 mb-3">Results</h3>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {deepScrapeResults.map((r, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded text-sm ${
                          r.status === 'done' ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {r.status === 'done' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-mono">{r.sku}</span>
                        </div>
                        <span className="font-medium">{r.imageCount} images</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {deepScrapeStatus === 'done' && (
                <div className="flex items-center gap-2 text-green-700 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>Done! Scraped images for {deepScrapeResults.length} products.</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'descriptions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900 mb-1">Update Product Descriptions</h2>
                <p className="text-sm text-oak-500">
                  Scrape detailed product descriptions from Ashley Furniture product pages and update database.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-oak-700">
                    Select Page (Optional)
                  </label>
                  <select
                    value={descriptionPageNum}
                    onChange={(e) => setDescriptionPageNum(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-oak-500 focus:border-oak-500"
                  >
                    <option value={0}>All Pages (270 products)</option>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((page) => (
                      <option key={page} value={page}>
                        Page {page} (30 products)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-oak-700">Action</label>
                  <button
                    onClick={() => updateDescriptions(descriptionPageNum || undefined)}
                    disabled={descriptionStatus === 'updating'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-oak-600 hover:bg-oak-700 text-white rounded-lg disabled:opacity-50"
                  >
                    {descriptionStatus === 'updating' ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Update Descriptions
                      </>
                    )}
                  </button>
                </div>
              </div>

              {descriptionStatus === 'updating' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Updating descriptions... This may take a few minutes.</span>
                  </div>
                  {descriptionProgress.total > 0 && (
                    <>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(descriptionProgress.current / descriptionProgress.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {descriptionProgress.current} / {descriptionProgress.total} processed
                      </div>
                    </>
                  )}
                </div>
              )}

              {descriptionResults.length > 0 && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-oak-900 mb-3">
                    Results ({descriptionResults.filter(r => r.success).length} succeeded, {descriptionResults.filter(r => !r.success).length} failed)
                  </h3>
                  <div className="max-h-96 overflow-y-auto space-y-1">
                    {descriptionResults.map((r, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded text-sm ${
                          r.success ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {r.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                          <span className="font-mono truncate">{r.sku}</span>
                        </div>
                        {r.success ? (
                          <span className="font-medium text-green-700 ml-2 flex-shrink-0">
                            {r.descriptionLength} chars
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 ml-2 truncate max-w-xs">
                            {r.error}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {descriptionStatus === 'done' && descriptionResults.length > 0 && (
                <div className="flex items-center gap-2 text-green-700 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>
                    Done! Updated {descriptionResults.filter(r => r.success).length} descriptions.
                  </span>
                </div>
              )}

              {descriptionStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-700 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span>Failed to update descriptions. Please try again.</span>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  <strong>Note:</strong> Description scraping visits each product page individually, so it takes longer than batch scraping.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'single' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900 mb-1">Single Product Gallery Extraction</h2>
                <p className="text-sm text-oak-500">
                  Extract all gallery images for a specific product by SKU. Uses Scene7 API + HTML parsing.
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={gallerySku}
                  onChange={(e) => setGallerySku(e.target.value)}
                  placeholder="Enter SKU (e.g., U4380887)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-oak-500 focus:border-oak-500"
                  onKeyDown={(e) => e.key === 'Enter' && fetchGallery()}
                />
                <button
                  onClick={fetchGallery}
                  disabled={galleryStatus === 'fetching'}
                  className="flex items-center gap-2 px-4 py-2 bg-oak-600 hover:bg-oak-700 text-white rounded-lg disabled:opacity-50"
                >
                  {galleryStatus === 'fetching' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Extract Gallery
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-oak-600">
                <Clock className="w-4 h-4" />
                <span>Estimated: 2-5 seconds per product</span>
              </div>

              {galleryStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-700 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span>{galleryError}</span>
                </div>
              )}

              {galleryStatus === 'done' && galleryResult && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Found {galleryResult.count} images for {galleryResult.sku}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {galleryResult.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square bg-white rounded overflow-hidden hover:ring-2 hover:ring-oak-500 border border-slate-200"
                      >
                        <img
                          src={img.replace('wid=1200&hei=900', 'wid=200&hei=150')}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gap' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900 mb-1">Gap Detection</h2>
                <p className="text-sm text-oak-500">
                  Analyze your database to find missing products and incomplete pages.
                </p>
              </div>

              <button
                onClick={analyzeGaps}
                disabled={gapStatus === 'analyzing'}
                className="flex items-center gap-2 px-4 py-2 bg-oak-600 hover:bg-oak-700 text-white rounded-lg disabled:opacity-50"
              >
                {gapStatus === 'analyzing' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ListChecks className="w-4 h-4" />
                )}
                Analyze Gaps
              </button>

              {gapStatus === 'done' && gapAnalysis && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="text-sm text-oak-600 mb-1">Products in Database</div>
                      <div className="text-2xl font-bold text-oak-900">{gapAnalysis.totalInDb}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="text-sm text-oak-600 mb-1">Expected Total</div>
                      <div className="text-2xl font-bold text-oak-900">{gapAnalysis.expectedTotal}</div>
                    </div>
                  </div>

                  {gapAnalysis.missingPages.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h3 className="font-medium text-red-800 mb-2">Missing Pages</h3>
                      <div className="flex flex-wrap gap-2">
                        {gapAnalysis.missingPages.map((page) => (
                          <button
                            key={page}
                            onClick={() => {
                              setActiveTab('batch');
                              scrapePage(page);
                            }}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
                          >
                            Scrape Page {page}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {gapAnalysis.incompletePages.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h3 className="font-medium text-amber-800 mb-2">Incomplete Pages</h3>
                      <div className="space-y-2">
                        {gapAnalysis.incompletePages.map(({ page, count }) => (
                          <div key={page} className="flex items-center justify-between">
                            <span className="text-amber-800">
                              Page {page}: {count}/{PRODUCTS_PER_PAGE} products
                            </span>
                            <button
                              onClick={() => {
                                setActiveTab('batch');
                                scrapePage(page);
                              }}
                              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-sm"
                            >
                              Re-scrape
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gapAnalysis.missingPages.length === 0 && gapAnalysis.incompletePages.length === 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">All pages complete! No gaps detected.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900 mb-1">Manual HTML Import</h2>
                <p className="text-sm text-oak-500">
                  Paste HTML source from Ashley Furniture pages to import products. This method bypasses bot detection.
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-medium text-amber-800 mb-2">How to get the HTML:</h3>
                <ol className="text-amber-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Open an Ashley sofa page in your browser</li>
                  <li>Right-click and select "View Page Source" (Ctrl+U / Cmd+Option+U)</li>
                  <li>Copy ALL the HTML (Ctrl+A, Ctrl+C)</li>
                  <li>Paste it below and click "Process HTML"</li>
                </ol>
              </div>

              <div className="flex flex-wrap gap-2">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={getPageUrl(page)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-oak-700 rounded text-sm"
                  >
                    Page {page} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fetchDetails}
                    onChange={(e) => setFetchDetails(e.target.checked)}
                    className="w-4 h-4 text-oak-600 border-slate-300 rounded focus:ring-oak-500"
                  />
                  <span className="text-sm text-oak-700">
                    <strong>Fetch full gallery</strong> after parsing HTML
                  </span>
                </label>
              </div>

              <textarea
                value={manualHtml}
                onChange={(e) => setManualHtml(e.target.value)}
                placeholder="Paste the full HTML source here..."
                className="w-full h-40 p-3 border border-slate-300 rounded-lg font-mono text-xs resize-y focus:ring-2 focus:ring-oak-500 focus:border-oak-500"
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={processManualHtml}
                  disabled={manualStatus === 'processing'}
                  className="flex items-center gap-2 px-4 py-2 bg-oak-600 hover:bg-oak-700 text-white rounded-lg disabled:opacity-50"
                >
                  {manualStatus === 'processing' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <ClipboardPaste className="w-4 h-4" />
                  )}
                  Process HTML
                </button>

                {manualStatus === 'done' && manualResult && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>Found {manualResult.total}, imported {manualResult.succeeded}</span>
                  </div>
                )}

                {manualStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5" />
                    <span>{manualError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-oak-900 mb-1">Scraper Settings</h2>
                <p className="text-sm text-oak-500">Configure scraping behavior and manage data.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-medium text-oak-900 mb-3">Default Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fetchDetails}
                        onChange={(e) => setFetchDetails(e.target.checked)}
                        className="w-4 h-4 text-oak-600 border-slate-300 rounded focus:ring-oak-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-oak-900">Fetch full gallery</span>
                        <p className="text-xs text-oak-500">Extract all images per product (slower, ~3s/product)</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={validateImages}
                        onChange={(e) => setValidateImages(e.target.checked)}
                        className="w-4 h-4 text-oak-600 border-slate-300 rounded focus:ring-oak-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-oak-900">Validate image URLs</span>
                        <p className="text-xs text-oak-500">Verify each image URL returns 200 OK (+2s/product)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-800">Danger Zone</h3>
                  </div>

                  {deleteStatus === 'done' && deleteResult && (
                    <div className="bg-white border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>
                          Deleted {deleteResult.deleted} sofas
                          {deleteResult.page ? ` from page ${deleteResult.page}` : ' (all)'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-red-700 text-sm mb-2">Delete sofas by page:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => deletePageSofas(page)}
                            disabled={deleteStatus === 'deleting'}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm disabled:opacity-50"
                          >
                            {deleteStatus === 'deleting' ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Page {page}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-red-200 pt-4">
                      <p className="text-red-700 text-sm mb-2">Delete ALL sofas:</p>
                      <button
                        onClick={deleteAllSofas}
                        disabled={deleteStatus === 'deleting'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          confirmDeleteAll
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-red-100 hover:bg-red-200 text-red-800'
                        }`}
                      >
                        {deleteStatus === 'deleting' ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {confirmDeleteAll ? 'Click again to confirm' : 'Delete All Sofas'}
                      </button>
                      {confirmDeleteAll && (
                        <button
                          onClick={() => setConfirmDeleteAll(false)}
                          className="ml-3 text-sm text-red-700 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
