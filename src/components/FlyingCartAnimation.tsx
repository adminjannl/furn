import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface FlyingCartAnimationProps {
  startX: number;
  startY: number;
  onComplete: () => void;
}

export default function FlyingCartAnimation({ startX, startY, onComplete }: FlyingCartAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const cartIconPosition = typeof window !== 'undefined'
    ? document.querySelector('[data-cart-icon]')?.getBoundingClientRect()
    : null;

  const endX = cartIconPosition ? cartIconPosition.left + cartIconPosition.width / 2 : window.innerWidth - 100;
  const endY = cartIconPosition ? cartIconPosition.top + cartIconPosition.height / 2 : 50;

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[10000]"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="animate-fly-to-cart"
        style={{
          '--end-x': `${endX - startX}px`,
          '--end-y': `${endY - startY}px`,
        } as React.CSSProperties}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-champagne-400/30 rounded-full blur-xl animate-gentle-pulse"></div>
          <div className="relative bg-gradient-to-br from-champagne-500 to-champagne-600 p-3 rounded-full shadow-golden">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
