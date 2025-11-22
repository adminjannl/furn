import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  }

  return (
    <>
      <div
        className="relative group cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <ZoomIn className="w-5 h-5" />
            <span className="font-semibold text-sm">Click to zoom</span>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-7xl w-full aspect-square cursor-zoom-out overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain"
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                transform: 'scale(2)',
              }}
            />
          </div>
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            Move mouse to zoom | Click to close
          </p>
        </div>
      )}
    </>
  );
}
