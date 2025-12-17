import { useState } from 'react';
import { Download, CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ScrapeStats {
  page: number;
  succeeded: number;
  failed: number;
  status: 'idle' | 'scraping' | 'done' | 'error';
}

export default function SofaScraper() {
  const [stats, setStats] = useState<ScrapeStats[]>(
    Array.from({ length: 9 }, (_, i) => ({
      page: i + 1,
      succeeded: 0,
      failed: 0,
      status: 'idle',
    }))
  );

  const scrapePage = async (pageNum: number) => {
    setStats((prev) =>
      prev.map((s) =>
        s.page === pageNum ? { ...s, status: 'scraping', succeeded: 0, failed: 0 } : s
      )
    );

    try {
      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ashley-scraper`;

      console.log(`🚀 Scraping Ashley page ${pageNum}...`);

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          pageNum,
          importToDb: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function error:', errorText);
        throw new Error(`Failed to scrape: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      console.log('Scrape result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Scraping failed');
      }

      const { succeeded, failed } = result;

      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? { ...s, status: 'done', succeeded, failed }
            : s
        )
      );

      console.log(`✅ Page ${pageNum}: ${succeeded} succeeded, ${failed} failed`);
    } catch (error) {
      console.error('Error scraping page:', error);
      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? { ...s, status: 'error', failed: 1 }
            : s
        )
      );
    }
  };

  const totalSucceeded = stats.reduce((sum, s) => sum + s.succeeded, 0);
  const totalFailed = stats.reduce((sum, s) => sum + s.failed, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-oak-900 mb-2">Sofa Scraper</h1>
        <p className="text-oak-600">Scrape sofas from Ashley Furniture (9 pages, 30 per page)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-sm text-oak-600 mb-1">Total Scraped</div>
          <div className="text-2xl font-bold text-oak-900">{totalSucceeded + totalFailed}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Succeeded</div>
          <div className="text-2xl font-bold text-green-900">{totalSucceeded}</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-900">{totalFailed}</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-blue-700 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-blue-900">
            {totalSucceeded + totalFailed > 0
              ? Math.round((totalSucceeded / (totalSucceeded + totalFailed)) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-oak-900 mb-4">Pages</h2>
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
                {(stat.succeeded > 0 || stat.failed > 0) && (
                  <div className="text-xs space-y-1">
                    <div className="text-green-600 font-medium">+{stat.succeeded}</div>
                    <div className="text-red-600 font-medium">-{stat.failed}</div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
