import { Link } from 'react-router-dom';

interface ColorVariant {
  id: string;
  colorName: string;
  colorCode: string;
  slug: string;
  thumbnailUrl?: string;
  isCurrentColor?: boolean;
}

interface ColorSwatchSelectorProps {
  variants: ColorVariant[];
  currentColorId?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ColorSwatchSelector({
  variants,
  currentColorId,
  size = 'md',
  showLabel = true,
  className = '',
}: ColorSwatchSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const currentVariant = variants.find(v => v.id === currentColorId || v.isCurrentColor);
  const displayLabel = currentVariant?.colorName || variants[0]?.colorName;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showLabel && (
        <div className="text-sm text-slate-600 w-full overflow-hidden">
          <span className="inline-block">Color: </span>
          <span className="font-medium text-slate-900 inline-block truncate max-w-[200px] align-bottom">{displayLabel}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === currentColorId || variant.isCurrentColor;

          return (
            <div key={variant.id} className="relative group/swatch">
              <Link
                to={`/product/${variant.slug}`}
                className={`
                  ${sizeClasses[size]}
                  rounded-full
                  border-2
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:shadow-lg
                  hover:z-50
                  relative
                  block
                  ${isSelected
                    ? 'border-slate-900 ring-2 ring-slate-300 ring-offset-2'
                    : 'border-slate-200 hover:border-slate-400'
                  }
                `}
                style={{ backgroundColor: variant.colorCode }}
                aria-label={`Select ${variant.colorName} color`}
              >
                {isSelected && (
                  <div className="absolute inset-0 rounded-full border-2 border-white"></div>
                )}
              </Link>

              <div className="
                absolute
                bottom-full
                left-1/2
                -translate-x-1/2
                mb-2
                px-3
                py-1.5
                bg-slate-900
                text-white
                text-xs
                rounded-lg
                whitespace-nowrap
                scale-0
                opacity-0
                group-hover/swatch:scale-100
                group-hover/swatch:opacity-100
                transition-all
                duration-200
                pointer-events-none
                shadow-lg
                origin-bottom
                z-50
              ">
                {variant.colorName}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
