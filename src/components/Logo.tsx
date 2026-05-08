export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img src="/logo.png" alt="AdDee" className={`h-8 ${className}`} />
  )
}
