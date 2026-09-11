export type Piece = { icon: string; label: string };

/**
 * The 10 pieces collected across the journey. Index 0-8 are earned by
 * screens 1-9 (one game each); index 9 (the "vagone") is awarded
 * automatically during the final reveal sequence.
 */
export const PIECES: Piece[] = [
  { icon: '🔩', label: 'un bullone' },
  { icon: '🔧', label: 'un cacciavite' },
  { icon: '🔗', label: 'un anello di catena' },
  { icon: '⚙️', label: 'un ingranaggio' },
  { icon: '🧲', label: 'una leva' },
  { icon: '🪜', label: 'un piolo di scaletta' },
  { icon: '🔺', label: 'una trave' },
  { icon: '🛤️', label: 'un pezzo di binario' },
  { icon: '🪑', label: 'un sedile' },
  { icon: '🎠', label: 'un vagone' },
];

export const TOTAL_PIECES = PIECES.length;
