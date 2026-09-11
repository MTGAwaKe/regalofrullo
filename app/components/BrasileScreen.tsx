import { ScreenShell } from './ScreenShell';
import { QuizGame } from './QuizGame';

const OPTIONS = [
  { text: 'In cima a una montagna', correct: false },
  { text: 'Sul mare, tra i banchetti dei pescatori', correct: true },
  { text: 'Dentro un centro commerciale', correct: false },
];

export function BrasileScreen({ onSolved }: { onSolved: () => void }) {
  return (
    <ScreenShell
      screenId={6}
      ambientIcons={['🌊', '🐚', '🐟']}
      eyebrow="Gioco 6 · Un luogo speciale"
      title="Dove abbiamo trovato il santuario di Yemanjá?"
      lead="In Brasile, col profumo salmastro di quel giorno ancora vivo nei ricordi."
    >
      <QuizGame
        options={OPTIONS}
        successMsg="Esatto: quel santuario sul mare, col profumo di pesce fresco tutt'intorno."
        onSolved={onSolved}
      />
    </ScreenShell>
  );
}
