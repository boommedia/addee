export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="w-7 h-7 rounded flex items-center justify-center font-black text-sm text-white shrink-0"
        style={{ background: 'linear-gradient(135deg, #0066FF, #00FF00)' }}
      >
        A
      </div>
      <span className="font-black text-white text-base tracking-tight">AdDee</span>
    </div>
  )
}
