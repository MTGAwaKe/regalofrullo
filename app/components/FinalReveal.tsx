import { ScreenShell } from './ScreenShell';

const TRACK_PATH =
  'M20,160 Q55,75 100,95 Q130,108 150,90 Q170,70 195,90 Q215,108 240,95 Q260,85 275,65 Q295,45 320,80 Q335,105 360,110';

export function FinalReveal({
  assemblyRevealed,
  ticketRevealed,
  onFireConfetti,
}: {
  assemblyRevealed: boolean;
  ticketRevealed: boolean;
  onFireConfetti: () => void;
}) {
  return (
    <ScreenShell
      sheetIndex={10}
      sheetName="Montaggio finale"
      ambientIcons={['🎉', '✨']}
      title="Aspetta un attimo..."
      lead="Bullone, cacciavite, catena, ingranaggio, leva, gradino, trave, binario, sedile... tutti insieme, questi pezzi formano qualcosa."
    >
      <div className={`assembly-stage${assemblyRevealed ? ' revealed' : ''}`}>
        <svg className="coaster-svg" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1="160" x2="390" y2="160" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
          <rect x="50" y="80" width="10" height="80" rx="2" fill="#1E2559" stroke="#F2B705" strokeWidth="1.5" />
          <rect x="270" y="60" width="10" height="100" rx="2" fill="#1E2559" stroke="#3FE0D0" strokeWidth="1.5" />
          <path id="coasterTrack" d={TRACK_PATH} stroke="#F2B705" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="150" cy="90" r="26" stroke="#FF4FA3" strokeWidth="3" fill="none" />
          <g>
            <rect x="130" y="60" width="26" height="14" rx="5" fill="#F7D258" />
            <circle cx="137" cy="57" r="3.5" fill="#FFF8ED" />
            <circle cx="149" cy="57" r="3.5" fill="#FFF8ED" />
          </g>
          <rect x="300" y="24" width="86" height="26" rx="6" fill="#1E2559" stroke="#F2B705" strokeWidth="1.5" />
          <text x="343" y="42" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="14" fill="#F7D258">
            RAPTOR
          </text>
          <text x="308" y="20" fontSize="14" fill="#FF4FA3">✦</text>
          <text x="382" y="60" fontSize="12" fill="#3FE0D0">✦</text>
          {assemblyRevealed && (
            <circle r="4" fill="#FFF8ED">
              <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto">
                <mpath href="#coasterTrack" />
              </animateMotion>
            </circle>
          )}
        </svg>
      </div>

      <div className={`ticket${ticketRevealed ? ' revealed' : ''}`}>
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
      <p className="lead ps-line">P.S. Anche il cane delle nacchere è invitato, ma non so se farà in tempo ad arrivare.</p>
      <div className="row">
        <button className="btn secondary" onClick={onFireConfetti}>
          Ancora coriandoli 🎉
        </button>
      </div>
    </ScreenShell>
  );
}
