'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { PIECES } from '../lib/pieces';
import { getBackgroundMusic } from '../lib/backgroundMusic';
import { vibrate, HAPTIC } from '../lib/haptics';

const ITEM_MS = 480;
const CONVERGE_MS = 550;
const DUST_MS = 700;
const DUST_MOTES = 18;

type SubPhase = 'narrating' | 'converging' | 'dust';

/**
 * Recaps the ten collected pieces one at a time, then has them converge into
 * a puff of dust — as if they're being assembled into something — before
 * calling `onDone`. The tenth piece (the "vagone") is awarded, via
 * `onFinalPiece`, at the exact moment it's shown here.
 */
export function PieceAssembly({ onFinalPiece, onDone }: { onFinalPiece: () => void; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [subPhase, setSubPhase] = useState<SubPhase>('narrating');

  useEffect(() => {
    if (subPhase !== 'narrating') return;
    getBackgroundMusic().playTick();
    if (index === PIECES.length - 1) {
      onFinalPiece();
      vibrate(HAPTIC.correct);
    }
    const t = setTimeout(() => {
      if (index < PIECES.length - 1) setIndex((i) => i + 1);
      else setSubPhase('converging');
    }, ITEM_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subPhase, index]);

  useEffect(() => {
    if (subPhase !== 'converging') return;
    const t = setTimeout(() => {
      setSubPhase('dust');
      getBackgroundMusic().playCorrect();
      vibrate(HAPTIC.win);
    }, CONVERGE_MS);
    return () => clearTimeout(t);
  }, [subPhase]);

  useEffect(() => {
    if (subPhase !== 'dust') return;
    const t = setTimeout(onDone, DUST_MS);
    return () => clearTimeout(t);
  }, [subPhase, onDone]);

  return (
    <div className="assembly-anim">
      {subPhase === 'narrating' && (
        <div className="assembly-narrate" key={index}>
          <span className="assembly-narrate-icon">{PIECES[index].icon}</span>
          <span className="assembly-narrate-label">{PIECES[index].label}</span>
        </div>
      )}
      {subPhase !== 'narrating' && (
        <>
          <div className={`assembly-converge${subPhase === 'dust' ? ' dust' : ''}`}>
            {PIECES.map((p, i) => (
              <span key={i} className="assembly-converge-icon" style={{ '--i': i } as CSSProperties}>
                {p.icon}
              </span>
            ))}
          </div>
          {subPhase === 'dust' && (
            <div className="assembly-dust-burst">
              {Array.from({ length: DUST_MOTES }, (_, i) => (
                <span key={i} className="dust-mote" style={{ '--a': `${(i / DUST_MOTES) * 360}deg` } as CSSProperties} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
