import { ScreenShell } from './ScreenShell';
import { QuizGame } from './QuizGame';

const OPTIONS = [
  { text: '"Aculatado"', correct: true },
  { text: '"De culo"', correct: false },
  { text: '"Deculato"', correct: false },
  { text: '"Culatado"', correct: false },
];

export function ArgentinaScreen({ onSolved }: { onSolved: () => void }) {
  return (
    <ScreenShell
      sheetIndex={5}
      sheetName="Regole locali"
      ambientIcons={['🚗', '🅿️', '➡️']}
      title="Come si parcheggiava in Argentina?"
      lead="Una regola tutta loro, che ancora oggi ci fa ridere."
    >
      <QuizGame
        options={OPTIONS}
        successMsg='Esatto: sempre e solo "aculatado". Ancora oggi ce lo ricordiamo.'
        onSolved={onSolved}
      />
    </ScreenShell>
  );
}
