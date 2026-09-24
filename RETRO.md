# RETRO — unde m-a mințit AI-ul


1. **„Rutele merg"** — a raportat rutele ca funcționale pe baza codurilor HTTP
   200, în timp ce pagina arunca `Invalid hook call` și nu randa absolut nimic.
   Într-un SPA *orice* rută întoarce 200, inclusiv cele complet stricate.

2. **Ruta `lazy` cu `export default`** — cod livrat care nu randa nimic și nu
   arunca nicio eroare. Build curat, TypeScript mulțumit, pagină goală. React
   Router v8 voia `Component`, nu `default`.

3. **De trei ori „am găsit un bug"** — și de trei ori bug-ul era în testul lui,
   nu în aplicație: limita de cantitate (20 de click-uri sincrone grupate de
   React), drawer-ul de filtre (`querySelector('dialog')` prindea alt dialog),
   câmpul „Portfolio" (eticheta reală era „Portfolio (optional)").

4. **Screenshot-uri care nu dovedeau nimic** — funcția lui de captură nu
   verifica excepțiile, deci un script picat producea o imagine care arăta ca
   un rezultat valid. A tras concluzii dintr-o poz[]

5. **„Dark mode e doar un swap de token-uri"** — apoi produsele charcoal și ink
   au dispărut complet pe panoul inversat. Exact aceeași greșeală de contrast
   ca în Faza 1, doar pe dos, la două luni de context distanță.

6. **„Toate cele 8 faze, livrate"** — cu skeletons sărite, deși erau punct
   explicit în planul de implementare. Omisiunea era justificată, dar formularea
   o ascundea.

7. **Tiparul comun, și singura concluzie care contează:** niciuna dintre
    problemele de mai sus nu a fost prinsă de TypeScript sau de oxlint. Toate
    au ieșit la iveală pentru că pagina a fost deschisă efectiv în browser.
    „Build-ul trece" nu înseamnă nimic. „Am verificat" merită întrebat *cum*.
