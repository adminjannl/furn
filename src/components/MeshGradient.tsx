import { useEffect, useRef } from 'react';

export default function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = [
      { r: 248, g: 246, b: 243 },
      { r: 242, g: 237, b: 231 },
      { r: 223, g: 210, b: 196 },
      { r: 209, g: 192, b: 169 },
      { r: 179, g: 159, b: 139 },
    ];

    let time = 0;

    const animate = () => {
      time += 0.002;

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const color1 = colors[0];
      const color2 = colors[1];
      const color3 = colors[2];
      const color4 = colors[3];

      const offset1 = 0.3 + Math.sin(time) * 0.1;
      const offset2 = 0.5 + Math.sin(time + 1) * 0.1;
      const offset3 = 0.7 + Math.cos(time + 2) * 0.1;

      gradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0.4)`);
      gradient.addColorStop(offset1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0.3)`);
      gradient.addColorStop(offset2, `rgba(${color3.r}, ${color3.g}, ${color3.b}, 0.2)`);
      gradient.addColorStop(offset3, `rgba(${color4.r}, ${color4.g}, ${color4.b}, 0.3)`);
      gradient.addColorStop(1, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0.4)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      style={{ opacity: 0.6 }}
    />
  );
}
