# Sage & Oak

Magazin online de mobilă — frontend React 19 + Vite 8 + Tailwind CSS v4 și un
API Express 5 + Prisma 7 + PostgreSQL, cu autentificare prin Better Auth. Totul
în TypeScript, într-un workspace Bun.

---

## Cerințe

- [Bun](https://bun.sh) (testat pe `bun 1.4.2`). Instalare, dacă lipsește:
  `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL** pornit local pe `localhost:5432`, cu un utilizator care are
  drept de `CREATEDB` (Prisma creează baza de date și o bază „shadow” pentru
  migrări).

## Prima pornire

Din rădăcina proiectului:

```bash
bun install                                  # toate pachetele + Prisma Client
cp server/.env.example server/.env           # apoi completează valorile
bun run --cwd server db:migrate              # creează baza sage_oak și tabelele
bun run --cwd server db:seed                 # 24 de produse și 5 joburi
```

În `server/.env` completează:

| Variabilă | Ce pui |
|---|---|
| `DATABASE_URL` | `postgresql://USER:PAROLA@localhost:5432/sage_oak` |
| `BETTER_AUTH_SECRET` | un șir aleator: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `http://localhost:3000` (lasă-l așa) |
| `CLIENT_ORIGIN` | `http://localhost:5173` (lasă-l așa) |

`server/.env` nu intră în git.

## Rulare

Două terminale, ambele din rădăcină:

```bash
bun run dev:server    # API pe http://localhost:3000 (repornește la modificări)
bun run dev:client    # site pe http://localhost:5173
```

Deschide **http://localhost:5173**. În development, Vite trimite tot ce începe
cu `/api` către server, deci site-ul și API-ul sunt pe aceeași origine și
cookie-ul de sesiune merge fără CORS.

---

## Verificat pe clonă curată

Pașii de mai sus au fost rulați pe un `git clone` proaspăt al branch-ului,
fără `node_modules`:

```
bun install          301 packages installed — Prisma Client generat automat
bun run typecheck    shared, server, client: Exited with code 0
bun run lint         shared, server, client: Exited with code 0
db:migrate           Already in sync
GET /api/products    24 de produse
```

Autentificarea a fost verificată în browser (Chrome, prin Playwright):
înregistrare, sesiune păstrată la refresh, delogare, parolă greșită, email deja
folosit — toate cu mesajul serverului afișat în formular.

---

## Comenzi

Din rădăcină:

| Comandă | Ce face |
|---|---|
| `bun run dev:server` / `dev:client` | Pornește API-ul / site-ul |
| `bun run typecheck` | Verifică tipurile în toate pachetele |
| `bun run lint` | Rulează oxlint în toate pachetele |
| `bun run test` | Teste unitare (`shared/`) și de integrare (`server/`) cu `bun test` |
| `bun run test:e2e` | Teste Playwright în browser (prima dată: `cd e2e && bunx playwright install chromium`) |

Testele rulează pe o bază separată, `sage_oak_test` (numele din `DATABASE_URL`
plus `_test`), pe care o creează, o migrează și o populează singure — baza de
development nu e atinsă. Testele Playwright pornesc propriul API și client pe
porturile 3100 și 5174, deci merg și cu `dev:server` / `dev:client` pornite.

GitHub Actions (`.github/workflows/ci.yml`) rulează la fiecare push: install,
lint, typecheck, `test`, `test:e2e`, cu un PostgreSQL ca serviciu.

Din `server/` (Prisma trebuie rulat prin aceste scripturi, nu cu `bunx prisma`
direct — scripturile încarcă `.env`):

| Comandă | Ce face |
|---|---|
| `bun run db:migrate` | Aplică migrările; după o schimbare în `schema.prisma` creează una nouă |
| `bun run db:seed` | Încarcă produsele și joburile (se poate rula de mai multe ori) |
| `bun run db:generate` | Regenerează Prisma Client |
| `bun run db:studio` | Deschide Prisma Studio pentru a vedea datele |

Din `client/`: `bun run build` (tipuri + build în `dist/`), `bun run preview`.

---

## API

| Endpoint | Răspuns |
|---|---|
| `GET /api/products` | Catalog cu căutare, filtre și sortare: `q`, `category`, `material`, `color` (liste separate prin virgulă), `min`, `max` (în cenți), `sort`, `bestseller=true` |
| `GET /api/products/bestsellers?limit=3` | Primele N produse bestseller |
| `GET /api/products/:slug` | Un produs, sau 404 |
| `GET /api/products/:slug/related?limit=3` | Produse din aceeași categorie |
| `GET /api/jobs` | Posturile deschise |
| `/api/auth/*` | Better Auth: `sign-up/email`, `sign-in/email`, `sign-out`, `get-session` |
| `GET /api/me` | Utilizatorul logat, sau 401 |
| `GET /api/health` | `{ "status": "ok" }` |

Parametrii invalizi primesc 400 cu numele câmpului: `{ error, issues }`.

---

## Ce conține

12 rute: Acasă, Magazin (catalog cu căutare și filtre), Detaliu produs, Coș,
Checkout în 3 pași, Best Sales, Despre, Cariere, Contact, Autentificare,
Înregistrare, 404.

- **Catalog din baza de date** — căutare și filtre pe categorie, preț, material
  și culoare, cu starea ținută în URL (un link filtrat poate fi copiat și
  trimis).
- **Conturi reale** — înregistrare și autentificare cu email și parolă; sesiunea
  e un cookie HTTP-only. Serverul aplică aceleași reguli de parolă ca
  formularul.
- **Coș** cu cantități, subtotal și confirmare la golire.
- **Checkout** pe 3 pași, pe o singură instanță `react-hook-form`; pasul înapoi
  nu pierde datele completate.
- **Formulare validate** cu Zod, cu aceleași scheme pe client și pe server.
  Cardul e verificat cu algoritmul Luhn și cu data de expirare.
- **Mod zi / noapte**, cu respectarea setării din sistemul de operare.
- **Stări de încărcare** (skeletons) și de eroare prin TanStack Query.
- Responsive de la 360px, cu drawer pentru meniu și pentru filtre.

### Ce nu e încă pe server

Coșul, checkout-ul și formularele de contact, carieră și newsletter sunt încă
**doar pe client** — nu se încasează plăți și nu se salvează comenzi. Coșul se
golește la refresh. Numărătorile din filtre și intervalul de preț sunt încă
calculate din datele din `shared/`, nu cerute de la API.

---

## Structura

```
Practica/
├── client/                  site-ul (React + Vite)
│   └── src/
│       ├── api/             apelurile către API
│       ├── components/      componente, inclusiv ui/ și skeletons/
│       ├── context/         coș, autentificare, notificări, temă
│       ├── data/            taxonomia și opțiunile de filtrare
│       ├── hooks/           useCart, useAuth, useToast, useTheme
│       ├── lib/             filtrare, client de autentificare, formatare
│       └── pages/           cele 12 rute
├── server/                  API-ul (Express + Prisma)
│   ├── prisma/              schema, migrările, seed-ul
│   └── src/
│       ├── lib/             Prisma, Better Auth, logica de catalog
│       ├── middleware/      erori, sesiune
│       └── routes/          products, jobs, me
├── shared/                  @sage-oak/shared — scheme Zod, tipuri, date
├── e2e/                     teste Playwright
├── project-scope.md         cerințele proiectului
├── implementation-plan.md   planul (frontend + backend)
├── AI-LOG.md                jurnalul lucrului cu AI
└── RETRO.md                 ce a mers prost cu AI-ul
```

## Stack

**Client:** React 19.3 · Vite 8.3 · Tailwind CSS 4.3 · React Router 8.4 ·
TanStack Query 5 · React Hook Form 7.88

**Server:** Bun 1.4 · Express 5.2 · Prisma 7.10 · PostgreSQL · Better Auth 1.7

**Comun:** TypeScript 6 · Zod 4.6 · oxlint · `bun test` · Playwright 1.63
