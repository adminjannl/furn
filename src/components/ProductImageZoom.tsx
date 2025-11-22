import { useState, useRef } from 'react';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImageZoom({ src, alt, className = '' }: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      ref={imageRef}
      className={`hover-zoom-container relative ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="hover-zoom-image w-full h-full object-cover"
        style={{
          transformOrigin: isZoomed ? `${position.x}% ${position.y}%` : 'center',
        }}
      />
      <div className="ambient-light-product absolute inset-0 pointer-events-none"></div>
    </div>
  );
}
