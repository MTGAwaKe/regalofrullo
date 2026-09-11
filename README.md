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

## Design

Ogni schermata è un "foglio" numerato (00/10 … 10/10) dello stesso set di disegni tecnici — cartiglio
in stencil, cornice con crocini d'angolo, griglia millimetrata sullo sfondo. Il freddo del disegno
tecnico (blu, righelli, lettering stencil) contrasta con il caldo delle decorazioni fatte a mano (le
emoji come adesivi, i pezzi raccolti come minuteria in ottone, un accento corallo per i timbri). Un
solo momento di vero calore cromatico: il biglietto Gardaland finale.

- Colori: `--paper` (blu blueprint), `--panel` (foglio), `--ink`/`--line` (inchiostro e righe), `--brass`
  (pezzi raccolti, azioni), `--grease` (accento caldo), `--correct`/`--wrong` (esiti)
- Type: *Big Shoulders Stencil* per cartigli/titoli tecnici, *IBM Plex Sans* + *IBM Plex Mono* per testi e dati

## Struttura

- `app/page.tsx` — orchestratore: schermata corrente (con transizione), inventario, toast, coriandoli
- `app/components/` — un componente React per schermata/gioco (stato vero, non più manipolazione diretta del DOM); `ScreenShell` disegna il "foglio" comune a tutte
- `app/lib/` — dati condivisi (i 10 pezzi), utility (shuffle), geometria del labirinto, motore audio
- `app/globals.css` — il sistema di design (blueprint) e le animazioni di ogni gioco
- `legacy-original-site/` — la primissima versione statica (HTML/CSS/JS), tenuta come riferimento

## Funzionalità

- **Audio**: una melodia di festa originale generata via Web Audio API (nessun file esterno), con pulsante muto e slider del volume; preferenze salvate in `localStorage`; piccoli effetti sonori (corretto/sbagliato/click) per ogni gioco
- **Vibrazione tattile** su mobile per bump, risposte sbagliate e coppie/risposte trovate (Android; su iOS Safari non fa nulla, l'API non esiste)
- **Barra di avanzamento** (N/10) accanto alla cassetta degli attrezzi
- Nessun progresso salvato: ogni apertura/refresh riparte dalla copertina
- **Reveal finale**: i dieci pezzi vengono ripresentati uno a uno con il loro nome, poi convergono in una nuvola di polvere prima di rivelare l'ottovolante e il biglietto
- **Ottimizzato per mobile**: safe-area insets per notch/home-indicator, target di tocco generosi, nessuno scroll orizzontale

## Prossimi passi (non ancora fatti)

- Sostituire le emoji della caccia agli indizi/memory con foto vere

## Deploy

Collegato a Vercel: ogni push sul branch principale genera un deploy di produzione.
