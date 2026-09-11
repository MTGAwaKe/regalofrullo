'use client';

import { useState } from 'react';
import { shuffle } from '../lib/shuffle';

type WordItem = { word: string; idx: number };

function buildBank(words: string[]): WordItem[] {
  return shuffle(words.map((word, idx) => ({ word, idx })));
}

/** Reusable "tap the words in the right order" puzzle, used by two screens. */
export function SentenceOrderGame({
  words,
  successMsg,
  onSolved,
}: {
  words: string[];
  successMsg: string;
  onSolved: () => void;
}) {
  const [bank, setBank] = useState<WordItem[]>(() => buildBank(words));
  const [placed, setPlaced] = useState<WordItem[]>([]);
  const [status, setStatus] = useState<'playing' | 'wrong' | 'correct'>('playing');

  function reset() {
    setBank(buildBank(words));
    setPlaced([]);
    setStatus('playing');
  }

  const usedIdx = new Set(placed.map((p) => p.idx));

  function place(item: WordItem) {
    if (status !== 'playing' || usedIdx.has(item.idx)) return;
    const nextPlaced = [...placed, item];
    setPlaced(nextPlaced);

    if (nextPlaced.length === words.length) {
      const correct = nextPlaced.every((p, i) => p.idx === i);
      if (correct) {
        setStatus('correct');
        onSolved();
      } else {
        setStatus('wrong');
        setTimeout(reset, 800);
      }
    }
  }

  function unplace(index: number) {
    if (status !== 'playing') return;
    setPlaced((p) => p.filter((_, i) => i !== index));
  }

  return (
    <div className="card">
      <div className={`sentence-build${status === 'wrong' ? ' shake' : ''}`}>
        {Array.from({ length: words.length }, (_, i) => {
          const item = placed[i];
          return item ? (
            <div key={item.idx} className="word-chip placed" onClick={() => unplace(i)}>
              {item.word}
            </div>
          ) : (
            <span key={`slot-${i}`} className="word-slot" />
          );
        })}
      </div>
      <div className="word-bank">
        {bank.map((item) => (
          <div
            key={item.idx}
            className={`word-chip${usedIdx.has(item.idx) ? ' used' : ''}`}
            onClick={() => place(item)}
          >
            {item.word}
          </div>
        ))}
      </div>
      <div className="row">
        <button className="btn secondary small" onClick={reset}>
          Ricomincia
        </button>
      </div>
      <div className={`feedback ${status === 'correct' ? 'ok' : status === 'wrong' ? 'err' : ''}`}>
        {status === 'correct' ? successMsg : status === 'wrong' ? "L'ordine non è giusto, riprova!" : ''}
      </div>
    </div>
  );
}
