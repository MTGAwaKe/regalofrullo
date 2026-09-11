import { ScreenShell } from './ScreenShell';
import { QuizGame } from './QuizGame';

const OPTIONS = [
  { text: 'La simpatia', correct: false },
  { text: 'La sincerità', correct: false },
  { text: "L'Audi", correct: true },
];

export function AudiScreen({ onSolved }: { onSolved: () => void }) {
  return (
    <ScreenShell
      sheetIndex={8}
      sheetName="La scintilla"
      ambientIcons={['✨', '🚗', '⚡']}
      title="Cosa ha fatto scattare la scintilla tra noi?"
      lead="Non è la risposta che ti aspetti."
    >
      <QuizGame
        options={OPTIONS}
        successMsg="Esatto. Non è la risposta più romantica del mondo, ma è quella vera."
        onSolved={onSolved}
      />
    </ScreenShell>
  );
}
