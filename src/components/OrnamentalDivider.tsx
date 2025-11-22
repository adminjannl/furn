interface OrnamentalDividerProps {
  variant?: 'default' | 'wood-grain';
  className?: string;
}

export default function OrnamentalDivider({ variant = 'default', className = '' }: OrnamentalDividerProps) {
  if (variant === 'wood-grain') {
    return <div className={`divider-wood-grain ${className}`}></div>;
  }

  return <div className={`divider-ornamental ${className}`}></div>;
}
