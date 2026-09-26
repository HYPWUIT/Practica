/**
 * Where to go after signing in: the `?next=` path if it is one of ours, else
 * the account page. Only same-site paths are accepted — `//evil.example` or a
 * full URL would turn the login page into an open redirect.
 */
export function nextPath(params: URLSearchParams, fallback = '/account'): string {
  const next = params.get('next')
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback
  }
  return next
}

/** `/login?next=…` for a page that needs a session. */
export function loginPathFor(path: string): string {
  return `/login?${new URLSearchParams({ next: path })}`
}
