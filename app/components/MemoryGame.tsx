'use client';

import { useRef, useState } from 'react';
import { ScreenShell } from './ScreenShell';
import { shuffle } from '../lib/shuffle';

const ICONS = ['💙', '⭐', '🌺', '📚', '☕', '🌙', '🎈', '💌'];

type Card = { id: number; icon: string; flipped: boolean; matched: boolean };

function buildDeck(): Card[] {
  return shuffle([...ICONS, ...ICONS]).map((icon, id) => ({ id, icon, flipped: false, matched: false }));
}

export function MemoryGame({ onSolved }: { onSolved: () => void }) {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const matchedCount = useRef(0);

  function flip(card: Card) {
    if (locked || card.flipped || card.matched || done) return;
    const nextCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    setCards(nextCards);
    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped.map((id) => nextCards.find((c) => c.id === id)!);
      if (a.icon === b.icon) {
        setCards((cs) => cs.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c)));
        setFlippedIds([]);
        setLocked(false);
        matchedCount.current += 1;
        if (matchedCount.current === ICONS.length) {
          setDone(true);
          onSolved();
        }
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)));
          setFlippedIds([]);
          setLocked(false);
        }, 700);
      }
    }
  }

  return (
    <ScreenShell
      screenId={4}
      ambientIcons={['💙', '🌟', '🌙']}
      eyebrow="Gioco 4 · Piccola e imperfetta, ma buona"
      title="Trova tutte le coppie."
      lead="Come un certo alieno blu che conosci bene: si va avanti tutti insieme, nessuno si perde e nessuno resta indietro."
    >
      <div className="card">
        <div className="mem-grid">
          {cards.map((c, i) => (
            <div
              key={c.id}
              className={`card-mem${c.flipped ? ' flipped' : ''}${c.matched ? ' matched' : ''}`}
              style={{ animationDelay: `${i * 35}ms` }}
              onClick={() => flip(c)}
            >
              <div className="card-mem-inner">
                <span className="back">?</span>
                <span className="face">{c.icon}</span>
              </div>
            </div>
          ))}
        </div>
        {moves > 0 && !done && <div className="mem-moves">Mosse: {moves}</div>}
        <div className="feedback ok">
          {done
            ? `Tutte le coppie trovate in ${moves} mosse. Sono davvero orgoglioso di te: studi e lavori con una grinta pazzesca, ogni giorno.`
            : ''}
        </div>
      </div>
    </ScreenShell>
  );
}
