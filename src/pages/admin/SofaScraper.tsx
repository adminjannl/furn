import { useState } from 'react';
import { Download, CheckCircle, XCircle, Loader, ClipboardPaste, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';

interface ScrapeStats {
  page: number;
  succeeded: number;
  failed: number;
  total: number;
  status: 'idle' | 'scraping' | 'done' | 'error';
  errorMessage?: string;
}

export default function SofaScraper() {
  const [stats, setStats] = useState<ScrapeStats[]>(
    Array.from({ length: 9 }, (_, i) => ({
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
  const [fetchDetails, setFetchDetails] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'done' | 'error'>('idle');
  const [deleteResult, setDeleteResult] = useState<{ deleted: number; page?: number } | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const scrapePage = async (pageNum: number) => {
    setStats((prev) =>
      prev.map((s) =>
        s.page === pageNum ? { ...s, status: 'scraping', succeeded: 0, failed: 0 } : s
      )
    );

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ pageNum, importToDb: true, fetchDetails }),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Scraping failed');
      }

      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? {
                ...s,
                status: 'done',
                succeeded: result.succeeded || 0,
                failed: result.failed || 0,
                total: result.total || 0,
                errorMessage: result.errors?.[0]
              }
            : s
        )
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? { ...s, status: 'error', failed: 1, errorMessage: errorMsg }
            : s
        )
      );
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
        body: JSON.stringify({ rawHtml: manualHtml, importToDb: true }),
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

  const totalSucceeded = stats.reduce((sum, s) => sum + s.succeeded, 0) + (manualResult?.succeeded || 0);
  const totalFailed = stats.reduce((sum, s) => sum + s.failed, 0) + (manualResult?.failed || 0);

  const getPageUrl = (page: number) => {
    const start = (page - 1) * 30;
    return page === 1
      ? 'https://www.ashleyfurniture.com/c/furniture/living-room/sofas/'
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${start}&sz=30`;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-oak-900 mb-2">Sofa Scraper</h1>
        <p className="text-oak-600">Import sofas from Ashley Furniture</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-amber-800 mb-2">Manual HTML Import (Recommended)</h3>
        <p className="text-amber-700 text-sm mb-3">
          Ashley blocks server requests. To import products:
        </p>
        <ol className="text-amber-700 text-sm space-y-1 list-decimal list-inside mb-4">
          <li>Open the Ashley sofa page in your browser</li>
          <li>Right-click and select "View Page Source" (Ctrl+U / Cmd+Option+U)</li>
          <li>Copy ALL the HTML (Ctrl+A, Ctrl+C)</li>
          <li>Paste it in the box below and click "Process HTML"</li>
        </ol>

        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
            <a
              key={page}
              href={getPageUrl(page)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-sm"
            >
              Page {page} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>

        <textarea
          value={manualHtml}
          onChange={(e) => setManualHtml(e.target.value)}
          placeholder="Paste the full HTML source here..."
          className="w-full h-32 p-3 border border-amber-300 rounded-lg font-mono text-xs resize-y"
        />

        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={processManualHtml}
            disabled={manualStatus === 'processing'}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
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

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-oak-900 mb-2">Automated Scrape (ScraperAPI)</h2>
        <p className="text-oak-500 text-sm mb-2">Click a page to automatically scrape 30 products.</p>

        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={fetchDetails}
            onChange={(e) => setFetchDetails(e.target.checked)}
            className="w-4 h-4 text-oak-600 border-slate-300 rounded focus:ring-oak-500"
          />
          <span className="text-sm text-oak-700">
            Fetch full gallery (all images per product) - slower but complete
          </span>
        </label>

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
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-red-50 rounded-lg border-2 border-red-200 p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800">Danger Zone - Delete Sofas</h2>
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

        {deleteStatus === 'error' && (
          <div className="bg-white border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <span>Delete operation failed</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-red-700 text-sm mb-3">Delete sofas by page (fetches page to identify SKUs):</p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
                <button
                  key={page}
                  onClick={() => deletePageSofas(page)}
                  disabled={deleteStatus === 'deleting'}
                  className="flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm disabled:opacity-50 transition-colors"
                >
                  {deleteStatus === 'deleting' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Page {page}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-red-200 pt-4">
            <p className="text-red-700 text-sm mb-3">Delete ALL sofas from the database:</p>
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
              {confirmDeleteAll ? 'Click again to confirm DELETE ALL' : 'Delete All Sofas'}
            </button>
            {confirmDeleteAll && (
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="ml-3 px-3 py-2 text-sm text-red-700 hover:text-red-900"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
