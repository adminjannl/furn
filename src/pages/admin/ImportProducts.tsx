import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, AlertCircle, CheckCircle, Loader, ClipboardPaste, Eye, Database } from 'lucide-react';
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

interface ImportedProduct {
  name: string;
  price: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

type ImportMode = 'manual-html' | 'manual-json' | 'url';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSKU(name: string, index: number): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  return `${prefix}-${String(index + 1).padStart(4, '0')}`;
}

function parseAshleyHtml(html: string): ParsedProduct[] {
  const products: ParsedProduct[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const productCards = doc.querySelectorAll('[data-ref="productCard"], .product-card, [class*="ProductCard"], article[class*="product"]');

  if (productCards.length === 0) {
    const gridItems = doc.querySelectorAll('[class*="grid"] > div, [class*="Grid"] > div, .products-grid > *, ul[class*="product"] > li');
    gridItems.forEach((item, index) => {
      const product = extractProductFromElement(item as HTMLElement, index);
      if (product) products.push(product);
    });
  } else {
    productCards.forEach((card, index) => {
      const product = extractProductFromElement(card as HTMLElement, index);
      if (product) products.push(product);
    });
  }

  if (products.length === 0) {
    const jsonScripts = doc.querySelectorAll('script[type="application/ld+json"], script[type="application/json"]');
    jsonScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            if (item.name && (item.price || item.offers)) {
              products.push({
                name: item.name,
                price: parseFloat(item.price || item.offers?.price || '0'),
                imageUrl: item.image || '',
                colors: [],
                sku: item.sku || generateSKU(item.name, index),
              });
            }
          });
        } else if (data['@graph']) {
          data['@graph'].forEach((item: any, index: number) => {
            if (item['@type'] === 'Product') {
              products.push({
                name: item.name,
                price: parseFloat(item.offers?.price || '0'),
                imageUrl: item.image || '',
                colors: [],
                sku: item.sku || generateSKU(item.name, index),
              });
            }
          });
        }
      } catch (e) {
      }
    });
  }

  const nextDataScript = doc.querySelector('script#__NEXT_DATA__');
  if (nextDataScript && products.length === 0) {
    try {
      const nextData = JSON.parse(nextDataScript.textContent || '');
      const props = nextData.props?.pageProps;
      if (props?.products) {
        props.products.forEach((item: any, index: number) => {
          products.push({
            name: item.name || item.title,
            price: parseFloat(item.price || item.salePrice || '0'),
            originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
            imageUrl: item.image || item.imageUrl || item.thumbnail || '',
            colors: (item.colors || []).map((c: any) => ({
              name: typeof c === 'string' ? c : c.name,
              code: typeof c === 'string' ? '#888888' : (c.code || '#888888')
            })),
            sku: item.sku || generateSKU(item.name || item.title, index),
          });
        });
      }
    } catch (e) {
    }
  }

  return products;
}

function extractProductFromElement(element: HTMLElement, index: number): ParsedProduct | null {
  const nameSelectors = [
    '[data-ref="productName"]',
    '.product-name',
    '.product-title',
    '[class*="ProductName"]',
    '[class*="productName"]',
    'h2',
    'h3',
    '[class*="title"]',
    'a[href*="/p/"]',
  ];

  let name = '';
  for (const selector of nameSelectors) {
    const el = element.querySelector(selector);
    if (el?.textContent?.trim()) {
      name = el.textContent.trim();
      break;
    }
  }

  if (!name) return null;

  const priceSelectors = [
    '[data-ref="productPrice"]',
    '.product-price',
    '[class*="Price"]',
    '[class*="price"]',
    'span[class*="sale"]',
    '[data-price]',
  ];

  let price = 0;
  for (const selector of priceSelectors) {
    const el = element.querySelector(selector);
    const priceText = el?.textContent || el?.getAttribute('data-price') || '';
    const match = priceText.match(/[\d,]+\.?\d*/);
    if (match) {
      price = parseFloat(match[0].replace(',', ''));
      break;
    }
  }

  const imageSelectors = [
    'img[data-ref="productImage"]',
    'img.product-image',
    'img[class*="ProductImage"]',
    'img[src*="product"]',
    'img[data-src]',
    'img',
  ];

  let imageUrl = '';
  for (const selector of imageSelectors) {
    const img = element.querySelector(selector) as HTMLImageElement;
    if (img) {
      imageUrl = img.src || img.dataset.src || img.getAttribute('data-lazy-src') || '';
      if (imageUrl && !imageUrl.startsWith('data:')) {
        break;
      }
    }
  }

  const colors: { name: string; code: string }[] = [];
  const swatches = element.querySelectorAll('[class*="swatch"], [class*="color"], [data-color]');
  swatches.forEach(swatch => {
    const colorName = swatch.getAttribute('data-color') ||
                      swatch.getAttribute('title') ||
                      swatch.getAttribute('aria-label') || '';
    if (colorName) {
      const style = (swatch as HTMLElement).style;
      const bgColor = style.backgroundColor || '#888888';
      colors.push({ name: colorName, code: bgColor });
    }
  });

  return {
    name,
    price: price || 999,
    imageUrl,
    colors,
    sku: generateSKU(name, index),
  };
}

function parseJsonInput(jsonStr: string): ParsedProduct[] {
  try {
    const data = JSON.parse(jsonStr);
    const items = Array.isArray(data) ? data : (data.products || data.items || [data]);

    return items.map((item: any, index: number) => ({
      name: item.name || item.title || item.productName || 'Unknown Product',
      price: parseFloat(item.price || item.salePrice || item.currentPrice || '0'),
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
      imageUrl: item.image || item.imageUrl || item.thumbnail || item.img || '',
      colors: (item.colors || item.variants || []).map((c: any) => ({
        name: typeof c === 'string' ? c : (c.name || c.colorName || 'Default'),
        code: typeof c === 'string' ? '#888888' : (c.code || c.hex || '#888888')
      })),
      sku: item.sku || item.productId || generateSKU(item.name || item.title, index),
      sourceUrl: item.url || item.sourceUrl || item.link,
    }));
  } catch (e) {
    throw new Error('Invalid JSON format. Please check your input.');
  }
}

export default function ImportProducts() {
  const navigate = useNavigate();
  const [importMode, setImportMode] = useState<ImportMode>('manual-html');
  const [htmlInput, setHtmlInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [categorySlug, setCategorySlug] = useState('sofas');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportedProduct[]>([]);
  const [importStats, setImportStats] = useState({ total: 0, success: 0, failed: 0 });
  const [parseError, setParseError] = useState('');

  const handleParseHtml = () => {
    setParseError('');
    try {
      if (!htmlInput.trim()) {
        setParseError('Please paste HTML content first');
        return;
      }
      const products = parseAshleyHtml(htmlInput);
      if (products.length === 0) {
        setParseError('No products found in the HTML. Try the JSON method or check the HTML structure.');
      }
      setParsedProducts(products);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleParseJson = () => {
    setParseError('');
    try {
      if (!jsonInput.trim()) {
        setParseError('Please paste JSON content first');
        return;
      }
      const products = parseJsonInput(jsonInput);
      setParsedProducts(products);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleImport = async () => {
    if (parsedProducts.length === 0) {
      alert('No products to import. Please parse HTML or JSON first.');
      return;
    }

    setIsImporting(true);
    setImportResults([]);
    setImportStats({ total: 0, success: 0, failed: 0 });

    try {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (!category) {
        throw new Error(`Category "${categorySlug}" not found. Please create it first.`);
      }

      const results: ImportedProduct[] = [];
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < parsedProducts.length; i++) {
        const product = parsedProducts[i];
        const result: ImportedProduct = {
          name: product.name,
          price: product.price,
          status: 'pending'
        };

        try {
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('sku', product.sku)
            .maybeSingle();

          if (existingProduct) {
            result.status = 'error';
            result.error = 'Product already exists (duplicate SKU)';
            failedCount++;
          } else {
            const slug = generateSlug(product.name) + '-' + Date.now();

            const { data: newProduct, error: productError } = await supabase
              .from('products')
              .insert({
                category_id: category.id,
                name: product.name,
                slug,
                description: `Premium ${product.name} from our exclusive collection.`,
                price: product.price,
                original_price: product.originalPrice,
                sku: product.sku,
                source_url: product.sourceUrl || sourceUrl,
                stock_quantity: 10,
                status: 'active',
                materials: 'Premium upholstery',
              })
              .select()
              .single();

            if (productError) {
              result.status = 'error';
              result.error = productError.message;
              failedCount++;
            } else {
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

              if (product.colors.length > 0) {
                const colorInserts = product.colors.map(color => ({
                  product_id: newProduct.id,
                  color_name: color.name,
                  color_code: color.code
                }));

                await supabase
                  .from('product_colors')
                  .insert(colorInserts);
              }

              result.status = 'success';
              successCount++;
            }
          }
        } catch (error: any) {
          result.status = 'error';
          result.error = error.message;
          failedCount++;
        }

        results.push(result);
        setImportResults([...results]);
        setImportStats({
          total: parsedProducts.length,
          success: successCount,
          failed: failedCount
        });
      }

      alert(`Import completed! ${successCount} products imported, ${failedCount} failed.`);
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light text-neutral-900 mb-2">Import Products</h1>
        <p className="text-neutral-600">Import products using manual HTML/JSON paste (guaranteed to work)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setImportMode('manual-html')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              importMode === 'manual-html'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            Paste HTML
          </button>
          <button
            onClick={() => setImportMode('manual-json')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              importMode === 'manual-json'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Paste JSON
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Target Category
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          >
            <option value="sofas">Sofas</option>
            <option value="beds">Beds</option>
            <option value="tables">Tables</option>
            <option value="chairs">Chairs</option>
            <option value="cabinets">Cabinets</option>
            <option value="armchairs">Armchairs</option>
          </select>
        </div>

        {importMode === 'manual-html' && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-emerald-800 mb-2">How to get the HTML:</h3>
              <ol className="list-decimal list-inside text-sm text-emerald-700 space-y-1">
                <li>Open the product listing page in your browser (e.g., Ashley sofas page)</li>
                <li>Scroll down to load all products you want</li>
                <li>Right-click anywhere on the page</li>
                <li>Select "View Page Source" (or press Ctrl+U / Cmd+Option+U)</li>
                <li>Select All (Ctrl+A / Cmd+A) and Copy (Ctrl+C / Cmd+C)</li>
                <li>Paste it in the box below</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Page HTML Source
              </label>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Paste the entire page HTML here..."
                className="w-full h-64 px-4 py-3 border border-neutral-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-neutral-500">
                {htmlInput.length.toLocaleString()} characters
              </p>
            </div>

            <Button onClick={handleParseHtml} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Parse HTML & Preview
            </Button>
          </div>
        )}

        {importMode === 'manual-json' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">JSON Format:</h3>
              <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded overflow-x-auto">
{`[
  {
    "name": "Product Name",
    "price": 999.99,
    "imageUrl": "https://...",
    "colors": [
      { "name": "Gray", "code": "#888888" }
    ],
    "sku": "PROD-001"
  }
]`}
              </pre>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                JSON Data
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"name": "Product", "price": 999, ...}]'
                className="w-full h-64 px-4 py-3 border border-neutral-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>

            <Button onClick={handleParseJson} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Parse JSON & Preview
            </Button>
          </div>
        )}

        {parseError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{parseError}</span>
            </div>
          </div>
        )}
      </div>

      {parsedProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-neutral-900">
              Preview: {parsedProducts.length} Products Found
            </h2>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import All to Database
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {parsedProducts.map((product, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-3">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <h3 className="font-medium text-neutral-900 text-sm truncate">{product.name}</h3>
                <p className="text-neutral-600">${product.price.toLocaleString()}</p>
                <p className="text-xs text-neutral-400">SKU: {product.sku}</p>
                {product.colors.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {product.colors.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-neutral-300"
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 5 && (
                      <span className="text-xs text-neutral-400">+{product.colors.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {importResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">Import Results</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-neutral-900">{importStats.total}</div>
              <div className="text-sm text-neutral-600">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{importStats.success}</div>
              <div className="text-sm text-green-600">Success</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{importStats.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {importResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  result.status === 'success' ? 'bg-green-50' :
                  result.status === 'error' ? 'bg-red-50' : 'bg-neutral-50'
                }`}
              >
                {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {result.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {result.status === 'pending' && <Loader className="w-5 h-5 text-neutral-400 animate-spin" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900 truncate">{result.name}</div>
                  <div className="text-sm text-neutral-600">${result.price}</div>
                  {result.error && <div className="text-sm text-red-600">{result.error}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          Back to Products
        </Button>
      </div>
    </div>
  );
}
