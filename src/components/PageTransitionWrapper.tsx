import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  return (
    <>
      <div
        className={`page-transition-content ${
          transitionStage === 'fadeOut' ? 'page-transition-exit' : 'page-transition-enter'
        }`}
        key={displayLocation.pathname}
      >
        {children}
      </div>

      <div
        className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-600 ${
          transitionStage === 'fadeOut' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-oak-50 to-cream-100"></div>
        <div className="absolute inset-0 texture-oak-natural opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-oak-900/5 via-transparent to-oak-900/5"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-oak-700 animate-elegant-entrance">
            <svg className="w-16 h-16 animate-gentle-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
