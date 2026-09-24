# AI-LOG

Jurnalul lucrului cu asistentul AI la proiectul **Sage & Oak** — magazin online
de mobilă, frontend-only (React 19 + TypeScript + Vite + Tailwind v4).

Perioada: 24 septembrie 2026
Repo: https://github.com/HYPWUIT/Practica

---

## 1. Tool-ul folosit

**Claude Code** (CLI-ul oficial Anthropic), model **Opus 5**, rulat în terminal
pe WSL2 / Ubuntu.

Ce a contat la alegerea lui, față de un chat obișnuit în browser:

- are acces direct la fișiere (citește, scrie, editează în repo), deci nu am
  făcut copy-paste de cod înainte și înapoi;
- rulează comenzi în shell — a putut face singur `bun add`, `bun run build`,
  `bun run lint` și `git`;
- a putut **porni aplicația și să o testeze în browser**. Asta a fost partea cea
  mai utilă: a condus Chrome headless prin CDP (Chrome DevTools Protocol), a
  completat formulare, a dat click pe filtre și a făcut screenshot-uri pe care
  le-a citit ca imagini. Mai multe bug-uri au fost găsite exact așa, nu de
  TypeScript.

Tool-uri secundare folosite de el în timpul lucrului: **Context7** (pentru
documentația la zi a Zod 4, React Router v8, Tailwind v4, TanStack Query v5) și
Chromium din cache-ul Playwright, pentru testare vizuală.

---

## 2. Promptul de start (copy-paste)

Sesiunea a început, literal, cu:

```
run the app
```

apoi, după ce a încercat `npm`:

```
run the app using bun
```

Primul prompt care a contat cu adevărat — cel de la care a pornit tot proiectul:

```
Review project-scope.md și ask clarifying questions.
```

(în sesiune scris în engleză: `Review project-scope.md and ask clarifying questions.`)

La momentul acela `project-scope.md` avea 12 rânduri scrise de mine:

```markdown
# Project
Create a furniture online store for clients to be able to buy online and search
for their products.

# Features
1. Navigation bar for home, contact, best sales, career and about page.
2. A search bar and a filter for results.
3. Payment system.
4. Authentification system
5. Add to cart system

# NB
Everything is for frontend only.
```

---

## 3. Cele 3 prompturi care au contat cel mai mult

### 3.1. `Review project-scope.md and ask clarifying questions.`

**De ce a contat:** în loc să înceapă să scrie cod pe baza a 12 rânduri vagi,
AI-ul a pus 7 întrebări în două runde și a găsit două contradicții pe care eu nu
le văzusem:

- „frontend only" intra în conflict cu „payment system" și „authentification
  system" — ambele presupun un backend;
- în lista de pagini erau 5 pagini de navigație, dar funcționalitățile cereau
  minimum 3 în plus (catalog, detaliu produs, coș) — altfel „search for their
  products" și „add to cart" nu au unde să existe.

Din răspunsurile mele au ieșit deciziile care au ținut tot proiectul: Tailwind,
React Router + Context, doar componente fără backend, 9 pagini, filtre pe
categorie/preț/material/culoare, paletă verde-alb.

**Lecția:** cel mai valoros prompt din tot proiectul nu a produs nicio linie de
cod.

### 3.2. `Suggest an implementation plan for this project.`

**De ce a contat:** a rezultat `implementation-plan.md` cu 9 faze (0–8), fiecare
cu fișierele concrete și cu riscurile identificate din start. Am lucrat apoi
strict pe „start phase N", fază cu fază, cu commit după fiecare.

Diferența față de „fă-mi un magazin online": fiecare fază a fost verificabilă
separat și am putut da commit la ceva care funcționa, nu la 3000 de linii
apărute deodată. Planul a prins din start și două riscuri reale:

- Vite 8 era foarte nou și `@tailwindcss/vite` putea să nu fie compatibil
  (nu a fost o problemă, s-a verificat în Faza 0);
- coșul se golește la refresh — decizie asumată, nu bug.

### 3.3. `on phase 3 we can use react hook with zod library. So we dont need a hook`

**De ce a contat:** aici am corectat eu planul AI-ului. Planul prevedea un hook
`useForm` scris de mână, cu validări proprii (required, email, minLength,
pattern, card, expiry, CVV) — descris chiar de el drept „cel mai important
fișier din proiect".

Sugestia mea de **react-hook-form + Zod** a eliminat complet acel fișier.
Rezultatul: schemele stau într-un singur loc (`lib/schemas.ts`), tipurile
formularelor vin din `z.infer` (deci niciun câmp nu e declarat de două ori), iar
singurele reguli scrise de mână au rămas două — algoritmul Luhn și verificarea
datei de expirare, pentru că Zod nu le are built-in.

A avut efect și mai târziu: checkout-ul în 3 pași rulează pe **o singură**
instanță `react-hook-form`, validată pe felii cu `trigger()`, deci la „Back" nu
se pierde nimic din ce era completat. Cu un hook scris de mână ar fi fost
semnificativ mai greu.

**Lecția:** AI-ul nu trebuie lăsat să decidă singur stack-ul. Când știi o
bibliotecă potrivită, spune-i — planul lui era corect, dar inutil de complicat.

---

## 4. Cazuri în care AI-ul a greșit (și cum mi-am dat seama)

### 4.1. Rută lazy care afișa pagină goală, fără nicio eroare

**Ce a greșit:** în Faza 1 a scris o rută cu
`lazy: () => import('./pages/X')`, unde fișierul avea `export default`.

**Cum mi-am dat seama:** nu din build — `bun run build` a trecut curat, iar
TypeScript nu a zis nimic. Pagina întorcea **HTTP 200** și tot layout-ul
(navbar, footer) se randa normal. Doar screenshot-ul a arătat că zona de
conținut era complet goală.

**Cauza reală:** React Router v8 așteaptă ca modulul din `lazy` să exporte
`Component`, nu `default`. Când nu-l găsește, nu aruncă eroare — pur și simplu
nu randează nimic.

**Cum s-a rezolvat:** în Faza 8, când am făcut code-splitting pe toate rutele,
s-a folosit un mic adaptor:

```ts
const page = (load) => async () => ({ Component: (await load()).default })
```

**De reținut:** „build-ul trece" nu înseamnă „aplicația merge". Fără să o
deschid efectiv în browser, bug-ul ăsta ar fi ajuns în producție.

### 4.2. Badge-ul coșului număra produse care nu existau

**Ce a greșit:** în Faza 2, `CartContext` calcula `count` din `items` (perechi
`{productId, qty}`), în timp ce `lines` și `subtotal` se calculau din produsele
găsite efectiv în catalog.

**Cum mi-am dat seama:** AI-ul a construit o pagină temporară care rula automat
10 operații pe coș și afișa starea după fiecare. Rândul care a dat totul de gol:

```
add unknown id    count=4  subtotal=$4,497  lines=1  items=[…,{"productId":"nope","qty":1}]
```

Adică badge-ul din navbar ar fi arătat 4 produse, iar pagina coșului 3. În plus,
id-ul inexistent rămânea în state pentru totdeauna.

**Cum s-a rezolvat:** dublu — reducer-ul respinge acum din start id-urile fără
produs, iar `count` se calculează din `lines`, nu din `items`, ca să fie
**structural imposibil** ca cele două să difere.

**De reținut:** TypeScript nu prinde așa ceva. Ambele variabile erau `number`,
tipurile erau corecte, logica era greșită.

### 4.3. Titlul „Filters" apărea de două ori pe mobil

**Ce a greșit:** în Faza 8 a pus `FilterSidebar` (care are propriul `<h2>
Filters</h2>`) într-un drawer `Sheet` care are deja antet cu titlu.

**Cum mi-am dat seama:** toate testele funcționale treceau — drawer-ul se
deschidea, cele 14 checkbox-uri erau acolo, URL-ul se actualiza corect,
butonul zicea „Show 4 products". **Doar screenshot-ul** la 390px a arătat
cuvântul „Filters" scris de două ori, unul sub altul.

**Cum s-a rezolvat:** `FilterSidebar` a primit prop-ul `hideHeading`, păstrând
totuși butonul „Clear all" aliniat la dreapta.

**De reținut:** testele verifică ce le ceri să verifice. Un defect pur vizual
trece prin ele fără nicio problemă.

### 4.4. Modul întunecat făcea produsele închise la culoare să dispară

**Ce a greșit:** la implementarea dark mode a inversat *toate* token-urile de
culoare, inclusiv `--color-mist` — fundalul pe care stau siluetele produselor.

**Cum mi-am dat seama:** a rulat un script care parcurge toate elementele
vizibile din pagină și calculează luminanța fundalului și a textului. A raportat
4 elemente „dark text pe fundal întunecat" pe `/catalog` — exact produsele
charcoal și ink (lampa, canapeaua neagră), care deveniseră aproape invizibile pe
panoul întunecat.

Ironia: era **exact aceeași greșeală ca în Faza 1**, doar pe dos. Atunci
produsele crem dispăreau pe fundal deschis și s-a rezolvat închizând nuanța
crem și adăugând token-ul `mist`.

**Cum s-a rezolvat:** `mist` **nu** se mai inversează. Motivul, scris în cod:
siluetele țin locul fotografiilor de produs, iar fotografiile nu își schimbă
culorile când site-ul trece pe dark mode.

### 4.5. Fundalul dialogurilor ar fi devenit o ceață albă

**Ce a greșit:** `Modal` și `Sheet` foloseau `backdrop:bg-ink/40`, unde `ink`
este culoarea textului.

**Cum mi-am dat seama:** aici nu m-am prins din testare, ci din raționament în
timpul lucrului la dark mode: `ink` devine aproape alb pe temă întunecată, deci
„fundalul întunecat" al modalei ar fi devenit o ceață deschisă peste pagină.

**Cum s-a rezolvat:** token separat `--color-scrim`, întunecat în ambele teme.

### 4.6. Bug-uri în propriile lui teste (nu în aplicație)

De trei ori AI-ul a raportat inițial o problemă care nu exista în cod:

| Ce părea | Ce era de fapt |
|---|---|
| Stepper-ul de cantitate nu respecta limita de 10 (20 de click-uri → cantitatea 2) | 20 de click-uri sincrone sunt grupate de React într-un singur render; cu pauze de 30ms între ele ajunge corect la 10 și se dezactivează |
| Drawer-ul de filtre nu avea checkbox-uri | `document.querySelector('dialog')` prindea drawer-ul de navigație, care e primul în DOM. Corect: `dialog[open]` |
| Câmpul „Portfolio" nu există | Eticheta reală era „Portfolio (optional)" |

**De reținut:** când AI-ul zice „am găsit un bug", merită verificat mai întâi
dacă bug-ul nu e chiar în test.

### 4.7. Planul conținea o recomandare depășită

Planul cerea `forwardRef` pentru `Input` și `Select`, ca să funcționeze
`{...register()}` de la react-hook-form. În **React 19** `ref` se transmite ca
prop normal, deci `forwardRef` nu mai e necesar. S-a descoperit la
implementare, în Faza 3.

La fel, planul prevedea *skeletons* încă din Faza 8 — dar atunci nu exista nimic
asincron în aplicație, deci nu aveau ce să acopere. Au devenit justificate abia
după introducerea TanStack Query.

---

## 5. Ce am scris de mână, fără AI

**Lucruri verificabile din istoricul repo-ului:**

- **`project-scope.md`, versiunea inițială** — cele 12 rânduri de la care a
  pornit tot (commit `bae784e`, `010c968`). AI-ul le-a extins ulterior, dar
  ideea, funcționalitățile și constrângerea „frontend only" sunt ale mele.
- **Toate deciziile de arhitectură**, date ca răspuns la întrebările lui:
  Tailwind în loc de CSS simplu sau MUI; React Router + Context în loc de
  Zustand; flux complet de magazin (9 pagini) în loc de variantă redusă;
  filtrele alese (categorie, preț, material+culoare — am exclus „cameră");
  imagini placeholder locale în loc de Unsplash; paleta verde-alb.
- **Corecția de stack din Faza 3** — react-hook-form + Zod în locul hook-ului
  propriu propus de AI (vezi 3.3). Este contribuția tehnică proprie cu cel mai
  mare impact asupra codului.
- **Managementul Git integral**: `git init`, remote-ul, branch-ul `test` ca
  plasă de siguranță, și 8 din cele 14 commit-uri — cu mesaje scrise de mine
  (`bae784e`, `010c968`, `3a59809`, `f17d307`, `8c4dd2c`, `9b16e1e`, `d59dcf6`,
  `bfc2fd8`).
- **Deciziile de produs ulterioare**: schimbarea regiunii din Cluj în Chișinău,
  înlocuirea favicon-ului cu logo-ul firmei, cererea de TanStack Query +
  skeletons, cererea de dark mode.

**De ce am ales să fac eu aceste lucruri:**

Scope-ul și deciziile de stack nu pot fi delegate — AI-ul poate enumera
opțiunile, dar alegerea depinde de ce vreau eu să învăț și de ce trebuie să
livrez. La Git am ținut controlul intenționat: branch-ul `test` a existat exact
ca să pot arunca lucrul AI-ului dacă o lua razna, iar asta nu are sens dacă tot
el decide când și ce se comite.

> **De completat de mine:** dacă am editat direct fișiere între rulările AI-ului
> (ajustări de culori, texte, spacing), le adaug aici. Sesiunea a detectat cel
> puțin o modificare manuală în `src/App.tsx`, între două rulări.

---

## 6. Ce aș face altfel în primele 10 minute, dacă aș relua

1. **Aș scrie scope-ul ca specificație, nu ca listă de dorințe.** Primele 10
   minute s-au dus pe două runde de întrebări de clarificare — utile, dar
   evitabile. Dacă scriam de la început „fără backend, auth și plata sunt doar
   formulare cu validare, 9 pagini, filtre pe X/Y/Z, paletă verde", ajungeam la
   aceeași specificație fără runda de întrebări.

2. **Aș cere planul pe faze înainte de orice linie de cod.** Am nimerit-o, dar
   din reflex, nu intenționat. Structura pe faze este singurul motiv pentru care
   istoricul e citibil și pentru care fiecare commit conține ceva funcțional.

3. **Aș configura verificarea în browser din minutul 1.** Driver-ul CDP a apărut
   abia în Faza 3. Trei dintre bug-urile de mai sus (4.1, 4.3, 4.4) erau
   invizibile pentru `tsc` și `oxlint` și au fost prinse doar de screenshot-uri.
   Regula pe care aș impune-o de la început: *nicio fază nu e gata până nu văd
   pagina*.

4. **Aș stabili de la început stack-ul de formulare.** Jumătate din
   funcționalități sunt formulare (auth, plată, contact, carieră, newsletter).
   Faptul că am ajuns la react-hook-form + Zod abia în Faza 3, ca o corecție,
   era evitabil printr-o singură propoziție în scope.

5. **Aș rula un `git init` + primul commit înainte de orice.** Repo-ul nu era
   inițializat la începutul sesiunii, iar branch-ul `test` a apărut abia pe la
   Faza 3. Plasa de siguranță e utilă de la început, nu de la mijloc.

6. **Aș întreba explicit despre modul întunecat și despre stratul de date de la
   început.** Ambele au venit ca cerințe ulterioare și ambele au necesitat
   refactorizare. Dark mode-ul a mers ușor doar pentru că, din întâmplare,
   fiecare culoare trecea deja prin token-uri `@theme` — dacă aș fi scris
   culori direct în clase, ar fi însemnat sute de modificări. Aici am avut
   noroc, nu prevedere.

---

## Rezumat cifre

| | |
|---|---|
| Faze planificate / livrate | 9 / 9 |
| Commit-uri | 14 |
| Pagini | 12 rute (9 din scope + login, signup, 404) |
| Produse în catalog | 24, în 6 categorii |
| Bundle principal (după code-splitting) | 492 kB → 154 kB gzip |
| Bug-uri prinse de screenshot, nu de compilator | 3 |
| Linii scrise de mine fără AI | vezi secțiunea 5 |
