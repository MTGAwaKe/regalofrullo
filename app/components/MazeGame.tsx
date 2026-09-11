'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScreenShell } from './ScreenShell';
import { LAYOUT, ROWS, COLS, START, GOAL, DIR_VECTORS, posKey, type Dir } from '../lib/mazeLayout';

const SWIPE_THRESHOLD = 24;

export function MazeGame({ onSolved }: { onSolved: () => void }) {
  const [pos, setPos] = useState(START);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([posKey(START.r, START.c)]));
  const [won, setWon] = useState(false);
  const [bump, setBump] = useState(false);

  // Read via refs inside the stable `move` callback so the keyboard listener
  // doesn't need to be re-subscribed on every step.
  const stateRef = useRef({ pos, won });
  useEffect(() => {
    stateRef.current = { pos, won };
  }, [pos, won]);

  const move = useCallback(
    (dir: Dir) => {
      const { pos, won } = stateRef.current;
      if (won) return;
      const [dr, dc] = DIR_VECTORS[dir];
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      const blocked = nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS || LAYOUT[nr][nc] !== 1;
      if (blocked) {
        setBump(true);
        return;
      }
      setPos({ r: nr, c: nc });
      setVisited((v) => {
        const next = new Set(v);
        next.add(posKey(nr, nc));
        return next;
      });
      if (nr === GOAL.r && nc === GOAL.c) {
        setWon(true);
        setTimeout(onSolved, 500);
      }
    },
    [onSolved]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const dir: Dir | undefined = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[
        e.key
      ] as Dir | undefined;
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: React.PointerEvent) {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  }

  return (
    <ScreenShell
      sheetIndex={1}
      sheetName="Il labirinto"
      ambientIcons={['🧱', '➰', '🔩']}
      title="Guidami fino al 33."
      lead="Trascina, usa le frecce o tocca i pulsanti per muoverti ed uscire dal labirinto: da qualche parte lì in fondo ti aspetta un numero importante."
    >
      <div className="card">
        <div className="maze-legend">
          <span>
            <i className="i-open" /> percorso libero
          </span>
          <span>
            <i className="i-wall" /> muro
          </span>
        </div>
        <div className="maze-wrap">
          <div
            className="maze-grid-outer"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={{ maxWidth: COLS * 42 }}
          >
            <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(28px, 42px))` }}>
              {LAYOUT.map((row, r) =>
                row.map((cellValue, c) => {
                  const isOpenCell = cellValue === 1;
                  const isGoal = isOpenCell && r === GOAL.r && c === GOAL.c;
                  const isVisited = isOpenCell && visited.has(posKey(r, c));
                  const classes = [
                    'maze-cell',
                    isOpenCell ? 'open' : 'wall',
                    isGoal ? 'goal' : '',
                    isVisited && !isGoal ? 'visited' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return (
                    <div key={posKey(r, c)} className={classes}>
                      {isGoal ? '33' : ''}
                    </div>
                  );
                })
              )}
            </div>
            <div
              className={`maze-player${bump ? ' bump' : ''}${won ? ' won' : ''}`}
              style={{
                left: `${(pos.c / COLS) * 100}%`,
                top: `${(pos.r / ROWS) * 100}%`,
                width: `${100 / COLS}%`,
                height: `${100 / ROWS}%`,
              }}
              onAnimationEnd={() => setBump(false)}
            >
              <span className="maze-player-dot" />
            </div>
          </div>
          <div className="maze-controls">
            <button className="mc-up" aria-label="Su" onClick={() => move('up')}>
              ↑
            </button>
            <button className="mc-left" aria-label="Sinistra" onClick={() => move('left')}>
              ←
            </button>
            <button className="mc-down" aria-label="Giù" onClick={() => move('down')}>
              ↓
            </button>
            <button className="mc-right" aria-label="Destra" onClick={() => move('right')}>
              →
            </button>
          </div>
        </div>
        <div className="feedback ok">{won ? "Ce l'hai fatta: 33, un anno bellissimo tutto da vivere." : ''}</div>
      </div>
    </ScreenShell>
  );
}
