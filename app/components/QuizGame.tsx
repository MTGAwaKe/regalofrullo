'use client';

import { useState } from 'react';

type Option = { text: string; correct: boolean };

export function QuizGame({
  options,
  successMsg,
  onSolved,
}: {
  options: Option[];
  successMsg: string;
  onSolved: () => void;
}) {
  const [answeredIdx, setAnsweredIdx] = useState<number | null>(null);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  function pick(i: number) {
    if (solved) return;
    if (options[i].correct) {
      setAnsweredIdx(i);
      setSolved(true);
      onSolved();
    } else {
      setWrongIdx(i);
      setTimeout(() => setWrongIdx((w) => (w === i ? null : w)), 500);
    }
  }

  return (
    <div className="card">
      <div className="quiz-options">
        {options.map((opt, i) => {
          const isCorrectPick = solved && i === answeredIdx;
          const isWrongPick = wrongIdx === i;
          return (
            <button
              key={opt.text}
              className={`opt${isCorrectPick ? ' correct' : ''}${isWrongPick ? ' wrong' : ''}`}
              disabled={solved}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => pick(i)}
            >
              <span className="opt-mark">{isCorrectPick ? '✓' : isWrongPick ? '✕' : ''}</span>
              {opt.text}
            </button>
          );
        })}
      </div>
      <div className={`feedback ${solved ? 'ok' : wrongIdx !== null ? 'err' : ''}`}>
        {solved ? successMsg : wrongIdx !== null ? 'Non proprio... pensaci ancora.' : ''}
      </div>
    </div>
  );
}
