import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'product' | 'category' | 'text' | 'image' | 'card' | 'hero' | 'list' | 'heading';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ variant = 'product', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'product':
        return (
          <div className={`bg-gradient-to-b from-white to-cream-50/30 rounded-2xl overflow-hidden shadow-elevation-2 ${className}`}>
            <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
              <div className="absolute top-4 right-4 w-16 h-8 bg-cream-300/60 rounded-lg"></div>
            </div>
            <div className="p-7">
              <div className="space-y-3">
                <div className="h-5 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded-lg w-4/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-5 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded-lg w-3/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-8 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded-lg w-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded-lg w-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'category':
        return (
          <div className={`bg-gradient-to-br from-cream-50 via-white to-cream-50 rounded-2xl p-6 shadow-elevation-1 ${className}`}>
            <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-3/4 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className={`space-y-3 ${className}`}>
            <div className="h-4 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-5/6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-4/6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
          </div>
        );
      case 'heading':
        return (
          <div className={`h-8 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded-xl w-2/3 relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
          </div>
        );
      case 'image':
        return (
          <div className={`aspect-video bg-gradient-to-br from-cream-100 to-cream-200 rounded-2xl relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        );
      case 'card':
        return (
          <div className={`bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-elevation-2 ${className}`}>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-3/4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-6 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-2/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className={`rounded-2xl overflow-hidden ${className}`} style={{ height: '400px' }}>
            <div className="w-full h-full bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <div className="absolute inset-0 flex items-center px-12">
                <div className="max-w-2xl space-y-6">
                  <div className="h-8 bg-white/40 rounded-lg w-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-16 bg-white/50 rounded-xl w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-12 bg-white/40 rounded-lg w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className={`bg-white rounded-xl p-4 shadow-elevation-1 ${className}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-2/3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-3 bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 rounded w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
}
