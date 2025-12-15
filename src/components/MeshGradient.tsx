export default function MeshGradient() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, rgba(248,246,243,0.4) 0%, rgba(242,237,231,0.3) 30%, rgba(223,210,196,0.2) 50%, rgba(209,192,169,0.3) 70%, rgba(248,246,243,0.4) 100%)',
        opacity: 0.6
      }}
    />
  );
}
