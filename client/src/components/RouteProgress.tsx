import { useNavigation } from 'react-router'

/**
 * Routes are code-split, so on a slow connection there is a gap between the
 * click and the next page appearing. This is the only thing standing in for
 * a skeleton: there is no data fetching in this app, so a content-shaped
 * placeholder would be pretending at work that never happens.
 */
function RouteProgress() {
  const { state } = useNavigation()
  const busy = state !== 'idle'

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-sage-500 transition-[opacity,transform] duration-300 ${
        busy ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
      }`}
    />
  )
}

export default RouteProgress
