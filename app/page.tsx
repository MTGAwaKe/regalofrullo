'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StarField } from './components/StarField';
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
const PROGRESS_KEY = 'regalofrullo:progress';

type Progress = { screen: number; inventory: (string | null)[] };

function loadProgress(): Progress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.screen === 'number' &&
      parsed.screen >= 0 &&
      parsed.screen <= 10 &&
      Array.isArray(parsed.inventory) &&
      parsed.inventory.length === TOTAL_PIECES
    ) {
      return parsed;
    }
  } catch {
    // ignore corrupt/unavailable storage
  }
  return null;
}

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [displayScreen, setDisplayScreen] = useState(0);
  const [transitionState, setTransitionState] = useState<'enter' | 'exit'>('enter');
  const [inventory, setInventory] = useState<(string | null)[]>(Array(TOTAL_PIECES).fill(null));
  const [toast, setToast] = useState<ToastState>(null);
  const [assemblyRevealed, setAssemblyRevealed] = useState(false);
  const [ticketRevealed, setTicketRevealed] = useState(false);
  const { particles, fire } = useConfetti();
  const music = useBackgroundMusic();

  // Guards the save effect below until the restore effect has had its one
  // chance to run — otherwise that effect's very first pass (still holding
  // the default screen=0/empty-inventory closure) can write over a just
  // -restored session before the restored state has flushed.
  const [hydrated, setHydrated] = useState(false);

  // Resume a previous session, if any, once we're safely on the client.
  // (Reading localStorage during the render itself would make the static
  // prerendered HTML and the client's first render disagree.)
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScreen(saved.screen);
      setDisplayScreen(saved.screen);
      setInventory(saved.inventory);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ screen, inventory }));
    } catch {
      // ignore (private browsing / storage disabled)
    }
  }, [hydrated, screen, inventory]);

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

  // Final reveal: the last piece (the "vagone") arrives on its own, followed
  // by the coaster assembly and the ticket, each with its own little pause.
  useEffect(() => {
    if (displayScreen !== 10) return;
    const t1 = setTimeout(() => collectPiece(TOTAL_PIECES - 1), 400);
    const t2 = setTimeout(() => setAssemblyRevealed(true), 1400);
    const t3 = setTimeout(() => {
      setTicketRevealed(true);
      fireConfetti();
    }, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayScreen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [displayScreen]);

  return (
    <>
      <StarField />
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
            <FinalReveal assemblyRevealed={assemblyRevealed} ticketRevealed={ticketRevealed} onFireConfetti={fireConfetti} />
          )}
        </div>
      </div>

      <footer className="note">fatto con 💛 per la signora — apri, gioca, e non barare guardando il codice sorgente.</footer>

      <ConfettiLayer particles={particles} />
      <RewardToast toast={toast} />
    </>
  );
}
