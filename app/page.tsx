'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StarField } from './components/StarField';
import { Inventory } from './components/Inventory';
import { RewardToast, type ToastState } from './components/RewardToast';
import { ConfettiLayer, useConfetti } from './components/Confetti';
import { IntroScreen } from './components/IntroScreen';
import { MazeGame } from './components/MazeGame';
import { HiddenObjectGame } from './components/HiddenObjectGame';
import { GrottaScreen } from './components/GrottaScreen';
import { MemoryGame } from './components/MemoryGame';
import { ArgentinaScreen } from './components/ArgentinaScreen';
import { BrasileScreen } from './components/BrasileScreen';
import { SliderPuzzleGame } from './components/SliderPuzzleGame';
import { AudiScreen } from './components/AudiScreen';
import { IrlandaScreen } from './components/IrlandaScreen';
import { FinalReveal } from './components/FinalReveal';
import { PIECES, TOTAL_PIECES } from './lib/pieces';

const NAV_DELAY_MS = 1300;

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [inventory, setInventory] = useState<(string | null)[]>(Array(TOTAL_PIECES).fill(null));
  const [toast, setToast] = useState<ToastState>(null);
  const [assemblyRevealed, setAssemblyRevealed] = useState(false);
  const [ticketRevealed, setTicketRevealed] = useState(false);
  const { particles, fire } = useConfetti();

  const toastHideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const showReward = useCallback((message: string) => {
    setToast({ message, visible: true });
    clearTimeout(toastHideTimer.current);
    toastHideTimer.current = setTimeout(() => setToast((t) => (t ? { ...t, visible: false } : t)), 1700);
  }, []);

  const collectPiece = useCallback(
    (index: number) => {
      const piece = PIECES[index];
      setInventory((inv) => {
        const next = [...inv];
        next[index] = piece.icon;
        return next;
      });
      showReward(`Hai raccolto: ${piece.label}.`);
    },
    [showReward]
  );

  // A game on screen N always awards piece N-1 and advances to screen N+1.
  const handleSolved = useCallback(
    (screenNumber: number) => {
      collectPiece(screenNumber - 1);
      setTimeout(() => setScreen(screenNumber + 1), NAV_DELAY_MS);
    },
    [collectPiece]
  );

  // Final reveal: the last piece (the "vagone") arrives on its own, followed
  // by the coaster assembly and the ticket, each with its own little pause.
  useEffect(() => {
    if (screen !== 10) return;
    const t1 = setTimeout(() => collectPiece(TOTAL_PIECES - 1), 400);
    const t2 = setTimeout(() => setAssemblyRevealed(true), 1400);
    const t3 = setTimeout(() => {
      setTicketRevealed(true);
      fire();
    }, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  return (
    <>
      <StarField />
      <Inventory pieces={inventory} />

      <div className="stage">
        {screen === 0 && <IntroScreen onStart={() => setScreen(1)} />}
        {screen === 1 && <MazeGame onSolved={() => handleSolved(1)} />}
        {screen === 2 && <HiddenObjectGame onSolved={() => handleSolved(2)} />}
        {screen === 3 && <GrottaScreen onSolved={() => handleSolved(3)} />}
        {screen === 4 && <MemoryGame onSolved={() => handleSolved(4)} />}
        {screen === 5 && <ArgentinaScreen onSolved={() => handleSolved(5)} />}
        {screen === 6 && <BrasileScreen onSolved={() => handleSolved(6)} />}
        {screen === 7 && <SliderPuzzleGame onSolved={() => handleSolved(7)} />}
        {screen === 8 && <AudiScreen onSolved={() => handleSolved(8)} />}
        {screen === 9 && <IrlandaScreen onSolved={() => handleSolved(9)} />}
        {screen === 10 && (
          <FinalReveal assemblyRevealed={assemblyRevealed} ticketRevealed={ticketRevealed} onFireConfetti={() => fire()} />
        )}
      </div>

      <footer className="note">fatto con 💛 per la signora — apri, gioca, e non barare guardando il codice sorgente.</footer>

      <ConfettiLayer particles={particles} />
      <RewardToast toast={toast} />
    </>
  );
}
