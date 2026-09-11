'use client';

import { useState } from 'react';
import { ScreenShell } from './ScreenShell';
import { getBackgroundMusic } from '../lib/backgroundMusic';
import { vibrate, HAPTIC } from '../lib/haptics';

const TARGET = ['🍚', '🥣', '🥬', '🌰', '🍑', ''];
const NAMES: Record<string, string> = {
  '🍚': 'cous cous',
  '🥣': 'ceci',
  '🥬': 'spinacini',
  '🌰': 'pistacchi',
  '🍑': 'albicocche',
};

function neighbors(idx: number): number[] {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  const n: number[] = [];
  if (row > 0) n.push(idx - 3);
  if (row < 1) n.push(idx + 3);
  if (col > 0) n.push(idx - 1);
  if (col < 2) n.push(idx + 1);
  return n;
}

function shuffledSlider(): string[] {
  const state = [...TARGET];
  let empty = state.indexOf('');
  for (let i = 0; i < 60; i++) {
    const opts = neighbors(empty);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    [state[empty], state[pick]] = [state[pick], state[empty]];
    empty = pick;
  }
  return state.join('') === TARGET.join('') ? shuffledSlider() : state;
}

export function SliderPuzzleGame({ onSolved }: { onSolved: () => void }) {
  const [state, setState] = useState<string[]>(shuffledSlider);
  const [solved, setSolved] = useState(false);

  const emptyIdx = state.indexOf('');
  const slidable = new Set(neighbors(emptyIdx));

  function trySlide(idx: number) {
    if (solved || !slidable.has(idx)) return;
    const next = [...state];
    [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
    setState(next);
    if (next.join('') === TARGET.join('')) {
      setSolved(true);
      getBackgroundMusic().playCorrect();
      vibrate(HAPTIC.correct);
      onSolved();
    } else {
      getBackgroundMusic().playTick();
    }
  }

  return (
    <ScreenShell
      sheetIndex={7}
      sheetName="Il tuo piatto del cuore"
      ambientIcons={['🥣', '🌰', '🍑']}
      title="Rimetti in ordine gli ingredienti."
      lead="Fai scorrere le tessere per ricomporre la ricetta che ti fa sempre brillare gli occhi, seguendo l'ordine qui sotto. Le tessere che si illuminano sono quelle che puoi muovere."
    >
      <div className="card">
        <div className="slider-target">
          {TARGET.filter((v) => v !== '').map((icon) => (
            <div key={icon} className="st-item">
              <span>{icon}</span>
              <span className="lbl">{NAMES[icon]}</span>
            </div>
          ))}
        </div>
        <div className="slider-grid-outer">
          {state.map((val, idx) =>
            val === '' ? null : (
              <div
                key={val}
                className={`slider-tile${slidable.has(idx) && !solved ? ' slidable' : ''}`}
                style={{ left: `${(idx % 3) * (100 / 3)}%`, top: `${Math.floor(idx / 3) * (100 / 3)}%` }}
                onClick={() => trySlide(idx)}
              >
                <span>{val}</span>
                <span className="lbl">{NAMES[val]}</span>
              </div>
            )
          )}
        </div>
        <div className="feedback ok">
          {solved ? 'Perfetto: ceci, spinacini, pistacchi e albicocche. Il tuo piatto del cuore.' : ''}
        </div>
      </div>
    </ScreenShell>
  );
}
