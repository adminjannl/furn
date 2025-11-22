import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'chair' | 'table' | 'sofa' | 'grain';
}

export default function FurnitureParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Particle[] = [];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.1 + 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        shape: ['chair', 'table', 'sofa', 'grain'][Math.floor(Math.random() * 4)] as Particle['shape'],
      });
    }

    const drawChair = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x - size * 0.3, y - size * 0.4);
      ctx.lineTo(x - size * 0.3, y + size * 0.4);
      ctx.moveTo(x + size * 0.3, y - size * 0.4);
      ctx.lineTo(x + size * 0.3, y + size * 0.4);
      ctx.moveTo(x - size * 0.35, y - size * 0.2);
      ctx.lineTo(x + size * 0.35, y - size * 0.2);
      ctx.moveTo(x - size * 0.35, y - size * 0.4);
      ctx.lineTo(x + size * 0.35, y - size * 0.4);
      ctx.stroke();
    };

    const drawTable = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.rect(x - size * 0.4, y - size * 0.1, size * 0.8, size * 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - size * 0.35, y);
      ctx.lineTo(x - size * 0.35, y + size * 0.4);
      ctx.moveTo(x + size * 0.35, y);
      ctx.lineTo(x + size * 0.35, y + size * 0.4);
      ctx.stroke();
    };

    const drawSofa = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x - size * 0.4, y - size * 0.3);
      ctx.lineTo(x - size * 0.4, y + size * 0.1);
      ctx.lineTo(x - size * 0.35, y + size * 0.3);
      ctx.moveTo(x + size * 0.4, y - size * 0.3);
      ctx.lineTo(x + size * 0.4, y + size * 0.1);
      ctx.lineTo(x + size * 0.35, y + size * 0.3);
      ctx.moveTo(x - size * 0.3, y - size * 0.2);
      ctx.lineTo(x + size * 0.3, y - size * 0.2);
      ctx.lineTo(x + size * 0.3, y + size * 0.1);
      ctx.lineTo(x - size * 0.3, y + size * 0.1);
      ctx.closePath();
      ctx.stroke();
    };

    const drawGrain = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x - size * 0.4, y);
      ctx.bezierCurveTo(
        x - size * 0.2, y - size * 0.2,
        x + size * 0.2, y + size * 0.2,
        x + size * 0.4, y
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - size * 0.3, y + size * 0.1);
      ctx.bezierCurveTo(
        x - size * 0.1, y - size * 0.1,
        x + size * 0.1, y + size * 0.3,
        x + size * 0.3, y + size * 0.1
      );
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.strokeStyle = `rgba(146, 128, 109, ${particle.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (particle.shape) {
          case 'chair':
            drawChair(ctx, 0, 0, particle.size);
            break;
          case 'table':
            drawTable(ctx, 0, 0, particle.size);
            break;
          case 'sofa':
            drawSofa(ctx, 0, 0, particle.size);
            break;
          case 'grain':
            drawGrain(ctx, 0, 0, particle.size);
            break;
        }

        ctx.restore();

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
