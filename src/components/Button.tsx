import { ReactNode, useState, MouseEvent } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide relative overflow-hidden';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-slate-600 via-slate-500 to-slate-800 text-white hover:from-slate-700 hover:via-slate-600 hover:to-slate-900 focus:ring-slate-500 shadow-lg hover:shadow-xl active:scale-[0.98] hover:scale-[1.02]',
    secondary: 'bg-gradient-to-br from-oak-800 to-oak-700 text-cream-50 hover:from-oak-900 hover:to-oak-800 focus:ring-oak-500 shadow-lg hover:shadow-xl active:scale-[0.98] hover:scale-[1.02]',
    outline: 'border-2 border-slate-400/60 text-slate-700 hover:bg-slate-50 hover:border-slate-500 focus:ring-slate-500 active:scale-[0.98] hover:scale-[1.02] shadow-sm hover:shadow-md',
    ghost: 'text-oak-700 hover:bg-slate-50 hover:text-slate-700 focus:ring-slate-500 active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: RippleEffect = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}
