'use client';

import { useEffect, useState } from 'react';
import { ScreenShell } from './ScreenShell';
import { PieceAssembly } from './PieceAssembly';

// Two passes of the same path (offset a hair) read as the twin rails of a
// real coaster track rather than one flat wavy line.
const TRACK_PATH =
  'M20,160 Q55,75 100,95 Q130,108 150,90 Q170,70 195,90 Q215,108 240,95 Q260,85 275,65 Q295,45 320,80 Q335,105 360,110';

type Phase = 'assembling' | 'coaster' | 'ticket';

export function FinalReveal({
  onCollectFinalPiece,
  onFireConfetti,
}: {
  onCollectFinalPiece: () => void;
  onFireConfetti: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('assembling');

  useEffect(() => {
    if (phase !== 'coaster') return;
    const t = setTimeout(() => {
      setPhase('ticket');
      onFireConfetti();
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, onFireConfetti]);

  return (
    <ScreenShell
      sheetIndex={10}
      sheetName="Montaggio finale"
      ambientIcons={['🎉', '✨']}
      title="Aspetta un attimo..."
      lead={
        phase === 'assembling'
          ? 'Guarda bene: ogni pezzo che hai raccolto sta per trasformarsi in qualcosa.'
          : 'Tutti insieme, questi pezzi formano qualcosa.'
      }
    >
      {phase === 'assembling' && (
        <PieceAssembly onFinalPiece={onCollectFinalPiece} onDone={() => setPhase('coaster')} />
      )}

      {phase !== 'assembling' && (
        <>
          <div className="assembly-stage revealed">
            <svg className="coaster-svg" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="160" x2="390" y2="160" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
              <rect x="50" y="80" width="10" height="80" rx="2" fill="#0A283F" stroke="var(--line)" strokeWidth="1.5" />
              <rect x="270" y="60" width="10" height="100" rx="2" fill="#0A283F" stroke="var(--line)" strokeWidth="1.5" />

              {/* twin rails */}
              <path
                id="coasterTrack"
                d={TRACK_PATH}
                stroke="var(--correct)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={TRACK_PATH}
                stroke="var(--correct)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                opacity=".4"
                transform="translate(0,5)"
              />

              {/* the loop */}
              <circle cx="150" cy="90" r="26" stroke="var(--correct)" strokeWidth="3" fill="none" />

              {/* wing-coaster train: riders seated to either side of the rail, not on top of it */}
              <g>
                <rect x="141" y="86" width="6" height="9" rx="2" fill="var(--brass)" />
                <circle cx="130" cy="90" r="4.5" fill="var(--grease)" />
                <circle cx="158" cy="90" r="4.5" fill="var(--grease)" />
                <circle cx="121" cy="90" r="4" fill="var(--grease)" opacity=".7" />
                <circle cx="167" cy="90" r="4" fill="var(--grease)" opacity=".7" />
              </g>

              {/* station sign, clawed as if something broke loose */}
              <rect x="300" y="24" width="86" height="26" rx="6" fill="#0A283F" stroke="var(--brass)" strokeWidth="1.5" />
              <text
                x="343"
                y="42"
                textAnchor="middle"
                fontFamily="var(--font-stencil), sans-serif"
                fontWeight="700"
                fontSize="15"
                letterSpacing="1"
                fill="var(--brass)"
              >
                RAPTOR
              </text>
              <g stroke="var(--grease)" strokeWidth="2" strokeLinecap="round" opacity=".85">
                <line x1="302" y1="16" x2="313" y2="30" />
                <line x1="309" y1="14" x2="320" y2="28" />
                <line x1="316" y1="13" x2="327" y2="27" />
              </g>
              <text x="308" y="20" fontSize="14" fill="var(--brass)">✦</text>
              <text x="382" y="60" fontSize="12" fill="var(--correct)">✦</text>

              {/* a little wing-train silhouette gliding along the track */}
              <g>
                <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#coasterTrack" />
                </animateMotion>
                <circle r="2.6" cy="-4.5" fill="var(--grease)" />
                <circle r="2.6" cy="4.5" fill="var(--grease)" />
                <circle r="2.2" fill="var(--brass)" />
              </g>
            </svg>
          </div>

          <div className={`ticket${phase === 'ticket' ? ' revealed' : ''}`}>
            <div className="ticket-eyebrow">Ammissione Speciale</div>
            <h2>
              Gardaland <span className="pass-name">Platinum Pass</span>
            </h2>
            <p className="ticket-name-line">
              Intestato a: <strong className="ticket-name">Patafrullo</strong>
            </p>
            <p className="mono ticket-mono-line">VALIDITÀ · TUTTA LA STAGIONE &nbsp;•&nbsp; INGRESSI · ILLIMITATI</p>
            <p className="ticket-message">
              33 anni, un compleanno in Puglia, una grotta ancora da scoprire, e una determinazione — la tua — che mi
              rende orgoglioso ogni giorno. Ti amo tantissimo. Si parte dal Raptor.
            </p>
            <div className="seal">🎢</div>
          </div>
          {phase === 'ticket' && (
            <>
              <p className="lead ps-line">
                P.S. Anche il cane delle nacchere è invitato, ma non so se farà in tempo ad arrivare.
              </p>
              <div className="row">
                <button className="btn secondary" onClick={onFireConfetti}>
                  Ancora coriandoli 🎉
                </button>
              </div>
            </>
          )}
        </>
      )}
    </ScreenShell>
  );
}
