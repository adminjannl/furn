import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

type Category = Database['public']['Tables']['categories']['Row'];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(category?: Category) {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image_url || '',
        display_order: category.display_order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        display_order: categories.length,
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      display_order: 0,
    });
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([formData]);

        if (error) throw error;
      }

      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg p-8 animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-slate-600 mb-4">No categories yet</p>
          <button
            onClick={() => openModal()}
            className="text-slate-900 font-semibold hover:underline"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Order</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-slate-600 truncate max-w-xs">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{category.slug}</td>
                  <td className="px-6 py-4 text-slate-600">{category.display_order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(category)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Category Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., Sofas"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
                  URL Slug *
                </label>
                <input
                  id="slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., sofas"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>
                <input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-slate-700 mb-2">
                  Display Order
                </label>
                <input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
