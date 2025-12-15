import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, AlertCircle, CheckCircle, Loader, Play,
  RefreshCw, Database, ChevronRight, Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';

interface ParsedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  colors: { name: string; code: string }[];
  sku: string;
  sourceUrl?: string;
}

interface BatchStatus {
  page: number;
  status: 'idle' | 'fetching' | 'parsing' | 'importing' | 'completed' | 'error';
  productsFound: number;
  productsImported: number;
  error?: string;
}

const ASHLEY_SOFA_BASE_URL = 'https://www.ashleyfurniture.com/c/furniture/living-room/sofas/';
const PRODUCTS_PER_PAGE = 48;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSKU(prefix: string, index: number, page: number): string {
  const num = (page - 1) * PRODUCTS_PER_PAGE + index + 1;
  return `${prefix}-${String(num).padStart(4, '0')}`;
}

function parseAshleyHtml(html: string, page: number): ParsedProduct[] {
  const products: ParsedProduct[] = [];

  // Method 1: Parse __NEXT_DATA__ JSON (most reliable for Next.js sites)
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1]);
      const pageProps = nextData?.props?.pageProps;

      // Try different paths where products might be
      const productList =
        pageProps?.plpData?.products ||
        pageProps?.products ||
        pageProps?.initialData?.products ||
        pageProps?.data?.products ||
        [];

      if (productList.length > 0) {
        productList.forEach((item: any, index: number) => {
          const product = extractProductFromNextData(item, index, page);
          if (product) products.push(product);
        });

        if (products.length > 0) {
          console.log(`Parsed ${products.length} products from __NEXT_DATA__`);
          return products;
        }
      }
    } catch (e) {
      console.log('__NEXT_DATA__ parsing failed:', e);
    }
  }

  // Method 2: Parse structured data (JSON-LD)
  const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1]);
      if (data['@type'] === 'ItemList' && data.itemListElement) {
        data.itemListElement.forEach((item: any, index: number) => {
          if (item.item || item['@type'] === 'Product') {
            const productData = item.item || item;
            products.push({
              name: productData.name || 'Unknown',
              price: parseFloat(productData.offers?.price || productData.price || '0'),
              imageUrl: productData.image || '',
              colors: [],
              sku: generateSKU('SOF', index, page),
              sourceUrl: productData.url,
            });
          }
        });
      }
      if (data['@graph']) {
        data['@graph'].forEach((item: any, index: number) => {
          if (item['@type'] === 'Product') {
            products.push({
              name: item.name,
              price: parseFloat(item.offers?.price || '0'),
              imageUrl: Array.isArray(item.image) ? item.image[0] : item.image,
              colors: [],
              sku: generateSKU('SOF', index, page),
              sourceUrl: item.url,
            });
          }
        });
      }
    } catch (e) {
      // Continue to next method
    }
  }

  if (products.length > 0) {
    console.log(`Parsed ${products.length} products from JSON-LD`);
    return products;
  }

  // Method 3: Regex extraction for product data embedded in HTML
  const productPatterns = [
    // Pattern for product names and prices in various formats
    /"name"\s*:\s*"([^"]+)"[^}]*"price"\s*:\s*["{]?(\d+(?:\.\d+)?)/g,
    /"productName"\s*:\s*"([^"]+)"[^}]*"salePrice"\s*:\s*["{]?(\d+(?:\.\d+)?)/g,
  ];

  for (const pattern of productPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const name = match[1];
      const price = parseFloat(match[2]);

      // Skip if already have this product
      if (!products.find(p => p.name === name) && name.length > 3 && price > 0) {
        products.push({
          name,
          price,
          imageUrl: '',
          colors: [],
          sku: generateSKU('SOF', products.length, page),
        });
      }
    }
  }

  // Method 4: Extract from Apollo state or Redux state
  const stateMatch = html.match(/__APOLLO_STATE__|__REDUX_STATE__|window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/);
  if (stateMatch) {
    try {
      const stateStr = stateMatch[0].replace(/^[^{]*/, '').replace(/;$/, '');
      const state = JSON.parse(stateStr);

      Object.values(state).forEach((item: any, index: number) => {
        if (item?.name && item?.price && !products.find(p => p.name === item.name)) {
          products.push({
            name: item.name,
            price: parseFloat(item.price),
            imageUrl: item.image || item.imageUrl || '',
            colors: [],
            sku: generateSKU('SOF', index, page),
          });
        }
      });
    } catch (e) {
      // Continue
    }
  }

  console.log(`Parsed ${products.length} products total`);
  return products;
}

function extractProductFromNextData(item: any, index: number, page: number): ParsedProduct | null {
  if (!item) return null;

  const name = item.name || item.title || item.productName;
  if (!name) return null;

  const price = parseFloat(
    item.price ||
    item.salePrice ||
    item.currentPrice ||
    item.prices?.sale ||
    item.prices?.current ||
    item.priceInfo?.salePrice ||
    '0'
  );

  const originalPrice = parseFloat(
    item.originalPrice ||
    item.regularPrice ||
    item.prices?.regular ||
    item.priceInfo?.regularPrice ||
    '0'
  ) || undefined;

  let imageUrl = '';
  if (item.image) {
    imageUrl = typeof item.image === 'string' ? item.image : item.image.url || item.image.src || '';
  } else if (item.images && item.images.length > 0) {
    const firstImage = item.images[0];
    imageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url || firstImage.src || '';
  } else if (item.thumbnail) {
    imageUrl = item.thumbnail;
  } else if (item.imageUrl) {
    imageUrl = item.imageUrl;
  }

  // Extract colors if available
  const colors: { name: string; code: string }[] = [];
  const colorData = item.colors || item.variants || item.swatches || [];

  if (Array.isArray(colorData)) {
    colorData.forEach((c: any) => {
      if (typeof c === 'string') {
        colors.push({ name: c, code: getColorCode(c) });
      } else if (c.name || c.colorName) {
        colors.push({
          name: c.name || c.colorName,
          code: c.code || c.hex || c.colorCode || getColorCode(c.name || c.colorName)
        });
      }
    });
  }

  return {
    name,
    price: price || 999,
    originalPrice,
    imageUrl,
    colors,
    sku: item.sku || item.productId || item.id || generateSKU('SOF', index, page),
    sourceUrl: item.url || item.pdpUrl || item.link,
  };
}

function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'charcoal': '#36454F',
    'slate': '#708090',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
    'ivory': '#FFFFF0',
    'tan': '#D2B48C',
    'brown': '#8B4513',
    'chocolate': '#3E2723',
    'espresso': '#3C2415',
    'walnut': '#5D432C',
    'navy': '#000080',
    'blue': '#0000FF',
    'denim': '#1560BD',
    'teal': '#008080',
    'green': '#008000',
    'sage': '#9CAF88',
    'olive': '#808000',
    'red': '#FF0000',
    'burgundy': '#800020',
    'orange': '#FFA500',
    'yellow': '#FFFF00',
    'gold': '#FFD700',
    'pink': '#FFC0CB',
    'purple': '#800080',
    'pebble': '#D4C4B0',
    'stone': '#9E9E9E',
    'sand': '#C2B280',
    'taupe': '#B38B6D',
    'caramel': '#C68642',
    'smoke': '#848482',
    'fossil': '#8B7D6B',
    'chestnut': '#954535',
    'nutmeg': '#8B4513',
    'alloy': '#989898',
    'ink': '#2C3539',
    'spice': '#8B4513',
    'onyx': '#353839',
    'cobblestone': '#A19A8B',
    'sky': '#87CEEB',
    'snow': '#FFFAFA',
    'dune': '#DCC9AA',
    'umber': '#635147',
  };

  const lowerName = colorName.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  return '#888888';
}

export default function ImportProducts() {
  const navigate = useNavigate();
  const [categorySlug, setCategorySlug] = useState('sofas');
  const [totalPages, setTotalPages] = useState(5);
  const [batches, setBatches] = useState<BatchStatus[]>(() =>
    Array.from({ length: 5 }, (_, i) => ({
      page: i + 1,
      status: 'idle',
      productsFound: 0,
      productsImported: 0,
    }))
  );
  const [currentProducts, setCurrentProducts] = useState<ParsedProduct[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const updateBatch = useCallback((page: number, updates: Partial<BatchStatus>) => {
    setBatches(prev => prev.map(b =>
      b.page === page ? { ...b, ...updates } : b
    ));
  }, []);

  const updateTotalPages = (num: number) => {
    setTotalPages(num);
    setBatches(Array.from({ length: num }, (_, i) => ({
      page: i + 1,
      status: 'idle',
      productsFound: 0,
      productsImported: 0,
    })));
  };

  const fetchPage = async (page: number): Promise<string | null> => {
    const url = page === 1
      ? ASHLEY_SOFA_BASE_URL
      : `${ASHLEY_SOFA_BASE_URL}?page=${page}`;

    addLog(`Fetching page ${page}: ${url}`);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/page-fetcher`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success) {
        throw new Error(`HTTP ${data.status}`);
      }

      addLog(`Page ${page} fetched: ${data.contentLength.toLocaleString()} bytes`);
      return data.html;
    } catch (error: any) {
      addLog(`Error fetching page ${page}: ${error.message}`);
      throw error;
    }
  };

  const importProducts = async (products: ParsedProduct[], page: number): Promise<number> => {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (!category) {
      throw new Error(`Category "${categorySlug}" not found`);
    }

    let importedCount = 0;

    for (const product of products) {
      try {
        // Check for existing product
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('sku', product.sku)
          .maybeSingle();

        if (existing) {
          addLog(`Skipped duplicate: ${product.name}`);
          continue;
        }

        const slug = generateSlug(product.name) + '-' + Date.now();

        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            category_id: category.id,
            name: product.name,
            slug,
            description: `Premium ${product.name} from our exclusive collection.`,
            price: product.price,
            original_price: product.originalPrice,
            sku: product.sku,
            source_url: product.sourceUrl,
            stock_quantity: 10,
            status: 'active',
            materials: 'Premium upholstery',
          })
          .select()
          .single();

        if (error) {
          addLog(`Failed to import ${product.name}: ${error.message}`);
          continue;
        }

        // Add image
        if (product.imageUrl) {
          await supabase
            .from('product_images')
            .insert({
              product_id: newProduct.id,
              image_url: product.imageUrl,
              display_order: 0,
              alt_text: product.name
            });
        }

        // Add colors
        if (product.colors.length > 0) {
          await supabase
            .from('product_colors')
            .insert(product.colors.map(color => ({
              product_id: newProduct.id,
              color_name: color.name,
              color_code: color.code
            })));
        }

        importedCount++;
      } catch (error: any) {
        addLog(`Error importing ${product.name}: ${error.message}`);
      }
    }

    return importedCount;
  };

  const runBatch = async (page: number) => {
    if (isRunning) return;

    setIsRunning(true);
    updateBatch(page, { status: 'fetching', error: undefined });

    try {
      // Step 1: Fetch HTML
      const html = await fetchPage(page);
      if (!html) {
        throw new Error('No HTML received');
      }

      // Step 2: Parse products
      updateBatch(page, { status: 'parsing' });
      addLog(`Parsing page ${page}...`);

      const products = parseAshleyHtml(html, page);

      if (products.length === 0) {
        // Save HTML for debugging
        console.log('HTML sample (first 5000 chars):', html.substring(0, 5000));
        throw new Error('No products found in HTML. Check console for HTML sample.');
      }

      updateBatch(page, { productsFound: products.length });
      setCurrentProducts(products);
      addLog(`Found ${products.length} products on page ${page}`);

      // Step 3: Import to database
      updateBatch(page, { status: 'importing' });
      addLog(`Importing ${products.length} products...`);

      const imported = await importProducts(products, page);

      updateBatch(page, {
        status: 'completed',
        productsImported: imported
      });
      addLog(`Page ${page} completed: ${imported}/${products.length} products imported`);

    } catch (error: any) {
      updateBatch(page, { status: 'error', error: error.message });
      addLog(`Batch ${page} failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllBatches = async () => {
    for (let i = 0; i < batches.length; i++) {
      if (batches[i].status !== 'completed') {
        await runBatch(batches[i].page);
        // Wait 2 seconds between batches to avoid rate limiting
        if (i < batches.length - 1) {
          addLog('Waiting 2 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  };

  const resetAll = () => {
    setBatches(prev => prev.map(b => ({
      ...b,
      status: 'idle',
      productsFound: 0,
      productsImported: 0,
      error: undefined,
    })));
    setCurrentProducts([]);
    setLogs([]);
  };

  const getStatusIcon = (status: BatchStatus['status']) => {
    switch (status) {
      case 'fetching':
      case 'parsing':
      case 'importing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusText = (status: BatchStatus['status']) => {
    switch (status) {
      case 'fetching': return 'Fetching HTML...';
      case 'parsing': return 'Parsing products...';
      case 'importing': return 'Importing to DB...';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
      default: return 'Ready';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light text-neutral-900 mb-2">Batch Scraper</h1>
        <p className="text-neutral-600">
          One-click batch import from Ashley Furniture. Each batch = 1 page ({PRODUCTS_PER_PAGE} products).
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Configuration</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Target Category
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
              disabled={isRunning}
            >
              <option value="sofas">Sofas</option>
              <option value="beds">Beds</option>
              <option value="tables">Tables</option>
              <option value="chairs">Chairs</option>
              <option value="cabinets">Cabinets</option>
              <option value="armchairs">Armchairs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Number of Pages (Batches)
            </label>
            <select
              value={totalPages}
              onChange={(e) => updateTotalPages(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
              disabled={isRunning}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} pages (~{n * PRODUCTS_PER_PAGE} products)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={runAllBatches}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run All Batches
          </Button>
          <Button
            variant="outline"
            onClick={resetAll}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Batch List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Batches</h2>

        <div className="space-y-3">
          {batches.map((batch) => (
            <div
              key={batch.page}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                batch.status === 'completed' ? 'bg-green-50 border-green-200' :
                batch.status === 'error' ? 'bg-red-50 border-red-200' :
                batch.status !== 'idle' ? 'bg-blue-50 border-blue-200' :
                'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(batch.status)}
                <div>
                  <div className="font-medium text-neutral-900">
                    Batch {batch.page} - Page {batch.page}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {batch.status === 'error' && batch.error ? (
                      <span className="text-red-600">{batch.error}</span>
                    ) : (
                      <>
                        {getStatusText(batch.status)}
                        {batch.productsFound > 0 && (
                          <span className="ml-2">
                            ({batch.productsImported}/{batch.productsFound} imported)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => runBatch(batch.page)}
                disabled={isRunning || batch.status === 'completed'}
                className="flex items-center gap-2"
              >
                {batch.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {batch.status === 'completed' ? 'Done' : 'Start'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {currentProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Latest Batch Products ({currentProducts.length})
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
            {currentProducts.slice(0, 12).map((product, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-2">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-20 object-cover rounded mb-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="text-xs font-medium text-neutral-900 truncate">{product.name}</div>
                <div className="text-xs text-neutral-600">${product.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Activity Log</h2>

        <div className="bg-neutral-900 rounded-lg p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-neutral-500">Waiting for activity...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          Back to Products
        </Button>
      </div>
    </div>
  );
}
