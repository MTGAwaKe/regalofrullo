export const LAYOUT = [
  [1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1],
];
export const ROWS = LAYOUT.length;
export const COLS = LAYOUT[0].length;
export const START = { r: 0, c: 0 };
export const GOAL = { r: 6, c: 6 };

export type Pos = { r: number; c: number };
export type Dir = 'up' | 'down' | 'left' | 'right';

export const DIR_VECTORS: Record<Dir, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export function posKey(r: number, c: number) {
  return `${r},${c}`;
}
