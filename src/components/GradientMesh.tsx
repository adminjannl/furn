interface GradientMeshProps {
  opacity?: number;
  speed?: number;
  colors?: string[];
  blur?: number;
}

export default function GradientMesh({ opacity = 0.15 }: GradientMeshProps) {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background: `linear-gradient(135deg,
          rgba(248,246,243,${opacity * 2}) 0%,
          rgba(242,237,231,${opacity * 1.5}) 30%,
          rgba(223,210,196,${opacity}) 50%,
          rgba(209,192,169,${opacity * 1.5}) 70%,
          rgba(248,246,243,${opacity * 2}) 100%)`,
      }}
    />
  );
}
