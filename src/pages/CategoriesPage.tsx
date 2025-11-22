import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('home.shopByCategory')}</h1>
          <p className="text-lg text-slate-600">
            {t('home.exploreCurated')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">{t('home.noCategoriesAvailable')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      {category.name}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-700">
                    {t(`categories.${category.slug}`, category.name)}
                  </h2>
                  <p className="text-slate-600 line-clamp-2">
                    {t(`categoryDescriptions.${category.slug}`, category.description || '')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
