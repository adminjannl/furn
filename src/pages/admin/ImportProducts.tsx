import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { fetchProductsFromUrl, generateSlug, generateSKU, translateText } from '../../utils/productScraper';
import Button from '../../components/Button';

interface ImportedProduct {
  name: string;
  originalName: string;
  price: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export default function ImportProducts() {
  const navigate = useNavigate();
  const [sourceUrl, setSourceUrl] = useState('https://mnogomebeli.com/krovati/');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportedProduct[]>([]);
  const [importStats, setImportStats] = useState({ total: 0, success: 0, failed: 0 });

  const handleImport = async () => {
    if (!sourceUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    setIsImporting(true);
    setImportResults([]);
    setImportStats({ total: 0, success: 0, failed: 0 });

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/scrape-products`;

      const scrapeResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: sourceUrl }),
      });

      if (!scrapeResponse.ok) {
        throw new Error(`Failed to scrape products: ${scrapeResponse.statusText}`);
      }

      const { products } = await scrapeResponse.json();

      if (!products || products.length === 0) {
        alert('No products found at the provided URL. The page structure may have changed.');
        setIsImporting(false);
        return;
      }

      const results: ImportedProduct[] = [];
      let successCount = 0;
      let failedCount = 0;

      const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'beds')
        .maybeSingle();

      let categoryId = categories?.id;

      if (!categoryId) {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: 'Beds',
            slug: 'beds',
            description: 'Comfortable and stylish beds for your bedroom',
            display_order: 1
          })
          .select()
          .single();

        if (categoryError) {
          throw new Error(`Failed to create beds category: ${categoryError.message}`);
        }

        categoryId = newCategory.id;
      }

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const result: ImportedProduct = {
          name: product.name,
          originalName: product.originalName,
          price: product.price,
          status: 'pending'
        };

        try {
          const slug = generateSlug(product.name);
          const sku = generateSKU(product.name, i);

          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('sku', sku)
            .maybeSingle();

          if (existingProduct) {
            result.status = 'error';
            result.error = 'Product already exists';
            failedCount++;
          } else {
            const { data: newProduct, error: productError } = await supabase
              .from('products')
              .insert({
                category_id: categoryId,
                name: product.name,
                slug: slug + '-' + Date.now(),
                description: product.description,
                price: product.price,
                sku,
                original_name: product.originalName,
                original_description: product.originalDescription,
                source_url: product.sourceUrl,
                mechanism_type: product.mechanismType,
                fabric_type: product.fabricType,
                bed_size: product.bedSize,
                original_price: product.originalPrice,
                original_currency: product.originalCurrency,
                stock_quantity: 10,
                status: 'active',
                materials: product.fabricType || 'Premium upholstery',
              })
              .select()
              .single();

            if (productError) {
              result.status = 'error';
              result.error = productError.message;
              failedCount++;
            } else {
              if (product.imageUrls.length > 0) {
                const imageInserts = product.imageUrls.map((url, index) => ({
                  product_id: newProduct.id,
                  image_url: url,
                  display_order: index,
                  alt_text: `${product.name} - Image ${index + 1}`
                }));

                await supabase
                  .from('product_images')
                  .insert(imageInserts);
              }

              if (product.colors && product.colors.length > 0) {
                const colorInserts = product.colors.map(color => ({
                  product_id: newProduct.id,
                  color_name: translateText(color),
                  color_code: '#000000'
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
          total: products.length,
          success: successCount,
          failed: failedCount
        });
      }

      alert(`Import completed! ${successCount} products imported successfully, ${failedCount} failed.`);
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
        <p className="text-neutral-600">Import products from external sources and translate them automatically</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="sourceUrl" className="block text-sm font-medium text-neutral-700 mb-2">
              Source URL
            </label>
            <input
              type="url"
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/products"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              disabled={isImporting}
            />
            <p className="mt-2 text-sm text-neutral-500">
              Enter the URL of the product listing page you want to import from
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleImport}
              disabled={isImporting || !sourceUrl.trim()}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Start Import
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/admin/products')}
              disabled={isImporting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {importResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-neutral-900 mb-4">Import Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-neutral-900">{importStats.total}</div>
                <div className="text-sm text-neutral-600">Total Products</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{importStats.success}</div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{importStats.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {importResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  result.status === 'success'
                    ? 'bg-green-50'
                    : result.status === 'error'
                    ? 'bg-red-50'
                    : 'bg-neutral-50'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {result.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {result.status === 'pending' && <Loader className="w-5 h-5 text-neutral-400 animate-spin" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900">{result.name}</div>
                  <div className="text-sm text-neutral-600">{result.originalName}</div>
                  <div className="text-sm font-medium text-neutral-900">${result.price}</div>
                  {result.error && (
                    <div className="text-sm text-red-600 mt-1">{result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Import Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Products will be automatically translated from Russian to English</li>
              <li>Prices will be converted from RUB to USD using current exchange rates</li>
              <li>Images will be referenced from the source (download locally for production)</li>
              <li>All imported products will be added to the "Beds" category</li>
              <li>Duplicate products (same SKU) will be skipped</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
