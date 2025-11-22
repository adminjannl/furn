import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface SnowfallProps {
  count?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export default function Snowfall({ count, intensity = 'medium' }: SnowfallProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const snowflakeCount = count || (intensity === 'light' ? 8 : intensity === 'heavy' ? 25 : 15);

    const flakes: Snowflake[] = Array.from({ length: snowflakeCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.2 + 0.1,
    }));

    setSnowflakes(flakes);
  }, [count, intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-slate-200/40 drop-shadow-[0_0_2px_rgba(163,191,209,0.2)]"
          >
            <path
              d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18M5.636 5.636L18.364 18.364M5.636 5.636L7.757 9.879M5.636 5.636L9.879 7.757M18.364 18.364L16.243 14.121M18.364 18.364L14.121 16.243M18.364 5.636L5.636 18.364M18.364 5.636L14.121 7.757M18.364 5.636L16.243 9.879M5.636 18.364L9.879 16.243M5.636 18.364L7.757 14.121"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
