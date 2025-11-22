import { useState, useRef } from 'react';

interface MagnifyOnHoverProps {
  imageUrl: string;
  alt: string;
  className?: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export default function MagnifyOnHover({
  imageUrl,
  alt,
  className = '',
  magnifierSize = 150,
  zoomLevel = 2.5
}: MagnifyOnHoverProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imgRef.current) return;

    const elem = imgRef.current;
    const { top, left, width, height } = elem.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setMagnifierPosition({ x: e.clientX, y: e.clientY });

    const imgX = (x / width) * 100;
    const imgY = (y / height) * 100;
    setImagePosition({ x: imgX, y: imgY });
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-300"
      />

      {showMagnifier && (
        <div
          className="fixed pointer-events-none z-50 border-4 border-white rounded-full shadow-2xl overflow-hidden"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${magnifierPosition.x}px`,
            top: `${magnifierPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
            backgroundRepeat: 'no-repeat',
            boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-full" />
        </div>
      )}
    </div>
  );
}
