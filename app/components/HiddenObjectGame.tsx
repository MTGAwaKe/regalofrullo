'use client';

import { useEffect, useState } from 'react';
import { ScreenShell } from './ScreenShell';
import { shuffle } from '../lib/shuffle';
import { getBackgroundMusic } from '../lib/backgroundMusic';
import { vibrate, HAPTIC } from '../lib/haptics';

const TARGETS = ['☀️', '🌊', '🫒', '🐚'];
const DECOYS = [
  '🌟', '🍋', '🦋', '🍃', '🍇', '🌸', '🪨', '🍊', '🌴', '🦀',
  '🕊️', '🌼', '🧭', '🍯', '🐌', '🍉', '🌾', '🐝', '🍄', '🌙',
];
const TOTAL_CELLS = 24;
const MAX_MISTAKES = 4;
const MEMORIZE_SECONDS = 3;

type Phase = 'memorize' | 'play' | 'done';

function makeBoard(): string[] {
  const pool = shuffle([...DECOYS]).slice(0, TOTAL_CELLS - TARGETS.length);
  return shuffle([...TARGETS, ...pool]);
}

// This screen only ever mounts client-side (after the player reaches it), so
// seeding state randomly at mount via a lazy initializer is safe — there's no
// server-rendered version of it to hydrate against.
export function HiddenObjectGame({ onSolved }: { onSolved: () => void }) {
  const [board, setBoard] = useState<string[]>(makeBoard);
  const [phase, setPhase] = useState<Phase>('memorize');
  const [countdown, setCountdown] = useState(MEMORIZE_SECONDS);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Record<number, 'target' | 'decoy'>>({});
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);

  function reset() {
    setBoard(makeBoard());
    setPhase('memorize');
    setCountdown(MEMORIZE_SECONDS);
    setFound(new Set());
    setRevealed({});
    setMistakes(0);
    setMessage(null);
  }

  // Self-scheduling countdown: the phase flip happens inside the timer
  // callback (not synchronously in the effect body) once it reaches zero.
  useEffect(() => {
    if (phase !== 'memorize') return;
    const t = setTimeout(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setPhase('play');
          return 0;
        }
        return c - 1;
      });
    }, 900);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  function reveal(idx: number) {
    if (phase !== 'play' || revealed[idx]) return;
    const icon = board[idx];
    const isTarget = TARGETS.includes(icon);

    if (isTarget) {
      setRevealed((r) => ({ ...r, [idx]: 'target' }));
      const nextFound = new Set(found).add(icon);
      setFound(nextFound);
      if (nextFound.size === TARGETS.length) {
        setPhase('done');
        setMessage({ text: 'Trovati tutti: sole, mare, ulivi e conchiglie. La Puglia dei tuoi 33 anni.', kind: 'ok' });
        getBackgroundMusic().playCorrect();
        vibrate(HAPTIC.correct);
        onSolved();
      } else {
        getBackgroundMusic().playTick();
      }
    } else {
      setRevealed((r) => ({ ...r, [idx]: 'decoy' }));
      setShakeIdx(idx);
      getBackgroundMusic().playWrong();
      vibrate(HAPTIC.wrong);
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      if (nextMistakes >= MAX_MISTAKES) {
        setMessage({ text: 'Troppi tentativi a vuoto: rimescolo tutto, riprova a memorizzare!', kind: 'err' });
        setTimeout(reset, 1200);
      } else {
        setMessage({ text: 'Non era quello... ricontrolla la memoria.', kind: 'err' });
        setTimeout(() => {
          setRevealed((r) => {
            const next = { ...r };
            delete next[idx];
            return next;
          });
        }, 650);
      }
    }
  }

  const remaining = Math.max(MAX_MISTAKES - mistakes, 0);
  const countdownPct = phase === 'memorize' ? (countdown / MEMORIZE_SECONDS) * 100 : 0;

  return (
    <ScreenShell
      sheetIndex={2}
      sheetName="Caccia agli indizi"
      ambientIcons={['☀️', '🌊', '🫒', '🐚']}
      title="Trova i 4 simboli di quella terra assolata."
      lead="Guarda bene la griglia: i 4 simboli giusti si illuminano per un attimo. Poi si nascondono tutti — sta a te ricordare dove sono."
    >
      <div className="card">
        <div className="seek-bar">
          {TARGETS.map((icon) => (
            <div key={icon} className={`seek-target${found.has(icon) ? ' found' : ''}`}>
              {icon}
            </div>
          ))}
        </div>

        {phase === 'memorize' ? (
          <>
            <div className="seek-status">Memorizza dove sono... {countdown}</div>
            <div className="seek-timer-track">
              <div className="seek-timer-fill" style={{ width: `${countdownPct}%` }} />
            </div>
          </>
        ) : (
          <div className="seek-status">{phase === 'play' ? 'Ora tocca a te: trova i 4 simboli!' : ''}</div>
        )}

        <div className="seek-lives">
          {Array.from({ length: MAX_MISTAKES }, (_, i) => (
            <span key={i} className={`life${i < remaining ? '' : ' used'}`}>
              🔩
            </span>
          ))}
        </div>

        <div className="seek-grid">
          {board.map((icon, idx) => {
            const state = revealed[idx];
            const memorizePreview = phase === 'memorize' && TARGETS.includes(icon);
            const classes = [
              'seek-cell',
              phase === 'memorize' ? 'memorize' : '',
              memorizePreview ? 'is-target-preview' : '',
              state === 'target' ? 'revealed is-target' : '',
              state === 'decoy' ? 'revealed is-decoy' : '',
              shakeIdx === idx ? 'shake' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <div
                key={idx}
                className={classes}
                onClick={() => reveal(idx)}
                onAnimationEnd={() => setShakeIdx((s) => (s === idx ? null : s))}
              >
                {phase === 'memorize' ? icon : state ? icon : '❔'}
              </div>
            );
          })}
        </div>

        <div className={`feedback ${message?.kind ?? ''}`}>{message?.text ?? ''}</div>
      </div>
    </ScreenShell>
  );
}
