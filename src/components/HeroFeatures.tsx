import { useState, useEffect, MouseEvent } from 'react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type HeroFeature = Database['public']['Tables']['hero_features']['Row'];

export default function HeroFeatures() {
  const [features, setFeatures] = useState<HeroFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiltAngles, setTiltAngles] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    try {
      const { data, error } = await supabase
        .from('hero_features')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      if (data) {
        setFeatures(data);
      }
    } catch (error) {
      console.error('Error loading hero features:', error);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(iconName: string) {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) {
      return Icons.Package;
    }
    return IconComponent;
  }

  function getIconColorClasses(color: string): { bg: string; text: string } {
    const colorMap: Record<string, { bg: string; text: string }> = {
      forest: { bg: 'bg-forest-100', text: 'text-forest-700' },
      copper: { bg: 'bg-champagne-100', text: 'text-champagne-700' },
      oak: { bg: 'bg-oak-100', text: 'text-oak-700' },
      cream: { bg: 'bg-cream-200', text: 'text-oak-700' },
    };
    return colorMap[color] || colorMap.forest;
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>, featureId: string) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltAngles((prev) => ({
      ...prev,
      [featureId]: { x: rotateX, y: rotateY },
    }));
  }

  function handleMouseLeave(featureId: string) {
    setTiltAngles((prev) => ({
      ...prev,
      [featureId]: { x: 0, y: 0 },
    }));
  }

  if (loading) {
    return (
      <section className="py-12 bg-white border-y border-oak-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-6 bg-slate-100 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-y border-oak-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon_name);
            const colors = getIconColorClasses(feature.icon_color);
            const tilt = tiltAngles[feature.id] || { x: 0, y: 0 };

            return (
              <div
                key={feature.id}
                className="flex items-start gap-4 animate-fade-in-up cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
                onMouseMove={(e) => handleMouseMove(e, feature.id)}
                onMouseLeave={() => handleMouseLeave(feature.id)}
              >
                <div
                  className={`p-3 ${colors.bg} ${colors.text} rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md`}
                  style={{
                    transform: `translateZ(20px)`,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div style={{ transform: 'translateZ(10px)' }}>
                  <h3 className="font-semibold text-oak-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-oak-600 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
