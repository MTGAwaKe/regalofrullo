import { ScreenShell } from './ScreenShell';
import { SentenceOrderGame } from './SentenceOrderGame';

const WORDS = ['Ti', 'amo', 'da', 'matti,', 'come', "l'erba", "d'Irlanda:", 'sempre', 'verde.'];

export function IrlandaScreen({ onSolved }: { onSolved: () => void }) {
  return (
    <ScreenShell
      screenId={9}
      ambientIcons={['🍀', '🌈']}
      eyebrow="Gioco 9 · L'ultimo indizio"
      title="Un ultimo indovinello, poi il regalo."
      lead="Il tuo posto del cuore, quello dove l'erba è sempre verde. Rimetti in ordine le parole."
    >
      <SentenceOrderGame words={WORDS} successMsg="Sempre. Ultimo indizio raccolto." onSolved={onSolved} />
    </ScreenShell>
  );
}
