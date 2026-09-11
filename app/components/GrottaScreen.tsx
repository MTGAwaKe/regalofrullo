import { ScreenShell } from './ScreenShell';
import { SentenceOrderGame } from './SentenceOrderGame';

const WORDS = ['La', 'visita', 'della', 'Grotta', 'del', 'Soffio,', 'mai', 'fatta.'];

export function GrottaScreen({ onSolved }: { onSolved: () => void }) {
  return (
    <ScreenShell
      screenId={3}
      ambientIcons={['🪨', '💧', '🕳️']}
      eyebrow="Gioco 3 · Un rimpianto (piccolo)"
      title="Rimetti in ordine le parole."
      lead="C'è una cosa che ci ha fatto rosicare parecchio durante quel viaggio in Puglia. Tocca le parole nell'ordine giusto per scoprire cosa — e tocca una parola già messa per rimetterla via."
    >
      <SentenceOrderGame
        words={WORDS}
        successMsg="Esatto. Quella grotta ce la siamo persa... per questa volta."
        onSolved={onSolved}
      />
    </ScreenShell>
  );
}
