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
      const startParam = pageNum === 1 ? 0 : (pageNum - 1) * 30;
      const targetUrl = pageNum === 1
        ? 'https://www.ashleyfurniture.com/c/furniture/living-room/sofas/'
        : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

      window.open(targetUrl, '_blank');

      alert(`Step 1: A new tab opened with Ashley Furniture page ${pageNum}.\n\nStep 2: Once the page loads, open DevTools (F12) and go to Console.\n\nStep 3: Paste this code and press Enter:\n\n(() => { const products = []; document.querySelectorAll('.product-tile, .product, [data-pid]').forEach(tile => { const nameEl = tile.querySelector('.product-name, .pdp-link a, [class*="product-name"]'); const priceEl = tile.querySelector('.price, .sales, [class*="price"]'); const imageEl = tile.querySelector('img[src*="scene7"], img[data-src*="scene7"]'); const linkEl = tile.querySelector('a[href*="/p/"]'); if (nameEl && priceEl) { const name = nameEl.textContent?.trim() || ''; const priceText = priceEl.textContent?.trim() || ''; const price = parseFloat(priceText.replace(/[^\\d.]/g, '')); let imageUrl = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src') || ''; if (imageUrl) { imageUrl = imageUrl.split('?')[0] + '?$AFHS-PDP-Main$'; if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl; } const productUrl = linkEl?.getAttribute('href') || ''; const sku = productUrl.match(/\\/p\\/[^\\/]+\\/([^\\/\\.]+)/)?.[1] || ''; if (name && !isNaN(price) && price > 0) { products.push({ name, price, imageUrl, sku }); } } }); console.log('Found products:', products.length); copy(JSON.stringify(products, null, 2)); console.log('✓ Copied to clipboard!'); })();\n\nStep 4: Come back here and paste the data.`);

      const productDataStr = prompt('Paste the product JSON data:');

      if (!productDataStr) {
        throw new Error('No data provided');
      }

      const productCards = JSON.parse(productDataStr);

      console.log(`Found ${productCards.length} products`);

      let succeeded = 0;
      let failed = 0;

      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'sofas')
        .maybeSingle();

      for (const card of productCards) {
        try {
          const { name, price, imageUrl, sku: productSku } = card;

          if (!name || !price) {
            failed++;
            continue;
          }

          const sku = productSku || `ASH-SOF-P${pageNum}-${String(succeeded + failed + 1).padStart(3, '0')}`;

          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('sku', sku)
            .maybeSingle();

          if (existingProduct) {
            console.log(`Skipped existing: ${name}`);
            failed++;
            continue;
          }

          const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

          const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
              name,
              slug: `${slug}-${sku.toLowerCase()}`,
              sku,
              price,
              description: name,
              category_id: category?.id || null,
              stock_quantity: 10,
              status: 'active',
            })
            .select()
            .single();

          if (productError || !product) {
            console.log(`Failed: ${name}`, productError);
            failed++;
            continue;
          }

          if (imageUrl) {
            await supabase.from('product_images').insert({
              product_id: product.id,
              image_url: imageUrl,
              display_order: 0,
            });
          }

          console.log(`✓ Imported: ${name}`);
          succeeded++;

          setStats((prev) =>
            prev.map((s) =>
              s.page === pageNum ? { ...s, succeeded, failed } : s
            )
          );
        } catch (error) {
          console.error('Import error:', error);
          failed++;
        }
      }

      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? { ...s, status: 'done', succeeded, failed }
            : s
        )
      );
    } catch (error) {
      console.error('Error scraping page:', error);
      setStats((prev) =>
        prev.map((s) =>
          s.page === pageNum
            ? { ...s, status: 'error', failed: s.failed + 1 }
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
