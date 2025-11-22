import { Truck, Shield, TreePine, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TrustBadges() {
  const { t } = useTranslation();
  const badges = [
    {
      icon: Truck,
      title: t('trustBadges.freeShipping'),
      subtitle: t('trustBadges.freeShippingDesc'),
      color: 'text-champagne-600',
      bg: 'bg-champagne-50'
    },
    {
      icon: Shield,
      title: t('trustBadges.warranty'),
      subtitle: t('trustBadges.warrantyDesc'),
      color: 'text-forest-600',
      bg: 'bg-forest-50'
    },
    {
      icon: TreePine,
      title: t('trustBadges.fscCertified'),
      subtitle: t('trustBadges.fscCertifiedDesc'),
      color: 'text-champagne-700',
      bg: 'bg-champagne-50'
    },
    {
      icon: Clock,
      title: t('trustBadges.fastDelivery'),
      subtitle: t('trustBadges.fastDeliveryDesc'),
      color: 'text-oak-600',
      bg: 'bg-oak-50'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white via-cream-50/30 to-white border-y border-slate-200/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,178,127,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/30 hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-1 elegant-shadow hover:luxury-shadow animate-reveal-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${badge.bg} ${badge.color} p-4 rounded-xl mb-4 transition-transform duration-500 hover:scale-110`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-oak-900 mb-1 text-sm leading-tight">
                  {badge.title}
                </h3>
                <p className="text-xs text-oak-600 leading-snug">
                  {badge.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
