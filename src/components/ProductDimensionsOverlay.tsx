interface ProductDimensionsOverlayProps {
  widthCm: number | null;
  lengthCm: number | null;
  heightCm: number | null;
  doorCount: number | null;
  className?: string;
}

export default function ProductDimensionsOverlay({
  widthCm,
  lengthCm,
  heightCm,
  doorCount,
  className = ''
}: ProductDimensionsOverlayProps) {
  if (!widthCm && !lengthCm && !heightCm && !doorCount) {
    return null;
  }

  return (
    <div className={`bg-oak-50 border-t border-oak-200 text-oak-700 px-3 py-2 text-xs font-medium ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {widthCm && lengthCm && heightCm && (
          <div className="flex items-center gap-2">
            <span className="opacity-75">Dimensions (W×D×H):</span>
            <span className="font-semibold">
              {widthCm}×{lengthCm}×{heightCm} cm
            </span>
          </div>
        )}
        {doorCount && (
          <div className="flex items-center gap-2">
            <span className="opacity-75">Doors:</span>
            <span className="font-semibold">{doorCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
