import { useEffect, useRef } from 'react';

interface GradientMeshProps {
  colors?: string[];
  speed?: number;
  opacity?: number;
  blur?: number;
}

export default function GradientMesh({
  colors = ['#d1b27f', '#b58a4d', '#9d7f5a', '#766657'],
  speed = 0.002,
  opacity = 0.15,
  blur = 60
}: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createGradientBlob = (
      x: number,
      y: number,
      radius: number,
      color: string,
      time: number
    ) => {
      const offsetX = Math.sin(time + x) * 30;
      const offsetY = Math.cos(time + y) * 30;

      const gradient = ctx.createRadialGradient(
        x + offsetX,
        y + offsetY,
        0,
        x + offsetX,
        y + offsetY,
        radius
      );

      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      timeRef.current += speed;
      const time = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `blur(${blur}px)`;

      const positions = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 200 },
        { x: canvas.width * 0.8, y: canvas.height * 0.4, radius: 250 },
        { x: canvas.width * 0.5, y: canvas.height * 0.7, radius: 220 },
        { x: canvas.width * 0.15, y: canvas.height * 0.8, radius: 180 },
        { x: canvas.width * 0.85, y: canvas.height * 0.15, radius: 200 },
      ];

      positions.forEach((pos, index) => {
        const colorIndex = index % colors.length;
        const hexColor = colors[colorIndex];
        const rgb = hexToRgb(hexColor);
        const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

        createGradientBlob(
          pos.x,
          pos.y,
          pos.radius,
          color,
          time + index * 1.5
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, speed, opacity, blur]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
