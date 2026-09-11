# Per Frullino 🎁

Biglietto di auguri interattivo: dieci piccoli giochi da completare per raccogliere i pezzi
di una "cassetta degli attrezzi" e scoprire il regalo finale.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Nessun database: è un'esperienza statica lato client

## Sviluppo

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Struttura

- `app/page.tsx` — orchestratore: stato della schermata corrente, inventario, toast, coriandoli
- `app/components/` — un componente React per schermata/gioco (stato vero, non più manipolazione diretta del DOM)
- `app/lib/` — dati condivisi (i 10 pezzi) e utility (shuffle)
- `app/globals.css` — stile e animazioni (rivisto rispetto all'originale: labirinto con token animato e swipe, flip 3D nel memory, sentence-order con slot vuoti e undo, slider con tessere che scorrono, ecc.)
- `legacy-original-site/` — la primissima versione statica (HTML/CSS/JS), tenuta come riferimento

## Deploy

Collegato a Vercel: ogni push sul branch principale genera un deploy di produzione.
