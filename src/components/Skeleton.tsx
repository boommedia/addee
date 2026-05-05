import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('bg-[#1a1a26] rounded-lg animate-pulse', className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-[#2a2a3d]">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#2a2a3d] flex gap-4">
        {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} className={`h-3 ${i === 0 ? 'w-32' : 'w-20'}`} />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-[#2a2a3d] flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={`h-3 ${j === 0 ? 'w-40' : j === cols - 1 ? 'w-16' : 'w-24'}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
