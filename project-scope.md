# Project

Create a furniture online store for clients to be able to buy online and search
for their products.

**Store name:** Sage & Oak
**Identity:** green and white palette, logo generated as part of the build.

# Features

1. Navigation bar for home, contact, best sales, career and about page.
2. A search bar and a filter for results.
3. Payment system.
4. Authentification system
5. Add to cart system

# NB

Everything is for frontend only. Nothing is backended — these are just
components. The authentification system is a form with validation, and the same
goes for the payment system and add to cart. A backend will be used later if
needed.

# Stack

- Vite + React 19 + TypeScript (already in `client/`)
- Tailwind CSS for styling
- React Router for pages
- React Context + `useReducer` for cart and auth state
- React Hook Form + Zod for every form (contact, career, auth, checkout)

No persistence layer: state lives in memory only, so a page refresh clears the
cart. This is intentional until a backend exists.

# Pages

The five nav pages, plus the four the shop flow requires:

| Page            | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| Home            | Landing, featured products, entry into the catalog   |
| Catalog         | Search results grid with filters                     |
| Product detail  | Single product, images, specs, add to cart           |
| Cart            | Line items, quantities, running total                |
| Checkout        | Payment + address form, success screen               |
| Best Sales      | Catalog grid preset to bestsellers, filters hidden   |
| Contact         | Contact form with validation                         |
| Career          | Open positions, application form                     |
| About           | Static brand/company content                         |

Best Sales is a thin preset over the catalog rather than a separate
implementation — the same product grid filtered to a `bestseller` flag.

# Data

Hardcoded product array committed in the repo. Product images are local
placeholder assets in `src/assets`, reused across products. The app works fully
offline — no network calls anywhere.

# Filters

- Category (sofas, chairs, tables, beds, storage, lighting)
- Price range
- Material
- Color

# Open items

- **No gated routes.** Validation-only auth means there is no logged-in state to
  protect checkout with. Checkout stays publicly reachable and the login form is
  a standalone page, so nothing breaks when a real backend lands.
