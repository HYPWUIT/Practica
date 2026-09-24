type SkeletonProps = {
  className?: string
}

/**
 * One grey block. Everything else in this folder is a composition of these,
 * shaped like the content it stands in for so the layout does not jump when
 * the real thing arrives.
 *
 * `motion-reduce:animate-none` because a pulsing page is exactly what someone
 * with that preference set asked not to see.
 */
function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-line motion-reduce:animate-none ${className}`}
    />
  )
}

export default Skeleton
