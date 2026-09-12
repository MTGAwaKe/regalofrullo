import { ScreenShell } from './ScreenShell';
import { SentenceOrderGame } from './SentenceOrderGame';

const WORDS = ['Ti', 'amo', 'un', 'sacchissimo,', 'come', 'tu', 'ami', "l'Irlanda"];

export function IrlandaScreen({ onSolved }: { onSolved: () => void }) {
  return (
    <ScreenShell
      sheetIndex={9}
      sheetName="L'ultimo indizio"
      ambientIcons={['🍀', '🌈']}
      title="Un ultimo indovinello, poi il regalo."
      lead="Il tuo posto del cuore, quello dove l'erba è sempre verde. Rimetti in ordine le parole."
    >
      <SentenceOrderGame words={WORDS} successMsg="Sempre verde. Ultimo indizio raccolto." onSolved={onSolved} />
    </ScreenShell>
  );
}
