import { Armchair } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} ${className} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-oak-200/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-champagne-600 border-r-champagne-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Armchair className={`${iconSizes[size]} text-oak-700 animate-gentle-pulse`} />
        </div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-oak-50/30 to-cream-100 relative overflow-hidden">
      <div className="absolute inset-0 texture-oak-natural opacity-30"></div>
      <div className="text-center relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-champagne-400/20 rounded-full blur-2xl animate-gentle-pulse"></div>
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <p className="text-oak-700 font-serif text-xl tracking-wide animate-elegant-shimmer">Crafting your experience...</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-oak-100 rounded-lg ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/30 elegant-shadow">
      <LoadingSkeleton className="aspect-square" />
      <div className="p-6 space-y-3">
        <LoadingSkeleton className="h-5 w-3/4" />
        <LoadingSkeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <LoadingSkeleton className="aspect-square rounded-2xl mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-3/4" />
        <LoadingSkeleton className="h-6 w-1/4" />
        <LoadingSkeleton className="h-20 w-full" />
        <LoadingSkeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
