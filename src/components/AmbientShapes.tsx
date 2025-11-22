export default function AmbientShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-champagne-200/20 to-transparent blur-2xl animate-ambient-drift"
        style={{ animationDelay: '0s', animationDuration: '20s' }}
      />
      <div
        className="absolute top-1/4 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-slate-200/15 to-transparent blur-3xl animate-ambient-drift"
        style={{ animationDelay: '3s', animationDuration: '25s' }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-cream-300/20 to-transparent blur-2xl animate-ambient-drift"
        style={{ animationDelay: '6s', animationDuration: '18s' }}
      />
      <div
        className="absolute bottom-20 right-1/3 w-36 h-36 rounded-full bg-gradient-to-br from-champagne-300/15 to-transparent blur-3xl animate-ambient-drift"
        style={{ animationDelay: '9s', animationDuration: '22s' }}
      />

      <svg className="absolute top-1/3 left-1/2 w-16 h-16 text-champagne-300/10 animate-parallax-float" style={{ animationDelay: '1s' }} viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="currentColor" />
      </svg>

      <svg className="absolute bottom-1/2 right-1/4 w-20 h-20 text-slate-300/10 animate-parallax-float" style={{ animationDelay: '4s' }} viewBox="0 0 100 100">
        <rect x="25" y="25" width="50" height="50" fill="currentColor" transform="rotate(45 50 50)" />
      </svg>

      <svg className="absolute top-2/3 left-1/3 w-12 h-12 text-cream-400/10 animate-parallax-float" style={{ animationDelay: '7s' }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>
    </div>
  );
}
