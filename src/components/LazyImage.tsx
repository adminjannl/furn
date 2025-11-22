import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  onLoad,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className="relative">
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-cream-100 to-cream-200 ${placeholderClassName}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        className={`transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } ${className}`}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}
