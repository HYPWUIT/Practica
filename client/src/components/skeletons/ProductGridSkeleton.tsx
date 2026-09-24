import Skeleton from './Skeleton'

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      {/* Matches ProductArt's aspect ratio, so nothing shifts on load. */}
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-1 h-8 w-full rounded-full" />
      </div>
    </div>
  )
}

type ProductGridSkeletonProps = {
  count?: number
}

function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading products"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductGridSkeleton
