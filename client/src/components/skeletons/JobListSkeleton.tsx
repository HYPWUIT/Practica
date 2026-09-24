import Skeleton from './Skeleton'

function JobListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading positions"
      className="mt-6 space-y-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-line p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-2 h-4 w-36" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-4 h-8 w-40 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default JobListSkeleton
