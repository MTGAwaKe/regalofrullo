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

- `app/page.tsx` — markup delle 11 schermate (intro + 9 giochi + reveal finale)
- `app/game.js` — logica dei giochi (porting 1:1 della versione originale in vanilla JS)
- `app/globals.css` — stile originale del biglietto
- `legacy-original-site/` — la primissima versione statica (HTML/CSS/JS), tenuta come riferimento

## Deploy

Collegato a Vercel: ogni push sul branch principale genera un deploy di produzione.
