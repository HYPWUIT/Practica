# Implementation Plan — Sage & Oak

Build order front-loads the risky vertical slice (catalog → detail → cart →
checkout) and leaves the static pages for last, so problems surface early.

See [project-scope.md](project-scope.md) for the agreed scope.

## Phase 0 — Foundation

**Install:** `bun add react-router` · `bun add -d tailwindcss @tailwindcss/vite`

Tailwind v4 needs no config file — add `tailwindcss()` to `vite.config.ts`
plugins and `@import "tailwindcss";` at the top of `src/index.css`.

**Design tokens** in `index.css` via `@theme`, so nothing hardcodes a hex:

```css
@theme {
  --color-sage-50 … --color-sage-900;   /* greens */
  --color-ink: …;                       /* body text */
  --font-display: …;                    /* headings */
}
```

**Logo** — an inline SVG component (`src/components/Logo.tsx`), not an image
file, so it recolors with the theme.

**App shell** — `App.tsx` gets stripped of the Vite starter and becomes
`<RouterProvider>`. Router in `src/router.tsx` with a layout route holding
`<Navbar>` / `<Footer>` / `<Outlet>`. All 9 routes stubbed to placeholder
components up front, so navigation is clickable end-to-end from day one.

**Delete:** `src/assets/hero.png`, `react.svg`, `vite.svg`, the contents of
`App.css`, `public/icons.svg`.

## Phase 1 — Data layer

`src/data/products.ts` — typed array, ~24 products so filters have something to
bite on.

```ts
type Product = {
  id, slug, name, price, category, material, color,
  bestseller: boolean, image, description, dimensions, inStock
}
```

Placeholder art: 6 SVG silhouettes in `src/assets/products/` (one per category),
tinted per product via CSS. Cheaper than 24 images and reads as intentional
rather than broken.

`src/data/filters.ts` derives category/material/color option lists from the
product array — so adding a product never means editing a filter list.

## Phase 2 — State

Two contexts in `src/context/`:

- **CartContext** — `useReducer` over `{ items: {productId, qty}[] }` with
  `add` / `remove` / `setQty` / `clear`; derived `subtotal` and `count` computed
  in the provider.
- **AuthContext** — deliberately thin: holds form state only, no session. Exists
  so the shape is right when a backend lands.

Custom hooks `useCart()` / `useAuth()` that throw outside their provider.

## Phase 3 — Shared UI

`src/components/ui/` — `Button`, `Input`, `Select`, `Badge`, `Modal`,
`EmptyState`, `PriceTag`. Build these before the pages, or the same button gets
written six times.

**Forms:** `bun add react-hook-form zod @hookform/resolvers` — no custom
validation hook. `useForm({ resolver: zodResolver(schema) })` covers everything
a hand-rolled hook would, plus touched/dirty state, focus management, and
minimal re-renders. `@hookform/resolvers/zod` detects the Zod version itself, so
the import is plain `@hookform/resolvers/zod` regardless of Zod 3 or 4.

Schemas live together in `src/lib/schemas.ts` — `contactSchema`,
`applicationSchema`, `loginSchema`, `signupSchema`, `shippingSchema`,
`paymentSchema` — so validation rules are readable in one place and the form
types come from `z.infer<typeof schema>` rather than being declared twice.

The card rules that would have been custom become Zod refinements:

```ts
const paymentSchema = z.object({
  number: z.string().refine(luhn, 'Invalid card number'),
  expiry: z.string().refine(notExpired, 'Card has expired'),
  cvv:    z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
})
```

Only `luhn` and `notExpired` stay hand-written, as plain functions in
`src/lib/validators.ts`.

The `Input` / `Select` primitives need `forwardRef` so `{...register('field')}`
spreads onto them cleanly — worth getting right when they are first written.

## Phase 4 — Catalog (the core)

`ProductCard` → `ProductGrid` → `CatalogPage` with `FilterSidebar` (category
checkboxes, price dual-range, material checkboxes, color swatches) and
`SearchBar`.

Filter state lives in **URL search params** via `useSearchParams`, not local
state — that gives shareable filtered URLs and back-button support for free, and
costs nothing extra to write.

Filtering itself: one pure `filterProducts(products, criteria)` in
`src/lib/filter.ts` — unit-testable, no React in it.

## Phase 5 — Product detail

`/product/:slug` — image, price, specs table, quantity stepper, add-to-cart that
fires a toast. Plus a "related products" strip (same category, excluding self)
to reuse `ProductGrid`.

## Phase 6 — Cart & checkout

`CartPage` — line items, qty steppers, remove, subtotal, empty state with a CTA
back to the catalog.

`CheckoutPage` — three-step form (shipping → payment → review). One
`react-hook-form` instance across all three steps, validated per step with
`trigger(['field', …])` against the merged schema, so data survives moving
backwards through the steps. Card validation is format-only: Luhn check, expiry
not in the past, CVV length. On submit: clear the cart, route to a success
screen with a fake order number.

## Phase 7 — Remaining pages

Fast now that the primitives exist.

| Page       | Contents                                                      |
| ---------- | ------------------------------------------------------------- |
| Home       | Hero, category tiles, bestseller strip, newsletter form       |
| Best Sales | `<CatalogPage bestsellersOnly>`, filters hidden               |
| About      | Static brand/company content                                  |
| Career     | Job list + application form                                   |
| Contact    | Contact form + details                                        |

## Phase 8 — Polish

Responsive pass at `sm` / `md` / `lg`, mobile nav drawer, focus states and
`aria-label`s on icon buttons, skeleton and empty states, then `bun run lint`
and `bun run build` clean.

## Risks

1. **Vite 8 is very new.** `@tailwindcss/vite` may not declare it in peer deps
   yet. If install warns or the plugin misbehaves, the fallback is Tailwind via
   PostCSS, which costs one config file and some build speed. Verify this in
   Phase 0 before anything else is built on it.
2. **Cart clears on refresh.** That is the agreed no-persistence design, but it
   makes the checkout flow annoying to demo. If it grates, adding `localStorage`
   to CartContext is a ~10-line change confined to one file.

## Effort shape

Phases 0–3 are the foundation and worth doing carefully. Phases 4–6 are the bulk
of the work. Phases 7–8 go quickly.

---

# Backend

The scope's "a backend will be used later" — now. This first cut covers the
catalogue, jobs and authentication; the client is switched over to it in
"Connecting the client" below.

**Stack:** Bun · Express 5 · Prisma 7 (pg driver adapter) on the local
PostgreSQL · Better Auth · Zod schemas shared with the client.

**Layout:** a Bun workspace. `client/` stays where it is; `server/` and
`shared/` sit beside it.

```
Practica/
├── client/    React app (unchanged apart from imports)
├── server/    Express API, Prisma schema, migrations, seed
└── shared/    @sage-oak/shared — Zod schemas, types, catalogue data
```

**Working rule:** one step per commit. Each commit has to build and be
checked on its own (typecheck, lint, and actually running the thing), with a
pause for review before the next step starts.

## Step 1 — Workspace and shared package ✅ `abf48e0`

Root `package.json` with workspaces and a single `bun.lock`. Form schemas,
card validators, product/job types and the catalogue data move from `client/`
into `shared/`. Product and job types are now `z.infer` of Zod schemas.
`shared/` also defines `catalogQuerySchema` for the API. Client imports switch
to `@sage-oak/shared`, with no change in behaviour.

**Checked:** typecheck, lint, client build, and the pages that use the moved
code rendered in headless Chrome.

## Step 2 — Dev proxy ✅ `6d4592f`

Vite proxies `/api` to `localhost:3000`, so client and API are same-origin in
development and the auth cookie works without CORS.

## Step 3 — Server scaffold ✅ `c90d565`

Express 5 app factory (`createApp()`, so tests can mount it without
listening), env validated with Zod at startup, `/api/health`, and one error
handler. Every error body has the shape `{ error, issues? }`: Zod errors →
400, `HttpError` and Express's own 4xx errors pass through, anything else →
500.

**Checked:** health 200, unknown route 404, malformed JSON 400.

## Step 4 — Prisma and PostgreSQL ✅ `4845d99`

`product` and `job` tables. The category, material and colour enums mirror
the shared Zod enums. The seed loads the 24 products and 5 jobs from
`@sage-oak/shared/data`, validating each row, and upserts so it can be re-run.
Credentials live in `server/.env` (git-ignored); `.env.example` is committed.

Two Prisma 7 quirks worth knowing:

- Bun's automatic `.env` loading does not reach the `prisma` binary, so the
  `db:*` scripts pass `--env-file=.env`. Run the CLI through `bun run db:*`,
  not bare `bunx prisma`.
- `prisma.config.ts` reads `process.env`, not `env()`, so that postinstall's
  `prisma generate` works on a fresh clone before a `.env` exists.

**Checked:** migration applied, row counts and job order correct, seed run
twice without duplicates.

## Step 5 — Catalogue and jobs endpoints ✅ `d3e3040`

| Endpoint                               | Returns                                    |
| -------------------------------------- | ------------------------------------------ |
| `GET /api/products`                    | search, filter, sort (catalogue URL params) |
| `GET /api/products/bestsellers?limit=` | first N bestsellers                        |
| `GET /api/products/:slug`              | one product, or 404                        |
| `GET /api/products/:slug/related`      | same category, excluding itself            |
| `GET /api/jobs`                        | listings in careers-page order             |

The Prisma query mirrors the client's `filterProducts`, so switching the
client over will not change results or ordering.

**Checked:** 21 queries matched `filterProducts` exactly, including order.
Detail, related, bestsellers and jobs match the mock data. Bad input → 400
naming the field.

## Step 6 — Better Auth ✅ `6abb293`

**Install:** `better-auth` (in `server/` only).

- `server/src/lib/auth.ts` — `betterAuth()` with the Prisma adapter
  (`provider: 'postgresql'`), `emailAndPassword: { enabled: true }`,
  `trustedOrigins: [CLIENT_ORIGIN]`.
- Add `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `CLIENT_ORIGIN` to
  `env.ts` and `.env.example`, and generate a real secret into `.env`.
- Generate the `user` / `session` / `account` / `verification` models with the
  Better Auth CLI (`--adapter prisma`), so they match the installed version.
  Then `bun run db:migrate --name auth`.
- Mount `app.all('/api/auth/*splat', toNodeHandler(auth))` **before**
  `express.json()` — the body parser would otherwise consume the request
  stream. `*splat` is Express 5's wildcard syntax.
- A `before` hook on `/sign-up/email` validates the password with the shared
  `passwordSchema`, so the server enforces the same rules as the signup form.
- `requireSession` middleware (`auth.api.getSession` + `fromNodeHeaders`) and
  `GET /api/me` as the first protected route.

**Checked** (through the Vite proxy): sign-up sets the cookie and `/api/me`
returns the user; sign-out → 401; sign-in restores it. Weak password → 400
with the form's message, duplicate email → 422, wrong password → 401,
untrusted origin → 403. The catalogue still works and malformed JSON → 400.
The password is stored hashed.

## Step 7 — Tests and CI ✅ `11d9323` `86f2091` `29febff` + CI

- **`shared/`** — 18 `bun test` unit tests: catalogue query parsing, password
  rules and messages, sign-up confirmation, Luhn and expiry.
- **`server/`** — 40 integration tests on the real app against
  `sage_oak_test`, migrated and seeded by a preload that refuses any database
  not ending in `_test`. The catalogue endpoint is checked against the
  client's `filterProducts` for 19 queries; auth covers the whole flow.
- **`e2e/`** — 8 Playwright tests. The config starts its own API (3100) and
  client (5174) on the test database, so a dev session is never touched.
- **CI** — GitHub Actions with a PostgreSQL service: install
  (`--frozen-lockfile`), lint, typecheck, `test`, `test:e2e`; the Playwright
  report is uploaded on failure.

**Checked:** each suite was made to fail on purpose (broken search, removed
password hook, form ignoring the server message) and caught it. The CI steps
were replayed on a fresh clone with no `.env`, `CI=true` and a new database.

**Found on the way:** Better Auth silently disables its origin check when
`NODE_ENV` is `test`. The origin test caught it; `auth.ts` now pins
`disableOriginCheck: false`.

# Connecting the client

The client's pages already read everything through `client/src/api/catalog.ts`
and `AuthProvider`, so only those change. Same working rule: one commit per
step, each checked in a real browser.

## C1 — Catalogue and jobs from the API ✅ `756286d`

The five functions in `api/catalog.ts` call the server instead of the bundled
data. The catalogue request reuses `criteriaToParams`, since the API takes the
page's URL parameters. A 404 for a product still resolves to `null`, so the
not-found view renders rather than the error state.

**Checked** in headless Chrome: home, catalogue (unfiltered, filtered,
searched), best sales, product detail with related items, careers. With the
API stopped, the catalogue shows its error state, proving nothing falls back
to bundled data.

## C2 — Sign in and sign up through Better Auth ✅ `52b3137`

`better-auth/react` client, same-origin (no `baseURL`). `AuthProvider` exposes
the session user, `signIn` / `signUp` (resolve `true` or set `error`) and
`signOut`. Both auth pages show a signed-in panel with sign-out while there is a
session, and the server's message in the form on failure. A 5xx reads as "The
server is not responding".

**Checked** with Playwright: sign-up, session kept across reload, sign-out,
wrong password, correct password, duplicate email, stale error cleared.

**Gotcha:** the first run failed with "Invalid hook call" while typecheck and
lint were green. A `client/node_modules` left over from before the workspace
held its own React, and `better-auth` resolved another from the root store.
Deleting it and reinstalling from the root fixed it. Fresh clones are not
affected.

## C3 — README and plan ✅

README rewritten for the full stack: requirements, `.env`, first-time setup,
running both apps, `db:*` scripts, endpoint list, what is not on the server
yet. The setup was re-run on a fresh clone before writing it.

## Later — out of scope for this cut

- **Facets from the API:** the filter sidebar's counts and price bounds, and the
  cart's product lookup, still come from `@sage-oak/shared/data`.
- **Session in the chrome:** the navbar does not show who is signed in, and no
  route requires a session yet.
- **Orders:** persist checkout (no real payment processing), linked to the
  user when signed in.
- **Forms:** contact, career applications and newsletter endpoints.
- **Push:** `origin/test` still points at the old branch; pushing the new
  `test` needs a force-push or deleting the remote branch first.
