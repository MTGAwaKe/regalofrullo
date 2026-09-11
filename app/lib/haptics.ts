/**
 * Thin wrapper around the Vibration API. Android Chrome supports it; iOS
 * Safari doesn't implement it at all, so this silently does nothing there —
 * no feature check needed by callers.
 */
export function vibrate(pattern: number | readonly number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const mutable: number | number[] = typeof pattern === 'number' ? pattern : pattern.slice();
      navigator.vibrate(mutable);
    } catch {
      // ignore — never let a haptic nice-to-have break a game action
    }
  }
}

export const HAPTIC = {
  bump: 30,
  wrong: 40,
  correct: [30, 40, 60],
  win: [40, 40, 90],
} as const;
