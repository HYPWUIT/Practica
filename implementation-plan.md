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
