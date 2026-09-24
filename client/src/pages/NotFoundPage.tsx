import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center">
      <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
        404
      </p>
      <h1 className="mt-3 text-4xl">This room is empty</h1>
      <p className="mx-auto mt-4 max-w-prose text-muted">
        The page you were looking for does not exist.
      </p>
      <Link
        to="/catalog"
        className="mt-8 inline-block rounded-full bg-sage-600 px-6 py-3 text-canvas transition-colors hover:bg-sage-700"
      >
        Browse the shop
      </Link>
    </section>
  )
}

export default NotFoundPage
