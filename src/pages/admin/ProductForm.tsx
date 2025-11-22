import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { ArrowLeft, Upload, X, GripVertical, AlertCircle } from 'lucide-react';

type Category = Database['public']['Tables']['categories']['Row'];

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_percentage: '0',
    sku: '',
    stock_quantity: '',
    category_id: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function loadProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price.toString(),
        discount_percentage: (data.discount_percentage || 0).toString(),
        sku: data.sku,
        stock_quantity: data.stock_quantity.toString(),
        category_id: data.category_id || '',
        status: data.status,
      });

      setImages(data.product_images?.map((img: any) => img.image_url) || []);
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function addImage() {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const productData = {
        name: formData.name,
        slug: slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: formData.category_id || null,
        status: formData.status === 'draft' ? 'inactive' : formData.status,
      };

      let productId = id;

      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;

        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      if (images.length > 0) {
        const imageData = images.map((url, index) => ({
          product_id: productId,
          image_url: url,
          display_order: index + 1,
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageData);

        if (imageError) throw imageError;
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </button>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Modern Sofa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="SOFA-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="999.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Discount %
              </label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Product Images
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Image Order Instructions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>First image</strong> is the primary thumbnail shown in product listings</li>
                  <li>Upload or drag the <strong>front-angle photo first</strong> for best results</li>
                  <li>Drag images by the handle to reorder them</li>
                  <li>Side angles and detail shots should come after the primary image</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-move ${
                    index === 0
                      ? 'bg-green-50 border-green-500'
                      : draggedIndex === index
                      ? 'bg-slate-100 border-slate-400 opacity-50'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <img src={url} alt="" className="w-16 h-16 rounded object-contain border border-slate-300 bg-white" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">Position {index}</span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                          PRIMARY THUMBNAIL
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-600 truncate block">{url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
