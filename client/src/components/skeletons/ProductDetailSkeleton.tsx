import Skeleton from './Skeleton'

function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading product"
      className="mx-auto max-w-6xl px-4 py-10"
    >
      <Skeleton className="mb-8 h-4 w-72" />

      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] rounded-xl" />

        <div>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-12 w-3/4" />
          <Skeleton className="mt-3 h-8 w-32" />

          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="mt-8 flex gap-3">
            <Skeleton className="h-11 w-28 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>

          <div className="mt-10 space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailSkeleton
