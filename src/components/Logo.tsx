export default function Logo({ className = 'h-10' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Bloggy"
      className={`w-auto object-contain ${className}`}
      style={{ imageRendering: 'auto' }}
    />
  )
}
