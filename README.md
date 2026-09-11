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

- `app/page.tsx` — orchestratore: schermata corrente (con transizione), inventario, toast, coriandoli, persistenza progressi
- `app/components/` — un componente React per schermata/gioco (stato vero, non più manipolazione diretta del DOM)
- `app/lib/` — dati condivisi (i 10 pezzi), utility (shuffle), geometria del labirinto, motore audio
- `app/globals.css` — stile e animazioni (labirinto con token animato/swipe/vista in prima persona, flip 3D nel memory, sentence-order con slot vuoti e undo, slider con tessere che scorrono, ecc.)
- `legacy-original-site/` — la primissima versione statica (HTML/CSS/JS), tenuta come riferimento

## Funzionalità

- **Audio**: una melodia di festa originale generata via Web Audio API (nessun file esterno), con pulsante muto e slider del volume; preferenze salvate in `localStorage`
- **Progressi salvati**: schermata e inventario vengono ricordati in `localStorage`, così si può riprendere da dove si era arrivati
- **Labirinto**: oltre alla mappa dall'alto, una mini-view in prima persona (SVG) mostra il corridoio davanti a sé in base alla direzione dell'ultimo movimento
- **Ottimizzato per mobile**: safe-area insets per notch/home-indicator, target di tocco generosi, nessuno scroll orizzontale

## Prossimi passi (non ancora fatti)

- Sostituire le emoji della caccia agli indizi/memory con foto vere

## Deploy

Collegato a Vercel: ogni push sul branch principale genera un deploy di produzione.
