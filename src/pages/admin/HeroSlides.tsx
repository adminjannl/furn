import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { Plus, Edit2, Trash2, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error loading slides:', error);
      alert('Error loading slides');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const slideData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      background_image_url: formData.get('background_image_url') as string,
      cta_primary_text: formData.get('cta_primary_text') as string,
      cta_primary_link: formData.get('cta_primary_link') as string,
      cta_secondary_text: formData.get('cta_secondary_text') as string,
      cta_secondary_link: formData.get('cta_secondary_link') as string,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(slideData)
          .eq('id', editingSlide.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert([{ ...slideData, display_order: slides.length }]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      setEditingSlide(null);
      loadSlides();
      alert('Slide saved successfully');
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving slide');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSlides();
      alert('Slide deleted successfully');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Error deleting slide');
    }
  }

  async function handleToggleActive(slide: HeroSlide) {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id);

      if (error) throw error;
      loadSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
      alert('Error toggling slide');
    }
  }

  async function handleMove(slide: HeroSlide, direction: 'up' | 'down') {
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const targetSlide = slides[targetIndex];

    try {
      await Promise.all([
        supabase
          .from('hero_slides')
          .update({ display_order: targetSlide.display_order })
          .eq('id', slide.id),
        supabase
          .from('hero_slides')
          .update({ display_order: slide.display_order })
          .eq('id', targetSlide.id),
      ]);

      loadSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      alert('Error moving slide');
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold">Hero Slides</h1>
        <button
          onClick={() => {
            setEditingSlide(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-oak-800 text-white px-4 py-2 rounded-lg hover:bg-oak-700"
        >
          <Plus className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingSlide ? 'Edit Slide' : 'Add Slide'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSlide?.title}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingSlide?.subtitle}
                  placeholder="e.g., Since 1947"
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingSlide?.description}
                  rows={3}
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Background Image URL *</label>
                <input
                  type="url"
                  name="background_image_url"
                  defaultValue={editingSlide?.background_image_url}
                  required
                  className="w-full border border-oak-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    name="cta_primary_text"
                    defaultValue={editingSlide?.cta_primary_text}
                    className="w-full border border-oak-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    name="cta_primary_link"
                    defaultValue={editingSlide?.cta_primary_link}
                    className="w-full border border-oak-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    name="cta_secondary_text"
                    defaultValue={editingSlide?.cta_secondary_text}
                    className="w-full border border-oak-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    name="cta_secondary_link"
                    defaultValue={editingSlide?.cta_secondary_link}
                    className="w-full border border-oak-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingSlide?.is_active ?? true}
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
                  Save Slide
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingSlide(null);
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
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white border border-oak-200 rounded-lg p-4 flex gap-4"
          >
            <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-oak-100">
              <img
                src={slide.background_image_url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-sm text-oak-600">{slide.subtitle}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMove(slide, 'up')}
                    disabled={index === 0}
                    className="p-2 hover:bg-oak-100 rounded disabled:opacity-30"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(slide, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 hover:bg-oak-100 rounded disabled:opacity-30"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {slide.description && (
                <p className="text-sm text-oak-700 mb-2">{slide.description}</p>
              )}
              <div className="flex gap-2">
                {slide.cta_primary_text && (
                  <span className="text-xs bg-champagne-100 text-champagne-700 px-2 py-1 rounded">
                    {slide.cta_primary_text}
                  </span>
                )}
                {slide.cta_secondary_text && (
                  <span className="text-xs bg-oak-100 text-oak-700 px-2 py-1 rounded">
                    {slide.cta_secondary_text}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleToggleActive(slide)}
                className={`p-2 rounded ${
                  slide.is_active
                    ? 'bg-forest-100 text-forest-700'
                    : 'bg-oak-100 text-oak-600'
                }`}
                title={slide.is_active ? 'Active' : 'Inactive'}
              >
                {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setEditingSlide(slide);
                  setIsFormOpen(true);
                }}
                className="p-2 hover:bg-oak-100 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
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
