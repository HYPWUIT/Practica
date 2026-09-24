# Sage & Oak

Magazin online de mobilă — proiect **frontend-only** (React 19 + TypeScript +
Vite 8 + Tailwind CSS v4).

---

## Rulare în 3 comenzi

```bash
cd client
bun install
bun run dev
```

Se deschide pe **http://localhost:5173**

Într-o singură linie, dacă preferi copy-paste:

```bash
cd client && bun install && bun run dev
```

> **Singura cerință:** [Bun](https://bun.sh) instalat
> (testat pe `bun 1.4.2`). Instalare, dacă lipsește:
> `curl -fsSL https://bun.sh/install | bash`

### Fără Bun? Aceleași 3 comenzi cu npm

```bash
cd client
npm install
npm run dev
```

Necesită Node.js 20.19+ sau 22.12+ (cerința Vite 8). Proiectul are `bun.lock`,
nu `package-lock.json`, deci npm va rezolva dependențele de la zero — merge, dar
calea testată este cea cu Bun.

---

## Verificat pe clonă curată

Comenzile de mai sus au fost rulate pe un `git clone` proaspăt, fără
`node_modules`, înainte de a scrie acest fișier:

```
bun install     58 packages installed [1331.00ms]
bun run dev     VITE v8.3.1  ready in 312 ms  →  http://localhost:5173/
```

Paginile au fost verificate că se randează efectiv, nu doar că întorc HTTP 200:

| Rută | Titlu randat |
|---|---|
| `/` | Furniture you stop noticing, in the best way |
| `/catalog` | Shop |
| `/product/alder-three-seat-sofa` | Alder Three-Seat Sofa |
| `/cart` | Your cart |
| `/contact` | Ask us anything |

---

## Alte comenzi

| Comandă | Ce face |
|---|---|
| `bun run build` | Verifică tipurile (`tsc -b`) și construiește în `dist/` |
| `bun run preview` | Servește build-ul de producție |
| `bun run lint` | Rulează oxlint |

Toate se rulează din directorul `client/`.

---

## Ce conține

12 rute: Acasă, Magazin (catalog cu căutare și filtre), Detaliu produs, Coș,
Checkout în 3 pași, Best Sales, Despre, Cariere, Contact, Autentificare,
Înregistrare, 404.

- **Căutare și filtre** pe categorie, preț, material și culoare, cu starea
  ținută în URL — un link filtrat poate fi copiat și trimis.
- **Coș** cu cantități, subtotal și confirmare la golire.
- **Checkout** pe 3 pași, pe o singură instanță `react-hook-form`; pasul înapoi
  nu pierde datele completate.
- **Formulare validate** cu Zod: autentificare, înregistrare, contact, aplicare
  la job, newsletter. Cardul e verificat cu algoritmul Luhn și cu data de
  expirare.
- **Mod zi / noapte**, cu respectarea setării din sistemul de operare.
- **Stări de încărcare** (skeletons) prin TanStack Query.
- Responsive de la 360px, cu drawer pentru meniu și pentru filtre.

### Important

Nu există backend. Autentificarea, plata și coșul sunt **doar componente cu
validare** — nu se creează conturi, nu se încasează plăți, nu se trimit
comenzi. Coșul se golește la refresh, intenționat. Catalogul (24 de produse) e
un fișier în repo, servit printr-un strat asincron care imită un API.

---

## Structura

```
Practica/
├── client/               ← aplicația (toate comenzile se dau de aici)
│   ├── src/
│   │   ├── api/          strat de date (înlocuibil cu un backend real)
│   │   ├── components/   componente, inclusiv ui/ și skeletons/
│   │   ├── context/      coș, autentificare, notificări, temă
│   │   ├── data/         catalogul de produse și taxonomia
│   │   ├── hooks/        useCart, useAuth, useToast, useTheme
│   │   ├── lib/          filtrare, scheme Zod, validatori, formatare
│   │   └── pages/        cele 12 rute
│   └── public/
├── project-scope.md      cerințele proiectului
├── implementation-plan.md planul pe 9 faze
└── AI-LOG.md             jurnalul lucrului cu AI
```

## Stack

React 19.3 · TypeScript 6 · Vite 8.3 · Tailwind CSS 4.3 · React Router 8.4 ·
TanStack Query 5.103 · React Hook Form 7.88 · Zod 4.6 · oxlint
