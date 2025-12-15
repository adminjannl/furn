import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import ProductOfTheMonth from './ProductOfTheMonth';
import MeshGradient from './MeshGradient';

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

export default function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      startAutoplay();
      return () => stopAutoplay();
    }
  }, [slides.length]);

  async function loadSlides() {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      if (data && data.length > 0) {
        setSlides(data);
      }
    } catch (error) {
      console.error('Error loading hero slides:', error);
    } finally {
      setLoading(false);
    }
  }

  function startAutoplay() {
    stopAutoplay();
    intervalRef.current = window.setInterval(() => {
      nextSlide();
    }, 10000);
  }

  function stopAutoplay() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function nextSlide() {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }

  function prevSlide() {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }

  function goToSlide(index: number) {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }

  if (loading) {
    return (
      <section className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative overflow-hidden rounded-lg w-full lg:flex-1 lg:max-w-[calc(100%-350px)] bg-slate-100 animate-pulse" style={{ height: '400px' }} />
            <div className="w-full lg:w-[325px] bg-slate-100 rounded-lg animate-pulse" style={{ height: '400px' }} />
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <section className="bg-cream-50/30 text-cream-50 py-8 relative z-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative overflow-hidden rounded-lg w-full lg:flex-1 lg:max-w-[calc(100%-350px)]" style={{ height: '400px' }}>
            <MeshGradient />
            {slides.map((s, index) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={s.background_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            <div className="relative h-full flex items-center px-6 md:px-12">
              <div className="max-w-2xl">
                <div
                  key={`subtitle-${currentSlide}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: '0ms' }}
                >
                  {slide.subtitle && (
                    <p className="text-champagne-400 font-semibold mb-4 text-base tracking-widest uppercase">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                <div
                  key={`title-${currentSlide}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: '150ms' }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
                    {slide.title}
                  </h1>
                </div>

                <div
                  key={`description-${currentSlide}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: '300ms' }}
                >
                  {slide.description && (
                    <p className="text-lg md:text-xl text-cream-100 leading-relaxed tracking-wide">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed z-10 shadow-xl"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed z-10 shadow-xl"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={isTransitioning}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === currentSlide
                          ? 'w-10 bg-champagne-400/90'
                          : 'w-1.5 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-full lg:w-[330px] flex-shrink-0">
            <ProductOfTheMonth />
          </div>
        </div>
      </div>
    </section>
  );
}
