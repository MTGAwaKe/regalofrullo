'use client';

import { useEffect, useState } from 'react';

type Star = { left: number; top: number; delay: number };

/**
 * Fixed, faint twinkling starfield behind the whole page.
 *
 * Unlike the game screens (which only ever mount client-side once the player
 * reaches them), this is part of the very first paint, so it's also part of
 * the statically prerendered HTML. Seeding random positions during that
 * render would embed one random layout in the static markup and produce a
 * different one on the client, causing a hydration mismatch — so positions
 * are only generated after mount, once we're safely client-only.
 */
export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Intentional: seed random star positions once, client-side only, after
    // the (deterministic) server-rendered pass has already committed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(
      Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="stars">
      {stars.map((s, i) => (
        <span key={i} style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
}
