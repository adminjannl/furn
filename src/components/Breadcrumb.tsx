import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className={`flex items-center gap-1.5 text-oak-600 hover:text-oak-900 transition-all duration-300 hover:scale-105 ${
          mounted ? 'breadcrumb-item-enter' : 'opacity-0'
        }`}
        style={{ animationDelay: '0s' }}
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={item.path} className="flex items-center gap-2">
          <ChevronRight
            className={`w-4 h-4 text-oak-400 ${
              mounted ? 'breadcrumb-separator-enter' : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
          {index === items.length - 1 ? (
            <span
              className={`text-oak-900 font-medium ${
                mounted ? 'breadcrumb-item-enter' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className={`text-oak-600 hover:text-oak-900 transition-all duration-300 hover:scale-105 hover:translate-x-0.5 ${
                mounted ? 'breadcrumb-item-enter' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
