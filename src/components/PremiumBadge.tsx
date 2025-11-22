import { ReactNode } from 'react';

interface PremiumBadgeProps {
  children: ReactNode;
  variant?: 'ribbon' | 'corner-fold' | 'organic' | 'pill';
  className?: string;
  animated?: boolean;
}

export default function PremiumBadge({
  children,
  variant = 'pill',
  className = '',
  animated = false
}: PremiumBadgeProps) {
  const variantClass = {
    ribbon: 'badge-ribbon',
    'corner-fold': 'badge-corner-fold px-4 py-2 rounded-lg text-sm font-semibold text-oak-900',
    organic: 'badge-organic text-sm font-semibold text-oak-900',
    pill: 'badge-pill-premium text-sm font-semibold text-oak-900',
  }[variant];

  return (
    <span className={`${variantClass} ${animated ? 'animate-badge-reveal' : ''} ${className}`}>
      {children}
    </span>
  );
}
