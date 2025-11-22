import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { Plus, Edit2, Trash2, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';

type CraftsmanshipHighlight = Database['public']['Tables']['craftsmanship_highlights']['Row'];

export default function CraftsmanshipAdmin() {
  const [highlights, setHighlights] = useState<CraftsmanshipHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHighlight, setEditingHighlight] = useState<CraftsmanshipHighlight | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadHighlights();
  }, []);

  async function loadHighlights() {
    try {
      const { data, error } = await supabase
        .from('craftsmanship_highlights')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setHighlights(data || []);
    } catch (error) {
      console.error('Error loading highlights:', error);
      alert('Error loading highlights');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const highlightData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_url: formData.get('image_url') as string,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingHighlight) {
        const { error } = await supabase
          .from('craftsmanship_highlights')
          .update(highlightData)
          .eq('id', editingHighlight.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('craftsmanship_highlights')
          .insert([{ ...highlightData, display_order: highlights.length }]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      setEditingHighlight(null);
      loadHighlights();
      alert('Highlight saved successfully');
    } catch (error) {
      console.error('Error saving highlight:', error);
      alert('Error saving highlight');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this highlight?')) return;

    try {
      const { error } = await supabase
        .from('craftsmanship_highlights')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadHighlights();
      alert('Highlight deleted successfully');
    } catch (error) {
      console.error('Error deleting highlight:', error);
      alert('Error deleting highlight');
    }
  }

  async function handleToggleActive(highlight: CraftsmanshipHighlight) {
    try {
      const { error } = await supabase
        .from('craftsmanship_highlights')
        .update({ is_active: !highlight.is_active })
        .eq('id', highlight.id);

      if (error) throw error;
      loadHighlights();
    } catch (error) {
      console.error('Error toggling highlight:', error);
      alert('Error toggling highlight');
    }
  }

  async function handleMove(highlight: CraftsmanshipHighlight, direction: 'up' | 'down') {
    const currentIndex = highlights.findIndex(h => h.id === highlight.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= highlights.length) return;

    const targetHighlight = highlights[targetIndex];

    try {
      await Promise.all([
        supabase
          .from('craftsmanship_highlights')
          .update({ display_order: targetHighlight.display_order })
          .eq('id', highlight.id),
        supabase
          .from('craftsmanship_highlights')
          .update({ display_order: highlight.display_order })
          .eq('id', targetHighlight.id),
      ]);

      loadHighlights();
    } catch (error) {
      console.error('Error moving highlight:', error);
      alert('Error moving highlight');
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold">Craftsmanship Highlights</h1>
        <button
          onClick={() => {
            setEditingHighlight(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-oak-800 text-white px-4 py-2 rounded-lg hover:bg-oak-700"
        >
          <Plus className="w-5 h-5" />
          Add Highlight
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingHighlight ? 'Edit Highlight' : 'Add Highlight'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingHighlight?.title}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  defaultValue={editingHighlight?.description}
                  required
                  rows={4}
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL *</label>
                <input
                  type="url"
                  name="image_url"
                  defaultValue={editingHighlight?.image_url}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-oak-600 mt-1">
                  Use high-quality images showing craftsmanship details
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingHighlight?.is_active ?? true}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-oak-800 text-white px-4 py-2 rounded-lg hover:bg-oak-700"
                >
                  Save Highlight
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingHighlight(null);
                  }}
                  className="flex-1 border border-oak-300 px-4 py-2 rounded-lg hover:bg-oak-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {highlights.map((highlight, index) => (
          <div
            key={highlight.id}
            className="bg-white border border-oak-200 rounded-lg p-4 flex gap-4"
          >
            <div className="w-32 h-24 flex-shrink-0 rounded overflow-hidden bg-oak-100">
              <img
                src={highlight.image_url}
                alt={highlight.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{highlight.title}</h3>
              <p className="text-sm text-oak-700 line-clamp-2">{highlight.description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleMove(highlight, 'up')}
                disabled={index === 0}
                className="p-2 hover:bg-oak-100 rounded disabled:opacity-30"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(highlight, 'down')}
                disabled={index === highlights.length - 1}
                className="p-2 hover:bg-oak-100 rounded disabled:opacity-30"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleActive(highlight)}
                className={`p-2 rounded ${
                  highlight.is_active
                    ? 'bg-forest-100 text-forest-700'
                    : 'bg-oak-100 text-oak-600'
                }`}
              >
                {highlight.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setEditingHighlight(highlight);
                  setIsFormOpen(true);
                }}
                className="p-2 hover:bg-oak-100 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(highlight.id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
