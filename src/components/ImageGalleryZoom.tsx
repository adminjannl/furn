import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface ImageGalleryZoomProps {
  images: Array<{
    url: string;
    alt: string;
  }>;
  initialIndex?: number;
  productName: string;
}

export default function ImageGalleryZoom({ images, initialIndex = 0, productName }: ImageGalleryZoomProps) {
  console.log('ImageGalleryZoom rendered with images:', images?.length, 'images');

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-cream-100 rounded-2xl flex items-center justify-center">
        <p className="text-slate-400">No images available</p>
      </div>
    );
  }

  const [selectedIndex, setSelectedIndex] = useState(Math.min(initialIndex, images.length - 1));
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(true);
  const imageContainerRef = useRef<HTMLImageElement>(null);

  const currentImage = images[selectedIndex] || images[0];
  const zoomLevels = [1, 2, 3, 4];

  console.log('Lightbox open:', isLightboxOpen, 'Current image URL:', currentImage?.url);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
        case '_':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedIndex, zoomLevel]);

  useEffect(() => {
    setImageLoaded(false);
  }, [selectedIndex, isLightboxOpen]);

  function openLightbox() {
    console.log('Opening lightbox, current image:', currentImage);
    setIsLightboxOpen(true);
    setIsAnimatingIn(true);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      setIsAnimatingIn(false);
    }, 500);
  }

  function closeLightbox() {
    setIsAnimatingOut(true);
    setZoomLevel(1);

    setTimeout(() => {
      setIsLightboxOpen(false);
      setIsAnimatingOut(false);
      document.body.style.overflow = '';
    }, 400);
  }

  function nextImage() {
    setSelectedIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  }

  function prevImage() {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  }

  function zoomIn() {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    console.log('zoomIn called, currentIndex:', currentIndex, 'zoomLevel:', zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      const newZoom = zoomLevels[currentIndex + 1];
      console.log('Setting new zoom:', newZoom);
      setZoomLevel(newZoom);
    }
  }

  function zoomOut() {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    console.log('zoomOut called, currentIndex:', currentIndex, 'zoomLevel:', zoomLevel);
    if (currentIndex > 0) {
      const newZoom = zoomLevels[currentIndex - 1];
      console.log('Setting new zoom:', newZoom);
      setZoomLevel(newZoom);
    }
  }

  function resetZoom() {
    setZoomLevel(1);
  }

  function handleWheel(e: React.WheelEvent) {
    console.log('Wheel event:', e.deltaY);
    if (e.deltaY < 0) {
      console.log('Zooming in');
      zoomIn();
    } else {
      console.log('Zooming out');
      zoomOut();
    }
  }

  const lightboxContent = isLightboxOpen && currentImage && currentImage.url && (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col transition-opacity duration-500 ${
        isAnimatingIn ? 'opacity-0' : isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        isolation: 'isolate'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLightbox();
        }
      }}
    >
      <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 flex items-center justify-between z-20 transition-all duration-700 ${
        isAnimatingIn ? '-translate-y-full opacity-0' : isAnimatingOut ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <div className="flex items-center gap-4">
          <h3 className="text-white text-lg md:text-xl font-semibold">{productName}</h3>
          <span className="text-white/70 text-sm">
            {selectedIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
            <button
              onClick={zoomOut}
              disabled={zoomLevel === zoomLevels[0]}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Zoom out (-)"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm font-medium min-w-[3rem] text-center">
              {zoomLevel}x
            </span>
            <button
              onClick={zoomIn}
              disabled={zoomLevel === zoomLevels[zoomLevels.length - 1]}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
          </div>

          <button
            onClick={resetZoom}
            className="p-2 md:p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl text-white transition-colors"
            title="Reset view (0)"
          >
            <Minimize2 className="w-5 h-5" />
          </button>

          <button
            onClick={closeLightbox}
            className="p-2 md:p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeLightbox();
          }
        }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-300">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
              <p className="text-white text-sm">Loading image...</p>
            </div>
          </div>
        )}

        <div
          className="relative cursor-zoom-in"
          onWheel={handleWheel}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            ref={imageContainerRef}
            src={currentImage.url}
            alt={currentImage.alt || 'Product image'}
            onLoad={() => {
              console.log('Image loaded successfully:', currentImage.url);
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.error('Image failed to load:', currentImage.url, e);
              setImageLoaded(true);
            }}
            className={`object-contain transition-all duration-300 ${
              !imageLoaded ? 'opacity-0 scale-95 blur-sm' : isAnimatingIn ? 'opacity-0 scale-90' : isAnimatingOut ? 'opacity-0 scale-90' : 'opacity-100 blur-0'
            }`}
            style={{
              width: zoomLevel === 1 ? 'auto' : `${zoomLevel * 100}%`,
              maxWidth: zoomLevel === 1 ? '90vw' : 'none',
              maxHeight: zoomLevel === 1 ? '70vh' : 'none',
              height: 'auto',
              transform: `scale(${zoomLevel === 1 ? 1 : 1})`,
              transformOrigin: 'center',
            }}
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-all duration-700 shadow-2xl hover:scale-110 border border-white/20 cursor-pointer ${
                isAnimatingIn ? 'opacity-0 -translate-x-8' : isAnimatingOut ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
              }`}
              title="Previous (←)"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </button>
            <button
              onClick={nextImage}
              className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-all duration-700 shadow-2xl hover:scale-110 border border-white/20 cursor-pointer ${
                isAnimatingIn ? 'opacity-0 translate-x-8' : isAnimatingOut ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
              }`}
              title="Next (→)"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 md:p-6 transition-all duration-700 ${
          isAnimatingIn ? 'translate-y-full opacity-0' : isAnimatingOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          <div className="flex justify-center gap-2 md:gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setZoomLevel(1);
                }}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 ${
                  selectedIndex === index
                    ? 'ring-2 ring-white scale-110 shadow-xl'
                    : 'ring-1 ring-white/30 hover:ring-white/60 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 text-white/90 text-xs md:text-sm bg-black/60 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-xl flex items-center gap-3 transition-all duration-700 delay-200 pointer-events-none ${
        isAnimatingIn ? 'translate-y-8 opacity-0' : isAnimatingOut ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <span className="hidden md:inline">Scroll or use +/- to zoom</span>
        <span className="md:hidden">Use zoom buttons or pinch</span>
        <span className="text-white/50">|</span>
        <span>Click anywhere to close</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div
          className="relative bg-gradient-to-br from-cream-100 to-cream-200/50 rounded-2xl overflow-hidden aspect-square border border-slate-200/50 luxury-shadow cursor-pointer group"
          onClick={openLightbox}
        >
          {currentImage && currentImage.url ? (
            <>
              <img
                src={currentImage.url}
                alt={currentImage.alt || 'Product image'}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg">
                  <Maximize2 className="w-5 h-5 text-slate-700" />
                  <span className="font-semibold text-sm text-slate-900">Click to view fullscreen</span>
                </div>
              </div>

              <div className="absolute top-5 right-5 z-20">
                <span className="bg-gradient-to-br from-forest-700 to-forest-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/30">
                  Made in Europe
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No image available
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-5">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`aspect-square bg-gradient-to-br from-cream-100 to-cream-200/50 rounded-xl overflow-hidden transition-all duration-400 border shadow-sm hover:shadow-md ${
                  selectedIndex === index
                    ? 'ring-2 ring-champagne-500 border-champagne-400 shadow-lg scale-105'
                    : 'border-slate-200/50 hover:border-champagne-300/70'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxContent && createPortal(lightboxContent, document.body)}
    </>
  );
}
