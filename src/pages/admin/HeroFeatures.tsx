import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { Plus, Edit2, Trash2, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';

type HeroFeature = Database['public']['Tables']['hero_features']['Row'];

const AVAILABLE_ICONS = [
  'Truck', 'Award', 'Leaf', 'Clock', 'Shield', 'Heart', 'Star', 'Zap',
  'CheckCircle', 'Package', 'Home', 'Settings', 'Gift', 'Sparkles'
];

const COLOR_OPTIONS = [
  { value: 'forest', label: 'Forest Green' },
  { value: 'copper', label: 'Copper' },
  { value: 'oak', label: 'Oak Brown' },
  { value: 'cream', label: 'Cream' },
];

export default function HeroFeaturesAdmin() {
  const [features, setFeatures] = useState<HeroFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState<HeroFeature | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    try {
      const { data, error } = await supabase
        .from('hero_features')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error loading features:', error);
      alert('Error loading features');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const featureData = {
      icon_name: formData.get('icon_name') as string,
      icon_color: formData.get('icon_color') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingFeature) {
        const { error } = await supabase
          .from('hero_features')
          .update(featureData)
          .eq('id', editingFeature.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_features')
          .insert([{ ...featureData, display_order: features.length }]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      setEditingFeature(null);
      loadFeatures();
      alert('Feature saved successfully');
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Error saving feature');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const { error } = await supabase
        .from('hero_features')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadFeatures();
      alert('Feature deleted successfully');
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Error deleting feature');
    }
  }

  async function handleToggleActive(feature: HeroFeature) {
    try {
      const { error } = await supabase
        .from('hero_features')
        .update({ is_active: !feature.is_active })
        .eq('id', feature.id);

      if (error) throw error;
      loadFeatures();
    } catch (error) {
      console.error('Error toggling feature:', error);
      alert('Error toggling feature');
    }
  }

  async function handleMove(feature: HeroFeature, direction: 'up' | 'down') {
    const currentIndex = features.findIndex(f => f.id === feature.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= features.length) return;

    const targetFeature = features[targetIndex];

    try {
      await Promise.all([
        supabase
          .from('hero_features')
          .update({ display_order: targetFeature.display_order })
          .eq('id', feature.id),
        supabase
          .from('hero_features')
          .update({ display_order: feature.display_order })
          .eq('id', targetFeature.id),
      ]);

      loadFeatures();
    } catch (error) {
      console.error('Error moving feature:', error);
      alert('Error moving feature');
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold">Hero Features</h1>
        <button
          onClick={() => {
            setEditingFeature(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-oak-800 text-white px-4 py-2 rounded-lg hover:bg-oak-700"
        >
          <Plus className="w-5 h-5" />
          Add Feature
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingFeature ? 'Edit Feature' : 'Add Feature'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Icon *</label>
                <select
                  name="icon_name"
                  defaultValue={editingFeature?.icon_name}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon Color *</label>
                <select
                  name="icon_color"
                  defaultValue={editingFeature?.icon_color || 'forest'}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                >
                  {COLOR_OPTIONS.map(color => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingFeature?.title}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={editingFeature?.description}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingFeature?.is_active ?? true}
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
                  Save Feature
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingFeature(null);
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
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="bg-white border border-oak-200 rounded-lg p-4 flex gap-4 items-center"
          >
            <div className={`p-3 rounded-lg bg-${feature.icon_color}-100 text-${feature.icon_color}-700`}>
              {feature.icon_name}
            </div>

            <div className="flex-1">
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-sm text-oak-600">{feature.description}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleMove(feature, 'up')}
                disabled={index === 0}
                className="p-2 hover:bg-oak-100 rounded disabled:opacity-30"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(feature, 'down')}
                disabled={index === features.length - 1}
                className="p-2 hover:bg-oak-100 rounded disabled:opacity-30"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleActive(feature)}
                className={`p-2 rounded ${
                  feature.is_active
                    ? 'bg-forest-100 text-forest-700'
                    : 'bg-oak-100 text-oak-600'
                }`}
              >
                {feature.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setEditingFeature(feature);
                  setIsFormOpen(true);
                }}
                className="p-2 hover:bg-oak-100 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(feature.id)}
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
