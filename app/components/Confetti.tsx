'use client';

import { useCallback, useState } from 'react';

type Particle = { id: number; left: number; color: string; duration: number; delay: number; rotate: number };

const COLORS = ['#F2B705', '#FF4FA3', '#3FE0D0', '#FFF8ED'];
let seq = 0;

/** Confetti burst state, shared between the trigger button and the layer that renders it. */
export function useConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const fire = useCallback((count = 70) => {
    const batch: Particle[] = Array.from({ length: count }, () => ({
      id: seq++,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 2.2 + Math.random() * 1.8,
      delay: Math.random() * 0.5,
      rotate: Math.random() * 360,
    }));
    setParticles((prev) => [...prev, ...batch]);
    const ids = new Set(batch.map((b) => b.id));
    setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), 4600);
  }, []);

  return { particles, fire };
}

export function ConfettiLayer({ particles }: { particles: Particle[] }) {
  return (
    <div className="confetti">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
