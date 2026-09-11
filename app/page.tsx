'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Inventory } from './components/Inventory';
import { RewardToast, type ToastState } from './components/RewardToast';
import { ConfettiLayer, useConfetti } from './components/Confetti';
import { AudioControl } from './components/AudioControl';
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
import { useBackgroundMusic } from './lib/useBackgroundMusic';

const NAV_DELAY_MS = 1300;
const TRANSITION_MS = 220;

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [displayScreen, setDisplayScreen] = useState(0);
  const [transitionState, setTransitionState] = useState<'enter' | 'exit'>('enter');
  const [inventory, setInventory] = useState<(string | null)[]>(Array(TOTAL_PIECES).fill(null));
  const [toast, setToast] = useState<ToastState>(null);
  const { particles, fire } = useConfetti();
  const music = useBackgroundMusic();

  // One-time cleanup: earlier versions saved progress to localStorage so a
  // refresh could resume where you left off. That's gone now — every visit
  // starts fresh — so remove any leftover data from before this change.
  useEffect(() => {
    try {
      window.localStorage.removeItem('regalofrullo:progress');
    } catch {
      // ignore (private browsing / storage disabled)
    }
  }, []);

  // Cross-fade between screens: fade the outgoing one out, then swap. This is
  // a small local animation state machine synchronized to `screen` changing,
  // not something derivable without an effect.
  useEffect(() => {
    if (screen === displayScreen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransitionState('exit');
    const t = setTimeout(() => {
      setDisplayScreen(screen);
      setTransitionState('enter');
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [screen, displayScreen]);

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

  const fireConfetti = useCallback(() => {
    fire();
    music.flourish();
  }, [fire, music]);

  // The last piece (the "vagone") is awarded as the finale of FinalReveal's
  // own piece-by-piece recap animation, not on a fixed page-level timer.
  const collectFinalPiece = useCallback(() => collectPiece(TOTAL_PIECES - 1), [collectPiece]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [displayScreen]);

  return (
    <>
      <Inventory pieces={inventory}>
        <AudioControl
          muted={music.muted}
          volume={music.volume}
          onToggleMute={music.toggleMute}
          onVolumeChange={music.setVolume}
        />
      </Inventory>

      <div className="stage">
        <div className={`stage-content ${transitionState}`} key={displayScreen}>
          {displayScreen === 0 && <IntroScreen onStart={() => setScreen(1)} />}
          {displayScreen === 1 && <MazeGame onSolved={() => handleSolved(1)} />}
          {displayScreen === 2 && <HiddenObjectGame onSolved={() => handleSolved(2)} />}
          {displayScreen === 3 && <GrottaScreen onSolved={() => handleSolved(3)} />}
          {displayScreen === 4 && <MemoryGame onSolved={() => handleSolved(4)} />}
          {displayScreen === 5 && <ArgentinaScreen onSolved={() => handleSolved(5)} />}
          {displayScreen === 6 && <BrasileScreen onSolved={() => handleSolved(6)} />}
          {displayScreen === 7 && <SliderPuzzleGame onSolved={() => handleSolved(7)} />}
          {displayScreen === 8 && <AudiScreen onSolved={() => handleSolved(8)} />}
          {displayScreen === 9 && <IrlandaScreen onSolved={() => handleSolved(9)} />}
          {displayScreen === 10 && (
            <FinalReveal onCollectFinalPiece={collectFinalPiece} onFireConfetti={fireConfetti} />
          )}
        </div>
      </div>

      <footer className="note">fatto con 💛 per la signora — apri, gioca, e non barare guardando il codice sorgente.</footer>

      <ConfettiLayer particles={particles} />
      <RewardToast toast={toast} />
    </>
  );
}
