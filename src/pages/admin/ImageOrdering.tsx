import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { ArrowUp, ArrowDown, Save, CheckCircle, AlertCircle, GripVertical } from 'lucide-react';
import Button from '../../components/Button';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: (Database['public']['Tables']['product_images']['Row'] & {
    newDisplayOrder?: number;
  })[];
};

export default function ImageOrdering() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('status', 'active')
        .order('sku', { ascending: true });

      if (error) throw error;

      const productsWithImages = (data as Product[])
        .filter(p => p.product_images && p.product_images.length > 1)
        .map(p => ({
          ...p,
          product_images: p.product_images.sort((a, b) => a.display_order - b.display_order)
        }));

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function selectProduct(product: Product) {
    setSelectedProduct({
      ...product,
      product_images: product.product_images.map((img, idx) => ({
        ...img,
        newDisplayOrder: idx
      }))
    });
    setHasChanges(false);
    setSuccessMessage('');
  }

  function moveImageUp(index: number) {
    if (!selectedProduct || index === 0) return;

    const newImages = [...selectedProduct.product_images];
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];

    newImages.forEach((img, idx) => {
      img.newDisplayOrder = idx;
    });

    setSelectedProduct({ ...selectedProduct, product_images: newImages });
    setHasChanges(true);
    setSuccessMessage('');
  }

  function moveImageDown(index: number) {
    if (!selectedProduct || index === selectedProduct.product_images.length - 1) return;

    const newImages = [...selectedProduct.product_images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];

    newImages.forEach((img, idx) => {
      img.newDisplayOrder = idx;
    });

    setSelectedProduct({ ...selectedProduct, product_images: newImages });
    setHasChanges(true);
    setSuccessMessage('');
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (!selectedProduct || draggedIndex === null || draggedIndex === index) return;

    const newImages = [...selectedProduct.product_images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    newImages.forEach((img, idx) => {
      img.newDisplayOrder = idx;
    });

    setSelectedProduct({ ...selectedProduct, product_images: newImages });
    setDraggedIndex(index);
    setHasChanges(true);
    setSuccessMessage('');
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  async function saveChanges() {
    if (!selectedProduct || !hasChanges) return;

    setSaving(true);
    try {
      const updates = selectedProduct.product_images.map(img => ({
        id: img.id,
        display_order: img.newDisplayOrder!
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('product_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      await loadProducts();

      const updatedProduct = products.find(p => p.id === selectedProduct.id);
      if (updatedProduct) {
        selectProduct(updatedProduct);
      }

      setHasChanges(false);
      setSuccessMessage('Image order saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Product Image Ordering</h1>
        <p className="text-slate-600">
          Reorder product images to ensure the best front-angle shot is shown as the thumbnail
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900 mb-4">
              Products with Multiple Images ({products.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'bg-slate-100 border-2 border-slate-900'
                      : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium text-slate-900 text-sm">{product.name}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {product.sku} • {product.product_images.length} images
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-slate-600">{selectedProduct.sku}</p>
                </div>
                {hasChanges && (
                  <Button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Order'}
                  </Button>
                )}
              </div>

              {successMessage && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">{successMessage}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Instructions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The first image (position 0) is the primary thumbnail shown in listings</li>
                    <li><strong>Drag images by the handle</strong> or use arrow buttons to reorder</li>
                    <li>Move the best <strong>front-angle shot to position 0</strong></li>
                    <li>Side angles and detail shots should come after the primary image</li>
                    <li>Click "Save Order" to apply changes</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {selectedProduct.product_images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-move ${
                      index === 0
                        ? 'border-green-500 bg-green-50'
                        : draggedIndex === index
                        ? 'border-slate-400 bg-slate-100 opacity-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                      <GripVertical className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveImageDown(index)}
                        disabled={index === selectedProduct.product_images.length - 1}
                        className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-shrink-0">
                      <img
                        src={image.image_url}
                        alt={`Position ${index}`}
                        className="w-40 h-40 object-contain rounded border border-slate-300 bg-white p-2"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900">Position {index}</span>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                            PRIMARY THUMBNAIL
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        <div className="mb-1">Display Order: {image.display_order}</div>
                        {image.newDisplayOrder !== undefined && image.newDisplayOrder !== image.display_order && (
                          <div className="text-orange-600 font-medium">
                            → Will be changed to: {image.newDisplayOrder}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
              <p className="text-slate-600">Select a product from the list to reorder its images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
