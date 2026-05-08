export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img src="/addee-online-logo-wht.png" alt="AdDee" className={`h-8 ${className}`} />
  )
}
