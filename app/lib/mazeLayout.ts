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

// Turning left/right from each of the 4 compass-like directions.
export const LEFT_OF: Record<Dir, Dir> = { up: 'left', left: 'down', down: 'right', right: 'up' };
export const RIGHT_OF: Record<Dir, Dir> = { up: 'right', right: 'down', down: 'left', left: 'up' };

export function posKey(r: number, c: number) {
  return `${r},${c}`;
}

export function isOpen(r: number, c: number): boolean {
  return r >= 0 && c >= 0 && r < ROWS && c < COLS && LAYOUT[r][c] === 1;
}

function step(pos: Pos, dir: Dir, count: number): Pos {
  const [dr, dc] = DIR_VECTORS[dir];
  return { r: pos.r + dr * count, c: pos.c + dc * count };
}

export const MAX_VIEW_DEPTH = 4;

export type FirstPersonView = {
  /** How many consecutive open cells are visible straight ahead (capped at MAX_VIEW_DEPTH). */
  openCount: number;
  /** Whether the wall closing the corridor (if any, within render distance) is a real dead end. */
  hasEndWall: boolean;
  /** Per visible segment (index 0 = nearest), whether there's a wall on that side. */
  leftWalls: boolean[];
  rightWalls: boolean[];
  /** Depth index (0-based) at which the goal cell is visible, or null if not in view. */
  goalDepth: number | null;
};

export function computeFirstPersonView(pos: Pos, facing: Dir): FirstPersonView {
  const left = LEFT_OF[facing];
  const right = RIGHT_OF[facing];
  const leftWalls: boolean[] = [];
  const rightWalls: boolean[] = [];
  let goalDepth: number | null = null;
  let openCount = 0;
  let hasEndWall = false;

  for (let d = 0; d < MAX_VIEW_DEPTH; d++) {
    const cell = step(pos, facing, d + 1);
    if (!isOpen(cell.r, cell.c)) {
      hasEndWall = true;
      break;
    }
    if (cell.r === GOAL.r && cell.c === GOAL.c) goalDepth = d;
    const leftCell = step(cell, left, 1);
    const rightCell = step(cell, right, 1);
    leftWalls.push(!isOpen(leftCell.r, leftCell.c));
    rightWalls.push(!isOpen(rightCell.r, rightCell.c));
    openCount++;
  }

  return { openCount, hasEndWall, leftWalls, rightWalls, goalDepth };
}
