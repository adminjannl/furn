import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type CraftsmanshipHighlight = Database['public']['Tables']['craftsmanship_highlights']['Row'];

export default function CraftsmanshipHighlights() {
  const { t } = useTranslation();
  const [highlights, setHighlights] = useState<CraftsmanshipHighlight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHighlights();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (highlights.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % highlights.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [highlights.length, isVisible]);

  async function loadHighlights() {
    try {
      const { data, error } = await supabase
        .from('craftsmanship_highlights')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      if (data && data.length > 0) {
        setHighlights(data);
      }
    } catch (error) {
      console.error('Error loading craftsmanship highlights:', error);
    } finally {
      setLoading(false);
    }
  }

  function nextHighlight() {
    setCurrentIndex((prev) => (prev + 1) % highlights.length);
  }

  function prevHighlight() {
    setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  }

  if (loading) {
    return (
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-slate-200 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded animate-pulse" />
              <div className="h-24 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (highlights.length === 0) {
    return null;
  }

  const highlight = highlights[currentIndex];

  return (
    <section ref={sectionRef} className="py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-oak-900 mb-4">
            {t('craftsmanship.title')}
          </h2>
          <p className="text-xl text-oak-600">
            {t('craftsmanship.subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div
                key={`text-${currentIndex}`}
                className="animate-fade-in-up"
              >
                <h3 className="text-3xl font-serif font-bold text-oak-900 mb-4">
                  {highlight.title}
                </h3>
                <p className="text-lg text-oak-700 leading-relaxed">
                  {highlight.description}
                </p>

                {highlights.length > 1 && (
                  <div className="flex gap-2 mt-8">
                    {highlights.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'w-8 bg-champagne-600'
                            : 'w-2 bg-oak-300 hover:bg-oak-400'
                        }`}
                        aria-label={`View highlight ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                {highlights.map((h, index) => (
                  <div
                    key={h.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={h.image_url}
                      alt={h.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>

              {highlights.length > 1 && (
                <>
                  <button
                    onClick={prevHighlight}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-oak-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                    aria-label="Previous highlight"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextHighlight}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-oak-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                    aria-label="Next highlight"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute -bottom-6 -left-6 bg-champagne-600 text-white px-6 py-4 rounded-lg shadow-xl animate-float">
                <p className="text-sm font-semibold mb-1">{t('craftsmanship.handcraftedSince')}</p>
                <p className="text-3xl font-serif font-bold">1947</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
