'use client';

import { useEffect } from 'react';
import { initGame } from './game';

export default function Home() {
  useEffect(() => {
    const cleanup = initGame();
    return cleanup;
  }, []);

  return (
    <>
      <div className="stars" id="stars" />

      <div className="topbar">
        <div className="inventory-wrap">
          <div className="inventory-grid" id="inventoryGrid" />
          <div className="inventory-label" id="inventoryLabel">La tua cassetta degli attrezzi</div>
        </div>
      </div>

      <div className="stage">
        {/* SCREEN 0: INTRO */}
        <section className="screen active" data-screen="0">
          <div className="ambient" data-icons="✨,🎈,💌" />
          <span className="eyebrow">Un biglietto un po&apos; speciale</span>
          <h1 className="title">Ciao Frullino, ✨</h1>
          <p className="lead">
            Ho preparato per te un piccolo biglietto di auguri interattivo il quale ti porterà alla scoperta del tuo
            regalo di compleanno. Scusami del ritardo con il quale tale sorpresa sta arrivando, ma proprio
            approfittando di quel ritardo ho avuto questa idea, che mi sembrava più interessante e interattiva.
          </p>
          <div className="card">
            <p className="tight-p">
              Dieci pezzi da raccogliere in questa cassetta degli attrezzi lungo il percorso: nove li conquisti
              giocando, l&apos;ultimo arriva da solo quando avrai finito. A cosa serviranno? Lo scoprirai solo alla fine.
            </p>
            <div className="row"><button className="btn" id="startBtn">Si comincia!</button></div>
          </div>
        </section>

        {/* SCREEN 1: MAZE */}
        <section className="screen" data-screen="1">
          <div className="ambient" data-icons="🧱,➰,🔩" />
          <span className="eyebrow">Gioco 1 · Il labirinto</span>
          <h1 className="title">Guidami fino al 33.</h1>
          <p className="lead">Tocca le frecce per muoverti ed esci dal labirinto: da qualche parte lì in fondo ti aspetta un numero importante.</p>
          <div className="card">
            <div className="maze-legend">
              <span><i className="i-open" /> percorso libero</span>
              <span><i className="i-wall" /> muro</span>
            </div>
            <div className="maze-wrap">
              <div className="maze-grid" id="mazeGrid" />
              <div className="maze-controls">
                <button className="mc-up" data-dr="-1" data-dc="0" aria-label="Su">↑</button>
                <button className="mc-left" data-dr="0" data-dc="-1" aria-label="Sinistra">←</button>
                <button className="mc-down" data-dr="1" data-dc="0" aria-label="Giù">↓</button>
                <button className="mc-right" data-dr="0" data-dc="1" aria-label="Destra">→</button>
              </div>
            </div>
            <div className="feedback" id="fb1" />
          </div>
        </section>

        {/* SCREEN 2: HIDDEN OBJECT */}
        <section className="screen" data-screen="2">
          <div className="ambient" data-icons="☀️,🌊,🫒,🐚" />
          <span className="eyebrow">Gioco 2 · Caccia agli indizi</span>
          <h1 className="title">Trova i 4 simboli di quella terra assolata.</h1>
          <p className="lead">Guarda bene la griglia: i 4 simboli giusti si illuminano per un attimo. Poi si nascondono tutti — sta a te ricordare dove sono.</p>
          <div className="card">
            <div className="seek-bar" id="seekTargets" />
            <div className="seek-status" id="seekStatus" />
            <div className="seek-lives" id="seekLives" />
            <div className="seek-grid" id="seekGrid" />
            <div className="feedback" id="fb2" />
          </div>
        </section>

        {/* SCREEN 3: SENTENCE ORDER - Grotta del Soffio */}
        <section className="screen" data-screen="3">
          <div className="ambient" data-icons="🪨,💧,🕳️" />
          <span className="eyebrow">Gioco 3 · Un rimpianto (piccolo)</span>
          <h1 className="title">Rimetti in ordine le parole.</h1>
          <p className="lead">C&apos;è una cosa che ci ha fatto rosicare parecchio durante quel viaggio in Puglia. Tocca le parole nell&apos;ordine giusto per scoprire cosa.</p>
          <div className="card">
            <div className="sentence-build" id="sentenceBuild3" />
            <div className="word-bank" id="wordBank3" />
            <div className="row"><button className="btn secondary small" data-reset="3">Ricomincia</button></div>
            <div className="feedback" id="fb3" />
          </div>
        </section>

        {/* SCREEN 4: MEMORY */}
        <section className="screen" data-screen="4">
          <div className="ambient" data-icons="💙,🌟,🌙" />
          <span className="eyebrow">Gioco 4 · Piccola e imperfetta, ma buona</span>
          <h1 className="title">Trova tutte le coppie.</h1>
          <p className="lead">Come un certo alieno blu che conosci bene: si va avanti tutti insieme, nessuno si perde e nessuno resta indietro.</p>
          <div className="card">
            <div className="mem-grid" id="memGrid" />
            <div className="feedback" id="fb4" />
          </div>
        </section>

        {/* SCREEN 5: QUIZ - Argentina */}
        <section className="screen" data-screen="5">
          <div className="ambient" data-icons="🚗,🅿️,➡️" />
          <span className="eyebrow">Gioco 5 · Regole locali</span>
          <h1 className="title">Come si parcheggiava in Argentina?</h1>
          <p className="lead">Una regola tutta loro, che ancora oggi ci fa ridere.</p>
          <div className="card">
            <div id="quizOpts5" />
            <div className="feedback" id="fb5" />
          </div>
        </section>

        {/* SCREEN 6: QUIZ - Brasile/Yemanjá */}
        <section className="screen" data-screen="6">
          <div className="ambient" data-icons="🌊,🐚,🐟" />
          <span className="eyebrow">Gioco 6 · Un luogo speciale</span>
          <h1 className="title">Dove abbiamo trovato il santuario di Yemanjá?</h1>
          <p className="lead">In Brasile, col profumo salmastro di quel giorno ancora vivo nei ricordi.</p>
          <div className="card">
            <div id="quizOpts6" />
            <div className="feedback" id="fb6" />
          </div>
        </section>

        {/* SCREEN 7: SLIDER PUZZLE - couscous */}
        <section className="screen" data-screen="7">
          <div className="ambient" data-icons="🥣,🌰,🍑" />
          <span className="eyebrow">Gioco 7 · Il tuo piatto del cuore</span>
          <h1 className="title">Rimetti in ordine gli ingredienti.</h1>
          <p className="lead">Fai scorrere le tessere per ricomporre la ricetta che ti fa sempre brillare gli occhi, seguendo l&apos;ordine qui sotto.</p>
          <div className="card">
            <div className="slider-target" id="sliderTarget" />
            <div className="slider-grid" id="sliderGrid" />
            <div className="feedback" id="fb7" />
          </div>
        </section>

        {/* SCREEN 8: QUIZ - Audi */}
        <section className="screen" data-screen="8">
          <div className="ambient" data-icons="✨,🚗,⚡" />
          <span className="eyebrow">Gioco 8 · La scintilla</span>
          <h1 className="title">Cosa ha fatto scattare la scintilla tra noi?</h1>
          <p className="lead">Non è la risposta che ti aspetti.</p>
          <div className="card">
            <div id="quizOpts8" />
            <div className="feedback" id="fb8" />
          </div>
        </section>

        {/* SCREEN 9: SENTENCE ORDER 2 - Irlanda */}
        <section className="screen" data-screen="9">
          <div className="ambient" data-icons="🍀,🌈" />
          <span className="eyebrow">Gioco 9 · L&apos;ultimo indizio</span>
          <h1 className="title">Un ultimo indovinello, poi il regalo.</h1>
          <p className="lead">Il tuo posto del cuore, quello dove l&apos;erba è sempre verde. Rimetti in ordine le parole.</p>
          <div className="card">
            <div className="sentence-build" id="sentenceBuild9" />
            <div className="word-bank" id="wordBank9" />
            <div className="row"><button className="btn secondary small" data-reset="9">Ricomincia</button></div>
            <div className="feedback" id="fb9" />
          </div>
        </section>

        {/* SCREEN 10: FINAL REVEAL */}
        <section className="screen" data-screen="10">
          <div className="ambient" data-icons="🎉,✨" />
          <span className="eyebrow" id="finalEyebrow">Cassetta completa</span>
          <h1 className="title" id="finalTitle">Aspetta un attimo...</h1>
          <p className="lead" id="finalLead">
            Bullone, cacciavite, catena, ingranaggio, leva, gradino, trave, binario, sedile... tutti insieme, questi
            pezzi formano qualcosa.
          </p>

          <div className="assembly-stage" id="assemblyStage">
            <svg className="coaster-svg" id="coasterSvg" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="160" x2="390" y2="160" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
              <rect x="50" y="80" width="10" height="80" rx="2" fill="#1E2559" stroke="#F2B705" strokeWidth="1.5" />
              <rect x="270" y="60" width="10" height="100" rx="2" fill="#1E2559" stroke="#3FE0D0" strokeWidth="1.5" />
              <path
                d="M20,160 Q55,75 100,95 Q130,108 150,90 Q170,70 195,90 Q215,108 240,95 Q260,85 275,65 Q295,45 320,80 Q335,105 360,110"
                stroke="#F2B705" strokeWidth="3.5" fill="none" strokeLinecap="round"
              />
              <circle cx="150" cy="90" r="26" stroke="#FF4FA3" strokeWidth="3" fill="none" />
              <g>
                <rect x="130" y="60" width="26" height="14" rx="5" fill="#F7D258" />
                <circle cx="137" cy="57" r="3.5" fill="#FFF8ED" />
                <circle cx="149" cy="57" r="3.5" fill="#FFF8ED" />
              </g>
              <rect x="300" y="24" width="86" height="26" rx="6" fill="#1E2559" stroke="#F2B705" strokeWidth="1.5" />
              <text x="343" y="42" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="14" fill="#F7D258">RAPTOR</text>
              <text x="308" y="20" fontSize="14" fill="#FF4FA3">✦</text>
              <text x="382" y="60" fontSize="12" fill="#3FE0D0">✦</text>
            </svg>
          </div>

          <div className="ticket" id="ticketCard">
            <div className="ticket-eyebrow">Ammissione Speciale</div>
            <h2>Gardaland <span className="pass-name">Platinum Pass</span></h2>
            <p className="ticket-name-line">Intestato a: <strong className="ticket-name">Patafrullo</strong></p>
            <p className="mono ticket-mono-line">VALIDITÀ · TUTTA LA STAGIONE &nbsp;•&nbsp; INGRESSI · ILLIMITATI</p>
            <p className="ticket-message">
              33 anni, un compleanno in Puglia, una grotta ancora da scoprire, e una determinazione — la tua — che mi
              rende orgoglioso ogni giorno. Ti amo tantissimo. Si parte dal Raptor.
            </p>
            <div className="seal">🎢</div>
          </div>
          <p className="lead ps-line" id="psLine">
            P.S. Anche il cane delle nacchere è invitato, ma non so se farà in tempo ad arrivare.
          </p>
          <div className="row"><button className="btn secondary" id="confettiBtn">Ancora coriandoli 🎉</button></div>
        </section>
      </div>

      <footer className="note">fatto con 💛 per la signora — apri, gioca, e non barare guardando il codice sorgente.</footer>

      <div className="confetti" id="confettiLayer" />
      <div className="reward-toast" id="rewardToast" />
    </>
  );
}
